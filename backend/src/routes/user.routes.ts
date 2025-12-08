import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser
} from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { idValidation } from '../middleware/validation.middleware';

const router = Router();

// All user management routes require admin authentication
router.use(authenticate, authorize('admin'));

router.get('/', getAllUsers);
router.get('/:id', idValidation, getUserById);
router.put('/:id/role', idValidation, updateUserRole);
router.delete('/:id', idValidation, deleteUser);

export default router;
