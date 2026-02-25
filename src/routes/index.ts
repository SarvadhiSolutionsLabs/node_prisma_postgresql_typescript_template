import { Router } from 'express';
import { END_POINTS } from '@constant';
import { healthRouter } from '@routes/health/health.routes';
import { userRouter } from '@modules/user/user.routes';
import { authRouter } from '@modules/auth/auth.routes';

export const router = Router();

router.use(`${END_POINTS.V1}${END_POINTS.HEALTH}`, healthRouter);
router.use(`${END_POINTS.V1}${END_POINTS.USER}`, userRouter);
router.use(`${END_POINTS.V1}${END_POINTS.AUTH}`, authRouter);

export default router;

