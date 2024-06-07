import express from "express";
import cors from "cors";
import { PORT, MONGODB_URI } from "./config/index.js";
import router from "./routes/authRoutes.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
// import { refreshToken } from "./middleware/authMiddleware.js";
// import session from "express-session";
import mongoose from "mongoose";
import courseRoutes from "./routes/courseRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// import subPlansRoutes from "./routes/subPlansRoutes.js";
// import MongoStore from "connect-mongo";
import otpRouter from "../src/routes/otpRoutes.js";
// import deserializeUser from "../src/middleware/deserializer.js";

const server = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://spicy-guitar.vercel.app",
];

server.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow the specified origins
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(express.json());

// Set up mongoose's promise to global promise
mongoose.promise = global.Promise;
mongoose.set("strictQuery", false);

server.use(router);

// Use the middleware for routes that require authentication
// server.use(deserializeUser);

// adding of courses
server.use("/courses", courseRoutes);
server.use("/users", userRoutes)

// //adding of course category
server.use("/category", categoryRoutes);

// //adding of subscription
// server.use("/subscription", subPlansRoutes);

server.use("/otp", otpRouter);

export default function startServer() {
  mongoose
    .connect(MONGODB_URI, {})
    .then(() => {
      console.log("Connected to database");
      server.listen(PORT, () =>
        console.log(`Server running on http://localhost:${PORT}`)
      );
    })
    .catch((err) => console.log(err));
}
