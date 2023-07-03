import multer from "multer";
import config from "../config";
import { Request} from 'express';
import { FileFilterCallback } from 'multer';

const UPLOAD_DIR = config.uploadDir;

const MAX_FILE_SIZE = Number(config.maxFileSize) || 2097152;
const ALLOWES_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

const storage = multer.memoryStorage();


const fileFilter = (req:Request, file: Express.Multer.File, cb: any) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false);
  }
  if (file.size > MAX_FILE_SIZE) {
    return cb(new Error("File Size exceeds maximum LIMIT"), false);
  }

  if (!ALLOWES_FILE_TYPES.includes(file.mimetype)) {
    return cb(new Error("File type is not allowed"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export default upload;
