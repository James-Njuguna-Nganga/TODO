import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Joi from 'joi'; 
import { pool } from '../config/database.js';


dotenv.config();

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
const registrationSchema = Joi.object({
  email: Joi.string().email().required(), 
  password: Joi.string().min(5).required(), 
});

export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  const { error } = registrationSchema.validate({ email, password });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);

    await transport.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Registration Successful',
      text: 'Thank you for registering!',
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
