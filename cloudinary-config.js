import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv';
dotenv.config();
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
// import {
//   CLOUDINARY_API_SECRET,
//   CLOUDINARY_API_KEY,
//   CLOUDINARY_CLOUD_NAME,
// } from "./config.js";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export default cloudinary;
