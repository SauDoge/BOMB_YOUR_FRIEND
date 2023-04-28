import { config } from "../config/config"

export const SERVER_RUNNING_MSG = `Server running on port ${config.server.port}`;
export const MISSING_REGISTER_PARAMETER = `Missing username or password parameter`;
export const ERROR_WRITING_FILE = `Error reading file `;
export const DUPLICATE_USERNAME = `Username is duplicated`;
export const HASHING_ERROR = `Error hashing`;
export const SUCCESSFULLY_REGISTER = `Successfully resgister user`;