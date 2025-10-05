import express from 'express';
const router = express.Router();
import { signup, login, logout } from '../controllers/auth.controller.js';


router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);


// router.post('/register', register);
// router.post('/login', login);
// router.post('/logout', logout);
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password', resetPassword);
// router.post('/verify-email', verifyEmail);
// router.post('/send-verification-email', sendVerificationEmail);
// router.post('/send-reset-password-email', sendResetPasswordEmail);



export default router;