import {User} from "../models/users.models.js"
import bycrypt from 'bcryptjs'
import { generateToken } from "../utils.js"
import cloudinary from "../lib/cloudinary.js"
export const signupUser = async (req,res)=>{
    // res.send("signup route")
    // console.log("Request Body:", req.body);
    const{ fullName,password,email} = req.body
    try {
        {
        if (!email) {
            throw new Error("Email required"); 
        }
        if (!fullName) {
            throw new Error("Fullname required"); 
        }
        if (!password) {
            throw new Error("password required"); 
        }
        if (password.length < 8) {
            return res.status(400).json({message:"password should be of atleast 8 character"}) 
        }
    }
    const user = await User.findOne({email})
    if(user) return res.status(400).json({message:"user already exists with this email"})
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password,salt)

    const newUser = new User({
        fullName:fullName,
        email:email,
        password:hashedPassword,
    })
    
    if(newUser)
     {
      generateToken(newUser._id,res)
      await newUser.save()
      res.status(200).json({
        _id: newUser._id,
        fullName:newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic   
      })
     }
     else{
        res.status(400).json({message:"user not created"})
     }

    } catch (error) {
        console.log("Error")
        res.status(400).json({message:"error"})
    }
}

export const loginUser = async (req,res)=>{
    // res.send("login route")
     const {email,password}=req.body
    try {
        const user = await User.findOne({email})
        if(!email) return res.status(400).json({message:"invalid credentials"})
        const ispasswordCorrect = await bycrypt.compare(password,user.password)
        if(!ispasswordCorrect) return  res.status(400).json({message:"password incorrect"})
        
        generateToken(user._id,res)
        res.status(200).json({
            _id: user._id,
            fullName:user.fullName,
            email: user.email,
            profilePic: user.profilePic   
          })

    } catch (error) {
        console.log("Error  "+error)
        res.status(400).json({message:"error"})
    }
}

export const logoutUser = (req,res)=>{
    // res.send("logout route")
    try {
        res.cookie("jwt","",{maxAge:0})
    res.status(200).json({message:"logged Out Succesfully"})
    } catch (error) {
    res.status(400).json({message:"error"})
    }
    
}

export const updateprofileUser = async (req,res)=> {
   
    try {
        const {profilePic} = req.body
        const userId = req.user._id;
        if(!profilePic){
            res.status(400).json({message:"No profile pic"})
        }
       const uploadResponse = await cloudinary.uploader.upload(profilePic)
       const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
       res.status(200).json(updatedUser)
    } catch (error) {
        res.status(400).json({message:"error"})
        console.log(error)
    }

}

export const checkAuth = (req,res)=>{
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in AuthController "+error.message)
        res.status(400).json({message:"Error "})

    }
}