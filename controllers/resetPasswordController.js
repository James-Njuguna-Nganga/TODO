import nodemailer from 'nodemailer';
import { pool } from '../config/database.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000).toISOString(); 

    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3',
      [resetToken, resetTokenExpiry, email]
    );

    const resetBaseUrl = 'http://localhost:5000/mytodo/v1/requestPassword'; 
    const resetUrl = `${resetBaseUrl}?token=${resetToken}`;
    await transport.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
    });

    res.status(200).json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await pool.query(
      'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > $2',
      [token, new Date().toISOString()]
    );
    if (user.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE email = $2',
      [hashedPassword, user.rows[0].email]
    );

    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
