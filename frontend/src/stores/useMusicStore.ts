import { axiosInstance } from "@/lib/axios";
import { Album, Song, Stats } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

//to handle suggestions only
interface MusicStore {
  songs: Song[];
  albums: Album[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: Album | null;
  featuredSongs: Song[];
  madeForYouSongs: Song[];
  trendingSongs: Song[];
  stats: Stats;

  fetchAlbums: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchSongs: () => Promise<void>;

  deleteSong: (id: string) => Promise<void>;
  deleteAlbum: (id: string) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
  albums: [],
  songs: [],
  isLoading: false,
  error: null,
  currentAlbum: null,

  featuredSongs: [],
  madeForYouSongs: [],
  trendingSongs: [],
  stats: { totalSongs: 0, totalAlbums: 0, totalUsers: 0, totalArtists: 0 },

  fetchAlbums: async () => {
    //data fetching logic...
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/albums");
      set({ albums: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbumById: async (id) => {
    //data fetching logic...
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/albums/${id}`);

      set({ currentAlbum: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFeaturedSongs: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.get("/songs/featured");

      set({ featuredSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchMadeForYouSongs: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.get("/songs/made-for-you");

      set({ madeForYouSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchTrendingSongs: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.get("/songs/trending");

      set({ trendingSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSongs: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.get("/songs");

      set({ songs: response.data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/stats");
      set({ stats: response.data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSong: async (id) => {
    set({ isLoading: true, error: null });

    try {
      await axiosInstance.delete(`/admin/songs/${id}`);

      //remove the song from the state by using filter
      set((state) => ({
        songs: state.songs.filter((song) => song._id !== id),
      }));

      toast.success("Song deleted successfully");
    } catch (error: any) {
      toast.error("Error deleting the song", error);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAlbum: async (id) => {
    set({ isLoading: true, error: null });

    try {
      await axiosInstance.delete(`/admin/albums/${id}`);

      //remove the song from the state by using filter
      set((state) => ({
        albums: state.albums.filter((album) => album._id !== id),
        //delete album songs too
        songs: state.songs.map((song) =>
          song.albumId === state.albums.find((album) => album._id === id)?.title
            ? { ...song, albumId: null }
            : song
        ),
      }));

      toast.success("Album deleted successfully");
    } catch (error: any) {
      toast.error("Error deleting the album", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
