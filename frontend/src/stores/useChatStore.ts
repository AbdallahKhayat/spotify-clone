// stores/useChatStore.ts
import { axiosInstance } from "@/lib/axios";
import { Message } from "@/types";
import { create } from "zustand";
import { io } from "socket.io-client";
interface ChatStore {
  users: any[];
  isLoading: boolean;
  error: string | null;
  socket: any;
  isConnected: boolean;
  onlineUsers: Set<string>;
  userActivities: Map<string, string>;
  messages: Message[];

  fetchUsers: () => Promise<void>;

  initSocket: (userId: string) => void; // to know which user is connecting
  disconnectSocket: () => void; // to let us become offline like closing browser
  sendMessage: (receiverId: string, senderId: string, content: string) => void; // to send messages
}

//connect to the Socket server that we created
const baseUrl = "http://localhost:5000";

const socket = io(baseUrl, {
  autoConnect: false, // we dont want to connect automatically , only connect if user is authenticated
  withCredentials: true, // enable send cookies and authentication headers
});

export const useChatStore = create<ChatStore>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,

  socket: null,
  isConnected: false,
  onlineUsers: new Set(),
  userActivities: new Map(),
  messages: [],

  fetchUsers: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await axiosInstance.get("/users");
      set({ users: response.data });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch users",
        users: [],
      });
    } finally {
      set({ isLoading: false });
    }
  },

  initSocket: (userId: string) => {
    if (!get().isConnected) {
      socket.auth = { userId }; // current authenticated userId
      socket.connect();

      //send an event that the user is connected
      socket.emit("user_connected", userId);

      // update onlineUsers set when a user comes online
      socket.on("user_online", (users: string[]) => {
        set({ onlineUsers: new Set(users) });
      });

      //update userActivities map when a user activity changes
      socket.on("user_activity", (activities: [string, string][]) => {
        set({ userActivities: new Map(activities) });
      });

      //update online users state
      socket.on("user_connected", (userId: string) => {
        set((state) => ({
          onlineUsers: new Set([...state.onlineUsers, userId]),
        }));
      });

      //update online users state when user disconnects
      socket.on("user_disconnected", (userId: string) => {
        set((state) => {
          const newOnlineUsers = new Set(state.onlineUsers);
          newOnlineUsers.delete(userId);
          return { onlineUsers: newOnlineUsers };
        });
      });

      // handle incoming messages
      socket.on("receive_message", (message: Message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      });

      // handle sent messages
      socket.on("message_sent", (message: Message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      });

      // listen for activity updated event
      socket.on("activity_updated", ({ userId, activity }) => {
        set((state) => {
          const newActivities = new Map(state.userActivities);
          newActivities.set(userId, activity);
          return { userActivities: newActivities };
        });
      });

      // because user just connected
      set({ isConnected: true });
    }
  },

  disconnectSocket: () => {
    if (get().isConnected) {
      socket.disconnect();
      set({ isConnected: false });
    }
  },
  sendMessage: (receiverId: string, senderId: string, content: string) => {},
}));
