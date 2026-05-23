const express = require('express');
const router = express.Router();
const multer = require('multer');
const imageService = require('../services/image.service');
const { uploadFromBuffer } = require('../config/cloudinary');

// إعداد multer لحفظ الصور مؤقتاً في الذاكرة (Memory Buffer) بدلاً من القرص لزيادة السرعة والأمان
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB كحد أقصى للصورة الأصلية
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// مسار للتحقق من تشغيل السيرفر
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Gallery backend is fully operational' });
});

// مسار رفع ومعالجة الصور الذكي
router.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: 'Please select a photo to upload' });
    }

    console.log(`Processing photo: ${file.originalname} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

    // 1. معالجة وضغط الصورة لثلاثة أحجام متجاوبة WebP في الذاكرة
    const sizes = ['thumbnail', 'medium', 'large', 'original'];
    const uploadPromises = sizes.map(async (size) => {
      // ضغط وتعديل الحجم عن طريق Sharp
      const processedBuffer = await imageService.processImage(file.buffer, size);
      
      // رفع البافر المضغوط مباشرة إلى Cloudinary
      const uploadResult = await uploadFromBuffer(processedBuffer, `rouh_masrya_${size}`);
      
      return {
        size: size,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        bytes: uploadResult.bytes
      };
    });

    // 2. تشغيل الرفع المتوازي لكافة الأحجام لسرعة المعالجة الفائقة
    const results = await Promise.all(uploadPromises);

    // 3. ترتيب النتائج لإرسالها للواجهة
    const responseData = {};
    results.forEach(resItem => {
      responseData[resItem.size] = {
        url: resItem.url,
        publicId: resItem.publicId,
        dimensions: `${resItem.width}x${resItem.height}`,
        sizeKB: (resItem.bytes / 1024).toFixed(1) + ' KB'
      };
    });

    console.log(`Photo processed & uploaded successfully for all sizes! 🎉`);

    res.json({
      success: true,
      message: 'Photo optimized and uploaded successfully',
      originalName: file.originalname,
      photoData: responseData
    });

  } catch (error) {
    console.error('Upload & optimization error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during image processing',
      error: error.message
    });
  }
});

module.exports = router;
