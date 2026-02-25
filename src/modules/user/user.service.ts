import bcrypt from 'bcryptjs';
import type { UserRole } from '@prisma/client';
import { ERROR_TYPES } from '@constant/errorTypes.constant';
import { RES_TYPES } from '@constant/message.constant';
import { AppError } from '@utils/appError';
import type { CreateUserDto, UpdateUserDto, UserDTO } from './user.types';
import {
  createUser,
  deleteUser,
  findUserByEmail,
  findUserById,
  listUsers,
  updateUser,
} from './user.repository';

export interface ListUsersServiceParams {
  page: number;
  limit: number;
}

export interface ListUsersServiceResult {
  users: UserDTO[];
  total: number;
  page: number;
  limit: number;
}

const DEFAULT_ROLE: UserRole = 'USER';

export const createUserService = async (dto: CreateUserDto): Promise<UserDTO> => {
  const existing = await findUserByEmail(dto.email);

  if (existing) {
    throw new AppError({
      errorType: ERROR_TYPES.CONFLICT,
      message: RES_TYPES.CONFLICT,
      code: 'USER_EMAIL_ALREADY_EXISTS',
    });
  }

  const passwordHash = await bcrypt.hash(dto.password, 10);

  const user = await createUser({
    email: dto.email,
    name: dto.name,
    passwordHash,
    role: (dto.role as UserRole) ?? DEFAULT_ROLE,
  });

  return user;
};

export const getUserByIdService = async (id: number): Promise<UserDTO> => {
  const user = await findUserById(id);

  if (!user) {
    throw new AppError({
      errorType: ERROR_TYPES.NOT_FOUND,
      message: RES_TYPES.RESOURCE_NOT_FOUND,
      code: 'USER_NOT_FOUND',
    });
  }

  return user;
};

export const listUsersService = async (
  params: ListUsersServiceParams,
): Promise<ListUsersServiceResult> => {
  const result = await listUsers(params);

  return {
    users: result.users,
    total: result.total,
    page: params.page,
    limit: params.limit,
  };
};

export const updateUserService = async (id: number, dto: UpdateUserDto): Promise<UserDTO> => {
  const existing = await findUserById(id);

  if (!existing) {
    throw new AppError({
      errorType: ERROR_TYPES.NOT_FOUND,
      message: RES_TYPES.RESOURCE_NOT_FOUND,
      code: 'USER_NOT_FOUND',
    });
  }

  let passwordHash: string | undefined;

  if (dto.password) {
    passwordHash = await bcrypt.hash(dto.password, 10);
  }

  const updated = await updateUser(id, {
    name: dto.name,
    passwordHash,
    role: dto.role as UserRole | undefined,
  });

  if (!updated) {
    throw new AppError({
      errorType: ERROR_TYPES.UNKNOWN_ERROR,
      message: RES_TYPES.INTERNAL_SERVER_ERROR,
      code: 'USER_UPDATE_FAILED',
    });
  }

  return updated;
};

export const deleteUserService = async (id: number): Promise<void> => {
  const existing = await findUserById(id);

  if (!existing) {
    throw new AppError({
      errorType: ERROR_TYPES.NOT_FOUND,
      message: RES_TYPES.RESOURCE_NOT_FOUND,
      code: 'USER_NOT_FOUND',
    });
  }

  await deleteUser(id);
};
