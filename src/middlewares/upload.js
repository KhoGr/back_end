import multer from "multer";

const storage = multer.memoryStorage(); 


const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, 
});
console.log("upload thành công")

export default upload;
