import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

app.use(cors());
app.use(express.json());

const port = 8000;

mongoose.connect(process.env.MONGO_URI);

const ticketSchema = new mongoose.Schema({
  _id: String,
  description: String,
  createdAt: Number,
  categoryId: String,
  content: String,
  color: String,
});

const categorySchema = new mongoose.Schema({
  _id: String,
  name: String,
  createdAt: Number,
  indexOrder: Number,
  color: String,
  tickets: [ticketSchema],
});

const userSchema = new mongoose.Schema({
  uid: String,
  email: String,
  googleId: String,
  boards: [categorySchema],
});

const User = mongoose.model('User', userSchema);

app.post('/api/users', async (req: Request, res: Response) => {
  const { email = '', id = '' } = req.body;

  if (!email || !id) {
    res.status(400).json({ message: 'Missing email or id params' });
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
      res.status(201).json(savedUser);
      return;
    }

    res.status(200).json(existingUser);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const a2 = {
  "_id": "afc58449-15e6-4278-986c-6566b2084934",
  "color": "#c1caf3",
  "createdAt": 1682152770781,
  "indexOrder": 0,
  "name": "dasdasd",
  "tickets": [
    {
      "_id": "267b85b3-01ef-4590-ac38-184fc8e907f1",
      "categoryId": "afc58449-15e6-4278-986c-6566b2084934",
      "color": "",
      "content": "",
      "createdAt": 1682152774480,
      "description": "fasfasf"
    }
  ]
};

app.post('/api/users/:uid', async (req: Request, res: Response) => {
  const { uid } = req.params;
  const { boards = a2 } = req.body;

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

// kanbanify-api
// E7zgB1HsnCWsXrT2