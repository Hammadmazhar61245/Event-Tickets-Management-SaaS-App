import express from 'express';
import {
  createPaymentIntent,
  createOrder,
  getMyOrders,
  getOrderById,
  getMyTickets
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/mytickets', protect, getMyTickets);
router.get('/:id', protect, getOrderById);

export default router;