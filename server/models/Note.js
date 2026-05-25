import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    department: { type: String, required: true },
    subject: { type: String, required: true },
    tags: [String],
    file: {
      name: { type: String, required: true },
      url: { type: String, required: true },
      size: { type: Number, default: 0 },
      mimeType: { type: String, required: true },
    },
    thumbnail: { type: String, default: '' },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    uploaderName: { type: String, required: true },
    uploaderAvatar: { type: String, default: '' },
    downloads: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isApproved: { type: Boolean, default: true },
    searchText: { type: String, index: 'text' },
  },
  { timestamps: true }
);

noteSchema.pre('save', function (next) {
  this.searchText = [
    this.title,
    this.description,
    this.category,
    this.department,
    this.subject,
    ...(this.tags || []),
  ]
    .filter(Boolean)
    .join(' ');
  next();
});

export default mongoose.model('Note', noteSchema);
