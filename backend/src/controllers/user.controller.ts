import { Response } from 'express';
import { prisma } from '../config/database';
import { asyncHandler } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 20;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({ skip, take: limit, select: { password: false, id: true, name: true, email: true, role: true, phone: true, address: true, createdAt: true, updatedAt: true } }),
    prisma.user.count()
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Get user by ID (Admin)
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id }, select: { password: false, id: true, name: true, email: true, role: true, phone: true, address: true, createdAt: true, updatedAt: true } });

  if (!user) {
    res.status(404).json({
      status: 'error',
      message: 'User not found'
    });
    return;
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// @desc    Update user role (Admin)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
export const updateUserRole = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { role } = req.body;

  if (!['customer', 'admin'].includes(role)) {
    res.status(400).json({
      status: 'error',
      message: 'Invalid role'
    });
    return;
  }

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { role: role as any },
    select: { password: false, id: true, name: true, email: true, role: true, phone: true, address: true, createdAt: true, updatedAt: true }
  });

  if (!user) {
    res.status(404).json({
      status: 'error',
      message: 'User not found'
    });
    return;
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// @desc    Delete user (Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.delete({ where: { id: req.params.id } });

  if (!user) {
    res.status(404).json({
      status: 'error',
      message: 'User not found'
    });
    return;
  }

  res.status(200).json({
    status: 'success',
    message: 'User deleted successfully'
  });
});
