import { prisma } from '@db/prisma';
import type { UserDTO } from './user.types';

type UserRole = UserDTO['role'];

export interface ListUsersParams {
  page: number;
  limit: number;
}

export interface ListUsersResult {
  users: UserDTO[];
  total: number;
}

export interface CreateUserRepositoryInput {
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
}

export interface UpdateUserRepositoryInput {
  name?: string;
  passwordHash?: string;
  role?: UserRole;
}

export const createUser = async (input: CreateUserRepositoryInput): Promise<UserDTO> => {
  const created = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      passwordHash: input.passwordHash,
      role: input.role,
    },
  });

  const [user] = await prisma.$queryRaw<UserDTO[]>`
    SELECT "id", "email", "name", "role", "createdAt", "updatedAt"
    FROM "User"
    WHERE "id" = ${created.id}
    LIMIT 1
  `;

  return user;
};

export const findUserById = async (id: number): Promise<UserDTO | null> => {
  const rows = await prisma.$queryRaw<UserDTO[]>`
    SELECT "id", "email", "name", "role", "createdAt", "updatedAt"
    FROM "User"
    WHERE "id" = ${id}
    LIMIT 1
  `;

  return rows[0] ?? null;
};

export const findUserByEmail = async (email: string): Promise<UserDTO | null> => {
  const rows = await prisma.$queryRaw<UserDTO[]>`
    SELECT "id", "email", "name", "role", "createdAt", "updatedAt"
    FROM "User"
    WHERE "email" = ${email}
    LIMIT 1
  `;

  return rows[0] ?? null;
};

export const listUsers = async (params: ListUsersParams): Promise<ListUsersResult> => {
  const offset = (params.page - 1) * params.limit;

  const users = await prisma.$queryRaw<UserDTO[]>`
    SELECT "id", "email", "name", "role", "createdAt", "updatedAt"
    FROM "User"
    ORDER BY "createdAt" DESC
    LIMIT ${params.limit} OFFSET ${offset}
  `;

  const [{ count }] = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*)::bigint AS "count"
    FROM "User"
  `;

  return {
    users,
    total: Number(count),
  };
};

export const updateUser = async (
  id: number,
  input: UpdateUserRepositoryInput,
): Promise<UserDTO | null> => {
  await prisma.user.update({
    where: { id },
    data: {
      name: input.name,
      passwordHash: input.passwordHash,
      role: input.role,
    },
  });

  const rows = await prisma.$queryRaw<UserDTO[]>`
    SELECT "id", "email", "name", "role", "createdAt", "updatedAt"
    FROM "User"
    WHERE "id" = ${id}
    LIMIT 1
  `;

  return rows[0] ?? null;
};

export const deleteUser = async (id: number): Promise<void> => {
  await prisma.user.delete({
    where: { id },
  });
};
