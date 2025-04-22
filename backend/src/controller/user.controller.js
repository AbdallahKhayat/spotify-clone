import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
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

export const getMessages = async (req, res, next) => {
  try {
    const myId = req.auth.userId;
    const { userId } = req.params; // other user id

    //find all messages based on these two options from $or
    const messages = await Message.find({
      // two options either other user is sender and im receiever or im sender and other user is receiver
      $or: [
        {
          senderId: userId,
          receiverId: myId,
        },
        {
          senderId: myId,
          receiverId: userId,
        },
      ],
    }).sort({ createdAt: 1 }); // so that the latest message is at the bottom

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
