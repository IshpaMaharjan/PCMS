import Connection from "../models/Connection.js";
import User from "../models/User.model.js";

/*  SEND CONNECTION REQUEST */
export const sendRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.id;

    if (senderId === receiverId) {
      return res.status(400).json({ message: "Cannot connect with yourself" });
    }

    // Check if receiver exists
    const receiverExists = await User.findById(receiverId);
    if (!receiverExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent duplicate in both directions
    const existing = await Connection.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    });

    if (existing) {
      return res.status(400).json({ message: "Request already exists" });
    }

    const connection = await Connection.create({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    // Populate sender & receiver for frontend UI
    await connection.populate("sender", "name role").populate("receiver", "name role");

    res.status(201).json(connection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ACCEPT REQUEST */
export const acceptRequest = async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (connection.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    connection.status = "accepted";
    await connection.save();

    // Populate for frontend UI
    await connection.populate("sender", "name role").populate("receiver", "name role");

    res.json(connection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET MY CONNECTIONS */
export const getMyConnections = async (req, res) => {
  try {
    const userId = req.user.id;

    const connections = await Connection.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
      .populate("sender", "name role")
      .populate("receiver", "name role");

    res.json(connections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* SEARCH USERS*/
export const searchUsers = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const currentUserId = req.user.id; // from auth middleware

    if (!keyword.trim()) {
      return res.json([]);
    }

    const users = await User.find({
      _id: { $ne: currentUserId }, // exclude self
      $or: [
        { name: { $regex: keyword, $options: "i" } }, // search by name
        { role: { $regex: keyword, $options: "i" } },
        { professionalType: { $regex: keyword, $options: "i" } }, // search by role
      ],
    })
      .select("name role") // do not include password
      .lean();

    res.json(users);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
