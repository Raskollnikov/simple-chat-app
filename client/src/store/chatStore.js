import { create } from "zustand";
import axios from "axios";

const CHAT_API_URL = "http://localhost:3000/api/chat";

axios.defaults.withCredentials = true;

const useChatStore = create((set) => ({
  chats: [],
  activeChat: null,
  room: null,
  name: '',
  senderId: '',
  messageList: [],
  showChat: false,
  
  fetchChats: async () => {
    try {
      const { data } = await axios.get(`${CHAT_API_URL}`);
      set({ chats: data });
    } catch (err) {
      console.error('failed to fetch chats:', err);
    }
  },
  setActiveChat: (chatId) => set({ activeChat: chatId }),
  setRoom: (room) => set({ room }),
  setName: (name) => set({ name }),
  setSenderId: (id) => set({ senderId: id }),
  setMessageList: (value) =>
  set((state) => ({
    messageList: typeof value === 'function' ? value(state.messageList) : value,
  })),
  setShowChat: (visible) => set({ showChat: visible }),
}));
export default useChatStore;