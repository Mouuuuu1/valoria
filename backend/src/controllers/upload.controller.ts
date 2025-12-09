import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware';

// @desc    Upload product images
// @route   POST /api/upload/products
// @access  Private/Admin
export const uploadProductImages = asyncHandler(async (req: Request, res: Response) => {
  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    res.status(400).json({
      status: 'error',
      message: 'No files uploaded'
    });
    return;
  }

  const files = req.files as Express.Multer.File[];
  const urls = files.map(file => `/uploads/products/${file.filename}`);

  res.status(200).json({
    status: 'success',
    data: {
      urls
    }
  });
});
