import { NextFunction, Request, Response } from "express";
import { ROOM_ERROR } from "../utils/stringResources";
import logging from "../utils/logging";

const existRoomCredentialMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.hasOwnProperty("room")) {
    logging.error(ROOM_ERROR);
    return res.status(400).json({ msg: ROOM_ERROR });
  }

  const { room } = req.body;

  if (!room) {
    logging.error(ROOM_ERROR);
    return res.status(400).json({ msg: ROOM_ERROR });
  }

  next();
};

export default existRoomCredentialMiddleware;
