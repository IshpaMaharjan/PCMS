import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["user", "professional"],
      required: true,
    },

    professionalType: {
      type: String,
      enum: [
        "Teacher",
        "Developer",
        "Carpenter",
        "Plumber",
        "Electrician",
        "Designer",
      ],
      required: function () {
        return this.role === "professional";
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
