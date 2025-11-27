import express from "express";
import {
  getAllReaders,
  createReader,
  updateReader,
  deleteReader,
} from "../controllers/reader.controller.js";

const router = express.Router();

router.get("/", getAllReaders);
router.post("/", createReader);
router.put("/:id", updateReader);
router.delete("/:id", deleteReader);

export default router;
