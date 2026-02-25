import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';

const projectRoot = process.cwd();

// Load base env first
dotenv.config({ path: path.join(projectRoot, '.env') });

// Load flavor-specific env (APP_ENV/local, dev, staging, production)
const appEnv = process.env.APP_ENV || 'local';
const flavorEnvPath = path.join(projectRoot, `.env.${appEnv}`);

if (fs.existsSync(flavorEnvPath)) {
  dotenv.config({ path: flavorEnvPath, override: true });
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_ENV: z.enum(['local', 'dev', 'staging', 'production']).default('local'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  LOG_LEVEL: z.string().default('info'),
  RATE_LIMIT_WINDOW_MS: z.string().default('60000'),
  RATE_LIMIT_MAX: z.string().default('100')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('Invalid environment configuration', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration. See logs for details.');
}

const env = parsed.data;

export const environment = {
  nodeEnv: env.NODE_ENV,
  appEnv: env.APP_ENV,
  port: Number(env.PORT),
  databaseUrl: env.DATABASE_URL,
  jwtSecret: env.JWT_SECRET,
  logLevel: env.LOG_LEVEL,
  rateLimitWindowMs: Number(env.RATE_LIMIT_WINDOW_MS),
  rateLimitMax: Number(env.RATE_LIMIT_MAX)
} as const;

export type Environment = typeof environment;

