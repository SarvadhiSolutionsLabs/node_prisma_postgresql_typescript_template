export const RES_STATUS = {
  CREATE: 'CREATE',
  GET: 'GET',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE'
} as const;

export type ResponseStatus = (typeof RES_STATUS)[keyof typeof RES_STATUS];

export const RES_TYPES = {
  // Generic
  SUCCESS: 'Success',
  FAILURE: 'Failure',

  // User module
  USER_CREATED: 'User created successfully.',
  USER_UPDATED: 'User updated successfully.',
  USER_DELETED: 'User deleted successfully.',
  USER_FETCHED: 'User fetched successfully.',
  USERS_FETCHED: 'Users fetched successfully.',

  // Auth / security
  INVALID_CREDENTIALS: 'Invalid credentials.',
  UNAUTHORIZED: 'Authentication required.',
  FORBIDDEN: 'You do not have permission to perform this action.',

  // Validation / resources
  VALIDATION_FAILED: 'One or more validation errors occurred.',
  RESOURCE_NOT_FOUND: 'Requested resource not found.',
  CONFLICT: 'A conflicting resource already exists.',

  // System
  INTERNAL_SERVER_ERROR: 'An unexpected error occurred. Please try again later.'
} as const;

export type ResponseMessageKey = keyof typeof RES_TYPES;

