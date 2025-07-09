import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./src/routes/routes.js"; // Importing routes
import connectDB from "./src/db/ConnectDB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.use("/", router);

connectDB()

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
