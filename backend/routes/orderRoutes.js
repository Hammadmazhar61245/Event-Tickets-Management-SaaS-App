import express from 'express';
import {
  simulatePayment,
  getMyOrders,
  getOrderById,
  getMyTickets
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Simulated payment (no Stripe)
router.post('/simulate-payment', protect, simulatePayment);
router.get('/myorders', protect, getMyOrders);
router.get('/mytickets', protect, getMyTickets);
router.get('/:id', protect, getOrderById);

export default router;