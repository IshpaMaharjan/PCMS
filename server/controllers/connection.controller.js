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
    console.log("1");
    // Check if receiver exists
    const receiverExists = await User.findById(receiverId);
    console.log("2");
    if (!receiverExists) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("3");
    // Prevent duplicate in both directions
    const existing = await Connection.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    });
    console.log("4");
    if (existing) {
      return res.status(400).json({ message: "Request already exists" });
    }
    console.log("5");
    const connection = await Connection.create({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });
    console.log("6");
    // Populate sender & receiver for frontend UI
    await connection.populate([
      { path: "sender", select: "name role" },
      { path: "receiver", select: "name role" }
    ]);

    console.log("7");
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

    if (connection.receiver.toString() !== req.user._id.toString) {
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
    const userId = req.user._id;

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
    const currentUserId = req.user._id; // from auth middleware

    if (!keyword.trim()) {
      return res.json([]);
    }

    const users = await User.find({
      _id: { $ne: currentUserId }, // exclude self
      $or: [
        { name: { $regex: keyword, $options: "i" } }, // search by name
        { role: { $regex: keyword, $options: "i" } },  // search by role
        { professionalType: { $regex: keyword, $options: "i" } }, // search by profession type
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

// Get all professionals by their profession/role
export const getProfessionalsByRole = async (req, res) => {
  try {
    const { role } = req.params;

    console.log("Fetching professionals for role:", role);

    const professionals = await User.find({
      role: "professional", // Users with role="professional"
      $or: [
        { professionalType: { $regex: new RegExp(`^${role}$`, 'i') } }, // Case-insensitive match
        { profession: { $regex: new RegExp(`^${role}$`, 'i') } },
        { jobTitle: { $regex: new RegExp(`^${role}$`, 'i') } }
      ]
    }).select("-password"); // Exclude password

    console.log(`Found ${professionals.length} professionals`);
    res.json(professionals);
  } catch (error) {
    console.error("Error in getProfessionalsByRole:", error);
    res.status(500).json({ message: error.message });
  }
};
