import Borrow from "../models/borrow.model.js";

// Lấy danh sách mượn sách
export const getAllBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find()
      .populate("Ma_Doc_Gia")
      .populate("Ma_Sach");
    res.status(200).json(borrows);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách mượn sách", error });
  }
};

// Thêm bản ghi mượn sách
export const createBorrow = async (req, res) => {
  try {
    const newBorrow = await Borrow.create(req.body);
    await newBorrow.populate(["Ma_Doc_Gia", "Ma_Sach"]);
    res.status(201).json(newBorrow);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi thêm bản ghi mượn sách", error });
  }
};

// Cập nhật bản ghi mượn sách (cập nhật ngày trả, trạng thái)
export const updateBorrow = async (req, res) => {
  try {
    const updated = await Borrow.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate(["Ma_Doc_Gia", "Ma_Sach"]);
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi cập nhật bản ghi mượn sách", error });
  }
};

// Xóa bản ghi mượn sách
export const deleteBorrow = async (req, res) => {
  try {
    await Borrow.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Đã xóa bản ghi mượn sách thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa bản ghi mượn sách", error });
  }
};
