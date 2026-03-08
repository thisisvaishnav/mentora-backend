import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "mentora_secret_key_change_me_in_prod";

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded; // { userId, role }
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
