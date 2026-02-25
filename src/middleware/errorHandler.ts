import type { ErrorRequestHandler } from 'express';
import { Prisma } from '@prisma/client';
import { ERROR_TYPES, type ErrorType } from '@constant/errorTypes.constant';
import { RES_TYPES } from '@constant/message.constant';
import { handleErrorResponse } from '@utils/handleResponse';
import { logger } from '@logger/logger';
import { AppError } from '@utils/appError';

const mapErrorTypeToStatusCode = (errorType: ErrorType): number => {
  switch (errorType) {
    case ERROR_TYPES.NOT_FOUND:
      return 404;
    case ERROR_TYPES.FORBIDDEN:
      return 403;
    case ERROR_TYPES.INVALID_REQUEST:
    case ERROR_TYPES.VALIDATION_ERROR:
      return 400;
    case ERROR_TYPES.CONFLICT:
      return 409;
    case ERROR_TYPES.UNAUTHORIZED:
      return 401;
    case ERROR_TYPES.INTERNAL_ERROR:
    case ERROR_TYPES.UNKNOWN_ERROR:
    default:
      return 500;
  }
};

export const ErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let statusCode = 500;
  let message: string = RES_TYPES.INTERNAL_SERVER_ERROR;
  let code: string | undefined;
  let errorPayload: unknown = undefined;

  if (err instanceof AppError) {
    statusCode = mapErrorTypeToStatusCode(err.errorType);
    message = err.message || message;
    code = err.code;
    errorPayload = err.details;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        statusCode = 409;
        message = RES_TYPES.CONFLICT;
        code = err.code;
        break;
      case 'P2003':
      case 'P2025':
        statusCode = 404;
        message = RES_TYPES.RESOURCE_NOT_FOUND;
        code = err.code;
        break;
      default:
        statusCode = 500;
        message = RES_TYPES.INTERNAL_SERVER_ERROR;
        code = err.code;
        break;
    }
    errorPayload = err.meta;
  } else {
    message = err?.message || RES_TYPES.INTERNAL_SERVER_ERROR;
    errorPayload = err;
  }

  logger.error(
    typeof errorPayload === 'string'
      ? errorPayload
      : JSON.stringify({ message, code, error: errorPayload }),
  );

  return handleErrorResponse(res, {
    statusCode,
    message,
    code,
    error: errorPayload,
  });
};

export const GlobalErrorHandler = () => {
  process.on('uncaughtException', (error) => {
    logger.error(`Uncaught exception: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error(
      `Unhandled rejection: ${reason instanceof Error ? reason.message : JSON.stringify(reason)}`,
    );
  });

  process.on('SIGTERM', () => {
    logger.info('Received SIGTERM, shutting down gracefully.');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    logger.info('Received SIGINT, shutting down gracefully.');
    process.exit(0);
  });
};
