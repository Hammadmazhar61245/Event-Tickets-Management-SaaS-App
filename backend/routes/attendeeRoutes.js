import express from 'express';
import { getAttendees } from '../controllers/attendeeController.js';
import { protect, organizer } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, organizer, getAttendees);

export default router;