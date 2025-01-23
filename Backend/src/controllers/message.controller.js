import { User } from "../models/users.models.js"
import { Message } from "../models/message.models.js"
import cloudinary from "../lib/cloudinary.js"
import { getRecieverSockedID,io } from "../lib/socket.js"



export const getUsers = async(req,res)=>{
     try {
        const loggedInUser = req.user._id
        const filterUser = await User.find({_id: {$ne:loggedInUser}}).select("-pasword")
        res.status(200).json(filterUser)    
    
    } catch (error) {
        res.status(400).json({message:"error in fetching user"})    
        console.log("Error is "+error)
     }
}

export const getMessage = async(req,res)=>{
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;
    
        const messages = await Message.find({
          $or: [
            // { senderId: myId, receiverId: userToChatId },
            // { senderId: userToChatId, receiverId: myId },
           { sendId: myId, recieverId: userToChatId },
            { sendId: userToChatId, recieverId: myId },
          
          ],
        });
    
        res.status(200).json(messages);
      } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
      }
}

export const sendMessage = async (req,res) => {
    try {
        // const {text,message}= req.body;
        const {text}= req.body;
        const {image}= req.body;

        const{id: recieverId} = req.params
        const sendId = req.user._id;

        console.log("Text:", text);
        console.log("Image:", image);

       
        let imageUrl;
        if (image) {
          // If image is a base64 string, upload it to Cloudinary
          const uploadResponse = await cloudinary.uploader.upload(image, {
            resource_type: "auto",  // Automatically detect file type (image/video)
          });
          imageUrl = uploadResponse.secure_url;  // Get the uploaded image URL
        }
    
        const newMessage = new Message({
            sendId,
            recieverId,
            text,
            image:imageUrl,
        })
     await newMessage.save();
  //  return  res.status(200).json(newMessage)


 const recieverSocketId = getRecieverSockedID(recieverId)
//  console.log("Receiver Socket ID:", recieverSocketId);
 if(recieverSocketId){
  io.to(recieverSocketId).emit("newMessage",newMessage)
  // console.log(newMessage)
}
return  res.status(200).json(newMessage)


    } catch (error) {
        res.status(400).json({message:"error in message"})    
        console.log("Error is "+error.message)
    }
}



































// export const sendMessage = async (req, res) => {
//   try {
//     const { text, image } = req.body;
//     const { id: recieverId } = req.params;
//     const sendId = req.user._id;

//     // Debugging logs to check if receiverId and senderId are correct
//     console.log("Receiver ID:", recieverId);
//     console.log("Sender ID:", sendId);

//     // Validate that text is not empty
//     if (!text.trim()) {
//       return res.status(400).json({ message: "Message text is required" });
//     }

//     let imageurl = null;
//     if (image) {
//       // If image is provided, upload it to Cloudinary
//       try {
//         const uploadResponse = await cloudinary.uploader.upload(image);
//         imageurl = uploadResponse.secure_url;
//         console.log("Image uploaded successfully:", imageurl);
//       } catch (uploadError) {
//         console.error("Error uploading image to Cloudinary:", uploadError.message);
//         return res.status(500).json({ message: "Error uploading image" });
//       }
//     }

//     // Ensure receiverId and senderId are provided
//     if (!recieverId || !sendId) {
//       return res.status(400).json({ message: "Receiver and sender IDs are required" });
//     }

//     const newMessage = new Message({
//       sendId,
//       recieverId,
//       text,
//       image: imageurl,
//     });

//     await newMessage.save();
//     res.status(200).json(newMessage);

//   } catch (error) {
//     console.error("Error in sendMessage controller:", error.message);
//     res.status(500).json({ message: "Error in sending message" });
//   }
// };
