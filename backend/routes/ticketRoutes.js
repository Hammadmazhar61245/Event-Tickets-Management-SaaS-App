import express from 'express';
import {
  createTicketTier,
  getTicketTiers,
  updateTicketTier,
  deleteTicketTier
} from '../controllers/ticketController.js';
import { protect, organizer } from '../middleware/auth.js';

const router = express.Router();

router.route('/event/:eventId')
  .post(protect, organizer, createTicketTier)
  .get(getTicketTiers);

router.route('/:tierId')
  .put(protect, organizer, updateTicketTier)
  .delete(protect, organizer, deleteTicketTier);

export default router;