import { z } from 'zod';
import { UserRole } from '@prisma/client';

export interface UserDTO {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(255),
  password: z.string().min(8).max(255),
  role: z.nativeEnum(UserRole).optional()
});

export const updateUserSchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    password: z.string().min(8).max(255).optional(),
    role: z.nativeEnum(UserRole).optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update.'
  });

export const userIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, { message: 'id must be a positive integer' })
    .transform((value) => Number(value))
});

export const listUsersQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((value) => (value ? Number(value) : 1))
    .pipe(z.number().int().min(1)),
  limit: z
    .string()
    .optional()
    .transform((value) => (value ? Number(value) : 10))
    .pipe(z.number().int().min(1).max(100))
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;

