import mongoose from "mongoose";

const authorSchema = new mongoose.Schema(
  {
    Ma_Tac_Gia: { type: String, required: true, unique: true },
    Ten_Tac_Gia: { type: String, required: true },
    Nam_Sinh: { type: Number },
    Que_Quan: { type: String },
    Tieu_Su: { type: String },
  },
  { collection: "Tac_Gia", timestamps: true, versionKey: false }
);

export default mongoose.model("Author", authorSchema);
