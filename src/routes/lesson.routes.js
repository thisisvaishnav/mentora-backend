import express from "express";
import { createLesson } from "../controllers/lesson.controller.js";
import { getSessions } from "../controllers/session.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

router.post("/", createLesson);
router.get("/:id/sessions", getSessions);

export default router;
