import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { PORT, URI } from "./config/index.js";
import App from "./routes/index.js";

const server = express();

// CONFIGURE HEADER INFORMATION
server.use(cors());
server.disable("x-powered-by"); //Reduce fingerprinting
server.use(cookieParser());
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

// Set up mongoose's promise to global promise
mongoose.promise = global.Promise;
mongoose.set("strictQuery", false);
mongoose
    .connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(console.log("Connected to database"))
    .catch((err) => console.log(err));

    // Connect Main route to server
server.use(App);

server.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
);