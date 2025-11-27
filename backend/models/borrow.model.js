import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema(
  {
    Ma_Doc_Gia: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reader",
      required: true,
    },
    Ma_Sach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    Ngay_Muon: { type: Date, default: Date.now },
    Ngay_Tra: { type: Date },
    trang_thai: {
      type: String,
      enum: ["Đang mượn", "Đã trả"],
      default: "Đang mượn",
    },
  },
  { collection: "Theo_Doi_Muon_Sach", timestamps: true }
);

export default mongoose.model("Borrow", borrowSchema);
