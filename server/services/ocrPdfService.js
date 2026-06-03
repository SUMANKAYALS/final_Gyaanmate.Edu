import PDFDocument from 'pdfkit';
import { createWorker, PSM } from 'tesseract.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OCR_SPACE_URL = 'https://api.ocr.space/parse/image';
const OCR_SPACE_SIZE_HINT = 'This PDF is too large for the free OCR service. Split it into smaller PDFs, compress it, or upload page images instead.';
const OCR_SPACE_PDF_LIMIT_MB = Number(process.env.OCR_SPACE_PDF_LIMIT_MB || 5);
const OCR_PDF_RENDER_SCALE = Number(process.env.OCR_PDF_RENDER_SCALE || 3);
const OCR_SPACE_IMAGE_RENDER_SCALE = Number(process.env.OCR_SPACE_IMAGE_RENDER_SCALE || 2);
const OCR_SPACE_IMAGE_MAX_BYTES = Number(process.env.OCR_SPACE_IMAGE_MAX_MB || 1.5) * 1024 * 1024;
const OCR_MAX_PDF_PAGES = Number(process.env.OCR_MAX_PDF_PAGES || 50);
const OCR_MIN_CONFIDENCE = Number(process.env.OCR_MIN_CONFIDENCE || 62);
const OCR_ENABLE_LOCAL_PDF_FALLBACK = process.env.OCR_ENABLE_LOCAL_PDF_FALLBACK !== 'false';
const GEMINI_OCR_MODEL = process.env.GEMINI_OCR_MODEL || process.env.GEMINI_MODEL || 'gemini-2.0-flash';
let geminiOcrDisabledUntil = 0;
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

function hasGeminiOcr() {
  return Boolean(process.env.GEMINI_API_KEY) && Date.now() > geminiOcrDisabledUntil;
}

function isQuotaError(err) {
  const status = err?.status || err?.response?.status;
  return status === 429 || /quota|rate limit|too many requests/i.test(err?.message || '');
}

function summarizeError(err) {
  const message = String(err?.message || err || 'Unknown error').replace(/\s+/g, ' ').trim();
  if (!message) return 'Unknown error';
  if (isQuotaError(err)) return `${message.split('[')[0].trim() || 'Quota exceeded'} (429 quota/rate limit)`;
  return message.length > 220 ? `${message.slice(0, 220)}...` : message;
}

function getAverageConfidence(result) {
  const words = result.data?.words || [];
  const confidentWords = words.filter((word) => Number.isFinite(word.confidence));
  if (confidentWords.length) {
    return confidentWords.reduce((sum, word) => sum + word.confidence, 0) / confidentWords.length;
  }
  return Number(result.data?.confidence || 0);
}

function scoreOcrText(text, confidence = 0) {
  const clean = normalizeText(text);
  if (!clean) return 0;

  const letters = (clean.match(/[A-Za-z0-9]/g) || []).length;
  const suspicious = (clean.match(/[{}[\]|\\_%<>^~]/g) || []).length;
  const words = clean.split(/\s+/).filter(Boolean);
  const usefulWords = words.filter((word) => /[A-Za-z0-9]{2,}/.test(word)).length;

  return confidence + Math.min(35, letters / 4) + usefulWords * 2 - suspicious * 5;
}

function isGoodOcrResult(text, confidence = 0) {
  const clean = normalizeText(text);
  const alphaNumeric = (clean.match(/[A-Za-z0-9]/g) || []).length;
  const words = clean.split(/\s+/).filter(Boolean);

  return (
    clean.length >= 20 &&
    alphaNumeric >= 12 &&
    words.length >= 4 &&
    (confidence >= OCR_MIN_CONFIDENCE || scoreOcrText(clean, confidence) >= 86)
  );
}

async function preprocessImageForOcr(buffer) {
  const image = await loadImage(buffer);
  const scale = Math.max(1, Number(process.env.OCR_IMAGE_UPSCALE || 2));
  const canvas = createCanvas(Math.ceil(image.width * scale), Math.ceil(image.height * scale));
  const context = canvas.getContext('2d');

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const threshold = Number(process.env.OCR_BINARY_THRESHOLD || 182);

  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
    const value = gray < threshold ? 0 : 255;
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
    data[i + 3] = 255;
  }

  context.putImageData(imageData, 0, 0);
  return canvas.toBuffer('image/png');
}

