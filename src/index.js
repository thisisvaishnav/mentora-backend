import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import lessonRoutes from "./routes/lesson.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import sessionRoutes from "./routes/session.routes.js";

dotenv.config();
// initialize express app to app variable
const app = express();
// it enable cors which allow request from origin 
app.use(cors());
// it parse incoming request with json payload
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/students", studentRoutes);
app.use("/lessons", lessonRoutes);
app.use("/bookings", bookingRoutes);
app.use("/sessions", sessionRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API running" })
})

const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})