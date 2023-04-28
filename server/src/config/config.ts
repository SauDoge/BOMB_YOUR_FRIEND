import dotenv from 'dotenv';

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 1337;
const SALT = process.env.HASH_SALT ? Number(process.env.HASH_SALT) : 10;
const DB_PATH = `./db/users.json`;

export const config = {
    server: {
        port: SERVER_PORT
    },
    db: {
        path: DB_PATH
    },
    hash: {
        salt: SALT
    }
};
