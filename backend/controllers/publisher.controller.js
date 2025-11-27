import Publisher from "../models/publisher.model.js";

// Lấy danh sách nhà xuất bản
export const getAllPublishers = async (req, res) => {
  try {
    const publishers = await Publisher.find();
    res.status(200).json(publishers);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách NXB", error });
  }
};

// Thêm nhà xuất bản mới
export const createPublisher = async (req, res) => {
  try {
    const newPublisher = await Publisher.create(req.body);
    res.status(201).json(newPublisher);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi thêm NXB", error });
  }
};

// Cập nhật NXB
export const updatePublisher = async (req, res) => {
  try {
    const updatedPublisher = await Publisher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPublisher)
      return res
        .status(404)
        .json({ message: "Không tìm thấy NXB để cập nhật" });
    res.status(200).json(updatedPublisher);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi cập nhật NXB", error });
  }
};

// Xóa NXB
export const deletePublisher = async (req, res) => {
  try {
    const deletedPublisher = await Publisher.findByIdAndDelete(req.params.id);
    if (!deletedPublisher)
      return res.status(404).json({ message: "Không tìm thấy NXB để xóa" });
    res.status(200).json({ message: "Đã xóa NXB thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa NXB", error });
  }
};
