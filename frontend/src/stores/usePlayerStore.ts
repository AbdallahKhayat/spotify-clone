import { create } from "zustand";
import { Song } from "@/types";
import { useChatStore } from "./useChatStore";

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;

  initializeQueue: (songs: Song[]) => void; //initialize the queue with a new array of songs
  playAlbum: (songs: Song[], startIndex?: number) => void; //play an album from a specific index
  setCurrentSong: (song: Song | null) => void; //set the current song
  togglePlay: () => void; //start or pause the current song
  playNext: () => void; //play the next song in the queue
  playPrevious: () => void; //play the previous song in the queue
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,

  initializeQueue: (songs: Song[]) => {
    set({
      queue: songs,
      currentSong: get().currentSong || songs[0],
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
    });
  },
  playAlbum: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return; //if the array is empty, do nothing

    const song = songs[startIndex]; //get the song at the start index

    const socket = useChatStore.getState().socket; //get the socket from the chat store

    // when we play our album update the socket
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }

    set({
      queue: songs,
      currentSong: song, //set the current song to the song at the start index
      currentIndex: startIndex,
      isPlaying: true, //set the isPlaying state to true
    });
  },
  setCurrentSong: (song: Song | null) => {
    if (!song) return; //if the song is null, do nothing

    const socket = useChatStore.getState().socket; //get the socket from the chat store

    // when we play our album update the socket
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }

    const songIndex = get().queue.findIndex((s) => s._id === song._id); //find the index of the song in the queue

    set({
      currentSong: song, //set the current song to the song passed in
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
      isPlaying: true,
    });
  },
  togglePlay: () => {
    const willStartPlaying = !get().isPlaying;

    const currentSong = get().currentSong;
    const socket = useChatStore.getState().socket; //get the socket from the chat store
    // when we play our album update the socket
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity:
          willStartPlaying && currentSong
            ? `Playing ${currentSong.title} by ${currentSong.artist}`
            : "Idle",
      });
    }

    set({ isPlaying: willStartPlaying }); //negate the state of isPlaying
  },
  playNext: () => {
    const { queue, currentIndex } = get(); //get the queue and current index from the state

    const nextIndex = currentIndex + 1;

    //if there is a next song to play, lets play it
    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex]; //get the next song in the queue

      const socket = useChatStore.getState().socket;

      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
        });
      }
      set({
        currentSong: nextSong, //set the current song to the next song
        currentIndex: nextIndex, //set the current index to the next index
        isPlaying: true,
      });
    } else {
      // no next song
      set({ isPlaying: false });

      const socket = useChatStore.getState().socket;

      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: "Idle",
        });
      }
    }
  },
  playPrevious: () => {
    const { queue, currentIndex } = get(); //get the queue and current index from the state

    const prevIndex = currentIndex - 1;

    //if there is a previous song to play, lets play it
    if (prevIndex >= 0) {
      const prevSong = queue[prevIndex];

      const socket = useChatStore.getState().socket;

      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
        });
      }

      set({
        currentSong: prevSong,
        currentIndex: prevIndex,
        isPlaying: true,
      });
    } else {
      // no prev song
      set({ isPlaying: false });

      const socket = useChatStore.getState().socket;

      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: "Idle",
        });
      }
    }
  },
}));
