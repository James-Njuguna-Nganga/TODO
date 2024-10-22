import app from "./app.js";
import { connectDB } from "./config/database.js";
import { connectRedis } from "./config/redisClient.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connection established");

    await connectRedis();
    console.log("Redis connection established");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start the server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
