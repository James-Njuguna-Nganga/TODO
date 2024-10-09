import { pool } from '../config/database.js';

export const User = {
  async findByEmail(email) {
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0];
  },

  async create(email, password) {
    await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, password]);
  },
};
