import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
    emailVerified: { type: Boolean, default: false },
    emailVerificationOtp: { type: String, select: false },
    emailVerificationOtpExpires: Date,
    passwordResetOtp: { type: String, select: false },
    passwordResetOtpExpires: Date,
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    instructorProfile: {
      expertise: [String],
      totalStudents: { type: Number, default: 0 },
      totalRevenue: { type: Number, default: 0 },
    },
    // Streak tracking
    streak: {
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      lastActivityDate: { type: Date, default: null },
      totalMinutesActive: { type: Number, default: 0 },
      streakCalendar: [
        {
          date: Date,
          minutesActive: Number,
          level: { type: Number, enum: [0, 1, 2, 3], default: 0 }, // 0: none, 1: light, 2: medium, 3: high
        }
      ],
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.compareEmailOtp = function (candidate) {
  return bcrypt.compare(candidate, this.emailVerificationOtp);
};

userSchema.methods.comparePasswordResetOtp = function (candidate) {
  return bcrypt.compare(candidate, this.passwordResetOtp);
};

export default mongoose.model('User', userSchema);
