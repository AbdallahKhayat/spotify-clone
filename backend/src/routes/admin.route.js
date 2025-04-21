import { Router } from "express";
import {
  createSong,
  deleteSong,
  createAlbum,
  deleteAlbum,
  checkAdmin,
} from "../controller/admin.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// protectRoute to check if user is logged in , getAdmin to check if user is admin
router.use(protectRoute, requireAdmin);

// check wether the user is admin or not but when entering the app for admin dashboard button
// send true if requireAdmin is true
router.get("/check", checkAdmin);

router.post("/songs", createSong);
router.delete("/songs/:id", deleteSong);

router.post("/albums", createAlbum);
router.delete("/albums/:id", deleteAlbum);

export default router;

// router.post("/songs", protectRoute, requireAdmin, createSong);
