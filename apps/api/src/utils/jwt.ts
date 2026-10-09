import jwt from 'jsonwebtoken';
import { Role } from '@ecocycle/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'ecocycle-super-secret-jwt-key-2026-campus-auth';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
  departmentId?: string | null;
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
