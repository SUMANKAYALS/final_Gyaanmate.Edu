import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FileText,
  Image,
  Tag,
  BookOpen,
  Loader2,
  Upload,
  Sparkles,
  X,
} from '../lib/icons';
import axios from 'axios';

const CATEGORY_DATA = {
  'Engineering': {
    departments: ['Computer Science', 'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering', 'Chemical Engineering'],
    subjects: {
      'Computer Science': ['Data Structures', 'Algorithms', 'Operating Systems', 'Database Management', 'Computer Networks', 'Software Engineering'],
      'Mechanical Engineering': ['Thermodynamics', 'Fluid Mechanics', 'Mechanics of Materials', 'Machine Design', 'Heat Transfer'],
      'Civil Engineering': ['Structural Analysis', 'Surveying', 'Geotechnical Engineering', 'Transportation Engineering', 'Construction Management'],
      'Electrical Engineering': ['Circuit Analysis', 'Electromagnetics', 'Power Systems', 'Control Systems', 'Digital Electronics'],
      'Chemical Engineering': ['Chemical Process Calculations', 'Fluid Mechanics', 'Heat Transfer', 'Mass Transfer', 'Process Control']
    }
  },
  'Medical': {
    departments: ['Nursing', 'Pharmacology', 'Medicine', 'Dentistry', 'Physiotherapy'],
    subjects: {
      'Nursing': ['Anatomy', 'Physiology', 'Microbiology', 'Pharmacology', 'Medical-Surgical Nursing'],
      'Pharmacology': ['Drug Chemistry', 'Pharmacokinetics', 'Pharmacodynamics', 'Clinical Pharmacology', 'Toxicology'],
      'Medicine': ['Internal Medicine', 'Surgery', 'Pediatrics', 'Obstetrics & Gynecology', 'Psychiatry'],
      'Dentistry': ['Oral Anatomy', 'Dental Materials', 'Oral Pathology', 'Orthodontics', 'Oral Surgery'],
      'Physiotherapy': ['Anatomy', 'Physiology', 'Exercise Therapy', 'Electrotherapy', 'Rehabilitation']
    }
  },
  'Science': {
    departments: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Environmental Science'],
    subjects: {
      'Physics': ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Quantum Mechanics', 'Optics'],
      'Chemistry': ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Analytical Chemistry', 'Biochemistry'],
      'Biology': ['Cell Biology', 'Genetics', 'Ecology', 'Microbiology', 'Biochemistry'],
      'Mathematics': ['Calculus', 'Linear Algebra', 'Differential Equations', 'Statistics', 'Number Theory'],
      'Environmental Science': ['Ecology', 'Environmental Chemistry', 'Climate Science', 'Pollution Control', 'Waste Management']
    }
  },
  'Business': {
    departments: ['Finance', 'Marketing', 'Human Resources', 'Operations', 'Management'],
    subjects: {
      'Finance': ['Corporate Finance', 'Investment Analysis', 'Financial Accounting', 'Risk Management', 'Portfolio Management'],
      'Marketing': ['Digital Marketing', 'Consumer Behavior', 'Market Research', 'Brand Management', 'Advertising'],
      'Human Resources': ['Organizational Behavior', 'Recruitment', 'Training & Development', 'Compensation', 'Labor Laws'],
      'Operations': ['Supply Chain Management', 'Quality Control', 'Production Planning', 'Logistics', 'Operations Research'],
      'Management': ['Strategic Management', 'Leadership', 'Business Ethics', 'Project Management', 'Entrepreneurship']
    }
  },
  'Arts': {
    departments: ['Fine Arts', 'Music', 'Theater', 'Literature', 'Design'],
    subjects: {
      'Fine Arts': ['Painting', 'Sculpture', 'Drawing', 'Art History', 'Digital Art'],
      'Music': ['Music Theory', 'Composition', 'Performance', 'Music History', 'Audio Engineering'],
      'Theater': ['Acting', 'Directing', 'Playwriting', 'Stage Design', 'Theater History'],
      'Literature': ['English Literature', 'Creative Writing', 'Literary Theory', 'Poetry', 'World Literature'],
      'Design': ['Graphic Design', 'UX/UI Design', 'Fashion Design', 'Interior Design', 'Industrial Design']
    }
  },
  'Programming': {
    departments: ['Web Development', 'Mobile Development', 'Data Science', 'DevOps', 'Game Development'],
    subjects: {
      'Web Development': ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Database Design'],
      'Mobile Development': ['Android Development', 'iOS Development', 'React Native', 'Flutter', 'Mobile UI/UX'],
      'Data Science': ['Python', 'Machine Learning', 'Data Visualization', 'Statistics', 'Deep Learning'],
      'DevOps': ['Docker', 'Kubernetes', 'CI/CD', 'Cloud Computing', 'Infrastructure as Code'],
      'Game Development': ['Unity', 'Unreal Engine', 'Game Design', '3D Modeling', 'Game Physics']
    }
  },
  'Mathematics': {
    departments: ['Pure Mathematics', 'Applied Mathematics', 'Statistics', 'Actuarial Science', 'Mathematical Physics'],
    subjects: {
      'Pure Mathematics': ['Algebra', 'Analysis', 'Geometry', 'Number Theory', 'Topology'],
      'Applied Mathematics': ['Differential Equations', 'Numerical Analysis', 'Optimization', 'Mathematical Modeling', 'Computational Mathematics'],
      'Statistics': ['Probability', 'Statistical Inference', 'Regression Analysis', 'Time Series', 'Bayesian Statistics'],
      'Actuarial Science': ['Life Contingencies', 'Financial Mathematics', 'Risk Theory', 'Pension Mathematics', 'Insurance'],
      'Mathematical Physics': ['Quantum Mechanics', 'Statistical Mechanics', 'Electromagnetism', 'Relativity', 'Mathematical Methods']
    }
  },
  'Languages': {
    departments: ['English', 'Spanish', 'French', 'German', 'Mandarin'],
    subjects: {
      'English': ['Grammar', 'Literature', 'Composition', 'Linguistics', 'Business English'],
      'Spanish': ['Grammar', 'Conversation', 'Literature', 'Culture', 'Translation'],
      'French': ['Grammar', 'Conversation', 'Literature', 'Culture', 'Translation'],
      'German': ['Grammar', 'Conversation', 'Literature', 'Culture', 'Translation'],
      'Mandarin': ['Characters', 'Grammar', 'Conversation', 'Culture', 'Business Chinese']
    }
  },
  'Other': {
    departments: ['General', 'Miscellaneous'],
    subjects: {
      'General': ['General Studies', 'Introduction', 'Overview'],
      'Miscellaneous': ['Other Topics', 'Special Topics', 'Electives']
    }
  }
};

