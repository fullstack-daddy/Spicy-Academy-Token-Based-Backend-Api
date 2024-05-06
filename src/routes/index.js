import express from "express";
import Auth from "./auth.js";
import { Verify, VerifyRole } from "../middleware/verify.js";
import { Logout, signInWithGoogle } from "../controllers/auth.js";
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
const app = express();

app.disable("x-powered-by");

// get method home route with the handler
app.get("/", (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      data: [],
      message: "Welcome to the home route",
    });
    res.sendFile(__dirname + "../pages/index.jsx");
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

// app.get("/", (req, res) => {
//   try {
//     // Send the JSX file after transpiling it to JavaScript
//     res.sendFile(path.join(__dirname, "../public/index.html"));
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: error.message,
//     });
//   }
// });

app.get("/user", Verify, (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      message: "Welcome to the your Dashboard!",
    });
  } catch (error) {
    res.status(500).json({ status: "error",
      message: `${error.message}`,
     });
  }
});

app.get("/admin", Verify, VerifyRole, (req, res) => {
  res.status(200).json({
      status: "success",
      message: "Welcome to the Admin portal!",
  });
});

app.get('/logout', Logout);

app.use("/auth", Auth);

app.get('/google-auth', )

export default app;
