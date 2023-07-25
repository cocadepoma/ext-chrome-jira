import cors from 'cors';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

import { User } from './schemas';

require('dotenv').config();

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

const port = 8002;

mongoose.connect(process.env.MONGO_URI);

app.post('/kanbanify/api/users', async (req: Request, res: Response) => {
  const { email = '', id = '' } = req.body;

  if (!email || !id) {
    return res.status(400).json({ message: 'Missing email or id params' });
  }

  try {
    const uid = `${email}-${id}`;
    const existingUser = await User.findOne({ uid });

    if (!existingUser) {
      const newUser = new User({
        email: email,
        googleId: id,
        uid: uid,
        categories: [],
      });
      const savedUser = await newUser.save();
      return res.status(201).json(savedUser);
    }

    res.status(200).json(existingUser);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/kanbanify/api/users/:uid', async (req: Request, res: Response) => {
  const { uid } = req.params;
  const { boards } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { uid },
      { boards },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});