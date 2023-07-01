import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import multer from "multer";
import path from "path";
import config from "../config";

const UPLOAD_DIR = config.uploadDir;

const MAX_FILE_SIZE = Number(config.maxFileSize) || 2097152;
const ALLOWES_FILE_TYPES = config.allowedFileTypes || ["jpg", "png", "jpeg"];
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname) as string;

    cb(
      null,
      Date.now() + "-" + file.originalname.replace(extname, "") + extname
    );
  },
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const extname = path.extname(file.originalname) as string;

  if (!ALLOWES_FILE_TYPES.includes(extname.substring(1))) {
    
    return cb(
      createHttpError(StatusCodes.NOT_ACCEPTABLE, "File type not allowed")
    );
  }
  cb(null, true);
};
const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

export default upload;
