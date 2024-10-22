import bcrypt from "bcrypt";
import { pool } from "../config/database.js";
import { sendEmail } from "../services/emailService.js";
import { registrationSchema } from "../validations/registrationValidation.js";

export const registerUser = async (req, res, next) => {
  const { email, password } = req.body;

  const { error } = registrationSchema.validate({ email, password });
  if (error) {
    return next({ 
      statusCode: 400, 
      message: error.details[0]?.message 
    });
  }

  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (rows.length > 0) {
    return next({ 
      statusCode: 400, 
      message: "User already exists" 
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [
    email,
    hashedPassword,
  ]);

  await sendEmail(
    email,
    "Registration Successful",
    "Thank you for registering!"
  );

  res.status(201).json({ message: "User registered successfully" });
};
