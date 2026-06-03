import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import FeaturePageShell from '../../components/features/FeaturePageShell';
import { CheckCircle2, Clock, Download, FileText, Image, Loader2, Upload } from '../../lib/icons';
import { aiAPI } from '../../services/api';

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 100 * 1024 * 1024;

function formatFileSize(size) {
  if (!size) return '0 KB';
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function NoteConverter() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [outputName, setOutputName] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
      toast.error('Upload a PDF, JPG, PNG, or WebP file');
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error('File must be 100MB or smaller');
      return;
    }
    setFile(selectedFile);
    setOutputName(selectedFile.name.replace(/\.(pdf|jpg|jpeg|png|webp)$/i, '-text.pdf'));
    setStatus('');
  };

  const handleConvert = async () => {
    if (!file) {
      toast.error('Upload an image PDF first');
      return;
    }

    setLoading(true);
    setStatus('Uploading file');
    const statusTimers = [
      setTimeout(() => setStatus('Reading scanned pages'), 1200),
      setTimeout(() => setStatus('Running handwriting OCR'), 4500),
      setTimeout(() => setStatus('Building searchable PDF'), 12000),
    ];
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await aiAPI.convertTextPdf(formData);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = outputName || file.name.replace(/\.(pdf|jpg|jpeg|png|webp)$/i, '-text.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setStatus('Text PDF downloaded');
      toast.success('Text PDF downloaded');
    } catch (err) {
      let message = 'Failed to convert file';
      const data = err.response?.data;
      if (data instanceof Blob) {
        try {
          message = JSON.parse(await data.text()).message || message;
        } catch {
          /* keep fallback */
        }
      } else if (data?.message) {
        message = data.message;
      }
      setStatus('Conversion failed');
      toast.error(message);
    } finally {
      statusTimers.forEach(clearTimeout);
      setLoading(false);
    }
  };

  return (
    <FeaturePageShell
      title="Image PDF to Text PDF"
      subtitle="Convert scanned notes, photographed pages, and image-only PDFs into searchable text PDFs."
      icon={FileText}
      badge="OCR converter"
      backTo="/notes"
      backLabel="Back"
      backMode="history"
      wide
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              handleFile(event.dataTransfer.files?.[0]);
            }}
            className="w-full min-h-56 rounded-xl border border-dashed border-violet-500/45 bg-slate-900/40 px-5 py-6 text-left transition hover:bg-violet-500/10 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/20 text-violet-300">
              <Upload size={24} />
            </span>
            <span className="mt-5 block text-lg font-semibold text-white">
              Upload scanned PDF or page images
            </span>
            <span className="mt-2 block text-sm leading-6 text-slate-400">
              Drop an image-only PDF, JPG, PNG, or WebP file here. The converter is meant to run OCR and produce a selectable, searchable PDF.
            </span>
            <span className="mt-4 inline-flex items-center gap-2 rounded-lg border border-violet-500/40 px-3 py-2 text-sm font-medium text-violet-300">
              <Image size={16} />
              Choose file
            </span>
          </button>

          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />

          {file && (
            <div className="mt-4 rounded-xl border border-slate-700/60 bg-slate-900/50 p-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-violet-300">
                  <FileText size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{file.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{formatFileSize(file.size)}</p>
                </div>
                <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
              </div>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col rounded-xl border border-slate-700/60 bg-slate-900/40 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">Output</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Searchable text PDF</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            The finished file is a clean PDF built from extracted OCR text, ready for search, copy, and study workflows.
          </p>

          <div className="mt-5 space-y-3 text-sm">
            {['Detect text from scanned pages', 'Keep pages in PDF format', 'Export a text-searchable PDF'].map((step) => (
              <div key={step} className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 size={16} className="text-emerald-400" />
                {step}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleConvert}
            disabled={loading || !file}
            className="btn-primary mt-6 min-h-12 w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {status || 'Preparing OCR'}
              </>
            ) : (
              <>
                <Download size={18} />
                Convert to text PDF
              </>
            )}
          </button>

          {outputName && (
            <p className="mt-3 truncate text-xs text-slate-500">
              Output file: {outputName}
            </p>
          )}

          <div className="mt-4 rounded-lg border border-slate-700/60 bg-slate-950/40 p-3">
            <div className="flex items-start gap-3">
              <span className={`mt-0.5 ${loading ? 'text-violet-300' : status === 'Conversion failed' ? 'text-rose-300' : 'text-slate-400'}`}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Clock size={16} />}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-200">
                  {status || 'Ready to convert'}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Handwritten pages can take longer than printed PDFs. Keep this page open until the download starts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <Link
          to="/notes/upload"
          className={`btn-primary px-4 py-2 text-sm ${loading ? 'pointer-events-none opacity-50' : ''}`}
        >
          Upload Converted PDF
        </Link>
        <Link to="/notes" className="btn-ghost px-4 py-2 text-sm">
          Browse Notes
        </Link>
      </div>
    </FeaturePageShell>
  );
}
