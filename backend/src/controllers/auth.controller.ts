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
    const token = jwt.sign({ uid, email: user.email }, jwtSecret, { expiresIn: '4h' });

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

    if (existingUser && !existingUser.verified) {
      await existingUser.deleteOne({ email });
    }

    // Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const registerToken = jwt.sign({ email }, jwtSecret, { expiresIn: 60 * 30 });

    // Create a new user
    const newUser = new User({
      email: email,
      password: hashedPassword,
      verified: false,
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
          .logo img {
            max-width: 100px;
            height: auto;
          }
          .content {
            text-align: justify;
          }
          .content p a {
            color: #f0a81f;
          }
          .button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #f0a81f;
            color: #fff!important;
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
            <p>Kanbanify is an app made by:</p>
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

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      email: savedUser.email,
      id: savedUser._id,
      boards: savedUser.boards
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const refresh = async (req: Request, res: Response) => {
  // @ts-ignore
  const { uid, email } = req;

  try {
    const newAccessToken = jwt.sign({ uid, email }, jwtSecret, { expiresIn: '4h' });
    const user = await User.findOne({ email });

    // Return the new access token
    return res.json({ token: newAccessToken, id: user._id, email, boards: user.boards });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

// Endpoint to handle email confirmation
const confirm = async (req: Request, res: Response) => {
  // @ts-ignore
  const { email } = req;

  try {
    // Find the user with the given confirmation token
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User register not found' });
    }

    // If the user is already confirmed, return an error (or a success message, depending on your requirements)
    if (user.verified) {
      return res.status(400).json({ message: 'Email already confirmed' });
    }

    // Update the user's verified flag to true
    user.verified = true;

    await user.save();

    return res.status(200).json({ message: 'Email confirmed successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const recovery = async (req: Request, res: Response) => {
  // @ts-ignore
  const { email } = req;
  const { password } = req.body;


  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update the user's verified flag to true
    user.verified = true;
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({ message: 'Password updated' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const recoveryEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    // Find the user with the given confirmation token
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const recoveryToken = jwt.sign({ email }, jwtSecret, { expiresIn: 60 * 5 });

    const transporter = nodemailer.createTransport({
      host: process.env.AUTH_HOST,
      port: Number(process.env.AUTH_PORT),
      secure: false,
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD,
      }
    });

    const emailContent = `
    <html>
      <head>
        <style>
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
          .logo img {
            max-width: 100px;
            height: auto;
          }
          .content {
            text-align: justify;
          }
          .content p a {
            color: #f0a81f;
          }
          .button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #f0a81f;
            color: #fff!important;
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
            <h2>Password Recovery Request</h2>
            <p>Hello ${email},</p>
            <p>We have received a password recovery request for your Kanbanify account.</p>
            <p>Please click the button below to reset your password:</p>
            <a class="button" href="https://deveser.net/recovering/kanbanify/${recoveryToken}">Reset Password</a>
            <p>If you did not request a password reset, please ignore this email.</p>
            <p>Thank you!</p>
          </div>
          <div class="logo">
            <p>Kanbanify is an app made by:</p>
            <img src="https://deveser.net/_next/image?url=%2Fimages%2Fwhite.png&w=384&q=75" alt="Your Company Logo">
          </div>
        </div>
      </body>
    </html>
  `;

    const mailOptions = {
      from: '"Kanbanify" <mailing@deveser.net>',
      to: email,
      subject: "Password Recovery Request for Kanbanify",
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Email sent successfully' });
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
  recovery,
  recoveryEmail,
}