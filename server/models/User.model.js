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

  // Profile fields
  phone: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  skills: [{
    type: String,
  }],
  experience: {
    type: Number,
    default: 0,
  },
  qualification: {
    type: String,
    default: "",
  },
  expertise: {
    type: String,
    default: "",
  },
  hourlyRate: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
