import prisma from "../config/prisma.js";

// only parent can assign student to lesson
export const createBooking = async (req, res) => {
  try {
    const { studentId, lessonId } = req.body;   
    // Parent only check
    if (req.user.role !== "PARENT") {
      return res.status(403).json({ error: "Access denied. Only parents can create bookings." });
    }
    // ensure studentId and lessonId are provided
    if (!studentId || !lessonId) {
      return res.status(400).json({ error: "studentId and lessonId are required" });
    }
    // verify the student belongs to this parent
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    


    if (student.parentId !== req.user.userId) {
      return res.status(403).json({ error: "You can only book lessonsfor your own students" });
    }
    
    // verify the lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId }
    });
    


    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }
    
    // check if booking already exists
    const existingBooking = await prisma.booking.findFirst({
      where: {
        studentId,
        lessonId
      }
    });

    if (existingBooking) {
      return res.status(400).json({ error: "Studentis already booked for this lesson" });
    }
    
    // create booking
    const booking = await prisma.booking.create({
      data: {
        studentId,
        lessonId
      }
    });
    
    res.status(201).json({
      message: "Bookingcreated successfully",
      booking
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
