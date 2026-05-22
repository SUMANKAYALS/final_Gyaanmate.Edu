import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    paymentId: { type: String, required: true, unique: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    studentName: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    courseName: { type: String, required: true },
    instructorName: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['completed', 'pending', 'failed'], default: 'completed' },
    method: { type: String, default: 'card' },
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);
