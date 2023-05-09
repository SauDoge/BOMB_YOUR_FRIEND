import { NextFunction, Request, Response } from "express";
import {
  ERROR_WRITING_FILE,
  DUPLICATE_USERNAME,
  SUCCESSFULLY_ADD_LEADERBOARD,
} from "../utils/stringResources";
import LeaderBoard from "../models/Leaderboard";
import { config } from "../config/config";
import fs from "fs";
import logging from "../utils/logging";

const addToLeaderboardMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.body;

  fs.readFile(config.db.leaderboard, "utf-8", (error, data) => {
    if (error) {
      logging.error(ERROR_WRITING_FILE);
      return res.status(500).json({ msg: ERROR_WRITING_FILE });
    }

    const leaderboard: LeaderBoard[] = JSON.parse(data);
    const filteredLeaderboard: LeaderBoard[] = leaderboard.filter(
      (l) => l.username === username
    );

    if (filteredLeaderboard.length > 0) {
      logging.error(DUPLICATE_USERNAME);
      return res.status(400).json({ msg: DUPLICATE_USERNAME });
    }

    const user: LeaderBoard = {
      username: username,
      score: "0",
    };

    leaderboard.push(user);

    fs.writeFileSync(
      config.db.leaderboard,
      JSON.stringify(leaderboard),
      "utf-8"
    );
    logging.info(SUCCESSFULLY_ADD_LEADERBOARD);
    return res.status(201).json({ user });
  });
};

export default addToLeaderboardMiddleware;
