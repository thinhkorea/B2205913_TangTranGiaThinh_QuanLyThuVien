import express from "express";
import {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
} from "../controllers/book.controller.js";

const router = express.Router();

// Danh sách tất cả sách
router.get("/", getAllBooks);

// Tìm kiếm sách theo từ khóa (?keyword=java)
router.get("/search", searchBooks);

// Thêm sách mới
router.post("/", createBook);

// Cập nhật sách theo ID
router.put("/:id", updateBook);

// Xóa sách theo ID
router.delete("/:id", deleteBook);

export default router;
