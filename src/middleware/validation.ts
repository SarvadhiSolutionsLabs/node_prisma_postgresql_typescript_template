import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { AppError } from '@utils/appError';
import { ERROR_TYPES } from '@constant/errorTypes.constant';
import { RES_TYPES } from '@constant/message.constant';

export interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export const validateRequest =
  (schemas: ValidationSchemas) => (req: Request, _res: Response, next: NextFunction) => {
    const { body, query, params } = schemas;

    const errors: Record<string, unknown> = {};

    if (body) {
      const result = body.safeParse(req.body);
      if (!result.success) {
        errors.body = result.error.flatten();
      } else {
        req.body = result.data;
      }
    }

    if (query) {
      const result = query.safeParse(req.query);
      if (!result.success) {
        errors.query = result.error.flatten();
      } else {
        req.query = result.data;
      }
    }

    if (params) {
      const result = params.safeParse(req.params);
      if (!result.success) {
        errors.params = result.error.flatten();
      } else {
        req.params = result.data;
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new AppError({
        errorType: ERROR_TYPES.VALIDATION_ERROR,
        message: RES_TYPES.VALIDATION_FAILED,
        details: errors,
        code: 'VALIDATION_ERROR'
      });
    }

    next();
  };

