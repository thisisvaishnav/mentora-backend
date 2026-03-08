import express from "express";
import { createStudent, getStudents } from "../controllers/student.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
const router = express.Router();
router.use(authenticate);

router.post("/", createStudent);
router.get("/", getStudents);
export default router;
