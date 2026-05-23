const sharp = require('sharp');

class ImageService {
  /**
   * معالجة الصورة: تحويلها لـ WebP، وضبط الحجم ديناميكياً
   * @param {Buffer} buffer - بافر الصورة الأصلية
   * @param {string} sizeType - الحجم المطلوب (thumbnail, medium, large, original)
   * @returns {Promise<Buffer>} - بافر الصورة المعالجة والمضغوطة
   */
  async processImage(buffer, sizeType) {
    let width;
    let quality = 80; // توازن ممتاز بين الجودة العالية والحجم الصغير

    switch (sizeType) {
      case 'thumbnail':
        width = 300;
        quality = 70; // الكروت الصغيرة لا تحتاج جودة فائقة
        break;
      case 'medium':
        width = 800;
        quality = 80;
        break;
      case 'large':
        width = 1600;
        quality = 85;
        break;
      case 'original':
      default:
        // الحجم الأصلي نقوم فقط بضغطه بدون تغيير أبعاد
        return await sharp(buffer)
          .webp({ quality: 85 })
          .toBuffer();
    }

    // تقطيع الصورة وضغطها ديناميكياً
    return await sharp(buffer)
      .resize({
        width: width,
        withoutEnlargement: true, // يمنع تشويه الصور الصغيرة لو تم تكبيرها
        fit: 'inside'
      })
      .webp({ quality: quality })
      .toBuffer();
  }
}

module.exports = new ImageService();
