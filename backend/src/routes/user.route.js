import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllUsers, getMessages } from "../controller/user.controller.js";
const router = Router();

// protectRoute: UnAutherized shouldnt see the users and also chat with users
router.get("/", protectRoute, getAllUsers);

// TODO: get Messages between two users
// router.get("messages/:userId", protectRoute, getMessages);

export default router;
