import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"
import {io} from "socket.io-client"

const BASE_URL= import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set,get)=>({
    authUser:null,
    isSigningUp: false,
    isloggingIn: false,
    isUpdatingProfile:false,
    socket:null,
    // onlineUsers:null,
    onlineUsers:[],
    


    isCheckingAuth : true,
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")
            set({authUser:res.data})
            get().connectSocket(); 

        
        } catch (error) {
            set({authUser:null})
            console.log("error")
        }finally{
            set({isCheckingAuth:false})
        }
    },

    signup: async (data) => {
        try {
            const res = await axiosInstance.post("/auth/signup",data)
            set({authUser:res.data})
            toast.success("Account Created SuccesFully")
        
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isSigningUp:false})
        }
    },

    logout: async () => {
    try {
        await axiosInstance.post("/auth/logout") 
        // localStorage.removeItem("authToken"); 
    set({authUser: null})
    toast.success("Logget Out Succesfully") 
    get().disconnectSocket()

    } catch (error) {
        toast.error("Error Cant LogOut ")
    }
    },

    login: async (data) => {
        set({isloggingIn: true})
        try {
           const res = await axiosInstance.post("/auth/login",data) 
            // localStorage.removeItem("authToken"); 
        set({authUser: res.data})
        toast.success("Logget in Succesfully") 
        get().connectSocket()
        } catch (error) {
            toast.error(" Invalid Credentials ")
            console.log(error)
        }
        },

        updateProfile: async (data) => {
            set({ isUpdatingProfile: true }); // Set loading state
            try {
                const res = await axiosInstance.put("/auth/update-profile", data); // Send profile data
                set({ authUser: res.data }); // Update authUser with the new data
                toast.success("Profile updated successfully");
            } catch (error) {
                console.error("Update Profile Error:", error);
                const errorMessage = error.response?.data?.message || "Failed to update profile";
                toast.error(errorMessage);
            } finally {
                set({ isUpdatingProfile: false }); // Reset loading state
            }
        },

        // connectSocket: ()=>{
        //     const { authUser,socket } = get();
        //     if (!authUser || get().socket?.connected) return;
        //     const newSocket = io(BASE_URL,{
        //         query:{
        //             userId: authUser._id,
        //         }
        //     })
        //     newSocket.on('connect', () => {
        //         console.log('Connected to socket server', newSocket.id);
        //         set({ socket: newSocket }); // Store the socket instance in the Zustand store

        //     });
        //     newSocket.connect()
        //     set({socket:newSocket})
        //     newSocket.on("getOnlineUsers",(userIDs)=>{
        //         set({onlineUsers:userIDs})
        //     })
        // },
        connectSocket: () => {
            const { authUser } = get();
            if (!authUser || get().socket?.connected) return;
        
            const socket = io(BASE_URL, {
              query: {
                userId: authUser._id,
              },
            });
            socket.connect();
        
            set({ socket: socket });
        
            socket.on("getOnlineUsers", (userIds) => {
              set({ onlineUsers: userIds });
            });
        },
        disconnectSocket: () => {
            const socket = get().socket;
            if (socket?.connected) {
                socket.disconnect();
                set({ socket: null }); // Set socket to null after disconnecting
                console.log("Socket disconnected");
            }
        },
        
}))
