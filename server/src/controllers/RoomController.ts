import { NextFunction, Request, Response } from "express";
import { config } from "../config/config";
import Room from "../models/Room";
import logging from "../utils/logging";
import {
  ERROR_WRITING_FILE,
  DUPLICATE_ROOM,
  SUCCESSFULLY_CREATE_ROOM,
} from "../utils/stringResources";
import fs from "fs";

const createRoom = (req: Request, res: Response, next: NextFunction) => {
  const { room } = req.body;

  fs.readFile(config.db.room, "utf-8", (error, data) => {
    if (error) {
      logging.error(ERROR_WRITING_FILE);
      return res.status(500).json({ msg: ERROR_WRITING_FILE });
    }

    const rooms: Room[] = JSON.parse(data);
    const filteredRoom = rooms.filter((r) => r.name === room.toString());

    if (filteredRoom.length > 0) {
      logging.error(DUPLICATE_ROOM);
      return res.status(400).json({ msg: DUPLICATE_ROOM });
    }

    const newRoom: Room = {
      name: room.toString(),
    };

    rooms.push(newRoom);

    fs.writeFileSync(config.db.room, JSON.stringify(rooms), "utf-8");
    logging.info(SUCCESSFULLY_CREATE_ROOM);
    return res.status(201).json({ room });
  });
};

const getRoom = (req: Request, res: Response, next: NextFunction) => {
  fs.readFile(config.db.room, "utf-8", (error, data) => {
    if (error) {
      logging.error(ERROR_WRITING_FILE);
      return res.status(500).json({ msg: ERROR_WRITING_FILE });
    }

    return res.status(200).json({ room: JSON.parse(data) });
  });
};

export default { createRoom, getRoom };
