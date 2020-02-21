import express from 'express';
import AuthController from '../controllers/authController';
import { authValidator } from '../middlewares/validations';
import {
  asyncHandler,
  checkAuth,
  checkUsername,
} from '../middlewares';

const router = express.Router();

router
  .route('/auth/signup')
  .post(
    authValidator,
    asyncHandler(checkUsername),
    asyncHandler(AuthController.signUp),
  );

router
  .route('/auth/login')
  .post(authValidator, asyncHandler(AuthController.login));

router
  .route('/auth/profile')
  .get(asyncHandler(checkAuth), asyncHandler(AuthController.profile));

export default router;
