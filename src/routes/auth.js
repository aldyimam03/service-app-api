import express from "express";
import { login, logout, profile } from "../controllers/authController.js";
import { validate, loginSchema } from "../middleware/validation.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.get("/profile", authenticateToken, isAdmin, profile);
router.post("/logout", authenticateToken, isAdmin, logout);

export default router;
