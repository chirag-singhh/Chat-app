import mongoose from "mongoose"
const messageSchema = new mongoose.Schema({
    sendId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
      
    },
    recieverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
       
    },
    text:{
        type: String,
    },
    message:{
        type: String,
    },
    image: {
        type: String,
      },
},{timestamps:true})

export const Message = mongoose.model("Message",messageSchema)