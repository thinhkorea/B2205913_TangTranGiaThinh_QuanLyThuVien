import express from "express";
import { login, getCurrentStaff } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/verify", getCurrentStaff);

export default router;
