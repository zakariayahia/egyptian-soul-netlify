const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// تهيئة إعدادات Cloudinary من ملف الـ .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
   * رفع بافر الصورة مباشرة إلى Cloudinary دون الحاجة لحفظها على السيرفر
   * @param {Buffer} buffer - بافر الصورة المضغوطة
   * @param {string} folder - اسم المجلد في Cloudinary
   * @returns {Promise<object>} - روابط وتفاصيل الصورة المرفوعة
   */
const uploadFromBuffer = (buffer, folder = 'rouh_masrya_optimized') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

module.exports = {
  cloudinary,
  uploadFromBuffer
};
