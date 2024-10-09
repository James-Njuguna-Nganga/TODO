import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import register from './routes/register.js';
import login from './routes/login.js';

import swaggerDefinition from './swagger.json' assert { type: 'json' };


const app = express();

app.use(express.json()); 

app.use(cors());
 
  
const baseUrl = '/mytodo/v1';

// Mount routes
app.use(baseUrl + '/register', register);
app.use(baseUrl + '/login', login);

// Mount Swagger
app.use(
  baseUrl + '/swagger',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDefinition),
);

export default app;
