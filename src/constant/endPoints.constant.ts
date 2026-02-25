export const END_POINTS = {
  COMMON: '/api',
  V1: '/v1',
  HEALTH: '/health',
  USER: '/users',
  AUTH: '/auth'
} as const;

export type EndpointKey = keyof typeof END_POINTS;

