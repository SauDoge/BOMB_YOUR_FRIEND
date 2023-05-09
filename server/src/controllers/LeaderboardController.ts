import { NextFunction, Request, Response } from "express";
import { config } from "../config/config";
import {
  ERROR_WRITING_FILE,
  USER_NOT_EXIST,
  SUCCESSFULLY_UPDATE_LEADERBOARD,
} from "../utils/stringResources";
import LeaderBoard from "../models/Leaderboard";
import logging from "../utils/logging";
import fs from "fs";

const updateLeaderboard = (req: Request, res: Response, next: NextFunction) => {
  const { username, score } = req.body;

  fs.readFile(config.db.leaderboard, "utf-8", (error, data) => {
    if (error) {
      logging.error(ERROR_WRITING_FILE);
      return res.status(500).json({ msg: ERROR_WRITING_FILE });
    }

    const leaderboard: LeaderBoard[] = JSON.parse(data);
    const index = leaderboard.findIndex((l) => l.username === username);

    if (index === -1) {
      logging.error(USER_NOT_EXIST);
      return res.status(400).json({ msg: USER_NOT_EXIST });
    }

    const user: LeaderBoard = leaderboard[index];
    const updatedSocre = (Number(user.score) + score).toString();

    user.score = updatedSocre;
    leaderboard[index] = user;

    leaderboard.sort((a, b) => (Number(a.score) > Number(b.score) ? -1 : 1));

    fs.writeFileSync(
      config.db.leaderboard,
      JSON.stringify(leaderboard),
      "utf-8"
    );
    logging.info(SUCCESSFULLY_UPDATE_LEADERBOARD);
    return res.status(201).json({ msg: SUCCESSFULLY_UPDATE_LEADERBOARD });
  });
};

const getLeaderboard = (req: Request, res: Response, next: NextFunction) => {
  fs.readFile(config.db.leaderboard, "utf-8", (error, data) => {
    if (error) {
      logging.error(ERROR_WRITING_FILE);
      return res.status(500).json({ msg: ERROR_WRITING_FILE });
    }

    return res.status(200).json({ leaderboard: JSON.parse(data) });
  });
};

export default { getLeaderboard, updateLeaderboard };
