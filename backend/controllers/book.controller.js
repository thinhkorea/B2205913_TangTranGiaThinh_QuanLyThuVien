import Book from "../models/book.model.js";

// Lấy danh sách tất cả sách (kèm thông tin NXB và tác giả)
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .populate("Ma_NXB") // lấy luôn thông tin NXB
      .populate("Tac_Gia"); // lấy luôn thông tin tác giả
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách sách", error });
  }
};

// Thêm sách mới
export const createBook = async (req, res) => {
  try {
    const newBook = await Book.create(req.body);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi thêm sách", error });
  }
};

// Cập nhật thông tin sách
export const updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedBook)
      return res
        .status(404)
        .json({ message: "Không tìm thấy sách để cập nhật" });
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi cập nhật sách", error });
  }
};

// Xóa sách
export const deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook)
      return res.status(404).json({ message: "Không tìm thấy sách để xóa" });
    res.status(200).json({ message: "Đã xóa sách thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa sách", error });
  }
};

// Tìm kiếm sách theo tên hoặc tác giả
export const searchBooks = async (req, res) => {
  try {
    const { keyword } = req.query;
    const regex = new RegExp(keyword, "i"); // không phân biệt hoa thường
    const results = await Book.find({
      $or: [{ Ten_Sach: regex }, { Tac_Gia: regex }],
    })
    .populate("Ma_NXB")
    .populate("Tac_Gia");
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tìm kiếm sách", error });
  }
};
