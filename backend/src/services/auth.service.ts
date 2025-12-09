import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { User, Role } from '../types/prisma';
import { AppError } from '../middleware/error.middleware';

export class AuthService {
  // Register new user
  async register(
    name: string,
    email: string,
    password: string,
    role: string = 'CUSTOMER'
  ): Promise<{ user: Omit<User, 'password'>; token: string }> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role.toUpperCase() as Role,
      },
    });

    // Generate token
    const token = this.generateToken(user.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  // Login user
  async login(email: string, password: string): Promise<{ user: Omit<User, 'password'>; token: string }> {
    // Find user with password field
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate token
    const token = this.generateToken(user.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  // Get user by ID
  async getUserById(userId: string): Promise<Omit<User, 'password'>> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Update user profile
  async updateProfile(userId: string, updates: Partial<User>): Promise<Omit<User, 'password'>> {
    // Don't allow updating password or role through this method
    const { password, role, ...safeUpdates } = updates as any;

    const user = await prisma.user.update({
      where: { id: userId },
      data: safeUpdates,
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Get all users (Admin only)
  async getAllUsers(page: number = 1, limit: number = 100): Promise<Omit<User, 'password'>[]> {
    const users = await prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users.map(user => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  // Delete user (Admin only)
  async deleteUser(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Don't allow deleting admin users
    if (user.role.toLowerCase() === 'admin') {
      throw new AppError('Cannot delete admin users', 403);
    }

    // Delete user's cart first
    await prisma.cart.deleteMany({
      where: { userId },
    });

    // Delete user
    await prisma.user.delete({
      where: { id: userId },
    });
  }

  // Generate JWT token
  private generateToken(userId: string): string {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET as string || 'fallback_secret',
      { expiresIn: '7d' }
    );
  }
}
