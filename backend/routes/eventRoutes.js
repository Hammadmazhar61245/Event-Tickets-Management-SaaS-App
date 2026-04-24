import express from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getMyEvents
} from '../controllers/eventController.js';
import { protect, organizer } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getEvents)
  .post(protect, organizer, createEvent);

router.get('/myevents', protect, organizer, getMyEvents);

router.route('/:id')
  .get(getEventById)
  .put(protect, organizer, updateEvent)
  .delete(protect, organizer, deleteEvent);

export default router;