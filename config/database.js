import { Pool } from 'pg';
require('dotenv').config();

const { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } = process.env;

const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: DB_PORT
});

const connectionStatus  = async () => {
    try {
        const client = await pool.connect();
        console.log('Connected to the database successfully!');
        client.release();
    } catch (error) {
        console.error('Database connection error:', error);
    }
};

connectionStatus();

export default pool; 
