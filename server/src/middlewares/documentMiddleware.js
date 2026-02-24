import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "advocate_documents",
    allowed_formats: ["jpg", "jpeg", "png", "pdf", "doc", "docx"],
  },
});

const upload = multer({ storage });

export default upload;