import express from "express"
import { signupUser,loginUser,logoutUser,updateprofileUser, checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middlewares.js";

const router = express.Router();
//Method1
// router.post("/signup", (req,res)=>{
//     res.send("signup route")
// })

//Method2
router.route("/signup").post(signupUser)
router.route("/login").post(loginUser)
router.route("/logout").post(logoutUser)
router.route("/update-profile").put(protectRoute,updateprofileUser)
router.route("/check").get(protectRoute,checkAuth)



export default router;