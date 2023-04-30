import { NextFunction, Request, Response } from "express";
import { MISSING_REGISTER_PARAMETER } from "../utils/stringResources";
import logging from "../utils/logging";

const existUserCredentialMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    !req.body.hasOwnProperty("username") ||
    !req.body.hasOwnProperty("password")
  ) {
    logging.error(MISSING_REGISTER_PARAMETER);
    return res.status(400).json({ msg: MISSING_REGISTER_PARAMETER });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    logging.error(MISSING_REGISTER_PARAMETER);
    return res.status(400).json({ msg: MISSING_REGISTER_PARAMETER });
  }

  next();
};

export default existUserCredentialMiddleware;
