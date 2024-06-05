import express from 'express';
import {sendOTP, resendOTP} from '../controllers/otpController.js';
const otpRouter = express.Router();
otpRouter.post('/send-otp', sendOTP);
otpRouter.post('/resend-otp', resendOTP);
export default otpRouter;