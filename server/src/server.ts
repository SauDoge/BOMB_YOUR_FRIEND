import express from "express";
import http from "http";
import logging from "./utils/logging";

import { config } from "./config/config";
import { Server } from "socket.io";
import { incomingMiddleware, corsMiddleware } from "./middlewares";
import { SERVER_RUNNING_MSG } from "./utils/stringResources";
import { userRoutes } from "./routes";

const router = express();

const start = () => {
  const server = createServer();
  const io = new Server(server);

  server.listen(config.server.port, () => logging.info(SERVER_RUNNING_MSG));
};

const createServer = () => {
  router.use(config.server.cookie);
  router.use(incomingMiddleware);

  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());

  router.use(corsMiddleware);

  router.use("/auth", userRoutes);

  router.get("/ping", (req, res, next) =>
    res.status(200).json({ msg: SERVER_RUNNING_MSG })
  );

  return http.createServer(router);
};

start();
