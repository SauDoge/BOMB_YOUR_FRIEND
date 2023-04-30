import { NextFunction, Request, Response } from "express";
import {
  ERROR_WRITING_FILE,
  DUPLICATE_USERNAME,
  HASHING_ERROR,
  SUCCESSFULLY_REGISTER,
  USER_NOT_EXIST,
  USER_UNAUTHORIZED,
  LOGIN_SUCCESS,
  INCORRECT_CREDENTIAL,
  SUCCESSFULLY_LOGOUT,
  ERROR_LOGOUT,
} from "../utils/stringResources";
import { config } from "../config/config";
import logging from "../utils/logging";
import User from "../models/User";
import fs from "fs";
import bcrypt from "bcrypt";

const register = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  fs.readFile(config.db.path, "utf-8", (error, data) => {
    if (error) {
      logging.error(ERROR_WRITING_FILE + error);
      return res.status(500).json({ msg: ERROR_WRITING_FILE + error });
    }

    const users: User[] = JSON.parse(data);
    const filteredUser = users.filter((u) => u.username === username);

    if (filteredUser.length > 0) {
      logging.error(DUPLICATE_USERNAME);
      return res.status(400).json({ msg: DUPLICATE_USERNAME });
    }

    bcrypt.hash(password, config.hash.salt, (error, hash) => {
      if (error) {
        logging.error(HASHING_ERROR);
        return res.status(500).json({ msg: HASHING_ERROR });
      }

      const user: User = {
        username: username,
        password: hash,
      };

      users.push(user);

      fs.writeFileSync(config.db.path, JSON.stringify(users), "utf-8");
      logging.info(SUCCESSFULLY_REGISTER);
      return res.status(201).json({ user });
    });
  });
};

const login = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  fs.readFile(config.db.path, "utf-8", (error, data) => {
    if (error) {
      logging.error(ERROR_WRITING_FILE + error);
      return res.status(500).json({ msg: ERROR_WRITING_FILE + error });
    }

    const users: User[] = JSON.parse(data);
    const filteredUser = users.filter((u) => u.username === username);

    if (filteredUser.length === 0) {
      logging.error(USER_NOT_EXIST);
      return res.status(400).json({ msg: USER_NOT_EXIST });
    }

    const user = filteredUser[0];

    bcrypt.compare(password, user.password, (error, success) => {
      if (error) {
        logging.error(USER_UNAUTHORIZED);
        return res.status(401).json({ msg: USER_UNAUTHORIZED });
      }

      if (success) {
        req.session.user = user;
        logging.info(LOGIN_SUCCESS);
        return res.status(200).json({ msg: LOGIN_SUCCESS });
      }

      logging.error(INCORRECT_CREDENTIAL);
      return res.status(401).json({ INCORRECT_CREDENTIAL });
    });
  });
};

const logout = (req: Request, res: Response, next: NextFunction) => {
  req.session.destroy((error) => {
    if (error) {
      logging.error(ERROR_LOGOUT);
      return res.status(500).json({ msg: ERROR_LOGOUT });
    }

    return res.status(200).json({ msg: SUCCESSFULLY_LOGOUT });
  });
};

const test = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user) {
    res.status(200).json({ msg: `Welcome back ${req.session.user.username}` });
  } else {
    res.status(401).json({ msg: "Not login" });
  }
};

export default { register, login, logout, test };
