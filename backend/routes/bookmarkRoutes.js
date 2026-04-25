import express from 'express';
import { toggleBookmark, getBookmarks } from '../controllers/bookmarkController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getBookmarks);
router.put('/:eventId', protect, toggleBookmark);

export default router;