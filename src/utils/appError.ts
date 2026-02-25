import type { ErrorType } from '@constant/errorTypes.constant';
import { ERROR_TYPES } from '@constant/errorTypes.constant';

export interface AppErrorParams {
  errorType?: ErrorType;
  message: string;
  code?: string;
  sourcePath?: string;
  details?: unknown;
}

export class AppError extends Error {
  public readonly errorType: ErrorType;

  public readonly code?: string;

  public readonly sourcePath?: string;

  public readonly details?: unknown;

  constructor({ errorType = ERROR_TYPES.UNKNOWN_ERROR, message, code, sourcePath, details }: AppErrorParams) {
    super(message);
    this.name = 'AppError';
    this.errorType = errorType;
    this.code = code;
    this.sourcePath = sourcePath;
    this.details = details;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

