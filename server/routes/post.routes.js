import express from "express";
import multer from "multer";
import authMiddleware from "../middleware/auth.middleware.js";
import { createPost, getFeedPosts, deletePost } from "../controllers/post.controller.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Create a post
router.post("/", authMiddleware, upload.single("image"), createPost);

// Get feed
router.get("/feed", authMiddleware, getFeedPosts);

// Delete post
router.delete("/:id", authMiddleware, deletePost);

export default router;