import mongoose from "mongoose";

const publisherSchema = new mongoose.Schema(
  {
    Ma_NXB: { type: String, required: true, unique: true },
    Ten_NXB: { type: String, required: true },
    Dia_Chi: { type: String },
  },
  { collection: "Nha_Xuat_Ban", timestamps: true }
);

export default mongoose.model("Publisher", publisherSchema);
