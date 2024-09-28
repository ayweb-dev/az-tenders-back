// uploadMiddleware.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../cloudinary-config.js"; // Assurez-vous que ce chemin est correct

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "tenders", // Nom du dossier dans Cloudinary
    allowed_formats: ["jpg", "png", "pdf"],
  },
});

const upload = multer({ storage: storage });

export default upload;
