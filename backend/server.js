import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import bookRoutes from "./routes/book.routes.js";
import publisherRoutes from "./routes/publisher.routes.js";

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

import readerRoutes from "./routes/reader.routes.js";
// (sau này thêm tiếp các routes khác như bookRoutes, borrowRoutes...)

app.use("/api/readers", readerRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/publishers", publisherRoutes);

app.get("/", (req, res) => {
  res.send("Hello from MEVN backend — Server đang hoạt động!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