async function recognizeWithTesseract(worker, buffer) {
  const processed = await preprocessImageForOcr(buffer);
  const result = await worker.recognize(processed);
  const text = normalizeText(result.data?.text);
  return {
    text,
    confidence: getAverageConfidence(result),
    score: scoreOcrText(text, getAverageConfidence(result)),
  };
}

async function extractTextWithTesseract(file) {
  const worker = await createWorker('eng', 1, {
    langPath: TESSERACT_LANG_PATH,
    cacheMethod: 'none',
  });
  try {
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
      preserve_interword_spaces: '1',
      user_defined_dpi: '300',
    });

    return await recognizeWithTesseract(worker, file.buffer);
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
    tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
    preserve_interword_spaces: '1',
    user_defined_dpi: '300',
  });
  return worker;
}

async function renderPdfPage(page, {
  scale = OCR_PDF_RENDER_SCALE,
  mimeType = 'image/png',
  quality = 90,
} = {}) {
  const viewport = page.getViewport({ scale });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  const context = canvas.getContext('2d');

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({
    canvasContext: context,
    viewport,
  }).promise;

  return mimeType === 'image/png'
    ? canvas.toBuffer('image/png')
    : canvas.toBuffer(mimeType, quality);
}

async function renderPdfPageToPng(page) {
  return renderPdfPage(page, { mimeType: 'image/png' });
}

async function renderPdfPageForOcrSpace(page) {
  const attempts = [
    { scale: OCR_SPACE_IMAGE_RENDER_SCALE, quality: 82 },
    { scale: Math.max(1.5, OCR_SPACE_IMAGE_RENDER_SCALE * 0.75), quality: 72 },
    { scale: 1.25, quality: 64 },
    { scale: 1, quality: 58 },
  ];

  for (const attempt of attempts) {
    const buffer = await renderPdfPage(page, {
      scale: attempt.scale,
      mimeType: 'image/jpeg',
      quality: attempt.quality,
    });
    if (buffer.length <= OCR_SPACE_IMAGE_MAX_BYTES || attempt === attempts[attempts.length - 1]) {
      return buffer;
    }
  }

  return renderPdfPage(page, { scale: 1, mimeType: 'image/jpeg', quality: 58 });
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
    const confidences = [];
    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const png = await renderPdfPageToPng(page);
      const result = await recognizeWithTesseract(worker, png);
      const text = result.text;
      if (isGoodOcrResult(text, result.confidence)) {
        pages.push(`Page ${pageNumber}\n${text}`);
        confidences.push(result.confidence);
      }
      page.cleanup();
    }

    if (pdf.numPages > pageCount) {
      pages.push(`Only the first ${pageCount} pages were processed. Set OCR_MAX_PDF_PAGES to increase this limit.`);
    }

    const text = normalizeText(pages.join('\n\n'));
    const confidence = confidences.length
      ? confidences.reduce((sum, item) => sum + item, 0) / confidences.length
      : 0;
    return {
      text,
      confidence,
      score: scoreOcrText(text, confidence),
    };
  } finally {
    await worker.terminate();
    await loadingTask.destroy();
  }
}

async function pdfToPageImages(file) {
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(file.buffer),
    disableWorker: true,
    useSystemFonts: true,
  });

  try {
    const pdf = await loadingTask.promise;
    const pageCount = Math.min(pdf.numPages, OCR_MAX_PDF_PAGES);
    const pages = [];

    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      pages.push({
        pageNumber,
        buffer: await renderPdfPageToPng(page),
      });
      page.cleanup();
    }

    return pages;
  } finally {
    await loadingTask.destroy();
  }
}

async function extractTextWithGeminiImages(images) {
  if (!hasGeminiOcr()) return '';

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: GEMINI_OCR_MODEL,
    generationConfig: {
      temperature: 0,
      maxOutputTokens: Number(process.env.GEMINI_OCR_MAX_TOKENS || 8192),
    },
  });

  const pages = [];
  for (const image of images) {
    const prompt = `Transcribe the handwritten or printed text in this page as accurately as possible.
Return only the transcribed text.
Keep each field on its own line.
Do not guess missing text; use [unclear] for unreadable words.`;

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          mimeType: 'image/png',
          data: image.buffer.toString('base64'),
        },
      },
    ]);
    const text = normalizeText(result.response.text());
    if (text) {
      pages.push(`Page ${image.pageNumber}\n${text}`);
    }
  }

  return normalizeText(pages.join('\n\n'));
}

