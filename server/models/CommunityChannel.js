import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    type: { 
      type: String, 
      enum: ['public', 'private', 'course'], 
      default: 'public' 
    },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    messageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('CommunityChannel', channelSchema);
