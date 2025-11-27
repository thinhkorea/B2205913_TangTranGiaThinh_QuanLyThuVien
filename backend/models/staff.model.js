import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    Ma_Nhan_Vien: { type: String, required: true, unique: true },
    Ho_Ten: { type: String, required: true },
    Password: { type: String, required: true },
    Chuc_Vu: { type: String },
    Dia_Chi: { type: String },
    So_Dien_Thoai: { type: String },
  },
  { collection: "Nhan_Vien", timestamps: true }
);

export default mongoose.model("Staff", staffSchema);
