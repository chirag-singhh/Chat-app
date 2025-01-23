// import {v2 as cloudinary} from "cloudinary"
// import fs from "fs"

// cloudinary.config({ 
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//     api_key: process.env.CLOUDINARY_API_KEY, 
//     api_secret: process.env.CLOUDINARY_API_SECRET 
// });

// const uploadCloudinary = async (LocalFilepath) => {
//     try {
//         if(!LocalFilepath) return null;
//         const responce = await cloudinary.uploader.upload(LocalFilepath,{resource_type:"auto"})
//         console.log("FILE IS UPLOADED"),
//         responce.url;
//         fs.unlinkSync(LocalFilepath)
//         return responce;
//     } catch (error) {
//         fs.unlinkSync(LocalFilepath)
//         return null
//     }

// }

// export { uploadCloudinary}
import { v2 as cloudinary } from "cloudinary";

import { config } from "dotenv";

config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});
export  default cloudinary;