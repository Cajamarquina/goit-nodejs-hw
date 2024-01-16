import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import gravatar from "gravatar";
import Jimp from "jimp";

import path from "path";
import fs from "fs/promises";
import User from "../models/user.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const avatarPath = path.resolve("public", "avatars");

const { JWT_SECRET } = process.env;
const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const avatarURL = gravatar.url(email, { s: 250, d: "retro", r: "g" });
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, avatarURL, password: hashPassword });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const { _id: id } = user;
  const playload = { id };
  const token = jwt.sign(playload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(id, { token });
  res.json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });

  res.status(204).send();
};

const subscription = async (req, res) => {
  const { _id, email } = req.user;
  const { subscription } = req.body;
  await User.findByIdAndUpdate(_id, { subscription: `${subscription}` });

  res.json({ email, subscription });
};

const updateAvatar = async (req, res) => {
  const { _id, avatarURL } = req.user;
  const { path: tmpUpload, originalname } = req.file;

  const filename = `${_id}-${originalname}`;
  const avatarsUpload = path.join(avatarPath, filename);
  const newAvatarURL = path.join("avatars", filename);

  try {
    await fs.rename(tmpUpload, avatarsUpload);
    const avatar = await Jimp.read(avatarsUpload);
    avatar.resize(250, 250);
    await avatar.writeAsync(avatarsUpload);

    await User.findByIdAndUpdate(_id, { avatarURL: `${newAvatarURL}` });
    res.json({ avatarURL: `${newAvatarURL}` });
  } catch (error) {
    HttpError(404, err.message);
  }
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  subscription: ctrlWrapper(subscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};

