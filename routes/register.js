import express from 'express';
import { registerUser } from '../controllers/registrationController.js';

const register = express.Router();

register.post('/', registerUser);

export default register;
