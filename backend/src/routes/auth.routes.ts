import { Router } from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  getAllUsers,
  deleteUser
} from '../controllers/auth.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { registerValidation, loginValidation } from '../middleware/validation.middleware';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);
router.get('/users', authenticate, authorize('admin'), getAllUsers);
router.delete('/users/:id', authenticate, authorize('admin'), deleteUser);

export default router;
