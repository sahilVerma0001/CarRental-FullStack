// server/controllers/paymentController.js
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Booking from '../models/Booking.js'; // your booking model
import Car from '../models/Car.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// create order
export const createOrder = async (req, res) => {
  try {
    // amount should be in INR (paise conversion below)
    const { amount, currency = 'INR' } = req.body;
    if (!amount) return res.status(400).json({ success: false, message: 'Amount is required' });

    const options = {
      amount: Math.round(amount * 100), // in paise
      currency,
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1, // auto capture
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Order creation failed' });
  }
};

// verify payment (called by frontend handler after checkout)
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingData } = req.body;
    // 1) verify signature
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    // 2) Payment verified - create booking (optional: you can also create booking earlier with pending status)
    // bookingData should include: car, pickupDate, returnDate, price, user will be from req.user (protect middleware)
    if (bookingData) {
      const { car: carId, pickupDate, returnDate, price } = bookingData;
      const car = await Car.findById(carId);
      const booking = new Booking({
        car: carId,
        owner: car?.owner || null,
        user: req.user._id,
        pickupDate,
        returnDate,
        price,
        status: 'pending',
        payment: {
          id: razorpay_payment_id,
          orderId: razorpay_order_id,
          signature: razorpay_signature,
        },
      });

      await booking.save();
    }

    res.json({ success: true, message: 'Payment verified and booking confirmed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
};
