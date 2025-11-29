import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    Ma_Sach: { type: String, required: true, unique: true },
    Ten_Sach: { type: String, required: true },
    Don_Gia: { type: Number },
    So_Quyen: { type: Number },
    Nam_Xuat_Ban: { type: Number },
    Tac_Gia: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
    },
    Ma_NXB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Publisher",
    },
    Hinh_Anh: { type: String, default: "" }, // URL hình ảnh bìa sách
    Mo_Ta: { type: String, default: "" }, // Mô tả chi tiết về sách
  },
  { collection: "Sach", timestamps: true, versionKey: false }
);

export default mongoose.model("Book", bookSchema);
