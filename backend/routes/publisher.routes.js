import express from "express";
import {
  getAllPublishers,
  createPublisher,
  updatePublisher,
  deletePublisher,
} from "../controllers/publisher.controller.js";

const router = express.Router();

router.get("/", getAllPublishers);
router.post("/", createPublisher);
router.put("/:id", updatePublisher);
router.delete("/:id", deletePublisher);

export default router;
