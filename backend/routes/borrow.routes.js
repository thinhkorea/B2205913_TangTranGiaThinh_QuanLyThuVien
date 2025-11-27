import express from "express";
import {
  getAllBorrows,
  createBorrow,
  updateBorrow,
  deleteBorrow,
} from "../controllers/borrow.controller.js";

const router = express.Router();

router.get("/", getAllBorrows);
router.post("/", createBorrow);
router.put("/:id", updateBorrow);
router.delete("/:id", deleteBorrow);

export default router;
