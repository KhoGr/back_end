import cloudinary from "../configs/cloudinary.config.js";
import fs from "fs";

export const uploadImage = async (filePath, folderName = "uploads", config = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName,
      ...config,
    });
    fs.unlinkSync(filePath);

    return result.secure_url;
    
  } catch (error) {
    console.error("Lỗi khi upload ảnh:", error);
    throw error;
  }
};
