import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import { jwtSecret } from "../constants/constants";
import { User } from "../models/user.models";



const login = async (req: Request, res: Response) => {
  const { email = '', password = '' } = req.body;

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email });

    // If the user does not exist, return an error
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.verified) {
      return res.status(403).json({ message: 'User not verified' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If the password doesn't match, return an error
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // If the email and password are correct, generate and return a JWT
    const uid = `${user.email}-${user._id}`;
    const token = jwt.sign({ uid, email: user.email }, jwtSecret, { expiresIn: '1h' });

    return res.json({ boards: user.boards, token, email, id: user._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new User({
      email: email,
      password: hashedPassword,
      boards: [],
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    console.log({
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASSWORD,
    })

    const transporter = nodemailer.createTransport({
      host: "smtp.dondominio.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD,
      }
    });

    const info = await transporter.sendMail({
      from: '"Kanbanify" <mailing@deveser.net>', // sender address
      to: "pacors88@gmail.com", // list of receivers
      subject: "Register confirmation in Kanbanify", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });

    const uid = `${savedUser.email}-${savedUser._id}`;

    // Generate and return a JWT for the newly registered user
    const token = jwt.sign({ uid, email: savedUser.email }, jwtSecret, { expiresIn: '1h' });

    return res.status(201).json({
      email: savedUser.email,
      token,
      id: savedUser._id,
      boards: savedUser.boards
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const refresh = (req: Request, res: Response) => {
  // @ts-ignore
  const { uid } = req;

  try {
    const newAccessToken = jwt.sign({ uid }, jwtSecret, { expiresIn: '1h' });

    // Return the new access token
    return res.json({ token: newAccessToken });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

export const authController = {
  login,
  register,
  refresh,
}