import mongoose from "mongoose";

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
  email: String,
  password: String,
  boards: [categorySchema],
});

export const User = mongoose.model('User', userSchema);