import util from "util";
import multer from "multer";
const maxSize = 5242880;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/public");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
export default uploadFileMiddleware;
