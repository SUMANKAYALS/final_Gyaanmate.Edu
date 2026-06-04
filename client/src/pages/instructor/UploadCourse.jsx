import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Upload,
  Sparkles,
} from '../../lib/icons';
import { courseAPI } from '../../services/api';
import FileDropzone, {
  FileChip,
  formatFileSize,
  UploadProgressBar,
} from '../../components/instructor/FileDropzone';

const CATEGORIES = [
  'Programming', 'Web Development', 'AI & Machine Learning', 'Cyber Security', 'Data Science',
  'Medical & Healthcare', 'Business & Finance', 'Graphic Design', 'Marketing', 'Personal Development',
];

const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Hindi', 'Arabic', 'Chinese', 'Japanese'];

const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-matroska'];
const MAX_IMAGE = 5 * 1024 * 1024;
const MAX_VIDEO_MB = 100;
const MAX_VIDEO = MAX_VIDEO_MB * 1024 * 1024;

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

export default function UploadCourse() {
  const navigate = useNavigate();
  const [publishing, setPublishing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [introVideo, setIntroVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [lessons, setLessons] = useState([]);
  const [pdfs, setPdfs] = useState([]);

  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      lessons.forEach((lesson) => {
        if (lesson.preview) URL.revokeObjectURL(lesson.preview);
      });
    };
  }, [thumbnailPreview, videoPreview, lessons]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const pickThumbnail = (file) => {
    if (!IMAGE_TYPES.includes(file.type)) {
      toast.error('Thumbnail must be JPG, PNG, or WEBP');
      return;
    }
    if (file.size > MAX_IMAGE) {
      toast.error('Thumbnail must be 5MB or smaller');
      return;
    }
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const pickVideo = (file) => {
    if (!VIDEO_TYPES.includes(file.type)) {
      toast.error('Video must be MP4, MOV, or MKV');
      return;
    }
    if (file.size > MAX_VIDEO) {
      toast.error(`Video must be ${MAX_VIDEO_MB}MB or smaller`);
      return;
    }
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setIntroVideo(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const pickPdfs = (files) => {
    const list = Array.from(files);
    const invalid = list.find((f) => f.type !== 'application/pdf');
    if (invalid) {
      toast.error('Only PDF files are allowed for resources');
      return;
    }
    setPdfs((prev) => [...prev, ...list]);
  };

  const removePdf = (index) => {
    setPdfs((prev) => prev.filter((_, i) => i !== index));
  };

  const setLessonField = (index, key, value) => {
    setLessons((prev) =>
      prev.map((lesson, i) => (i === index ? { ...lesson, [key]: value } : lesson))
    );
  };

  const pickLessonVideo = (index, file) => {
    if (!VIDEO_TYPES.includes(file.type)) {
      toast.error('Lesson video must be MP4, MOV, or MKV');
      return;
    }
    if (file.size > MAX_VIDEO) {
      toast.error(`Lesson video must be ${MAX_VIDEO_MB}MB or smaller`);
      return;
    }
    const preview = URL.createObjectURL(file);
    setLessonField(index, 'video', file);
    setLessonField(index, 'preview', preview);
  };

  const addLesson = () => {
    setLessons((prev) => [
      ...prev,
      {
        title: `Lesson ${prev.length + 1}`,
        duration: '10 min',
        video: null,
        preview: '',
      },
    ]);
  };

  const removeLesson = (index) => {
    setLessons((prev) => {
      const selected = prev[index];
      if (selected?.preview) URL.revokeObjectURL(selected.preview);
      return prev.filter((_, i) => i !== index).map((lesson, i) => ({
        ...lesson,
        title: lesson.title.startsWith('Lesson ') ? `Lesson ${i + 1}` : lesson.title,
      }));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!thumbnail) {
      toast.error('Please upload a course thumbnail');
      return;
    }

    const fd = new FormData();
    fd.append('title', form.title.trim());
    fd.append('description', form.description.trim());
    fd.append('descriptionFull', form.descriptionFull.trim());
    fd.append('price', String(form.price));
    fd.append('category', form.category);
    fd.append('categorySlug', form.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    fd.append('level', form.level);
    fd.append('duration', form.duration.trim());
    fd.append('language', form.language);
    fd.append('tags', form.tags);
    fd.append('skills', form.skills);
    fd.append('requirements', form.requirements);
    fd.append('whatYouWillLearn', form.whatYouWillLearn);
    fd.append('thumbnail', thumbnail);
    if (introVideo) fd.append('introVideo', introVideo);
    if (lessons.length) {
      const missingVideo = lessons.find((lesson) => !lesson.video);
      if (missingVideo) {
        toast.error('Every lesson must include a video file.');
        setPublishing(false);
        return;
      }
      lessons.forEach((lesson) => fd.append('lessonVideos', lesson.video));
      fd.append('lessonTitles', JSON.stringify(lessons.map((lesson) => lesson.title)));
      fd.append('lessonDurations', JSON.stringify(lessons.map((lesson) => lesson.duration)));
    }
    pdfs.forEach((pdf) => fd.append('pdfs', pdf));

    setPublishing(true);
    setUploadProgress(0);
    try {
      await courseAPI.createWithUpload(fd, setUploadProgress);
      toast.success('Course published successfully!');
      navigate('/instructor/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish course');
    } finally {
      setPublishing(false);
      setUploadProgress(0);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs mb-3">
          <Sparkles size={14} />
          Instructor Studio
        </div>
        <h1 className="text-3xl font-bold gradient-text">Upload Course</h1>
        <p className="text-slate-400 mt-2 text-sm">
          Create a premium course with media, resources, and detailed metadata.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative">
        {publishing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
            <div className="glass-card p-8 w-full max-w-sm mx-4 text-center space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-400 mx-auto" />
              <p className="text-white font-medium">Publishing your course...</p>
              <UploadProgressBar progress={uploadProgress} label="Upload progress" />
            </div>
          </div>
        )}

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

        <SectionCard title="Media uploads" subtitle="Files upload to Cloudinary — thumbnail, intro video, and PDF resources">
          <div>
            <FieldLabel icon={Image} required>Course thumbnail</FieldLabel>
            {!thumbnailPreview ? (
              <FileDropzone
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                maxSize={MAX_IMAGE}
                label="Upload course cover image"
                hint="JPG, PNG, WEBP · Max 5MB"
                icon={Image}
                onFiles={pickThumbnail}
                disabled={publishing}
              />
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-slate-700/60 group">
                <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-48 object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    URL.revokeObjectURL(thumbnailPreview);
                    setThumbnail(null);
                    setThumbnailPreview('');
                  }}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-slate-900/90 text-xs text-red-300 border border-red-500/30 hover:bg-red-500/20 transition opacity-0 group-hover:opacity-100"
                >
                  Remove
                </button>
                <div className="absolute bottom-0 inset-x-0 px-3 py-2 bg-gradient-to-t from-slate-950/90 to-transparent">
                  <p className="text-xs text-slate-300 truncate">{thumbnail?.name}</p>
                  <p className="text-[10px] text-slate-500">{formatFileSize(thumbnail?.size)}</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <FieldLabel icon={Video}>Intro video</FieldLabel>
            {!introVideo ? (
              <FileDropzone
                accept=".mp4,.mov,.mkv,video/mp4,video/quicktime,video/x-matroska"
                maxSize={MAX_VIDEO}
                label="Upload course intro video"
                hint={`MP4, MOV, MKV · Max ${MAX_VIDEO_MB}MB`}
                icon={Video}
                onFiles={pickVideo}
                disabled={publishing}
              />
            ) : (
              <div className="space-y-3">
                <FileChip
                  name={introVideo.name}
                  size={introVideo.size}
                  icon={Video}
                  onRemove={() => {
                    URL.revokeObjectURL(videoPreview);
                    setIntroVideo(null);
                    setVideoPreview('');
                  }}
                />
                {videoPreview && (
                  <video
                    src={videoPreview}
                    controls
                    className="w-full rounded-xl border border-slate-700/60 max-h-64 bg-black"
                  />
                )}
              </div>
            )}
          </div>

          <div>
            <FieldLabel icon={FileText}>PDF notes & resources</FieldLabel>
            <FileDropzone
              accept=".pdf,application/pdf"
              multiple
              label="Upload PDF resources"
              hint="Multiple PDFs · Notes, slides, worksheets"
              icon={FileText}
              onFiles={pickPdfs}
              disabled={publishing}
            />
            {pdfs.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs text-slate-500 uppercase tracking-wide">{pdfs.length} file(s)</p>
                {pdfs.map((pdf, i) => (
                  <FileChip
                    key={`${pdf.name}-${i}`}
                    name={pdf.name}
                    size={pdf.size}
                    icon={FileText}
                    onRemove={() => removePdf(i)}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <FieldLabel icon={Video}>Course lessons</FieldLabel>
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <div key={index} className="border border-slate-700/60 rounded-2xl p-4 bg-slate-950/50">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1 min-w-0">
                      <FieldLabel icon={BookOpen} required>Lesson title</FieldLabel>
                      <InputField
                        icon={BookOpen}
                        required
                        value={lesson.title}
                        onChange={(e) => setLessonField(index, 'title', e.target.value)}
                        placeholder={`Lesson ${index + 1} title`}
                      />
                    </div>
                    <div className="w-full sm:w-56">
                      <FieldLabel icon={Clock}>Duration</FieldLabel>
                      <InputField
                        icon={Clock}
                        value={lesson.duration}
                        onChange={(e) => setLessonField(index, 'duration', e.target.value)}
                        placeholder="e.g. 12 min"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {!lesson.video ? (
                      <FileDropzone
                        accept=".mp4,.mov,.mkv,video/mp4,video/quicktime,video/x-matroska"
                        maxSize={MAX_VIDEO}
                        label="Upload lesson video"
                        hint={`MP4, MOV, MKV · Max ${MAX_VIDEO_MB}MB`}
                        icon={Video}
                        onFiles={(file) => pickLessonVideo(index, file)}
                        disabled={publishing}
                      />
                    ) : (
                      <div className="space-y-3">
                        <FileChip
                          name={lesson.video.name}
                          size={lesson.video.size}
                          icon={Video}
                          onRemove={() => {
                            if (lesson.preview) URL.revokeObjectURL(lesson.preview);
                            setLessonField(index, 'video', null);
                            setLessonField(index, 'preview', '');
                          }}
                        />
                        {lesson.preview && (
                          <video
                            src={lesson.preview}
                            controls
                            className="w-full rounded-xl border border-slate-700/60 max-h-64 bg-black"
                          />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeLesson(index)}
                      disabled={publishing || lessons.length <= 1}
                      className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
                    >
                      Remove lesson
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addLesson}
                disabled={publishing}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 transition"
              >
                Add lesson
              </button>
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

        <motion.button
          type="submit"
          disabled={publishing}
          whileHover={{ scale: publishing ? 1 : 1.01 }}
          whileTap={{ scale: publishing ? 1 : 0.98 }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-lg shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
        >
          {publishing ? (
            <>
              <Loader2 size={22} className="animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Upload size={20} />
              Publish Course
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
