import multer from "multer";
import path from "path";
import { HttpError } from "../helpers/index.js";

const destination = path.resolve("tmp");

const storage = multer.diskStorage({
  destination,
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const limits = { fileSize: 1024 * 1024 * 6 };
const fileFilter = (req, file, callback) => {
  const extension = req.originalname.split(".").pop();
  if (extension === "exe") {
    callback(HttpError(400, ".exe not valid extension"));
  }
};

const upload = multer({
  storage,
  limits,
});

export default upload;