const CATEGORIES = Object.keys(CATEGORY_DATA);

const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const PDF_TYPES = ['application/pdf'];
const MAX_FILE = 50 * 1024 * 1024;
const MAX_IMAGE = 5 * 1024 * 1024;

function FieldLabel({ icon: Icon, children, required }) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
      <Icon size={16} className="text-indigo-400" />
      {children}
      {required && <span className="text-red-400">*</span>}
    </label>
  );
}

function InputField({ icon: Icon, className = '', ...props }) {
  return (
    <div className="relative group">
      {Icon && (
        <Icon
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition pointer-events-none"
        />
      )}
      <input
        {...props}
        className={`w-full rounded-xl bg-slate-900/60 border border-slate-700/60 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 transition ${Icon ? 'pl-11 pr-4 py-3' : 'px-4 py-3'
          } ${className}`}
      />
    </div>
  );
}

function TextAreaField({ icon: Icon, rows = 3, className = '', ...props }) {
  return (
    <div className="relative group">
      {Icon && (
        <Icon
          size={18}
          className="absolute left-3.5 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition pointer-events-none"
        />
      )}
      <textarea
        rows={rows}
        {...props}
        className={`w-full rounded-xl bg-slate-900/60 border border-slate-700/60 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 transition resize-none ${Icon ? 'pl-11 pr-4 py-3' : 'px-4 py-3'
          } ${className}`}
      />
    </div>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 md:p-8 border border-slate-700/40 rounded-2xl space-y-5"
    >
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {children}
    </motion.section>
  );
}

function FileDropzone({ accept, maxSize, label, hint, icon: Icon, onFile, disabled, preview }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndSetFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    const acceptedTypes = accept.split(',').map(t => t.trim());
    if (!acceptedTypes.some(type => file.type === type || file.name.endsWith(type))) {
      toast.error('Invalid file type');
      return;
    }
    if (file.size > maxSize) {
      toast.error(`File must be ${(maxSize / 1024 / 1024).toFixed(0)}MB or smaller`);
      return;
    }
    onFile(file);
  };

  if (preview) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-slate-700/60 group">
        <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
        <button
          type="button"
          onClick={() => onFile(null)}
          className="absolute top-3 right-3 p-2 rounded-lg bg-slate-900/90 text-red-300 border border-red-500/30 hover:bg-red-500/20 transition opacity-0 group-hover:opacity-100"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition cursor-pointer ${isDragging
        ? 'border-indigo-500 bg-indigo-500/10'
        : 'border-slate-700 hover:border-slate-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <Icon size={40} className="mx-auto mb-3 text-slate-500" />
      <p className="text-white font-medium mb-1">{label}</p>
      <p className="text-xs text-slate-500">{hint}</p>
    </div>
  );
}

