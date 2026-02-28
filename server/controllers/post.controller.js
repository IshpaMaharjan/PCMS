import Post from "../models/Post.js";
import User from "../models/User.js";

export const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find logged-in user
    const user = await User.findById(userId).populate("connections", "_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const allowedUsers = [...user.connections.map(u => u._id), req.user._id];

    // // Create array of IDs to fetch posts from
    // const connectionIds = user.connections.map(conn => conn._id);

    // // Include self also
    // connectionIds.push(userId);

    // Fetch posts
    const posts = await Post.find({
      author: { $in: allowedUsers }
    })
      .populate("author", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);

  } catch (error) {
    console.error("Feed error:", error);
    res.status(500).json({ message: "Server error" });
  }
};