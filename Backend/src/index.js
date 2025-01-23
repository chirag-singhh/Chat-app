import express from "express"
import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import dotenv from "dotenv"
import connectDB from "./db/db.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path";
import {app,io,server} from "./lib/socket.js"

// const app = express();
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
}));

app.use(bodyParser.json({ limit: "10mb" })); // Adjust limit as needed
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser())

dotenv.config()
const Port = process.env.PORT
const __dirname = path.resolve();
app.use("/auth",authRoutes)
app.use("/message",messageRoutes)
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));


  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
  }

connectDB()





server.listen(Port,()=>{
    console.log("Server is running on "+Port)
})  