import jwt from 'jsonwebtoken';
import { environment } from '@config/config';

export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  [key: string]: unknown;
}

export const signToken = (payload: JwtPayload, expiresIn: string | number = '1h'): string => {
  // Casting options here keeps the wrapper simple while relying on jsonwebtoken's runtime validation.
  return jwt.sign(payload, environment.jwtSecret, { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, environment.jwtSecret);

  if (typeof decoded === 'string') {
    throw new Error('Invalid token payload');
  }

  return decoded as unknown as JwtPayload;
};
