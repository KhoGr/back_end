import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

// Load biến môi trường từ .env
dotenv.config();

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Export Cloudinary
export { cloudinary };
