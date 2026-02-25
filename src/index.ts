import http from 'http';
import { createApp } from '@app/app';
import { environment } from '@config/config';
import { GlobalErrorHandler } from '@middleware';
import { prisma } from '@db/prisma';
import { logger } from '@logger/logger';

// Ensure BigInt is serialized correctly when present in JSON responses
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(BigInt.prototype as any).toJSON = function toJSON() {
  return this.toString();
};

const app = createApp();
const server = http.createServer(app);

const startServer = async () => {
  GlobalErrorHandler();

  try {
    await prisma.$connect();
  } catch (error) {
    logger.error(
      `Failed to connect to database: ${error instanceof Error ? error.message : error}`,
    );
    process.exit(1);
  }

  logger.info('Database connection established successfully.');

  const port = environment.port;

  server.listen(port, () => {
    logger.info(`Server is listening on port ${port} (env: ${environment.appEnv})`);
  });
};

void startServer();
