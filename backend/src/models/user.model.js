import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    //so we can take userId from clerk and store it in mongo
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    //to add createdAt, updatedAt
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