export default function NotesUpload() {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Engineering',
    department: '',
    subject: '',
    tags: '',
  });

  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    // Reset dependent fields when category changes
    if (key === 'category') {
      setForm((f) => ({ ...f, department: '', subject: '' }));
    }
    // Reset subject when department changes
    if (key === 'department') {
      setForm((f) => ({ ...f, subject: '' }));
    }
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) {
      setFile(null);
      return;
    }
    if (!IMAGE_TYPES.includes(selectedFile.type) && !PDF_TYPES.includes(selectedFile.type)) {
      toast.error('File must be an image (JPG, PNG, WEBP) or PDF');
      return;
    }
    if (selectedFile.size > MAX_FILE) {
      toast.error('File must be 50MB or smaller');
      return;
    }
    setFile(selectedFile);
  };

  const handleThumbnail = (selectedFile) => {
    if (!selectedFile) {
      setThumbnail(null);
      setThumbnailPreview('');
      return;
    }
    if (!IMAGE_TYPES.includes(selectedFile.type)) {
      toast.error('Thumbnail must be JPG, PNG, or WEBP');
      return;
    }
    if (selectedFile.size > MAX_IMAGE) {
      toast.error('Thumbnail must be 5MB or smaller');
      return;
    }
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    setThumbnail(selectedFile);
    setThumbnailPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please upload a file');
      return;
    }

    const fd = new FormData();
    fd.append('title', form.title.trim());
    fd.append('description', form.description.trim());
    fd.append('category', form.category);
    fd.append('department', form.department);
    fd.append('subject', form.subject);
    fd.append('tags', form.tags);
    fd.append('file', file);
    if (thumbnail) fd.append('thumbnail', thumbnail);

    setUploading(true);
    try {
      const token = localStorage.getItem('learnhub_token');
      // await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notes`, fd, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notes`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Note uploaded successfully!');
      navigate('/notes');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload note');
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="notes-upload-page max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs mb-3">
          <Sparkles size={14} />
          Study Materials
        </div>
        <h1 className="text-3xl font-bold gradient-text">Upload Notes</h1>
        <p className="text-slate-400 mt-2 text-sm">
          Share your study materials with the community. PDFs and images supported.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard title="Basic information" subtitle="Title, description, and categorization">
          <div>
            <FieldLabel icon={BookOpen} required>Title</FieldLabel>
            <InputField
              icon={BookOpen}
              required
              placeholder="e.g. Calculus Chapter 5 Notes"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
            />
          </div>
          <div>
            <FieldLabel icon={BookOpen} required>Description</FieldLabel>
            <TextAreaField
              icon={BookOpen}
              required
              rows={3}
              placeholder="Brief description of the notes"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>
          <div>
            <FieldLabel icon={Tag} required>Category</FieldLabel>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-white focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 transition"
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {form.category && (
            <div>
              <FieldLabel icon={BookOpen} required>Department</FieldLabel>
              <select
                value={form.department}
                onChange={(e) => set('department', e.target.value)}
                disabled={!form.category}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-white focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 transition disabled:opacity-50"
              >
                <option value="">Select Department</option>
                {CATEGORY_DATA[form.category]?.departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          )}

          {form.department && (
            <div>
              <FieldLabel icon={BookOpen} required>Subject</FieldLabel>
              <select
                value={form.subject}
                onChange={(e) => set('subject', e.target.value)}
                disabled={!form.department}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-white focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 transition disabled:opacity-50"
              >
                <option value="">Select Subject</option>
                {CATEGORY_DATA[form.category]?.subjects[form.department]?.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <FieldLabel icon={Tag}>Tags</FieldLabel>
            <InputField
              icon={Tag}
              placeholder="calculus, integration, derivatives (comma separated)"
              value={form.tags}
              onChange={(e) => set('tags', e.target.value)}
            />
          </div>
        </SectionCard>

        <SectionCard title="File uploads" subtitle="Upload your study material and optional thumbnail">
          <div>
            <FieldLabel icon={FileText} required>Study material</FieldLabel>
            {!file ? (
              <FileDropzone
                accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                maxSize={MAX_FILE}
                label="Upload your notes"
                hint="PDF or Image · Max 50MB"
                icon={FileText}
                onFile={handleFile}
                disabled={uploading}
              />
            ) : (
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-700/60">
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-indigo-400" />
                  <div>
                    <p className="text-white text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          <div>
            <FieldLabel icon={Image}>Thumbnail (optional)</FieldLabel>
            <FileDropzone
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              maxSize={MAX_IMAGE}
              label="Upload thumbnail"
              hint="JPG, PNG, WEBP · Max 5MB"
              icon={Image}
              onFile={handleThumbnail}
              disabled={uploading}
              preview={thumbnailPreview}
            />
          </div>
        </SectionCard>

        <motion.button
          type="submit"
          disabled={uploading}
          whileHover={{ scale: uploading ? 1 : 1.01 }}
          whileTap={{ scale: uploading ? 1 : 0.98 }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-lg shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
        >
          {uploading ? (
            <>
              <Loader2 size={22} className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={20} />
              Upload Notes
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
