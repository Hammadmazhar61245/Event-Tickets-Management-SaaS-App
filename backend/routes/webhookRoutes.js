import express from 'express';
import { handleStripeWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// This route is handled in server.js with raw body, so we just export the handler
router.post('/stripe', handleStripeWebhook);

export default router;