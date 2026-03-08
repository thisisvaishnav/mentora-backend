import express from "express";
import { createBooking } from "../controllers/booking.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(authenticate);
router.post("/", createBooking);

export default router;
