import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Feedback', feedbackSchema);
