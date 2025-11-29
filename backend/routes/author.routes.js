import express from "express";
import {
  getAllAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  searchAuthors,
} from "../controllers/author.controller.js";

const router = express.Router();

// Danh sách tất cả tác giả
router.get("/", getAllAuthors);

// Tìm kiếm tác giả theo từ khóa (?keyword=nguyen)
router.get("/search", searchAuthors);

// Thêm tác giả mới
router.post("/", createAuthor);

// Cập nhật tác giả theo ID
router.put("/:id", updateAuthor);

// Xóa tác giả theo ID
router.delete("/:id", deleteAuthor);

export default router;