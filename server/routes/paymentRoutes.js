// server/routes/paymentRoutes.js
import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// create order (protected so only logged-in users book)
router.post('/create-order', protect, createOrder);

// verify after checkout (protected)
router.post('/verify-payment', protect, verifyPayment);

export default router;
