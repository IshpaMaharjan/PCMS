import Post from "../models/Post.model.js";
import User from "../models/User.model.js";

export const getFeedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("connections", "_id");
    if (!user) return res.status(404).json({ message: "User not found" });

    const allowedUsers = [user._id, ...user.connections.map((conn) => conn._id)];

    const posts = await Post.find({ author: { $in: allowedUsers } })
      .populate("author", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Feed error:", error);
    res.status(500).json({ message: "Server error" });
  }
};