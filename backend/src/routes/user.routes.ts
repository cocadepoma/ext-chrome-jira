import express from 'express';
import { check } from 'express-validator';
import { userController } from '../controllers/user.controller';
import { middlewares } from '../middlewares/db.middleware';

const router = express.Router();

// Get User
router.get(
  '/kanbanify/api/users/:id',
  [
    middlewares.validatorJWT,
    check('id', 'The id must be provided').not().isEmpty().isMongoId(),
    middlewares.checkFields,
  ],
  userController.get
);

// Update User
router.patch(
  '/kanbanify/api/users/:id',
  [
    middlewares.validatorJWT,
    check('id', 'The id must be provided').not().isEmpty().isMongoId(),
    middlewares.checkFields,
  ],
  userController.update
);

// Delete User
router.delete(
  '/kanbanify/api/users/:id',
  [
    middlewares.validatorJWT,
    check('id', 'The id must be provided').not().isEmpty().isMongoId(),
    middlewares.checkFields,
  ],
  userController.remove
);

export const userRoutes = router;