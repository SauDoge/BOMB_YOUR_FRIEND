import dotenv from "dotenv";
import User from "../models/User";
import session from "express-session";

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  // : 1337;
  : 8000;
const SALT = process.env.HASH_SALT ? Number(process.env.HASH_SALT) : 10;
const DB_PATH = `./db/users.json`;
const ROOM_PATH = `./db/rooms.json`;
const LEADERBOARD_PATH = `./db/leaderboard.json`;
const SESSION_SECRET = process.env.SESSION_SECRET || "secret";
const SESSION_EXPIRATION = process.env.SESSION_EXPIRATION
  ? Number(process.env.SESSION_EXPIRATION)
  : 60000;

declare module "express-session" {
  interface SessionData {
    user: User;
  }
}

const configSession = session({
  secret: SESSION_SECRET,
  resave: false,
  name: 'bomb',
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: SESSION_EXPIRATION,
  },
});

export const config = {
  server: {
    port: SERVER_PORT,
    cookie: configSession,
  },
  db: {
    path: DB_PATH,
    room: ROOM_PATH,
    leaderboard: LEADERBOARD_PATH
  },
  hash: {
    salt: SALT,
  },
};
