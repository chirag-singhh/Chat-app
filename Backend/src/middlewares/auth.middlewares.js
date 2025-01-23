import { User } from "../models/users.models.js";
import jwt from 'jsonwebtoken'


export const protectRoute = async (req,res,next) => {
    try {
        // const token = req.cookie.jwt
        const token = req.cookies.jwt;
        if(!token) return  res.status(400).json({message:"User not loggedIn No token "})

        const decoded = jwt.verify(token,process.env.JWT_KEY)
        if(!decoded){
            return res.status(400).json({message:"unauthorized user"}
            )
        }
        const user = await User.findById(decoded.userId).select("-password")
        if(!user){
            return res.status(400).json({message:"user not exists"})
        }    

    req.user = user;
    next()       
    } catch (error) {
        console.log(error);
    }
}