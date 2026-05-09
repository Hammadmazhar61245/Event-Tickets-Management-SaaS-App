import express from 'express';
import { createVenue, getVenues, updateVenue, deleteVenue } from '../controllers/venueController.js';
import { protect, organizer } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, organizer, createVenue)
  .get(protect, organizer, getVenues);

router.route('/:id')
  .put(protect, organizer, updateVenue)
  .delete(protect, organizer, deleteVenue);

export default router;