import { create } from "zustand";
import axios from "axios";
const FRIEND_API_URL = "http://localhost:3000/api/friend";


axios.defaults.withCredentials = true;

export const useFriendStore = create((set) => ({
  friends: [],
  friendRequests: [],
  searchResults: [],
  isLoading: false,
  error: null,

  fetchFriends: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${FRIEND_API_URL}/`, { withCredentials: true });
      set({ friends: res.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Error fetching friends", 
        isLoading: false 
      });
    }
  },

  fetchFriendRequests: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${FRIEND_API_URL}/friend-requests`, { withCredentials: true });
      set({ friendRequests: res.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Error fetching friend requests", 
        isLoading: false 
      });
    }
  },
  acceptFriendRequest: async (fromId) => {
    await axios.post(`${FRIEND_API_URL}/accept/${fromId}`, {}, { withCredentials: true });

    set((state) => {
      const acceptedUser = state.friendRequests.find(req => req.from._id === fromId)?.from;
      return {
        friendRequests: state.friendRequests.filter(req => req.from._id !== fromId),
        friends: acceptedUser ? [...state.friends, acceptedUser] : state.friends
      };
    });
  },
  declineFriendRequest: async (fromId) => {
  await axios.post(`${FRIEND_API_URL}/decline/${fromId}`, {}, { withCredentials: true });

    set((state) => ({
      friendRequests: state.friendRequests.filter(req => req.from._id !== fromId)
    }));
  },

  searchUsers: async (query) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${FRIEND_API_URL}/search?q=${query}`, { withCredentials: true });
      set({ searchResults: res.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Error searching users", 
        isLoading: false 
      });
    }
  },

  sendFriendRequest: async (toId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${FRIEND_API_URL}/request/${toId}`, {}, { withCredentials: true });
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Error sending friend request", 
        isLoading: false 
      });
    }
  },
  removeFriend: async (friendId) => {
    set({ isLoading: true, error: null });
    try {
        await axios.delete(`${FRIEND_API_URL}/${friendId}`, { withCredentials: true });
        set((state) => ({
        friends: state.friends.filter((friend) => friend._id !== friendId),
        isLoading: false
        }));
    } catch (error) {
        set({
        error: error.response?.data?.message || "Error removing friend",
        isLoading: false,
        });
    }
    },
    reset: () => set({ 
    friends: [], 
    searchResults: [], 
    friendRequests: [] 
  })
}));
