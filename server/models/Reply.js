import mongoose from 'mongoose';

const replySchema = new mongoose.Schema(
  {
    thread: { type: mongoose.Schema.Types.ObjectId, ref: 'DiscussionThread', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    parentReply: { type: mongoose.Schema.Types.ObjectId, ref: 'Reply' },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isAccepted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

replySchema.index({ thread: 1, createdAt: 1 });

export default mongoose.model('Reply', replySchema);
