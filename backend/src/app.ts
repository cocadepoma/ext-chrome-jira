import cors from 'cors';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
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

const limit1h = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Allow a maximum of 3 password recovery requests per IP per hour
});

const limit10mins = rateLimit({
  windowMs: 60 * 60 * 100, // 1 hour
  max: 10, // Allow a maximum of 3 password recovery requests per IP per hour
});

app.use(cors(corsOptions));
app.use(express.json());

app.use('/kanbanify/api/auth/recovery/email', limit1h);
app.use('/kanbanify/api/auth/login', limit10mins);

app.use(userRoutes);
app.use(authRoutes);

mongoose.connect(process.env.MONGO_URI);

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});