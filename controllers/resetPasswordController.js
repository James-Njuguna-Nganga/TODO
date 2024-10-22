import { pool } from '../config/database.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { passwordResetValidation, resetPasswordValidation } from '../validations/passwordResetValidation.js';
import { sendEmail, generateResetUrl } from '../services/emailService.js';

export const passwordResetController = async (req, res, next) => {
  const { email } = req.body;

  if (email) {
    const { error } = passwordResetValidation.validate(req.body);
    if (error) {
      return next({ 
        statusCode: 400, 
        message: error.details[0]?.message 
      });
    }

    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length === 0) {
      return next({ 
        statusCode: 404, 
        message: 'User not found' 
      });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000).toISOString();

    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3',
      [resetToken, resetTokenExpiry, email]
    );

    const resetUrl = generateResetUrl(resetToken);
    await sendEmail(email, 'Password Reset Request', `You requested a password reset. Click the link to reset your password: ${resetUrl}`);

    return res.status(200).json({
       success: true, 
       message: 'Password reset email sent' 
      });
  } 

  const { token } = req.params;
  const { error } = resetPasswordValidation.validate(req.body);
  if (error) {
    return next({ 
      statusCode: 400, 
      message: error.details[0]?.message 
    });
  }

  const { password } = req.body;

  const { rows } = await pool.query(
    'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > $2',
    [token, new Date().toISOString()]
  );

  if (rows.length === 0) {
    return next({ 
      statusCode: 400, 
      message: 'Invalid or expired token' 
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query(
    'UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE email = $2',
    [hashedPassword, rows[0].email]
  );

  return res.status(200).json({ 
    success: true, 
    message: 'Password reset successfully' 
  });
};
