import express from "express";
import Post from "../models/Post.model.js";
import User from "../models/User.model.js";
import authMiddleware from "../middleware/auth.middleware.js";
import multer from "multer";

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

/* GET POSTS */
router.get("/feed", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const allowedUsers = [...user.connections, req.user._id];

    const posts = await Post.find({
      author: { $in: allowedUsers },
    })
      .populate("author", "name role")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;