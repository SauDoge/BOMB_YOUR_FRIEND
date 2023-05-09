import express from "express";
import http from "http";
import logging from "./utils/logging";
import cors from "cors";

import { config } from "./config/config";
import { Server } from "socket.io";
import { incomingMiddleware, corsMiddleware } from "./middlewares";
import { SERVER_RUNNING_MSG } from "./utils/stringResources";
import { userRoutes, roomRoutes, leaderboardRoutes } from "./routes";

const router = express();

const start = () => {
  const server = createServer();
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    const { address } = socket.handshake;
    const id = socket.id;

    logging.info(`Connection - IP: [${address}] - ID: [${id}]`);

    // socket on a player joining a room
    // if enough player joined the room, initialise the map for them
    socket.on("join", (room) => {
      logging.info(`Join - IP: [${address}] - ID: [${room}]`);

      socket.join(room);

      io.to(room).emit(
        "clientConnected",
        io.sockets.adapter.rooms.get(room)?.size
      );
    });

    // socket on a player sending a message
    socket.on("message", (msg) => {
      logging.info(`Message - MSG: [${msg}] - IP: [${address}] - ID: [${id}]`);
      socket.to(msg.room).emit("receive", msg);
    });

    // socket on a playing event
    // 1) placing a bomb
    //  1.1) an explosion
    // 2) picking up an item
    // 3) moving in a direction
    socket.on("placing bomb", () => {});

    socket.on("retrieving item", () => {});

    // socket on a player logging out
    socket.on("disconnect", () => {
      logging.info(`Disconnected - IP: [${address}] - ID: [${id}]`);
    });
  });

  server.listen(config.server.port, () => logging.info(SERVER_RUNNING_MSG));
};

const createServer = () => {
  router.use(cors());
  router.use(config.server.cookie);
  router.use(incomingMiddleware);

  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());

  router.use(corsMiddleware);

  router.use("/auth", userRoutes);
  router.use("/room", roomRoutes);
  router.use("/leaderboard", leaderboardRoutes);

  router.get("/ping", (req, res, next) =>
    res.status(200).json({ msg: SERVER_RUNNING_MSG })
  );

  return http.createServer(router);
};

start();
