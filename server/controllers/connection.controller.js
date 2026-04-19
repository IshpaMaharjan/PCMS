import Connection from "../models/Connection.js";
import User from "../models/User.model.js";

/*  SEND CONNECTION REQUEST */
export const sendRequest = async (req, res) => {
  try {
    console.log("Received connection request from user:", req.user);
    const senderId = req.user._id;
    const receiverId = req.params.id;

    if (senderId.equals(receiverId)) {
      return res.status(400).json({ message: "Cannot connect with yourself" });
    }

    // Check if receiver exists
    const receiverExists = await User.findById(receiverId);
    if (!receiverExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // If a rejected connection exists between these two users, delete it
    // so a fresh request can be sent safely
    await Connection.deleteOne({
      $or: [
        { sender: senderId, receiver: receiverId, status: "rejected" },
        { sender: receiverId, receiver: senderId, status: "rejected" },
      ],
    });

    // Prevent duplicate pending/accepted in both directions
    const existing = await Connection.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
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
    await connection.populate([
      { path: "sender", select: "name role" },
      { path: "receiver", select: "name role" },
    ]);

    res.status(201).json(connection);
  } catch (error) {
    console.error("SEND REQUEST ERROR:", error);
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

    if (connection.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    connection.status = "accepted";
    await connection.save();

    // Populate for frontend UI
    await connection.populate([
      { path: "sender", select: "name role" },
      { path: "receiver", select: "name role" },
    ]);

    res.json(connection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* REJECT REQUEST */
export const rejectRequest = async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (connection.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    connection.status = "rejected";
    await connection.save();

    res.json({ message: "Request rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* CANCEL SENT REQUEST */
export const cancelRequest = async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (connection.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (connection.status !== "pending") {
      return res.status(400).json({ message: "Only pending requests can be cancelled" });
    }

    await connection.deleteOne();

    res.json({ message: "Request cancelled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* REMOVE CONNECTION */
export const removeConnection = async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    if (
      connection.sender.toString() !== req.user._id.toString() &&
      connection.receiver.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await connection.deleteOne();

    res.json({ message: "Connection removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET MY CONNECTIONS */
export const getMyConnections = async (req, res) => {
  try {
    const userId = req.user._id;

    const connections = await Connection.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "name role")
      .populate("receiver", "name role");

    res.json(connections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* SEARCH USERS */
export const searchUsers = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const currentUserId = req.user._id;

    if (!keyword.trim()) {
      return res.json([]);
    }

    const users = await User.find({
      _id: { $ne: currentUserId },
      role: { $ne: "admin" }, // exclude admin users from search
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { role: { $regex: keyword, $options: "i" } },
        { professionalType: { $regex: keyword, $options: "i" } },
      ],
    })
      .select("name role")
      .lean();

    res.json(users);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all professionals by their profession/role
export const getProfessionalsByRole = async (req, res) => {
  try {
    const { role } = req.params;

    console.log("Fetching professionals for role:", role);

    const professionals = await User.find({
      role: "professional",
      $or: [
        { professionalType: { $regex: new RegExp(`^${role}$`, "i") } },
        { profession: { $regex: new RegExp(`^${role}$`, "i") } },
        { jobTitle: { $regex: new RegExp(`^${role}$`, "i") } },
      ],
    }).select("-password");

    console.log(`Found ${professionals.length} professionals`);
    res.json(professionals);
  } catch (error) {
    console.error("Error in getProfessionalsByRole:", error);
    res.status(500).json({ message: error.message });
  }
};