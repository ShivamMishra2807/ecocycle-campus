import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/db';
import { generateToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/response';
import { LoginSchema, RegisterSchema, Role } from '@ecocycle/shared';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export async function register(req: Request, res: Response) {
  const parsed = RegisterSchema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
  if (existing) {
    return sendError(res, 'User with this email already exists', 400);
  }

  const passwordHash = await bcrypt.hash(parsed.password, 10);

  const user = await prisma.user.create({
    data: {
      name: parsed.name,
      email: parsed.email,
      passwordHash,
      phone: parsed.phone,
      role: parsed.role || Role.STUDENT,
      departmentId: parsed.departmentId || null,
    },
    include: { department: true },
  });

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role as Role,
  });

  return sendSuccess(res, {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId,
      departmentName: user.department?.name,
      avatarUrl: user.avatarUrl,
    },
  }, 'Registration successful', 201);
}

export async function login(req: Request, res: Response) {
  const parsed = LoginSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email: parsed.email },
    include: { department: true },
  });

  if (!user || !user.isActive) {
    return sendError(res, 'Invalid credentials or account inactive', 401);
  }

  const isMatch = await bcrypt.compare(parsed.password, user.passwordHash);
  if (!isMatch) {
    return sendError(res, 'Invalid credentials', 401);
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role as Role,
  });

  return sendSuccess(res, {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId,
      departmentName: user.department?.name,
      avatarUrl: user.avatarUrl,
    },
  }, 'Login successful');
}

export async function getMe(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return sendError(res, 'Unauthenticated', 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    include: { department: true },
  });

  if (!user) {
    return sendError(res, 'User not found', 404);
  }

  return sendSuccess(res, {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    departmentId: user.departmentId,
    departmentName: user.department?.name,
    avatarUrl: user.avatarUrl,
  });
}
