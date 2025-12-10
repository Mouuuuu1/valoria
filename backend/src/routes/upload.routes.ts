import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = Router();

// Configure Cloudinary
const useCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('✅ Cloudinary configured for image uploads');
}

// Configure storage based on environment
let storage: any;
let uploadsDir: string;

if (useCloudinary) {
  // Use Cloudinary for production
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'valoria/products',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
    } as any,
  });
} else {
  // Use local storage for development
  uploadsDir = process.env.NODE_ENV === 'production' 
    ? '/tmp/uploads/products' 
    : path.join(__dirname, '../../uploads/products');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Created uploads directory:', uploadsDir);
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    },
  });
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

// Upload single image
router.post('/image', authenticate, authorize('admin'), upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: 'error',
      message: 'No file uploaded',
    });
  }

  // Cloudinary files have a 'path' property with the full URL
  const imageUrl = (req.file as any).path || `/uploads/products/${req.file.filename}`;
  
  res.status(200).json({
    status: 'success',
    data: {
      url: imageUrl,
      filename: req.file.filename,
    },
  });
});

// Upload multiple images
router.post('/multiple', authenticate, authorize('admin'), (req, res, next) => {
  upload.array('images', 5)(req, res, (err) => {
    try {
      if (err) {
        console.error('❌ Upload error:', err);
        return res.status(400).json({
          status: 'error',
          message: err.message || 'File upload failed',
        });
      }

      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'No files uploaded',
        });
      }

      const files = req.files as Express.Multer.File[];
      // Cloudinary files have a 'path' property with the full URL
      const imageUrls = files.map(file => (file as any).path || `/uploads/products/${file.filename}`);
      
      console.log('✅ Uploaded images:', imageUrls);
      
      res.status(200).json({
        status: 'success',
        data: {
          urls: imageUrls,
        },
      });
    } catch (error: any) {
      console.error('❌ Unexpected error in upload:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Upload failed',
      });
    }
  });
});

export default router;
