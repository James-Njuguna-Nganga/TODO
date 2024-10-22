import bcrypt from "bcrypt";
import { pool } from "../config/database.js";
import { loginValidation } from "../validations/loginValidation.js";
import { generateToken } from "../services/tokenService.js";

export const loginController = async (req, res, next) => {
  const { error } = loginValidation.validate(req.body);
  if (error) {
    return next({
      statusCode: 400, 
      message: error.details[0]?.message 
    });
  }

  const { email, password } = req.body;

  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (!rows.length) {
    return next({ 
      statusCode: 404, 
      message: "User not found" 
    });
  }

  const user = rows[0];

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return next({ 
      statusCode: 401, 
      message: "Invalid email or password" 
    });
  }

  const token = generateToken(user);

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
  });
};
