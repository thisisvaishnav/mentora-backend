import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || "mentora_secret_key_change_me_in_prod";

export const signup = async (req, res) => {
  try {

    const { email, password,role} = req.body;
    // if ther is no email or password or role then return error 
    if (!email || !password || !role) {
      return res.status(400).json({ error: "Email, password, and role are required" });
    }
    // if role is not parent or mentor then return error because student can't signup
    if (role !== "PARENT" && role !== "MENTOR") {
      return res.status(400).json({ error: "Invalid role. Only PARENT and MENTOR can signup." });
    }
    // if user already exists with this email then return error
    const existingUser = await prisma.user.findUnique({ where: { email } }); // this give true if user exist and false if user does't 
    
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // create user if every thing is right no more checks
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role
      }
    });
    // generate token 
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // if ther is no email or password then return error 

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    // check if user exists with this email or not 
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "user not found, please signup first :(" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // generate token 

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMe = async (req, res) => {
// middle ware will send user id in req.user
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true, role: true, createdAt: true }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
