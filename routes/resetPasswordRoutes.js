import express from 'express';
import { requestPasswordReset, resetPassword } from '../controllers/resetPasswordController.js';
const resetPassword = express.Router();

router.post('/requestPassword', requestPasswordReset);
router.post('/resetPassword/:token', resetPassword);

export default resetPassword;

