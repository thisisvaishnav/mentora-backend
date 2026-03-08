import prisma from "../config/prisma.js";

// only mentor can create lessons
export const createLesson = async (req, res) => {
  try {
    const { title,description} = req.body;
    // Mentor only check
    if (req.user.role !== "MENTOR") {
      return res.status(403).json({ error: "Access denied. Only mentors can create lessons." });
    }
    // there must be title and description
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }
    // create lesson and attach it to mentor
    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        mentorId: req.user.userId
      }
    });
    res.status(201).json(lesson);
  } catch (error) {
    console.error("Create lesson error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
