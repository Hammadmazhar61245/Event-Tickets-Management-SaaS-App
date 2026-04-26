import express from 'express';
import {
  register,
  login,
  verifyEmail,
  getProfile,
  updateProfile,
  uploadProfilePicture,
  forgotPassword,
  resetPassword,
  upload
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Existing
router.post('/register', register);
router.post('/login', login);
router.get('/verify/:token', verifyEmail);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Profile picture upload
router.put('/profile-picture', protect, upload.single('profilePicture'), uploadProfilePicture);

// Forgot / Reset password
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;