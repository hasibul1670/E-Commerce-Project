import multer from "multer";
import path from "path";
import config from "../config";

const UPLOAD_DIR = config.uploadDir;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    cb(
      null,
      Date.now() + "-" + file.originalname.replace(extname, "") + extname
    );
  },
});

const upload = multer({ storage: storage });

export default upload;
