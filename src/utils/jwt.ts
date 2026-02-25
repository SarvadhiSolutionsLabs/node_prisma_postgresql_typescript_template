import jwt from 'jsonwebtoken';
import { environment } from '@config/config';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  [key: string]: unknown;
}

export const signToken = (payload: JwtPayload, expiresIn = '1h'): string => {
  return jwt.sign(payload, environment.jwtSecret, { expiresIn });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, environment.jwtSecret) as JwtPayload;
};

