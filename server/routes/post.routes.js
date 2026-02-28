import express from "express";
import Post from "../models/Post.model.js";
import authMiddleware from "../middleware/auth.middleware.js";
import multer from "multer";
import { getFeedPosts } from "../controllers/post.controller.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* CREATE POST */
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const newPost = await Post.create({
      author: req.user._id,
      content: req.body.content,
      image: req.file ? req.file.filename : null,
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feed of self + connected users
router.get("/feed", authMiddleware, getFeedPosts);

export default router;