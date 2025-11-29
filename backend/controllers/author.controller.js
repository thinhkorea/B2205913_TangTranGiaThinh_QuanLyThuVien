import Author from "../models/author.model.js";

// Lấy danh sách tất cả tác giả
export const getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find().sort({ Ten_Tac_Gia: 1 });
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách tác giả", error });
  }
};

// Thêm tác giả mới
export const createAuthor = async (req, res) => {
  try {
    const newAuthor = await Author.create(req.body);
    res.status(201).json(newAuthor);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi thêm tác giả", error });
  }
};

// Cập nhật thông tin tác giả
export const updateAuthor = async (req, res) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedAuthor)
      return res.status(404).json({ message: "Không tìm thấy tác giả để cập nhật" });
    res.status(200).json(updatedAuthor);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi cập nhật tác giả", error });
  }
};

// Xóa tác giả
export const deleteAuthor = async (req, res) => {
  try {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
    if (!deletedAuthor)
      return res.status(404).json({ message: "Không tìm thấy tác giả để xóa" });
    res.status(200).json({ message: "Đã xóa tác giả thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa tác giả", error });
  }
};

// Tìm kiếm tác giả theo tên
export const searchAuthors = async (req, res) => {
  try {
    const { keyword } = req.query;
    const regex = new RegExp(keyword, "i");
    const results = await Author.find({
      Ten_Tac_Gia: regex
    });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tìm kiếm tác giả", error });
  }
};