import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    Ma_Sach: { type: String, required: true, unique: true },
    Ten_Sach: { type: String, required: true },
    Don_Gia: { type: Number },
    So_Quyen: { type: Number },
    Nam_Xuat_Ban: { type: Number },
    Tac_Gia: { type: String },
    Ma_NXB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Publisher",
    },
  },
  { collection: "Sach", timestamps: true }
);

export default mongoose.model("Book", bookSchema);
