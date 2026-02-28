import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender is required"],
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver is required"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true }
);

connectionSchema.index({ sender: 1, receiver: 1 }, { unique: true });

connectionSchema.pre("save", function (next) {
  if (this.sender.equals(this.receiver)) {
    return next(new Error("Cannot connect with yourself"));
  }
  next();
});

const Connection = mongoose.model("Connection", connectionSchema);

export default Connection;