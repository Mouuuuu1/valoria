import { Router } from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  getAllUsers
} from '../controllers/auth.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { registerValidation, loginValidation } from '../middleware/validation.middleware';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);
router.get('/users', authenticate, authorize('admin'), getAllUsers);

export default router;
