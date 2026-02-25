import { Router } from 'express';
import { handleApiResponse } from '@utils/handleResponse';
import { RES_STATUS, RES_TYPES } from '@constant/message.constant';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  return handleApiResponse(res, {
    responseType: RES_STATUS.GET,
    message: RES_TYPES.SUCCESS,
    data: {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }
  });
});

