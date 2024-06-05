import express from 'express';
import { studentLogin, adminLogin, superAdminLogin, logout, studentSignup, adminSignup, superAdminSignup } from '../controllers/authController.js';
import {authMiddleware, refreshToken} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/studentLogin', studentLogin);
router.post('/adminLogin', adminLogin);
router.post('/superAdminLogin', superAdminLogin);
router.get('/refreshToken', refreshToken);
router.post('/logout', logout);
router.post('/studentSignup', studentSignup);
router.post('/superAdminSignup', superAdminSignup);
router.post('/adminSignup', adminSignup);

export default router;