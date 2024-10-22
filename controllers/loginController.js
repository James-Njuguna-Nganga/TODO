import bcrypt from "bcrypt";
import { pool } from "../config/database.js";
import { loginValidation } from "../validations/loginValidation.js";
import { generateToken } from "../services/tokenService.js";

export const loginController = async (req, res) => {
  const { error } = loginValidation.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0]?.message });
  }

  const { email, password } = req.body;

  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (!rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const user = rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
