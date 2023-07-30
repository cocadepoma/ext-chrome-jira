import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

import { jwtSecret } from "../constants/constants";
import { User } from "../models/user.models";

const login = async (req: Request, res: Response) => {
  const { email = '', password = '' } = req.body;

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email });

    // If the user does not exist, return an error
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.verified) {
      return res.status(403).json({ message: 'User not verified' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If the password doesn't match, return an error
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
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
    const registerToken = uuidv4();

    // Create a new user
    const newUser = new User({
      email: email,
      password: hashedPassword,
      verified: false,
      registerToken,
      boards: [],
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    const transporter = nodemailer.createTransport({
      host: process.env.AUTH_HOST,
      port: Number(process.env.AUTH_PORT),
      secure: false,
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD,
      }
    });

    // Email template
    const emailContent = `
    <html>
      <head>
        <style>
          /* Add your CSS styles here */
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
          }
          .logo {
            text-align: center;
            margin-bottom: 20px;
          }
          .logo-bottom {
            text-align: center;
            margin-top: 20px;
          }
          .logo img {
            max-width: 100px;
            height: auto;
          }
          .content {
            text-align: justify;
          }
          .button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="https://deveser.net/_next/image?url=%2Fimages%2Fapps%2Fkanbanify-web.png&w=384&q=75" alt="Your Company Logo">
          </div>
          <div class="content">
            <h2>Thanks for Registering with Kanbanify!</h2>
            <p>Hello ${email},</p>
            <p>We are excited to welcome you to Kanbanify! Please click the button below to confirm your registration:</p>
            <a class="button" href="https://deveser.net/registering/kanbanify/${registerToken}">Confirm Registration</a>
            <p>If you did not sign up for Kanbanify, please ignore this email.</p>
            <p>Thank you!</p>
          </div>
          <div class="logo">
            <img src="https://deveser.net/_next/image?url=%2Fimages%2Fwhite.png&w=384&q=75" alt="Your Company Logo">
          </div>
        </div>
      </body>
    </html>
  `;

    const mailOptions = {
      from: '"Kanbanify" <mailing@deveser.net>',
      to: savedUser.email,
      subject: "Registration Confirmation for Kanbanify",
      html: emailContent,
    };

    const info = await transporter.sendMail(mailOptions);

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

// Endpoint to handle email confirmation
const confirm = async (req: Request, res: Response) => {
  const { registerToken } = req.body;

  if (!registerToken) {
    return res.status(404).json({ message: 'The confirmation token is required' });
  }

  try {
    // Find the user with the given confirmation token
    const user = await User.findOne({ registerToken: registerToken });

    if (!user) {
      return res.status(404).json({ message: 'Invalid confirmation token' });
    }

    // If the user is already confirmed, return an error (or a success message, depending on your requirements)
    if (user.verified) {
      return res.status(400).json({ message: 'Email already confirmed' });
    }

    // Update the user's verified flag to true
    user.verified = true;
    user.registerToken = undefined; // Clear the confirmation token, as it's no longer needed

    await user.save();

    return res.status(200).json({ message: 'Email confirmed successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const authController = {
  login,
  register,
  confirm,
  refresh,
}