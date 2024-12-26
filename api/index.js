import express from "express";
import dotenv from "dotenv";
import connectToDb from "./db/connectToDb.js";
import cors from "cors";

//routes
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import adminRoutes from "./routes/admin.routes.js";

import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
connectToDb();

const PORT = process.env.PORT || 6000;

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
