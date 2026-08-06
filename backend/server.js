import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
dotenv.config();

const app = express();

connectDB();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://notes-app-gxt2-pr1wmtdxc-aleeza-amjads-projects.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());


app.get("/", (req, res) => {
  res.send("Notes App Backend Running...");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});