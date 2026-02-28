import express from "express";
import {
  sendRequest,
  acceptRequest,
  getMyConnections,
  searchUsers,
  getProfessionalsByRole
} from "../controllers/connection.controller.js";
import authMiddleware from "../middleware/auth.middleware.js"; // ✅ fix case
import User from "../models/User.model.js";

const router = express.Router();

router.post("/send/:id", authMiddleware, sendRequest);
router.put("/accept/:id", authMiddleware, acceptRequest);
router.get("/my", authMiddleware, getMyConnections);
router.get("/search", authMiddleware, searchUsers);
router.get("/profession/:role", getProfessionalsByRole);

// Connect with another user
router.post("/:id/connect", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const connectUser = await User.findById(req.params.id);

    if (!user || !connectUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent duplicate connections
    if (!user.connections.includes(connectUser._id)) {
      user.connections.push(connectUser._id);
      await user.save();
    }

    // Optional: add self to the other user's connections
    if (!connectUser.connections.includes(user._id)) {
      connectUser.connections.push(user._id);
      await connectUser.save();
    }

    res.status(200).json({ message: "Connected successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;