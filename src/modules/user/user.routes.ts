import { Router } from 'express';
import { authenticate, authorizeByAnyRole } from '@middleware';
import { validateRequest } from '@middleware/validation';
import {
  createUserSchema,
  listUsersQuerySchema,
  updateUserSchema,
  userIdParamSchema
} from './user.types';
import {
  createUserController,
  deleteUserController,
  getUserByIdController,
  listUsersController,
  updateUserController
} from './user.controller';

export const userRouter = Router();

// Create user - admins only
userRouter.post(
  '/',
  authenticate,
  authorizeByAnyRole(['ADMIN', 'SUPER_ADMIN']),
  validateRequest({ body: createUserSchema }),
  (req, res, next) => {
    void createUserController(req, res).catch(next);
  }
);

// List users - admins only
userRouter.get(
  '/',
  authenticate,
  authorizeByAnyRole(['ADMIN', 'SUPER_ADMIN']),
  validateRequest({ query: listUsersQuerySchema }),
  (req, res, next) => {
    void listUsersController(req, res).catch(next);
  }
);

// Get user by id - admins only
userRouter.get(
  '/:id',
  authenticate,
  authorizeByAnyRole(['ADMIN', 'SUPER_ADMIN']),
  validateRequest({ params: userIdParamSchema }),
  (req, res, next) => {
    void getUserByIdController(req, res).catch(next);
  }
);

// Update user - admins only
userRouter.put(
  '/:id',
  authenticate,
  authorizeByAnyRole(['ADMIN', 'SUPER_ADMIN']),
  validateRequest({ params: userIdParamSchema, body: updateUserSchema }),
  (req, res, next) => {
    void updateUserController(req, res).catch(next);
  }
);

// Delete user - admins only
userRouter.delete(
  '/:id',
  authenticate,
  authorizeByAnyRole(['ADMIN', 'SUPER_ADMIN']),
  validateRequest({ params: userIdParamSchema }),
  (req, res, next) => {
    void deleteUserController(req, res).catch(next);
  }
);

