import { Router } from 'express';
import { loginController, refreshTokenController } from './auth.controller';

export const authRouter = Router();

authRouter.post('/login', (req, res, next) => {
  void loginController(req, res).catch(next);
});

authRouter.post('/refresh-token', (req, res, next) => {
  void refreshTokenController(req, res).catch(next);
});

