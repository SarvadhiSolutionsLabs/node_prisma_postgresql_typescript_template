import type { Request, Response } from 'express';
import { RES_STATUS, RES_TYPES } from '@constant/message.constant';
import { handleApiResponse } from '@utils/handleResponse';
import {
  createUserService,
  deleteUserService,
  getUserByIdService,
  listUsersService,
  updateUserService,
} from './user.service';

export const createUserController = async (req: Request, res: Response) => {
  const user = await createUserService(req.body);

  return handleApiResponse(res, {
    responseType: RES_STATUS.CREATE,
    message: RES_TYPES.USER_CREATED,
    data: user,
  });
};

export const getUserByIdController = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const user = await getUserByIdService(userId);

  return handleApiResponse(res, {
    responseType: RES_STATUS.GET,
    message: RES_TYPES.USER_FETCHED,
    data: user,
  });
};

export const listUsersController = async (req: Request, res: Response) => {
  const { page, limit } = req.query as unknown as { page: number; limit: number };

  const result = await listUsersService({ page, limit });

  return handleApiResponse(res, {
    responseType: RES_STATUS.GET,
    message: RES_TYPES.USERS_FETCHED,
    data: result.users,
    pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
    },
  });
};

export const updateUserController = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const user = await updateUserService(userId, req.body);

  return handleApiResponse(res, {
    responseType: RES_STATUS.UPDATE,
    message: RES_TYPES.USER_UPDATED,
    data: user,
  });
};

export const deleteUserController = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  await deleteUserService(userId);

  return handleApiResponse(res, {
    responseType: RES_STATUS.DELETE,
    message: RES_TYPES.USER_DELETED,
  });
};
