
import {create} from "zustand"
import toast from "react-hot-toast"
import { axiosInstance } from "../lib/axios"
import { useAuthStore } from "./useAuthStore";


export const useChatStore = create((set,get) => ({
  messages: [],
  users: [],
  selectedUser: null, // Renamed from selectedUsers
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    if (!userId) {
      console.error("User ID is not defined. Cannot fetch messages.");
      return;
    }
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message);
      
    }
  },
  subscribeToMessages: () => {
    
    const { selectedUser } = get();
    if (!selectedUser) return;
  
    const socket = useAuthStore.getState().socket;
    // console.log("Socket is not connected.");
    if (!socket || !socket.connected) {
      // console.log("Socket is not connected.");
      return;
    }

    socket.on("newMessage", (newMessage) => {
      // console.log("Received newMessage event:", newMessage);
      const isMessageSentFromSelectedUser = newMessage.sendId === selectedUser._id;
      // console.log("hiiiiii  "+isMessageSentFromSelectedUser)
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },
  
  
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
  setSelectedUser: (selectedUser) => set({ selectedUser }), // Renamed parameter
  // setSelectedUser: (selectedUser) => {
  //   localStorage.setItem("selectedUser", JSON.stringify(selectedUser));
  //   set({ selectedUser });}
}));





















// import {create} from "zustand"
// import toast from "react-hot-toast"
// import { axiosInstance } from "../lib/axios"

// export const useChatStore = create((set)=>({
// messages:[],
// users:[],
// selectedUsers:null,
// isUsersLoading:false,
// isMessagesLoading:false,


// getUsers: async () => {
//     set({ isUsersLoading: true });
//     try {
//       const res = await axiosInstance.get("/message/users");
//       set({ users: res.data });
//     } catch (error) {
//       toast.error(error.response.data.message);
//     } finally {
//       set({ isUsersLoading: false });
//     }
//   },

//   getMessages: async (userId) => {
//     set({ isMessagesLoading: true });
//     try {
//       const res = await axiosInstance.get(`/messages/${userId}`);
//       set({ messages: res.data });
//     } catch (error) {
//       toast.error(error.response.data.message);
//     } finally {
//       set({ isMessagesLoading: false });
//     }
//   },
//   setSelectedUser: (selectedUsers) => set({ selectedUsers }),
// }))
