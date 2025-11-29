import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const readerSchema = new mongoose.Schema(
  {
    Ma_Doc_Gia: { type: String, required: true, unique: true },
    Ho_Lot: { type: String },
    Ten: { type: String },
    Ngay_Sinh: { type: Date },
    Phai: { type: String },
    Dia_Chi: { type: String },
    Dien_Thoai: { type: String },
    Email: { type: String },
    Password: { type: String, required: true },
    Ngay_Dang_Ky: { type: Date, default: Date.now },
    Tinh_Trang: { type: String, default: '1' }, // '1' = Hoạt động, '0' = Bị khóa
  },
  { collection: "Doc_Gia", timestamps: true, versionKey: false }
);

// Hash password trước khi lưu
readerSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method kiểm tra password
readerSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.Password);
};

export default mongoose.model("Reader", readerSchema);
