import type { Request, Response } from 'express';
import { RES_STATUS, RES_TYPES } from '@constant/message.constant';
import { handleApiResponse } from '@utils/handleResponse';

// Skeleton controller showing where to implement authentication flows

export const loginController = async (_req: Request, res: Response) => {
  // TODO: Implement login logic (validate credentials, issue JWT)
  return handleApiResponse(res, {
    responseType: RES_STATUS.GET,
    message: RES_TYPES.SUCCESS,
    data: {
      todo: 'Implement login logic'
    }
  });
};

export const refreshTokenController = async (_req: Request, res: Response) => {
  // TODO: Implement refresh token logic
  return handleApiResponse(res, {
    responseType: RES_STATUS.GET,
    message: RES_TYPES.SUCCESS,
    data: {
      todo: 'Implement refresh token logic'
    }
  });
};

