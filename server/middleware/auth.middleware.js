import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get full user from database (excluding password)
      const user = await User.findById(decoded.id).select("-password");
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default authMiddleware;