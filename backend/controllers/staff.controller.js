import Staff from "../models/staff.model.js";

// Lấy danh sách nhân viên
export const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find();
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách nhân viên", error });
  }
};

// Thêm nhân viên mới
export const createStaff = async (req, res) => {
  try {
    const newStaff = await Staff.create(req.body);
    res.status(201).json(newStaff);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi thêm nhân viên", error });
  }
};

// Cập nhật nhân viên
export const updateStaff = async (req, res) => {
  try {
    const updated = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi cập nhật nhân viên", error });
  }
};

// Xóa nhân viên
export const deleteStaff = async (req, res) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Đã xóa nhân viên thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa nhân viên", error });
  }
};
