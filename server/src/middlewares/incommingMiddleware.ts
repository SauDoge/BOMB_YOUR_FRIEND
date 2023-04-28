import Logging from "../utils/logging";
import { Request, Response, NextFunction } from "express";

const incomingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Logging.info(
    `Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
  );
  res.on("finish", () => {
    Logging.info(
      `Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`
    );
  });

  next();
};

export default incomingMiddleware;
