import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";

//helper function for cloudinary uploads
const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });

    return result.secure_url;
  } catch (error) {
    console.log("Error in uploadToCloudinary", error);
    throw new Error("Error uploadimg to cloudinary");
  }
};

export const createSong = async (req, res, next) => {
  try {
    //if audio file and image file arent provided
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: "Please upload all files" });
    }

    const { title, artist, albumId, duration } = req.body;

    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    // save audio and image to cloudinary before creating songs
    //grab the urls from return result
    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const song = new Song({
      title,
      artist,
      imageUrl,
      audioUrl,
      duration,
      albumId: albumId || null,
    });

    await song.save();

    // if song belongs to an album, update the album's songs array
    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: {
          songs: song._id,
        },
      });
    }

    res.status(201).json(song);
  } catch (error) {
    console.log("Error in createSong", error);
    // res.status(500).json({ message: "Internal server error", error });
    next(error);
  }
};

// ex: api/admin/songs/123 delete it
export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;

    const song = await Song.findById(id);

    // if song belongs to an album, update the album's songs array
    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        // pull the song from the album (delete)
        $pull: {
          songs: song._id,
        },
      });
    }

    await Song.findByIdAndDelete(song);

    res.status(200).json({ message: "Song deleted Successfully" });
  } catch (error) {
    console.log("Error in deleteSong", error);
    next(error);
  }
};

export const createAlbum = async (req, res, next) => {
  try {
    const { title, artist, releaseYear } = req.body;

    const { imageFile } = req.files;

    const imageUrl = await uploadToCloudinary(imageFile);

    const album = new Album({
      title,
      artist,
      imageUrl,
      releaseYear,
    });

    await album.save();
    res.status(201).json(album);
  } catch (error) {
    console.log("Error in createAlbum", error);
    next(error);
  }
};

// ex: api/admin/albums/123 delete it
export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;

    //first delete the songs of the album then delete album
    await Song.deleteMany({ albumId: id });
    await Album.findByIdAndDelete(id);

    res.status(200).json({ message: "Album deleted Successfully" });
  } catch (error) {
    console.log("Error in deleteAlbum", error);
    next(error);
  }
};

// basically depends on requireAdmin from admin.route
export const checkAdmin = async (req, res, next) => {
  res.status(200).json({ admin: true });
};
