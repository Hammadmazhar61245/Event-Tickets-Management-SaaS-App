import express from 'express';
import {
  createTicketTier,
  getTicketTiers,
  updateTicketTier,
  deleteTicketTier,
  cancelTicket
} from '../controllers/ticketController.js';
import { protect, organizer } from '../middleware/auth.js';

const router = express.Router();

router.route('/event/:eventId')
  .post(protect, organizer, createTicketTier)
  .get(getTicketTiers);

router.route('/:tierId')
  .put(protect, organizer, updateTicketTier)
  .delete(protect, organizer, deleteTicketTier);

router.put('/cancel/:ticketId', protect, cancelTicket);

export default router;