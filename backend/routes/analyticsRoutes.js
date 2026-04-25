import express from 'express';
import { organizerAnalytics } from '../controllers/analyticsController.js';
import { protect, organizer } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, organizer, organizerAnalytics);

export default router;