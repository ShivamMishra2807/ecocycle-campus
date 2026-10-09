import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { sendError } from '../utils/response';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('🔥 Server Error:', err);

  if (err instanceof ZodError) {
    const issueMessages = err.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
    return sendError(res, `Validation Error: ${issueMessages}`, 400, err.issues);
  }

  return sendError(
    res,
    err.message || 'An unexpected error occurred on the server',
    err.statusCode || 500,
    process.env.NODE_ENV === 'development' ? err.stack : null
  );
}
