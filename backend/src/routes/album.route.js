import { Router } from "express";
import { getAllAlbums, getAlbumById } from "../controller/album.controller.js";
const router = Router();

//no use of protectRoute here since even signed out users can still listen to music

router.get("/", getAllAlbums);
router.get("/:albumId", getAlbumById);

export default router;
