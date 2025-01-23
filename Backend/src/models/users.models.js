import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName:{
        type: String,
        required: true,
        index: true,
        trim: true,
    },
    password:{
        type: String,
        required: true,
        minlength: 8,
    },
    profilePic:{
        type: String,
        default: "",
    },
},{timestamps:true})

export const User = mongoose.model("User",userSchema)