async function extractTextWithGemini(file) {
  if (!hasGeminiOcr()) return '';

  const images = file.mimetype === 'application/pdf'
    ? await pdfToPageImages(file)
    : [{ pageNumber: 1, buffer: await preprocessImageForOcr(file.buffer) }];

  return extractTextWithGeminiImages(images);
}

async function extractTextWithOcrSpace(file) {
  if (file.mimetype === 'application/pdf') {
    return extractPdfTextWithOcrSpacePages(file);
  }

  return extractImageTextWithOcrSpace({
    buffer: file.buffer,
    mimetype: file.mimetype,
    originalname: file.originalname,
  });
}

async function extractImageTextWithOcrSpace(file) {
  const apiKey = process.env.OCR_SPACE_API_KEY || 'helloworld';
  const form = new FormData();
  form.append('apikey', apiKey);
  form.append('language', process.env.OCR_LANGUAGE || 'eng');
  form.append('isOverlayRequired', 'false');
  form.append('detectOrientation', 'true');
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

  const normalized = normalizeText(text);
  return {
    text: normalized,
    confidence: 0,
    score: scoreOcrText(normalized, 0),
  };
}

async function extractPdfTextWithOcrSpacePages(file) {
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(file.buffer),
    disableWorker: true,
    useSystemFonts: true,
  });

  try {
    const pdf = await loadingTask.promise;
    const pageCount = Math.min(pdf.numPages, OCR_MAX_PDF_PAGES);
    const pages = [];

    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      try {
        const buffer = await renderPdfPageForOcrSpace(page);
        const result = await extractImageTextWithOcrSpace({
          buffer,
          mimetype: 'image/jpeg',
          originalname: `${safeOutputName(file.originalname).replace(/\.pdf$/i, '')}-page-${pageNumber}.jpg`,
        });
        if (result.text) {
          pages.push(`Page ${pageNumber}\n${result.text}`);
        }
      } finally {
        page.cleanup();
      }
    }

    if (pdf.numPages > pageCount) {
      pages.push(`Only the first ${pageCount} pages were processed. Set OCR_MAX_PDF_PAGES to increase this limit.`);
    }

    const text = normalizeText(pages.join('\n\n'));
    return {
      text,
      confidence: 0,
      score: scoreOcrText(text, 0),
    };
  } finally {
    await loadingTask.destroy();
  }
}

export async function extractTextFromFile(file) {
  const isPdf = file.mimetype === 'application/pdf';
  const isImage = file.mimetype?.startsWith('image/');

  if (isPdf || isImage) {
    try {
      const text = await extractTextWithGemini(file);
      if (text) return text;
    } catch (err) {
      if (isQuotaError(err)) {
        geminiOcrDisabledUntil = Date.now() + 10 * 60 * 1000;
      }
      console.warn('Gemini handwriting OCR failed, trying fallback OCR:', summarizeError(err));
    }
  }

  if (isPdf || isImage) {
    try {
      const result = await extractTextWithOcrSpace(file);
      if (isGoodOcrResult(result.text, result.confidence) || result.score >= 80) return result.text;
    } catch (err) {
      console.warn('OCR.space failed:', summarizeError(err));
    }
  }

  if (isPdf && OCR_ENABLE_LOCAL_PDF_FALLBACK) {
    try {
      const result = await extractTextFromPdfLocally(file);
      if (isGoodOcrResult(result.text, result.confidence)) return result.text;
    } catch (err) {
      console.warn('Local PDF OCR failed:', summarizeError(err));
    }
  }

  if (isImage) {
    try {
      const result = await extractTextWithTesseract(file);
      if (isGoodOcrResult(result.text, result.confidence)) return result.text;
    } catch (err) {
      console.warn('Tesseract OCR failed:', summarizeError(err));
    }
  }

  const err = new Error(
    hasGeminiOcr()
      ? 'No readable text was found in this file'
      : 'Handwriting OCR quota is unavailable right now and fallback OCR could not read this file clearly. Try again after quota resets or add OCR_SPACE_API_KEY for a stronger fallback.'
  );
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
