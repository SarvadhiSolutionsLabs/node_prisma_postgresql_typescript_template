import type { NextFunction, Request, Response } from 'express';
import { logger } from '@logger/logger';

export const responseHandler = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - start;
    const logMessage = `${res.statusCode} - ${req.method} ${req.originalUrl} - ${durationMs}ms - ${
      req.ip
    }`;
    logger.info(logMessage);
  });

  next();
};

