import prisma from "../config/prisma.js";
// why I have created this controller file ?

// only parent can add students or create students 
export const createStudent = async (req, res) => {
  try {
    const { name } = req.body;
    
    // 
    if (req.user.role !== "PARENT") {
      return res.status(403).json({ error: "Access denied. Only parents can add students." });
    }
    // there must be name of student
    if (!name) {
      return res.status(400).json({ error: "Student name is required" });
    }
    // create student with given name and attach it to parent
    const student = await prisma.student.create({
      data: {
        name,
        parentId: req.user.userId
      }
    });
    
    res.status(201).json(student);
  } catch (error) {
    console.error("Create student error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getStudents = async (req, res) => {
  try {
    // Parent only check
    if (req.user.role !== "PARENT") {
      return res.status(403).json({ error: "Access denied. Only parents can view their students." });
    }

    const students = await prisma.student.findMany({
      where: {
        parentId: req.user.userId
      }
    });
    
    res.json(students);
  } catch (error) {
    console.error("Get students error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
