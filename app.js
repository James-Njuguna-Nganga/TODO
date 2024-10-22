import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import register from "./routes/register.js";
import login from "./routes/login.js";
import resetPassword from "./routes/resetPasswordRoutes.js";
import todos from "./routes/todos.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import limiter from './middleware/rateLimiter.js';
import swaggerDefinition from "./swagger.json" assert { type: "json" };

const app = express();

app.use(express.json());
app.use(cors());
app.use(limiter);

const baseUrl = "/mytodo/v1";

app.use(baseUrl + "/register", register);
app.use(baseUrl + "/login", login);
app.use(baseUrl + "/resetPassword", resetPassword);
app.use(baseUrl + "/todos", todos);

app.use(
  baseUrl + "/swagger",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDefinition)
);
app.use(errorMiddleware);

export default app;
