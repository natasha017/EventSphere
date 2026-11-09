
import multer from "multer";
import path from "path";
import fs from "fs";
import { nanoid } from "nanoid";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const uploadDir = path.join(__dirname, "../uploads/events");


fs.mkdirSync(uploadDir, { recursive: true });

const imgUpload = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${nanoid()}${extension}`);
  },
});

const upload = multer({
  storage: imgUpload,

  fileFilter: function (req, file, cb) {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error("Only JPG, PNG, and WebP images are allowed")
      );
    }

    cb(null, true);
  },

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

export default upload;
