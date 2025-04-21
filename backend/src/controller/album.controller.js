import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";

export const getAllAlbums = async (req, res, next) => {
  try {
    //fetch all albums
    const albums = await Album.find();

    res.status(200).json(albums);
  } catch (error) {
    next(error);
  }
};
export const getAlbumById = async (req, res, next) => {
  try {
    const { albumId } = req.params;

    // when fetching a single album fetch the songs of that album too
    // using populate cause only songsId exist in albums so that it will got to songs tabel and fetch them from there
    const album = await Album.findById(albumId).populate("songs");

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }
    res.status(200).json(album);
  } catch (error) {
    next(error);
  }
};
