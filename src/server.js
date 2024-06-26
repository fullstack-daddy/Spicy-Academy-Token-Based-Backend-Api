import express from "express";
import cors from "cors";
import { PORT, MONGODB_URI } from "./config/index.js";
import router from "./routes/authRoutes.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import refreshTokenRoute from "./routes/refreshTokenRoute.js";
import mongoose from "mongoose";
import courseRoutes from "./routes/courseRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subPlansRoutes from "./routes/subPlansRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import assessmentRoute from "./routes/assessmentRoute.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import otpRouter from "../src/routes/otpRoutes.js";

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
server.use(refreshTokenRoute);

// adding of courses
server.use("/courses", courseRoutes);
server.use("/assignment", assignmentRoutes);
server.use("/lesson", lessonRoutes);
server.use("/users", userRoutes);
server.use("/assessment", assessmentRoute);

//adding of course category
server.use("/category", categoryRoutes);

//adding of subscription
server.use("/subscription", subPlansRoutes);

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
