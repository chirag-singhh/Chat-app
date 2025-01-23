// import { useEffect, useState } from "react";
// import { useChatStore } from "../store/useChatStore";
// import { useAuthStore } from "../store/useAuthStore";
// import SidebarSkeleton from "./skeletons/SidebarSkeleton";
// import { Users } from "lucide-react";



// const Sidebar = () => {
//   const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
//   const { onlineUsers = [] } = useAuthStore();

//   useEffect(() => {
//     getUsers();
//   }, [getUsers]);

//   if (isUsersLoading) return <SidebarSkeleton />;

//   return (
//     <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
//       <div className="border-b border-base-300 w-full p-5">
//         <div className="flex items-center gap-2">
//           <Users className="size-6" />
//           <span className="font-medium hidden lg:block">Contacts</span>
//         </div>
//       </div>

//       <div className="overflow-y-auto w-full py-3">
//         {users.map((user) => (
//           <button
//             key={user._id}
//             onClick={() => setSelectedUser(user)}
//             className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
//               selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""
//             }`}
//           >
//             <div className="relative mx-auto lg:mx-0">
//               <img
//                 src={user.profilePic || "/avatar.png"}
//                 alt={user.name}
//                 className="size-12 object-cover rounded-full"
//               />
//               {onlineUsers.includes(user._id) && (
//                 <span
//                   className="absolute bottom-0 right-0 size-3 bg-green-500 
//                   rounded-full ring-2 ring-zinc-900"
//                 />
//               )}
//             </div>

//             <div className="hidden lg:block text-left min-w-0">
//               <div className="font-medium truncate">{user.fullName}</div>
//               <div className="text-sm text-zinc-400">
//                 {onlineUsers.includes(user._id) ? "Online" : "Offline"}
//               </div>
//             </div>
//           </button>
//         ))}

//         {users.length === 0 && (
//           <div className="text-center text-zinc-500 py-4">No users found</div>
//         )}
//       </div>
//     </aside>
//   );
// };
// export default Sidebar;
import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers = [], socket } = useAuthStore();

  const [unreadMessages, setUnreadMessages] = useState({});

  useEffect(() => {
    getUsers();

    if (socket) {
      // Listen for new messages
      socket.on("newMessage", (newMessage) => {
        setUnreadMessages((prev) => {
          const isFromSelectedUser = selectedUser?._id === newMessage.sendId;
          if (isFromSelectedUser) return prev; // No unread if the user is already selected

          return {
            ...prev,
            [newMessage.sendId]: (prev[newMessage.sendId] || 0) + 1,
          };
        });
      });
    }

    return () => {
      if (socket) {
        socket.off("newMessage");
      }
    };
  }, [getUsers, socket, selectedUser]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {users.map((user) => {
          const isUnread = unreadMessages[user._id] > 0;

          return (
            <button
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                // Mark messages as read when user is selected
                setUnreadMessages((prev) => ({
                  ...prev,
                  [user._id]: 0,
                }));
              }}
              className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""
              }`}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                    rounded-full ring-2 ring-zinc-900"
                  />
                )}
   

              </div>

              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>

              {/* New message badge */}
              {isUnread && (
                <span className="ml-auto bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {unreadMessages[user._id]}
                </span>
              )}
            </button>
          );
        })}

        {users.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No users found</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;











