import Borrow from "../models/borrow.model.js";
import Book from "../models/book.model.js";
import mongoose from "mongoose";

// Lấy danh sách mượn sách
export const getAllBorrows = async (req, res) => {
  try {
    const { Ma_Doc_Gia } = req.query;
    
    // Nếu có Ma_Doc_Gia parameter, lọc theo độc giả
    const filter = Ma_Doc_Gia ? { Ma_Doc_Gia } : {};
    
    const borrows = await Borrow.find(filter)
      .populate("Ma_Doc_Gia")
      .populate({
        path: "Ma_Sach",
        populate: {
          path: "Tac_Gia",
        },
      });
    res.status(200).json(borrows);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách mượn sách", error });
  }
};

// Thêm bản ghi mượn sách
export const createBorrow = async (req, res) => {
  try {
    const { Ma_Doc_Gia, Ma_Sach, Ngay_Muon, Ngay_Tra, trang_thai } = req.body;

    // Validate required fields
    if (!Ma_Doc_Gia || !Ma_Sach) {
      return res.status(400).json({
        message: "Ma_Doc_Gia và Ma_Sach là bắt buộc",
      });
    }

    // Convert string IDs to ObjectId if needed
    const docGiaId = new mongoose.Types.ObjectId(Ma_Doc_Gia);
    const sachId = new mongoose.Types.ObjectId(Ma_Sach);

    // Kiểm tra số lượng sách chưa trả (tối đa 3 cuốn)
    const unreturned = await Borrow.countDocuments({
      Ma_Doc_Gia: docGiaId,
      trang_thai: "Đang mượn",
    });

    if (unreturned >= 3) {
      return res.status(400).json({
        message: "Bạn đã mượn 3 cuốn sách. Vui lòng trả sách trước khi mượn thêm.",
      });
    }

    const borrowData = {
      Ma_Doc_Gia: docGiaId,
      Ma_Sach: sachId,
      Ngay_Muon: Ngay_Muon ? new Date(Ngay_Muon) : new Date(),
      trang_thai: trang_thai || "Đang mượn",
    };

    // Set Ngay_Tra: nếu có thì dùng, không thì mặc định = Ngay_Muon + 14 ngày
    if (Ngay_Tra) {
      borrowData.Ngay_Tra = new Date(Ngay_Tra);
    } else {
      const returnDate = new Date(borrowData.Ngay_Muon);
      returnDate.setDate(returnDate.getDate() + 14);
      borrowData.Ngay_Tra = returnDate;
    }

    console.log("Creating borrow with data:", borrowData);
    const newBorrow = await Borrow.create(borrowData);
    
    // Trừ So_Quyen của sách
    await Book.findByIdAndUpdate(
      sachId,
      { $inc: { So_Quyen: -1 } },
      { new: true }
    );
    
    await newBorrow.populate("Ma_Doc_Gia");
    await newBorrow.populate({
      path: "Ma_Sach",
      populate: {
        path: "Tac_Gia",
      },
    });
    res.status(201).json(newBorrow);
  } catch (error) {
    console.error("Create Borrow Error:", error);
    res.status(400).json({
      message: "Lỗi khi thêm bản ghi mượn sách",
      error: error.message,
    });
  }
};

// Cập nhật bản ghi mượn sách (cập nhật ngày trả, trạng thái)
export const updateBorrow = async (req, res) => {
  try {
    const { Ngay_Tra_Thuc_Te, trang_thai } = req.body;
    const borrowId = req.params.id;

    // Get original borrow record
    const originalBorrow = await Borrow.findById(borrowId);
    
    if (!originalBorrow) {
      return res.status(404).json({
        message: "Bản ghi mượn sách không tồn tại",
      });
    }

    // Update borrow record
    const updateData = {};
    if (Ngay_Tra_Thuc_Te) {
      updateData.Ngay_Tra_Thuc_Te = new Date(Ngay_Tra_Thuc_Te);
    }
    if (trang_thai) {
      updateData.trang_thai = trang_thai;
    }

    const updated = await Borrow.findByIdAndUpdate(borrowId, updateData, {
      new: true,
    })
      .populate("Ma_Doc_Gia")
      .populate({
        path: "Ma_Sach",
        populate: {
          path: "Tac_Gia",
        },
      });

    // Nếu trả sách thì tăng lại So_Quyen
    if (trang_thai === "Đã trả" && originalBorrow.trang_thai === "Đang mượn") {
      await Book.findByIdAndUpdate(
        originalBorrow.Ma_Sach,
        { $inc: { So_Quyen: 1 } },
        { new: true }
      );
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Update Borrow Error:", error.message);
    console.error("Error Stack:", error.stack);
    res
      .status(400)
      .json({ message: "Lỗi khi cập nhật bản ghi mượn sách", error: error.message });
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
