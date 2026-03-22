import Post from "../models/Post.model.js";
import Connection from "../models/Connection.js";

// Create a post (only for user/professional)
export const createPost = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(403).json({ message: "Admin cannot create posts" });
    }

    const { content } = req.body;
    if (!content || !content.trim())
      return res.status(400).json({ message: "Content is required" });

    const newPost = await Post.create({
      author: req.user._id,
      content,
      image: req.file ? req.file.filename : null,
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error creating post" });
  }
};

// Get feed
export const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    let posts;

    if (role === "admin") {
      // Admin: all posts
      posts = await Post.find()
        .populate("author", "_id name role")
        .sort({ createdAt: -1 });
    } else {
      // User/Professional: own + connected users
      const connections = await Connection.find({
        status: "accepted",
        $or: [{ sender: userId }, { receiver: userId }],
      });

      const connectedUserIds = connections.map((conn) =>
        conn.sender.toString() === userId.toString() ? conn.receiver : conn.sender
      );

      const userIds = [userId, ...connectedUserIds];

      posts = await Post.find({ author: { $in: userIds } })
        .populate("author", "_id name role")
        .sort({ createdAt: -1 });
    }

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching feed posts:", err);
    res.status(500).json({ message: "Server error fetching posts" });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Admin can delete any post; others only their own
    if (req.user.role !== "admin" && post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted successfully", postId });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Server error deleting post" });
  }
};