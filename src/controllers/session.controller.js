import prisma from "../config/prisma.js";

// create a session for a lesson
export const createSession = async (req, res) => {
  try {
    const { lessonId, date, topic, summary } = req.body;
    
    // verify required fields
    if (!lessonId || !date || !topic) {
      return res.status(400).json({ error: "lessonId, date, and topic are required" });
    }
    
    // verify the lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId }
    });
    
    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }
    
    // Mentor only check - ensure the mentor creating the session owns the lesson
    if (req.user.role !== "MENTOR") {
       return res.status(403).json({ error: "Access denied. Only mentors can create sessions." });
    }

    if (lesson.mentorId !== req.user.userId) {
       return res.status(403).json({ error: "You can only create sessions for your own lessons" });
    }
    
    // create session
    const session = await prisma.session.create({
      data: {
        lessonId,
        date: new Date(date),
        topic,
        summary
      }
    });
    
    res.status(201).json(session);
  } catch (error) {
    console.error("Create session error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// get all sessions for a specific lesson
export const getSessions = async (req, res) => {
  try {
    const { id: lessonId } = req.params;
    
    // verify the lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId }
    });
    
    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }
    
    // Anyone authenticated can view sessions for a lesson they have access to
    // Mentors can see sessions for their own lessons
    // Parents can see sessions for lessons their students are booked in
    if (req.user.role === "MENTOR" && lesson.mentorId !== req.user.userId) {
        return res.status(403).json({ error: "You can only view sessions for your own lessons" });
    }

    if (req.user.role === "PARENT") {
        const studentBookings = await prisma.booking.findMany({
            where: {
                lessonId,
                student: {
                    parentId: req.user.userId
                }
            }
        });

        if (studentBookings.length === 0) {
            return res.status(403).json({ error: "You can only view sessions for lessons your students are booked in" });
        }
    }

    const sessions = await prisma.session.findMany({
      where: {
        lessonId
      },
      orderBy: {
        date: 'asc'
      }
    });
    
    res.json(sessions);
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
