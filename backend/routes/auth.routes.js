import express from "express";
import {
  readerRegister,
  staffLogin,
  readerLogin,
  getCurrentStaff,
  getCurrentReader,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Staff (Admin) routes
router.post("/staff/login", staffLogin);
router.post("/staff/verify", getCurrentStaff);

// Reader (User) routes
router.post("/reader/register", readerRegister);
router.post("/reader/login", readerLogin);
router.post("/reader/verify", getCurrentReader);

export default router;
