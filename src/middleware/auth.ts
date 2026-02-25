import type { NextFunction, Request, Response } from 'express';
import { ERROR_TYPES } from '@constant/errorTypes.constant';
import { RES_TYPES } from '@constant/message.constant';
import { AppError } from '@utils/appError';
import { verifyToken } from '@utils/jwt';

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError({
      errorType: ERROR_TYPES.UNAUTHORIZED,
      message: RES_TYPES.UNAUTHORIZED,
      code: 'UNAUTHORIZED'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);

    req.user = {
      id: payload.sub,
      email: payload.email,
      // Role is kept generic string here; casting will be refined in services as needed.
      role: payload.role as any
    };

    next();
  } catch {
    throw new AppError({
      errorType: ERROR_TYPES.UNAUTHORIZED,
      message: RES_TYPES.UNAUTHORIZED,
      code: 'INVALID_TOKEN'
    });
  }
};

export const authorizeByRole = (role: string) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError({
        errorType: ERROR_TYPES.UNAUTHORIZED,
        message: RES_TYPES.UNAUTHORIZED,
        code: 'UNAUTHORIZED'
      });
    }

    if (req.user.role !== role) {
      throw new AppError({
        errorType: ERROR_TYPES.FORBIDDEN,
        message: RES_TYPES.FORBIDDEN,
        code: 'FORBIDDEN'
      });
    }

    next();
  };
};

export const authorizeByAnyRole = (roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError({
        errorType: ERROR_TYPES.UNAUTHORIZED,
        message: RES_TYPES.UNAUTHORIZED,
        code: 'UNAUTHORIZED'
      });
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError({
        errorType: ERROR_TYPES.FORBIDDEN,
        message: RES_TYPES.FORBIDDEN,
        code: 'FORBIDDEN'
      });
    }

    next();
  };
};

