import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Car from '../models/Car.js'
import nodemailer from 'nodemailer';
import crypto from 'crypto';



const generateToken = (userId) => {
    const payload = userId;
    return jwt.sign(payload, process.env.JWT_SECRET)
}



// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use Gmail service
    auth: {
        user: process.env.EMAIL_USER, // Replace with your Gmail
        pass: process.env.EMAIL_PASS, // Replace with your App Password
    },
});

// Verify Transporter (Optional)
transporter.verify((error, success) => {
    if (error) {
        console.log('Transporter error:', error);
    } else {
        console.log('Transporter is ready to send emails');
    }
});



// POST /api/users/forgot-password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.json({ success: false, message: 'Email is required' });

        const user = await User.findOne({ email });
        // For security, don't reveal whether user exists or not.
        if (!user) {
            // Respond the same message as when user exists.
            return res.json({ success: true, message: 'If an account with that email exists, you will receive a reset link.' });
        }

        // Generate token
        const token = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Save hashed token and expiry (1 hour)
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 Minutes
        await user.save();

        // Create reset URL (frontend route)
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        const mailOptions = {
            from: `"CarRental App" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
        <p>Hello ${user.name || ''},</p>
        <p>You requested a password reset. Click the link below to set a new password. This link will expire in 1 hour.</p>
        <p><a href="${resetUrl}">Reset password</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: 'If an account with that email exists, you will receive a reset link.' });

    } catch (err) {
        console.error(err);
        return res.json({ success: false, message: 'Something went wrong' });
    }
};



// POST /api/users/reset-password/:token
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!token) return res.json({ success: false, message: 'Invalid or missing token' });
        if (!password || password.length < 8) return res.json({ success: false, message: 'Password must be at least 8 characters' });

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }  // token not expired
        });

        if (!user) {
            return res.json({ success: false, message: 'Token is invalid or has expired' });
        }

        // Update password
        user.password = await bcrypt.hash(password, 10);
        // Clear reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Optionally send a confirmation email
        const mailOptions = {
            from: `"CarRental App" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Your password has been changed',
            html: `<p>Hello ${user.name || ''},</p><p>Your password has been successfully updated. If you did not perform this action, please contact support.</p>`
        };
        transporter.sendMail(mailOptions).catch(e => console.error('confirm mail error', e));

        return res.json({ success: true, message: 'Password has been reset successfully' });
    } catch (err) {
        console.error(err);
        return res.json({ success: false, message: 'Something went wrong' });
    }
};


// register user

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password || password.length < 8) {
            return res.json({ success: false, message: "Fill all fields properly" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP (6-digit)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save user as unverified
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpires: Date.now() + 10 * 60 * 1000, // 10 min
            isVerified: false,
        });

        // ✅ Send OTP email (async — no need to wait)
        transporter.sendMail({
            from: `"CarRental App" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify your email - CarRental",
            html: `
        <h2>Hello ${name},</h2>
        <p>Welcome to CarRental! Please verify your email to secure your account.</p>
        <h1 style="letter-spacing:4px;">${otp}</h1>
        <p>This OTP will expire in <b>10 minutes</b>.</p>
      `,
        }).catch(err => console.error("OTP email error:", err));

        res.json({
            success: true,
            message: "Registered successfully! OTP sent to your email.",
            user: {
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
            },
        });

    } catch (err) {
        console.error(err);
        res.json({ success: false, message: "Something went wrong" });
    }
};




// POST /api/user/verify-otp
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.json({ success: false, message: "Email and OTP are required" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.json({ success: false, message: "User not found" });

        if (user.isVerified) {
            return res.json({ success: true, message: "User already verified" });
        }

        // Check OTP validity
        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.json({ success: false, message: "Invalid or expired OTP" });
        }

        // Mark as verified
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // ✅ Immediately log in user (generate token)
        const token = generateToken(user._id.toString());


        res.json({ success: true,token, message: "Email verified successfully!" });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: "Error verifying OTP" });
    }
};




// login user 

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.json({ success: false, message: "User not found" });

        if (!user.isVerified)
            return res.json({ success: false, message: "Please verify your email via OTP." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.json({ success: false, message: "Invalid credentials" });

        const token = generateToken(user._id.toString());
        res.json({ success: true, token });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: err.message });
    }
};





//Get user data using Token (JWT)
export const getUserData = (req, res) => {
    try {
        const { user } = req;
        res.json({ success: true, user })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Get all cars for the frontend
export const getCars = async (req, res) => {
    try {
        const cars = await Car.find({ isAvailable: true })
        res.json({ success: true, cars })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}
