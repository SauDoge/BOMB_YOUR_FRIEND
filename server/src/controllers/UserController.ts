import { NextFunction, Request, Response } from "express";
import {
  MISSING_REGISTER_PARAMETER,
  ERROR_WRITING_FILE,
  DUPLICATE_USERNAME,
  HASHING_ERROR,
  SUCCESSFULLY_REGISTER,
} from "../utils/stringResources";
import { config } from "../config/config";
import logging from "../utils/logging";
import User from "../models/User";
import fs from "fs";
import bcrypt from "bcrypt";

const register = (req: Request, res: Response, next: NextFunction) => {
  if (
    !req.body.hasOwnProperty("username") ||
    !req.body.hasOwnProperty("password")
  ) {
    logging.error(MISSING_REGISTER_PARAMETER);
    res.status(400).json({ msg: MISSING_REGISTER_PARAMETER });
    return;
  }

  const { username, password } = req.body;

  if (!username || !password) {
    logging.error(MISSING_REGISTER_PARAMETER);
    res.status(400).json({ msg: MISSING_REGISTER_PARAMETER });
    return;
  }

  fs.readFile(config.db.path, "utf-8", (error, data) => {
    if (error) {
      logging.error(ERROR_WRITING_FILE + error);
      res.status(500).json({ msg: ERROR_WRITING_FILE + error });
      return;
    }

    const users: User[] = JSON.parse(data);
    const filteredUser = users.filter((u) => u.username === username);

    if (filteredUser.length > 0) {
      logging.error(DUPLICATE_USERNAME);
      res.status(400).json({ msg: DUPLICATE_USERNAME });
      return;
    }

    bcrypt.hash(password, config.hash.salt, (error, hash) => {
      if (error) {
        logging.error(HASHING_ERROR);
        res.status(500).json({ msg: HASHING_ERROR });
        return;
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

export default { register };
