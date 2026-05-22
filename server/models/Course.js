import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, default: '10 min' },
  videoUrl: { type: String, default: '' },
  order: { type: Number, default: 0 },
});

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  size: { type: Number, default: 0 },
  mimeType: { type: String, default: 'application/pdf' },
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String, required: true },
    descriptionFull: { type: String, default: '' },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    instructorName: { type: String, required: true },
    instructorImage: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, index: true },
    categorySlug: { type: String, index: true },
    image: { type: String, default: '' },
    introVideo: { type: String, default: '' },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    students: { type: Number, default: 0 },
    duration: { type: String, default: '8 weeks' },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'], default: 'Beginner' },
    reviews: { type: Number, default: 0 },
    lessons: [lessonSchema],
    skills: [String],
    tags: [String],
    requirements: [String],
    whatYouWillLearn: [String],
    resources: [resourceSchema],
    isPublished: { type: Boolean, default: true },
    language: { type: String, default: 'English' },
    searchText: { type: String, index: 'text' },
  },
  { timestamps: true }
);

courseSchema.pre('save', function (next) {
  this.searchText = [
    this.title,
    this.description,
    this.descriptionFull,
    this.category,
    ...(this.tags || []),
    ...(this.skills || []),
    ...(this.requirements || []),
    ...(this.whatYouWillLearn || []),
    this.level,
    this.language,
  ]
    .filter(Boolean)
    .join(' ');
  if (this.title) {
    const base = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    if (!this.slug || this.isModified('title')) {
      this.slug = `${base}-${Date.now().toString(36)}`;
    }
  }
  next();
});

export default mongoose.model('Course', courseSchema);
