import Staff from "../models/staff.model.js";

// Đăng nhập
export const login = async (req, res) => {
  try {
    const { Ma_Nhan_Vien, Password } = req.body;

    // Kiểm tra nhân viên có tồn tại không
    const staff = await Staff.findOne({ Ma_Nhan_Vien });
    if (!staff) {
      return res.status(401).json({ message: "Mã nhân viên không tồn tại" });
    }

    // Kiểm tra password
    const isPasswordValid = await staff.comparePassword(Password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mật khẩu không đúng" });
    }

    // Trả về thông tin nhân viên (không trả password)
    const staffData = {
      _id: staff._id,
      Ma_Nhan_Vien: staff.Ma_Nhan_Vien,
      Ho_Ten: staff.Ho_Ten,
      Chuc_Vu: staff.Chuc_Vu,
      Role: staff.Role,
    };

    res.status(200).json({
      message: "Đăng nhập thành công",
      staff: staffData,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi đăng nhập", error: error.message });
  }
};

// Lấy thông tin nhân viên hiện tại (dùng cho verify session)
export const getCurrentStaff = async (req, res) => {
  try {
    const staffId = req.body.staffId;
    const staff = await Staff.findById(staffId);

    if (!staff) {
      return res.status(404).json({ message: "Nhân viên không tồn tại" });
    }

    const staffData = {
      _id: staff._id,
      Ma_Nhan_Vien: staff.Ma_Nhan_Vien,
      Ho_Ten: staff.Ho_Ten,
      Chuc_Vu: staff.Chuc_Vu,
      Role: staff.Role,
    };

    res.status(200).json(staffData);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin", error: error.message });
  }
};
