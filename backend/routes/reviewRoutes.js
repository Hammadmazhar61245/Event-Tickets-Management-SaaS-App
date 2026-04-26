import express from 'express';
import { addReview, getEventReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, addReview);
router.get('/event/:eventId', getEventReviews);

export default router;