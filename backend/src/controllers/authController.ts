import { Request, Response } from 'express';
import UserModel from '../models/User';
import { store } from '../data/store';

type UserRecord = {
  id: number;
  username: string;
  name: string;
  avatar: string;
};

const toPublicUser = (row: {
  userId: number;
  username: string;
  name: string;
  avatar: string;
}): UserRecord => ({
  id: row.userId,
  username: row.username,
  name: row.name,
  avatar: row.avatar,
});

const fetchAllUsers = async (): Promise<UserRecord[]> => {
  const users = await UserModel.find({}, { _id: 0, userId: 1, username: 1, name: 1, avatar: 1 }).sort({ userId: 1 }).lean();
  return users.map(toPublicUser);
};

export const signup = async (req: Request, res: Response) => {
  const { username, name, password } = req.body as {
    username?: string;
    name?: string;
    password?: string;
  };

  if (!username?.trim() || !name?.trim() || !password?.trim()) {
    return res.status(400).json({ message: 'Name, username, and password are required.' });
  }

  try {
    const normalizedUsername = username.trim().toLowerCase();
    const trimmedName = name.trim();
    const avatar = trimmedName.charAt(0).toUpperCase() || 'U';

    const existingUser = await UserModel.findOne({ username: normalizedUsername }).lean();

    if (existingUser) {
      return res.status(409).json({ message: 'That username is already taken.' });
    }

    const lastUser = await UserModel.findOne({}, { userId: 1 }).sort({ userId: -1 }).lean();
    const nextUserId = (lastUser?.userId ?? 0) + 1;

    const user = await UserModel.create({
      userId: nextUserId,
      username: normalizedUsername,
      name: trimmedName,
      avatar,
      password,
    });

    return res.status(201).json({
      user: toPublicUser(user),
      availableUsers: await fetchAllUsers(),
      appliances: store.getAppliances(),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Database error during signup.' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body as { username?: string; password?: string };

  if (!username?.trim() || !password?.trim()) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const user = await UserModel.findOne({ username: username.trim().toLowerCase() }).lean();

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    return res.json({
      user: toPublicUser(user),
      availableUsers: await fetchAllUsers(),
      appliances: store.getAppliances(),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Database error during login.' });
  }
};
