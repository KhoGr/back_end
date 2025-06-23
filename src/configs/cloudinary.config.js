import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

console.log("Toàn bộ biến môi trường:", {
  CLOUD_NAME: process.env.CLOUD_NAME,
  CLOUD_API_KEY: process.env.CLOUD_API_KEY,
  CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,  
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET,
});

// Kiểm tra xem Cloudinary có nhận được cấu hình không
// console.log("Cloudinary status:", cloudinary.config());

export default cloudinary;
