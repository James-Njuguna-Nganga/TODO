import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } = process.env;

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
});

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return pool;
  }

  try {
    const client = await pool.connect();
    isConnected = true;
    client.release();
    return pool;
  } catch (error) {
    throw new Error("Database connection error");
  }
};

export { connectDB };
