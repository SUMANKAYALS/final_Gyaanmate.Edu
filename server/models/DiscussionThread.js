import mongoose from 'mongoose';

const threadSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { 
      type: String, 
      enum: ['question', 'discussion', 'announcement', 'resource', 'showcase'],
      default: 'discussion'
    },
    tags: [{ type: String }],
    channel: { type: mongoose.Schema.Types.ObjectId, ref: 'CommunityChannel' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    views: { type: Number, default: 0 },
    isSolved: { type: Boolean, default: false },
    acceptedAnswer: { type: mongoose.Schema.Types.ObjectId, ref: 'Reply' },
    pinned: { type: Boolean, default: false },
    locked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

threadSchema.index({ createdAt: -1 });
threadSchema.index({ category: 1 });
threadSchema.index({ tags: 1 });

export default mongoose.model('DiscussionThread', threadSchema);
