import express from "express";
import {
    refreshToken
} from "../controllers/refreshTokenController.js";

const router = express.Router();

router.get("/refreshToken", refreshToken);

export default router;