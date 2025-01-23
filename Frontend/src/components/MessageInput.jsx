import React from 'react'
import { useState,useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import {toast} from 'react-hot-toast'
import { X } from 'lucide-react'
function MessageInput() {
  const [text, settext] = useState("")
  const [imageprv, setimageprb] = useState(null)
  const [imageFile, setImageFile] = useState(null);
  const fileinputRef = useRef(null)
  const {sendMessage} = useChatStore()

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (!file.type.startsWith("image/")) {
  //     toast.error("Please select an image file");
  //     return;
  //   }
  //   // Set the image preview URL
  //   // setimageprb(URL.createObjectURL(file));
  //   const blobURL = URL.createObjectURL(file);
  //   setimageprb(blobURL);
  //   // Store the actual file to be sent to the server
  //   setImageFile(blobURL); // 
  // };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
  
    const reader = new FileReader();
    reader.onloadend = () => {
      setimageprb(reader.result); // Base64 string
      setImageFile(file); // Keep the file for future use if needed
    };
    reader.readAsDataURL(file); // Convert to base64
  };
  const removeImage = ()=>{ setimageprb(null);
    if (fileinputRef.current) fileinputRef.current.value = "";}
  
  // const handleSendMessage = async (e) => {
  //   e.preventDefault();
  //   if (!text.trim() && !imageprv) return;

  //   try {
  //     await sendMessage({
  //       text: text.trim(),
  //       image: imageprv,
  //     });

  //     // Clear form
  //     settext("");
  //     setimageprb(null);
  //     if (fileinputRef.current) fileinputRef.current.value = "";
  //   } catch (error) {
  //     console.error("Failed to send message:", error);
  // }}
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    // Check if text or image is provided
    if (!text.trim() && !imageprv) return;
  
    // Prepare the message data
    const messageData = {
      text: text.trim(),
      image: imageprv, // Ensure this is a valid image URL or base64 data
      // image: imageFile
    };
  
    try {
      // Send the message using the Zustand store's sendMessage
      await sendMessage(messageData);
  
      // Clear form inputs
      settext(""); // Ensure setText is defined
      setimageprb(null); // Ensure setImagePrv is defined
  
      if (fileinputRef.current) {
        fileinputRef.current.value = ""; // Reset file input
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };
  

  return (
    <div className="p-4 w-full">
    {imageprv && (
      <div className="mb-3 flex items-center gap-2">
        <div className="relative">
          <img
            src={imageprv}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
          />
          <button
            onClick={removeImage}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
            flex items-center justify-center"
            type="button"
          >
            <X className="size-3" />
          </button>
        </div>
      </div>
    )}

    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
      <div className="flex-1 flex gap-2">
        <input
          type="text"
          className="w-full input input-bordered rounded-lg input-sm sm:input-md"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => settext(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileinputRef}
          onChange={handleImageChange}
        />

        <button
          type="button"
          className={`hidden sm:flex btn btn-circle
                   ${imageprv ? "text-emerald-500" : "text-zinc-400"}`}
          onClick={() => fileinputRef.current?.click()}
        >
          {/* <Image size={20} /> */}
        </button>
      </div>
      <button
        type="submit"
        className="btn btn-sm btn-circle"
        disabled={!text.trim() && !imageprv}
      >
        {/* <Send size={22} /> */}
      </button>
    </form>
  </div>
  )
}

export default MessageInput