import {Server} from "socket.io"
import http from "http"
import express from "express"


const app = express();
const server = http.createServer(app)
const UserSocketMap = {}
export function getRecieverSockedID(userID){
    return UserSocketMap[userID]
} 

const io = new Server(server,{
    cors:{
        origin:["http://localhost:5173"]
    }
})
io.on("connection", (socket) => {
    console.log("A User is Connected", socket.id);
    // Emit a message to the client if needed
    socket.emit('connected', { message: 'You are connected' });
    const userId = socket.handshake.query.userId
    if(userId) UserSocketMap[userId]= socket.id
    io.emit("getOnlineUsers",Object.keys(UserSocketMap))

    socket.on("disconnect", () => {
        console.log("A user is disconnected", socket.id);
        delete UserSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(UserSocketMap))
    
    });
});


export {io,server,app}