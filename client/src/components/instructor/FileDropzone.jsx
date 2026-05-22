import { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Loader2 } from '../../lib/icons';

export default function FileDropzone({
  accept,
  multiple = false,
  maxSize,
  label,
  hint,
  icon: Icon = Upload,
  onFiles,
  disabled = false,
  children,
  className = '',
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  const validate = useCallback(
    (files) => {
      if (!files?.length) return [];
      const list = Array.from(files);
      if (maxSize) {
        const tooBig = list.find((f) => f.size > maxSize);
        if (tooBig) {
          setError(`"${tooBig.name}" exceeds the size limit`);
          return [];
        }
      }
      setError('');
      return list;
    },
    [maxSize]
  );

  const handleFiles = (files) => {
    const valid = validate(files);
    if (valid.length) onFiles(multiple ? valid : valid[0]);
  };

  return (
    <div className={className}>
      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!disabled) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => !disabled && inputRef.current?.click()}
        whileHover={disabled ? {} : { scale: 1.005 }}
        className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer ${
          dragging
            ? 'border-indigo-400 bg-indigo-500/10'
            : 'border-slate-600/80 bg-slate-900/40 hover:border-indigo-500/50 hover:bg-indigo-500/5'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
        {children || (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <div className="p-3 rounded-xl bg-indigo-500/15 mb-3">
              <Icon className="text-indigo-400" size={24} />
            </div>
            <p className="text-sm font-medium text-slate-200">{label}</p>
            {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
            <p className="text-[10px] text-indigo-400/80 mt-2">Drag & drop or click to browse</p>
          </div>
        )}
      </motion.div>
      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
    </div>
  );
}

export function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i += 1;
  }
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function FileChip({ name, size, onRemove, icon: Icon }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700/60 group">
      {Icon && <Icon size={16} className="text-indigo-400 shrink-0" />}
      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-200 truncate">{name}</p>
        {size != null && <p className="text-[10px] text-slate-500">{formatFileSize(size)}</p>}
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="p-1 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
          aria-label="Remove file"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export function UploadProgressBar({ progress, label }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label || 'Uploading...'}</span>
        <span className="text-indigo-300 font-medium">{progress}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-500"
        />
      </div>
    </div>
  );
}

export function LoadingOverlay({ show, text = 'Publishing...' }) {
  if (!show) return null;
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-slate-950/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <p className="text-sm text-slate-300">{text}</p>
      </div>
    </div>
  );
}
