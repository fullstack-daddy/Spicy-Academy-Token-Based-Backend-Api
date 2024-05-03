import express from "express";
import Auth from "./auth.js";
import { Verify, VerifyRole } from "../middleware/verify.js";
import { Logout } from "../controllers/auth.js";

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
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

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

export default app;
