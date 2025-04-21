import { clerkClient } from "@clerk/express";

//to check if user is authenticated or not so he can do stuffs (like,comment..)
export const protectRoute = async (req, res, next) => {
  console.log("req.auth", req.auth);
  if (!req.auth.userId) {
    res.status(401).json({ message: "Unauthorized - you must be logged in" });
    return;
  }
  // if authenticated
  next();
};

//to check if user is admin or not
export const requireAdmin = async (req, res, next) => {
  try {
    const currentUser = await clerkClient.users.getUser(req.auth.userId);

    const isAdmin =
      process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress.emailAddress;

    if (!isAdmin) {
      res.status(403).json({ message: "Unauthorized - you must be an admin" });
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
};
