import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllUsers } from "../controller/user.controller.js";
const router = Router();

// protectRoute: UnAutherized shouldnt see the users and also chat with users
router.get("/", getAllUsers);

// TODO: get Messages between two users
export default router;
