import express from "express";
import { signup, login,googleLogin } from "../controllers/authController.js";

const router = express.Router();

// Signup
router.post("/signup", signup);

// Login
router.post("/login", login);

//google
router.post("/google", googleLogin);

export default router;