import mongoose from "mongoose";

const readerSchema = new mongoose.Schema(
  {
    Ma_Doc_Gia: { type: String, required: true, unique: true },
    Ho_Lot: { type: String },
    Ten: { type: String },
    Ngay_Sinh: { type: Date },
    Phai: { type: String },
    Dia_Chi: { type: String },
    Dien_Thoai: { type: String },
  },
  { collection: "Doc_Gia", timestamps: true }
);

export default mongoose.model("Reader", readerSchema);
