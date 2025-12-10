import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads/products');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory:', uploadsDir);
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  },
});

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

  const imageUrl = `/uploads/products/${req.file.filename}`;
  
  res.status(200).json({
    status: 'success',
    data: {
      url: imageUrl,
      filename: req.file.filename,
    },
  });
});

// Upload multiple images
router.post('/multiple', authenticate, authorize('admin'), (req, res) => {
  upload.array('images', 5)(req, res, (err) => {
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
    const imageUrls = files.map(file => `/uploads/products/${file.filename}`);
    
    console.log('✅ Uploaded images:', imageUrls);
    
    res.status(200).json({
      status: 'success',
      data: {
        urls: imageUrls,
      },
    });
  });
});

export default router;
