import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { User } from "../models/user.model.js";

export const getStats = async (req, res, next) => {
  try {
    //to count number of songs
    // const totalSongs = await Song.countDocuments();
    // const totalAlbums = await Album.countDocuments();
    // const totalUsers = await User.countDocuments();

    const [totalSongs, totalAlbums, totalUsers, uniqueArtists] =
      await Promise.all([
        Song.countDocuments(),
        Album.countDocuments(),
        User.countDocuments(),
        Song.aggregate([
          //fetch all songs and albums then union Songs with albums
          {
            $unionWith: {
              coll: "albums",
              pipeline: [],
            },
          },
          //then group them with artist
          {
            $group: {
              _id: "$artist",
            },
          },
          //finally count them
          {
            $count: "count",
          },
        ]),
      ]);

    res.status(200).json({
      totalSongs,
      totalAlbums,
      totalUsers,
      totalArtists: uniqueArtists[0]?.count || 0,
    });
  } catch (error) {
    next(error);
  }
};
