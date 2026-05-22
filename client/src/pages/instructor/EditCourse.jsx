import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  BookOpen,
  Image,
  Video,
  FileText,
  DollarSign,
  Tag,
  Languages,
  Clock,
  ListChecks,
  Target,
  Loader2,
  Save,
  Sparkles,
} from '../../lib/icons';
import { courseAPI } from '../../services/api';

const CATEGORIES = [
  'Programming', 'Web Development', 'AI & Machine Learning', 'Cyber Security', 'Data Science',
  'Medical & Healthcare', 'Business & Finance', 'Graphic Design', 'Marketing', 'Personal Development',
];

const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Hindi', 'Arabic', 'Chinese', 'Japanese'];

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
        className={`w-full rounded-xl bg-slate-900/60 border border-slate-700/60 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 transition ${
          Icon ? 'pl-11 pr-4 py-3' : 'px-4 py-3'
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
        className={`w-full rounded-xl bg-slate-900/60 border border-slate-700/60 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 transition resize-none ${
          Icon ? 'pl-11 pr-4 py-3' : 'px-4 py-3'
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

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    descriptionFull: '',
    price: 49.99,
    category: 'Programming',
    level: 'Beginner',
    duration: '8 weeks',
    language: 'English',
    tags: '',
    skills: '',
    requirements: '',
    whatYouWillLearn: '',
  });

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      const res = await courseAPI.getById(id);
      const course = res.data.course;
      setForm({
        title: course.title || '',
        description: course.description || '',
        descriptionFull: course.descriptionFull || '',
        price: course.price || 49.99,
        category: course.category || 'Programming',
        level: course.level || 'Beginner',
        duration: course.duration || '8 weeks',
        language: course.language || 'English',
        tags: course.tags?.join(', ') || '',
        skills: course.skills?.join(', ') || '',
        requirements: course.requirements || '',
        whatYouWillLearn: course.whatYouWillLearn || '',
      });
    } catch (error) {
      toast.error('Failed to load course');
      navigate('/instructor/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await courseAPI.update(id, {
        title: form.title.trim(),
        description: form.description.trim(),
        descriptionFull: form.descriptionFull.trim(),
        price: form.price,
        category: form.category,
        categorySlug: form.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        level: form.level,
        duration: form.duration.trim(),
        language: form.language,
        tags: form.tags,
        skills: form.skills,
        requirements: form.requirements,
        whatYouWillLearn: form.whatYouWillLearn,
      });
      toast.success('Course updated successfully!');
      navigate('/instructor/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update course');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400 flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin" />
          Loading course...
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs mb-3">
          <Sparkles size={14} />
          Instructor Studio
        </div>
        <h1 className="text-3xl font-bold gradient-text">Edit Course</h1>
        <p className="text-slate-400 mt-2 text-sm">
          Update your course details and metadata.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard title="Basic information" subtitle="Title, descriptions, and categorization">
          <div>
            <FieldLabel icon={BookOpen} required>Course title</FieldLabel>
            <InputField
              icon={BookOpen}
              required
              placeholder="e.g. Complete React Masterclass"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
            />
          </div>
          <div>
            <FieldLabel icon={BookOpen} required>Short description</FieldLabel>
            <TextAreaField
              icon={BookOpen}
              required
              rows={2}
              placeholder="One-line summary shown on course cards"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>
          <div>
            <FieldLabel icon={FileText}>Full description</FieldLabel>
            <TextAreaField
              icon={FileText}
              rows={4}
              placeholder="Detailed overview, curriculum highlights, who this is for..."
              value={form.descriptionFull}
              onChange={(e) => set('descriptionFull', e.target.value)}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel icon={Tag}>Category</FieldLabel>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-white focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 transition"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel icon={Target}>Level</FieldLabel>
              <select
                value={form.level}
                onChange={(e) => set('level', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-white focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 transition"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>All Levels</option>
              </select>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Course details" subtitle="Duration, language, requirements, and outcomes">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel icon={Clock}>Duration</FieldLabel>
              <InputField
                icon={Clock}
                placeholder="e.g. 12 hours, 8 weeks"
                value={form.duration}
                onChange={(e) => set('duration', e.target.value)}
              />
            </div>
            <div>
              <FieldLabel icon={Languages}>Language</FieldLabel>
              <select
                value={form.language}
                onChange={(e) => set('language', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-white focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 transition"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <FieldLabel icon={ListChecks}>Requirements</FieldLabel>
            <TextAreaField
              icon={ListChecks}
              rows={3}
              placeholder="One per line — e.g. Basic computer skills&#10;No prior coding experience needed"
              value={form.requirements}
              onChange={(e) => set('requirements', e.target.value)}
            />
          </div>
          <div>
            <FieldLabel icon={Target}>What students will learn</FieldLabel>
            <TextAreaField
              icon={Target}
              rows={4}
              placeholder="One outcome per line — e.g. Build React apps from scratch&#10;Master hooks and state management"
              value={form.whatYouWillLearn}
              onChange={(e) => set('whatYouWillLearn', e.target.value)}
            />
          </div>
        </SectionCard>

        <SectionCard title="Pricing & tags" subtitle="Set price and discovery keywords">
          <div>
            <FieldLabel icon={DollarSign} required>Price (USD)</FieldLabel>
            <InputField
              icon={DollarSign}
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => set('price', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <FieldLabel icon={Tag}>Tags</FieldLabel>
            <InputField
              icon={Tag}
              placeholder="react, javascript, frontend (comma separated)"
              value={form.tags}
              onChange={(e) => set('tags', e.target.value)}
            />
          </div>
          <div>
            <FieldLabel icon={Sparkles}>Skills</FieldLabel>
            <InputField
              icon={Sparkles}
              placeholder="React, TypeScript, REST APIs (comma separated)"
              value={form.skills}
              onChange={(e) => set('skills', e.target.value)}
            />
          </div>
        </SectionCard>

        <div className="flex gap-3">
          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: saving ? 1 : 1.01 }}
            whileTap={{ scale: saving ? 1 : 0.98 }}
            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-lg shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
          >
            {saving ? (
              <>
                <Loader2 size={22} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </motion.button>
          <button
            type="button"
            onClick={() => navigate('/instructor/dashboard')}
            className="px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}
