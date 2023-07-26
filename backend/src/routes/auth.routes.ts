import express from 'express';
import { check } from 'express-validator';

import { authController } from '../controllers/auth.controller';
import { middlewares } from '../middlewares/db.middleware';

const router = express.Router();

// Login
router.post(
  '/kanbanify/api/auth/login',
  [
    check("email", "The email is required").isEmail(),
    middlewares.userEmailExists,
    check("password", "The password must be at least 6 characters").isLength({ min: 6 }),
    middlewares.checkFields,
  ],
  authController.login
);

// Register
router.post(
  '/kanbanify/api/auth/register',
  [
    check("email", "The email is required").isEmail(),
    middlewares.userEmailExists,
    check("password", "The password must be at least 6 characters").isLength({ min: 6 }),
    middlewares.checkFields,
  ],
  authController.register
);

// Refresh token
router.post(
  '/kanbanify/api/auth/refresh',
  middlewares.validatorJWT,
  authController.refresh
);

export const authRoutes = router;