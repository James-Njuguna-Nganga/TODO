import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import register from "./routes/register.js";
import login from "./routes/login.js";
import resetPasswordRoutes from "./routes/resetPasswordRoutes.js";
import todoRoutes from "./routes/todos.js";
import rateLimit from "express-rate-limit";
import swaggerDefinition from "./swagger.json" assert { type: "json" };

const app = express();

app.use(express.json());
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});
app.use(limiter);

const baseUrl = "/mytodo/v1";

app.use(baseUrl + "/register", register);
app.use(baseUrl + "/login", login);
app.use(baseUrl, resetPasswordRoutes);
app.use(baseUrl + "/todos", todoRoutes);

app.use(
  baseUrl + "/swagger",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDefinition)
);

export default app;
