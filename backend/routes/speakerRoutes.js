import express from 'express';
import { createSpeaker, getSpeakers, updateSpeaker, deleteSpeaker } from '../controllers/speakerController.js';
import { protect, organizer } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, organizer, createSpeaker)
  .get(protect, organizer, getSpeakers);

router.route('/:id')
  .put(protect, organizer, updateSpeaker)
  .delete(protect, organizer, deleteSpeaker);

export default router;