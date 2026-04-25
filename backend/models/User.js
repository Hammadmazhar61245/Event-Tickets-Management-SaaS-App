import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['attendee', 'organizer'], default: 'attendee' },
  phone: { type: String },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  bookmarkedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  createdAt: { type: Date, default: Date.now }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

const User = mongoose.model('User', userSchema);
export default User;