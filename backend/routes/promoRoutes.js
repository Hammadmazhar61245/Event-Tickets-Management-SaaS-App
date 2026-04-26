import express from 'express';
import { validatePromo } from '../controllers/promoController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/validate', protect, validatePromo);

export default router;