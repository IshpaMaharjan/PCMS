import express from "express";
import { getProfessionalsByRole} from "../controllers/connection.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import User from "../models/User.model.js";

const router = express.Router();

// Get professionals by their role/profession
router.get("/profession/:role", authMiddleware, getProfessionalsByRole);

// Get user by ID (for profile viewing)
router.get("/users/:id", authMiddleware, async (req, res) => {
  try {
    console.log("Fetching user with ID:", req.params.id);
    
    const user = await User.findById(req.params.id).select("-password");
    
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }
    
    console.log("User found:", user.name);
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put("/users/:id", authMiddleware, async (req, res) => {
  try {
    console.log("Updating user with ID:", req.params.id);
    console.log("Update data:", req.body);
    
    // Check if user is updating their own profile
    if (req.params.id !== req.user.id) {
      console.log("Unauthorized: User can only update their own profile");
      return res.status(403).json({ message: "Not authorized to update this profile" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("-password");

    console.log("User updated successfully");
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get current user profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: error.message });
  }
});

// Other routes...
export default router;