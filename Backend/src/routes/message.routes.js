import express from "express"
import { protectRoute } from "../middlewares/auth.middlewares.js";
import { getUsers,getMessage,sendMessage } from "../controllers/message.controller.js";



const router = express.Router();



router.route("/users").get(protectRoute,getUsers)
router.route("/:id").get(protectRoute,getMessage)
router.route("/send/:id").post(protectRoute,sendMessage)





export default router;
