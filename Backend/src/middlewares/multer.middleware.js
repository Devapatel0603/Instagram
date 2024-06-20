import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            `${req.user._id}${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

export const upload = multer({
    storage,
});
