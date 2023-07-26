import { Request, Response } from "express";

import { User } from '../models/user.models';

const get = async (req: Request, res: Response) => {
  // @ts-ignore
  const { email, uid, token } = req;
  const { id } = req.params;

  const userUid = `${email}-${id}`;
  // Check if the authenticated user is the same as the user being deleted
  if (userUid !== uid) {
    return res.status(403).json({ message: 'Unauthorized access to this resource' });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ boards: user.boards, token, email, id: user._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const update = async (req: Request, res: Response) => {
  // @ts-ignore
  const { email, token } = req;
  const { boards } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { boards },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ boards: updatedUser.boards, token, email, id: updatedUser._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const remove = async (req: Request, res: Response) => {
  // @ts-ignore
  const { email, uid } = req;
  const { id } = req.params;

  const userUid = `${email}-${id}`;

  // Check if the authenticated user is the same as the user being deleted
  if (userUid !== uid) {
    return res.status(403).json({ message: 'Unauthorized access to this resource' });
  }

  try {
    // Delete the user from the database
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const userController = {
  get,
  update,
  remove,
}