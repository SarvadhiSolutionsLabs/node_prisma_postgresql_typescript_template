import express from 'express';
import type { Express } from 'express';
import { END_POINTS } from '@constant';
import { ErrorHandler, registerSecurityMiddlewares, responseHandler } from '@middleware';
import { router as rootRouter } from '@routes/index';

export const createApp = (): Express => {
  const app = express();
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    }),
  );

  registerSecurityMiddlewares(app);
  app.use(responseHandler);

  app.use(END_POINTS.COMMON, rootRouter);

  // Global error handler should be last
  app.use(ErrorHandler);

  return app;
};
