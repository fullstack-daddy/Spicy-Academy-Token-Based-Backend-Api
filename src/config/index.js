import * as dotenv from 'dotenv'
dotenv.config()

const { MONGODB_URI, PORT, JWT_SECRET, JWT_REFRESH_SECRET } = process.env;

export { MONGODB_URI, PORT, JWT_SECRET, JWT_REFRESH_SECRET };