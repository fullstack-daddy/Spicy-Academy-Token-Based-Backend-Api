import * as dotenv from 'dotenv'
dotenv.config()

const { MONGODB_URI, PORT, SECRET_ACCESS_TOKEN } = process.env;

export { MONGODB_URI, PORT, SECRET_ACCESS_TOKEN };