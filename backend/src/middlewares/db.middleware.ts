import { NextFunction, Request, Response } from 'express';

import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { jwtSecret } from '../constants/constants';
import { User } from "../models/user.models";

// This middleware checks if an user exists in the database with an ID
const userIdExists = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      msg: 'There is not an id provided'
    });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        msg: 'The id provided does not exist'
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'Error, contact with the administrator'
    });
  }
}

// This Middleware checks if and Email exist or not in the DB
// depending on the route path origin.
const userEmailExists = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const { path } = req.route;

  if (!email) {
    return res.status(404).json({
      msg: 'There is not and email provided'
    });
  }

  try {

    const user = await User.findOne({ email });

    switch (path) {
      // If the path is new, is a register
      case '/kanbanify/api/auth/register':
        if (user?.verified) {
          return res.status(409).json({
            msg: 'The user email already exists'
          });
        }
        break;

      // If the path is /, is a login
      case '/kanbanify/api/auth/login':
        if (!user) {
          return res.status(403).json({
            msg: 'Invalid credentials'
          });
        }
        break;

      default:
        return res.status(500).json({
          msg: 'Error, contact with the administrator'
        });
    }

    next();

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'Error, contact with the administrator'
    });
  }
}

const checkFields = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  next();
};

const validatorJWT = (req: Request, res: Response, next: NextFunction) => {
  // x-token headers
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "There is no token",
    });
  }

  try {
    const { uid, email } = jwt.verify(token, jwtSecret);

    // @ts-ignore
    req.uid = uid;
    // @ts-ignore
    req.token = token;
    // @ts-ignore
    req.email = email;

  } catch (error) {
    console.log(error);
    return res.status(401).json({
      ok: false,
      msg: "Invalid Token",
    });
  }

  next();
};

const validatorRegisterJWT = (req: Request, res: Response, next: NextFunction) => {
  // x-token headers
  const { registerToken } = req.body;

  if (!registerToken) {
    return res.status(401).json({
      ok: false,
      msg: "Invalid register token",
    });
  }

  try {
    const { email } = jwt.verify(registerToken, jwtSecret);

    if (!email) {
      return res.status(401).json({
        ok: false,
        msg: "Invalid register token",
      });
    }

    // @ts-ignore
    req.token = registerToken;
    // @ts-ignore
    req.email = email;

  } catch (error) {
    console.log(error);
    return res.status(401).json({
      ok: false,
      msg: "Invalid register token",
    });
  }

  next();
};

export const middlewares = {
  userIdExists,
  userEmailExists,
  checkFields,
  validatorJWT,
  validatorRegisterJWT,
}