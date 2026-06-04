import mongoose from 'mongoose';

const codingSubmissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    problemSlug: { type: String, required: true, index: true },
    problemTitle: { type: String, required: true },
    language: { type: String, default: 'javascript' },
    code: { type: String, required: true },
    status: {
      type: String,
      enum: ['Accepted', 'Wrong Answer', 'Runtime Error'],
      required: true,
      index: true,
    },
    passedTests: { type: Number, default: 0 },
    totalTests: { type: Number, default: 0 },
    runtimeMs: { type: Number, default: 0 },
    error: { type: String, default: '' },
  },
  { timestamps: true }
);

codingSubmissionSchema.index({ user: 1, problemSlug: 1, createdAt: -1 });

export default mongoose.model('CodingSubmission', codingSubmissionSchema);
