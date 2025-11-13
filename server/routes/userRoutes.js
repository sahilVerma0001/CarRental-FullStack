import express from 'express'
import { getCars, getUserData, loginUser, registerUser, forgotPassword, resetPassword, verifyOtp, } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/data', protect, getUserData)
userRouter.get('/cars', getCars)
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password/:token', resetPassword);
userRouter.post("/verify-otp", verifyOtp);


export default userRouter;