import { NextFunction, Request, Response } from "express";
import { MISSING_LEADERBOARD_PARAMETER } from "../utils/stringResources";
import logging from "../utils/logging";

const existLeaderboardCredentialMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    !req.body.hasOwnProperty("username") ||
    !req.body.hasOwnProperty("score")
  ) {
    logging.error(MISSING_LEADERBOARD_PARAMETER);
    return res.status(400).json({ msg: MISSING_LEADERBOARD_PARAMETER });
  }

  const { username, score } = req.body;

  if (!username || !score) {
    logging.error(MISSING_LEADERBOARD_PARAMETER);
    return res.status(400).json({ msg: MISSING_LEADERBOARD_PARAMETER });
  }

  next();
};

export default existLeaderboardCredentialMiddleware;
