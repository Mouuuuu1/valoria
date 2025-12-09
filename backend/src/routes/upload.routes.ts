import { Router, Request, Response } from 'express';
import { upload } from '../config/upload';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/error.middleware';

const router = Router();

// Upload single image
router.post(
  '/single',
  authenticate,
  authorize('admin'),
  upload.single('image'),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({
        status: 'error',
        message: 'No file uploaded'
      });
      return;
    }

    const imageUrl = `/uploads/products/${req.file.filename}`;

    res.status(200).json({
      status: 'success',
      data: {
        url: imageUrl,
        filename: req.file.filename
      }
    });
  })
);

// Upload multiple images
router.post(
  '/multiple',
  authenticate,
  authorize('admin'),
  upload.array('images', 5),
  asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({
        status: 'error',
        message: 'No files uploaded'
      });
      return;
    }

    const imageUrls = files.map(file => `/uploads/products/${file.filename}`);

    res.status(200).json({
      status: 'success',
      data: {
        urls: imageUrls
      }
    });
  })
);

export default router;
