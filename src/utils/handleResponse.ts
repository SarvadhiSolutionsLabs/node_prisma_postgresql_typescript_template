import type { Response } from 'express';
import { RES_STATUS, RES_TYPES, type ResponseStatus } from '@constant/message.constant';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponseOptions<T> {
  statusCode?: number;
  responseType?: ResponseStatus;
  message?: string;
  data?: T;
  pagination?: PaginationMeta;
}

export interface ErrorResponseOptions {
  statusCode: number;
  message: string;
  code?: string;
  error?: unknown;
}

const getStatusCodeForResponseType = (responseType: ResponseStatus): number => {
  switch (responseType) {
    case RES_STATUS.CREATE:
      return 201;
    case RES_STATUS.GET:
      return 200;
    case RES_STATUS.UPDATE:
      return 200;
    case RES_STATUS.DELETE:
      return 200;
    default:
      return 200;
  }
};

export const handleApiResponse = <T>(res: Response, options: ApiResponseOptions<T>) => {
  const { statusCode, responseType = RES_STATUS.GET, message, data, pagination } = options;

  const httpStatusCode = statusCode ?? getStatusCodeForResponseType(responseType);

  return res.status(httpStatusCode).json({
    success: true,
    statusCode: httpStatusCode,
    message: message ?? RES_TYPES.SUCCESS,
    data,
    pagination
  });
};

export const handleErrorResponse = (res: Response, options: ErrorResponseOptions) => {
  const { statusCode, message, code, error } = options;

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    code,
    error
  });
};

