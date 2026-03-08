import express from "express";
import { createSession, getSessions } from "../controllers/session.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(authenticate);
router.post("/", createSession);
export default router;
