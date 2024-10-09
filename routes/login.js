import express from 'express';
import { loginController } from '../controllers/loginController.js';

const login = express.Router();

login.post('/', loginController);

export default login;
