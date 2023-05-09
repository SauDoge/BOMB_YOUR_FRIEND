import { config } from "../config/config";

export const SERVER_RUNNING_MSG = `Server running on port ${config.server.port}`;
export const MISSING_REGISTER_PARAMETER = `Missing username or password parameter`;
export const ERROR_WRITING_FILE = `Error reading file `;
export const DUPLICATE_USERNAME = `Username is duplicated`;
export const HASHING_ERROR = `Error hashing`;
export const SUCCESSFULLY_REGISTER = `Successfully resgister user`;
export const USER_NOT_EXIST = `User not exist`;
export const USER_UNAUTHORIZED = `User unauthorized`;
export const LOGIN_SUCCESS = `Login Successfull`;
export const INCORRECT_CREDENTIAL = `Incorrect password or username`;
export const SUCCESSFULLY_LOGOUT = `Successfully logout`;
export const ERROR_LOGOUT = `Error logging out`;
export const ROOM_ERROR = `Room name not specified`;
export const DUPLICATE_ROOM = `Room duplicated`;
export const SUCCESSFULLY_CREATE_ROOM = `Successfully create room`;
export const SUCCESSFULLY_ADD_LEADERBOARD = `Successfully added to the leaderboard`;
export const SUCCESSFULLY_UPDATE_LEADERBOARD = `Successfully update leaderboard;`
export const MISSING_LEADERBOARD_PARAMETER = `Missing username or score parameter`;
