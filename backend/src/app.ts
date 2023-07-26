import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { authRoutes } from './routes/auth.routes';
import { userRoutes } from './routes/user.routes';

require('dotenv').config();

const port = 8002;

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use(userRoutes);
app.use(authRoutes);

mongoose.connect(process.env.MONGO_URI);

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});