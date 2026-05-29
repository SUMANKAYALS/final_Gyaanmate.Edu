import PDFDocument from 'pdfkit';
import { createWorker, PSM } from 'tesseract.js';
import { createCanvas } from '@napi-rs/canvas';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OCR_SPACE_URL = 'https://api.ocr.space/parse/image';
const OCR_SPACE_SIZE_HINT = 'This PDF is too large for the free OCR service. Split it into smaller PDFs, compress it, or upload page images instead.';
const OCR_SPACE_PDF_LIMIT_MB = Number(process.env.OCR_SPACE_PDF_LIMIT_MB || 5);
const OCR_PDF_RENDER_SCALE = Number(process.env.OCR_PDF_RENDER_SCALE || 2);
const OCR_MAX_PDF_PAGES = Number(process.env.OCR_MAX_PDF_PAGES || 50);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TESSERACT_LANG_PATH = path.resolve(__dirname, '../node_modules/@tesseract.js-data/eng/4.0.0');

function normalizeText(text) {
  return String(text || '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
}

function safeOutputName(originalName = 'converted.pdf') {
  const base = originalName.replace(/\.(pdf|jpg|jpeg|png|webp)$/i, '') || 'converted';
  return `${base.replace(/[^a-zA-Z0-9._-]+/g, '-')}-text.pdf`;
}

async function extractTextWithTesseract(file) {
  const worker = await createWorker('eng', 1, {
    langPath: TESSERACT_LANG_PATH,
    cacheMethod: 'none',
  });
  try {
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.AUTO,
      preserve_interword_spaces: '1',
    });

    const result = await worker.recognize(file.buffer);
    return normalizeText(result.data?.text);
  } finally {
    await worker.terminate();
  }
}

async function configureTesseractWorker() {
  const worker = await createWorker('eng', 1, {
    langPath: TESSERACT_LANG_PATH,
    cacheMethod: 'none',
  });
  await worker.setParameters({
    tessedit_pageseg_mode: PSM.AUTO,
    preserve_interword_spaces: '1',
  });
  return worker;
}

async function renderPdfPageToPng(page) {
  const viewport = page.getViewport({ scale: OCR_PDF_RENDER_SCALE });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  const context = canvas.getContext('2d');

  await page.render({
    canvasContext: context,
    viewport,
  }).promise;

  return canvas.toBuffer('image/png');
}

async function extractTextFromPdfLocally(file) {
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(file.buffer),
    disableWorker: true,
    useSystemFonts: true,
  });
  const pdf = await loadingTask.promise;
  const pageCount = Math.min(pdf.numPages, OCR_MAX_PDF_PAGES);
  const worker = await configureTesseractWorker();

  try {
    const pages = [];
    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const png = await renderPdfPageToPng(page);
      const result = await worker.recognize(png);
      const text = normalizeText(result.data?.text);
      if (text) {
        pages.push(`Page ${pageNumber}\n${text}`);
      }
      page.cleanup();
    }

    if (pdf.numPages > pageCount) {
      pages.push(`Only the first ${pageCount} pages were processed. Set OCR_MAX_PDF_PAGES to increase this limit.`);
    }

    return normalizeText(pages.join('\n\n'));
  } finally {
    await worker.terminate();
    await loadingTask.destroy();
  }
}

async function extractTextWithOcrSpace(file) {
  if (file.mimetype === 'application/pdf' && file.size > OCR_SPACE_PDF_LIMIT_MB * 1024 * 1024) {
    const err = new Error(`${OCR_SPACE_SIZE_HINT} Current PDF limit: ${OCR_SPACE_PDF_LIMIT_MB}MB.`);
    err.status = 413;
    throw err;
  }

  const apiKey = process.env.OCR_SPACE_API_KEY || 'helloworld';
  const form = new FormData();
  form.append('apikey', apiKey);
  form.append('language', process.env.OCR_LANGUAGE || 'eng');
  form.append('isOverlayRequired', 'false');
  form.append('scale', 'true');
  form.append('OCREngine', '2');
  form.append('file', new Blob([file.buffer], { type: file.mimetype }), file.originalname);

  const response = await fetch(OCR_SPACE_URL, {
    method: 'POST',
    body: form,
  });

  if (!response.ok) {
    const isTooLarge = response.status === 413;
    const err = new Error(
      isTooLarge
        ? `${OCR_SPACE_SIZE_HINT} Current PDF limit: ${OCR_SPACE_PDF_LIMIT_MB}MB.`
        : `Free OCR API failed with status ${response.status}`
    );
    err.status = isTooLarge ? 413 : 502;
    throw err;
  }

  const data = await response.json();
  if (data.IsErroredOnProcessing) {
    const message = data.ErrorMessage || data.ErrorDetails || 'Free OCR API could not process this file';
    const text = Array.isArray(message) ? message.join(', ') : message;
    const isSizeError = /large|size|maximum|max|limit/i.test(text);
    const err = new Error(isSizeError ? OCR_SPACE_SIZE_HINT : text);
    err.status = 422;
    throw err;
  }

  const text = (data.ParsedResults || [])
    .map((page) => page.ParsedText)
    .filter(Boolean)
    .join('\n\n');

  return normalizeText(text);
}

export async function extractTextFromFile(file) {
  const isPdf = file.mimetype === 'application/pdf';
  const isImage = file.mimetype?.startsWith('image/');

  if (isPdf) {
    try {
      const text = await extractTextFromPdfLocally(file);
      if (text) return text;
    } catch (err) {
      console.warn('Local PDF OCR failed, trying free OCR API:', err.message);
    }
  }

  if (isImage) {
    try {
      const text = await extractTextWithTesseract(file);
      if (text) return text;
    } catch (err) {
      console.warn('Tesseract OCR failed, trying free OCR API:', err.message);
    }
  }

  if (isPdf || isImage) {
    const text = await extractTextWithOcrSpace(file);
    if (text) return text;
  }

  const err = new Error('No readable text was found in this file');
  err.status = 422;
  throw err;
}

export function createTextPdfBuffer({ text, sourceName }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: 54,
        right: 54,
        bottom: 54,
        left: 54,
      },
      info: {
        Title: safeOutputName(sourceName),
        Subject: 'OCR text PDF',
      },
    });

    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.font('Helvetica-Bold').fontSize(15).text('OCR Text PDF', { align: 'center' });
    doc.moveDown(0.35);
    doc.font('Helvetica').fontSize(9).fillColor('#666666').text(`Source: ${sourceName || 'Uploaded file'}`, {
      align: 'center',
    });
    doc.moveDown(1.25);
    doc.fillColor('#111111').font('Helvetica').fontSize(11).text(text, {
      align: 'left',
      lineGap: 4,
    });
    doc.end();
  });
}

export function getTextPdfFileName(originalName) {
  return safeOutputName(originalName);
}
