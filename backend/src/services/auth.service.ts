import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';
import { AppError } from '../middleware/error.middleware';

export class AuthService {
  // Register new user
  async register(name: string, email: string, password: string, role: string = 'customer'): Promise<{ user: any; token: string }> {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // Generate token
    const token = this.generateToken(user._id.toString());

    // Remove password from response
    const userObject = user.toObject();
    const { password: _, ...userWithoutPassword } = userObject;

    return { user: userWithoutPassword, token };
  }

  // Login user
  async login(email: string, password: string): Promise<{ user: any; token: string }> {
    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate token
    const token = this.generateToken(user._id.toString());

    // Remove password from response
    const userObject = user.toObject();
    const { password: _, ...userWithoutPassword } = userObject;

    return { user: userWithoutPassword, token };
  }

  // Get user by ID
  async getUserById(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  // Update user profile
  async updateProfile(userId: string, updates: Partial<IUser>): Promise<IUser> {
    // Don't allow updating password or role through this method
    const { password, role, ...safeUpdates } = updates as any;

    const user = await User.findByIdAndUpdate(
      userId,
      safeUpdates,
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
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
