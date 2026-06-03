import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    channel: { type: mongoose.Schema.Types.ObjectId, ref: 'CommunityChannel', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, default: '', trim: true },
    type: { 
      type: String, 
      enum: ['text', 'image', 'gif', 'file', 'system'], 
      default: 'text' 
    },
    attachments: [{
      url: { type: String, required: true },
      name: { type: String, default: 'Attachment' },
      size: { type: Number, default: 0 },
      mimeType: { type: String, default: 'application/octet-stream' },
      kind: { type: String, enum: ['image', 'gif', 'file'], default: 'file' },
    }],
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    reactions: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      emoji: { type: String },
    }],
    edited: { type: Boolean, default: false },
    editedAt: { type: Date },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

messageSchema.index({ channel: 1, createdAt: -1 });

export default mongoose.model('Message', messageSchema);
