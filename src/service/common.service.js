import { cloudinary } from '../configs/cloudinary.config.js';


// Upload image function
export const uploadImage = async (imgSrc, folderName = "", config = {}) => {
  try {
    const result = await cloudinary.uploader.upload(imgSrc, {
      folder: folderName,
      ...config,
    });
    return result.secure_url;
  } catch (error) {
    console.error("Lỗi khi upload ảnh:", error);
    throw error;
  }
};


