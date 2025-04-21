import { User } from "../models/user.model.js";
export const getAllUsers = async (req, res, next) => {
  try {
    //find all users but not myself so we use this method

    const currentUserId = req.auth.userId;
    const users = await User.find({
      // $ne = not_equal
      clerkId: { $ne: currentUserId },
    });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
