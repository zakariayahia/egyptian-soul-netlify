const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const galleryRoutes = require('./routes/gallery');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. ميكانيكية التحصين والحماية والـ CORS
app.use(cors({
  origin: '*', // يمكنك تحديده لاحقاً برابط موقعك على Vercel لزيادة الأمان
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. تفعيل الـ Rate Limiter لحماية السيرفر من هجمات الرفع العشوائية
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 دقيقة افتراضياً
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // الحد الأقصى للطلبات لكل آي بي
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});
app.use('/api/', limiter);

// 3. ربط مسارات الـ API الخاصة بالمعرض
app.use('/api/gallery', galleryRoutes);

// 4. معالج الأخطاء العام
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred',
    error: err.message
  });
});

// 5. تشغيل السيرفر بنجاح
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 Egyptian Soul Gallery API Server is running!`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`===================================================`);
});
