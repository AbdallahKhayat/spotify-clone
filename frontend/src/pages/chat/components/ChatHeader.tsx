import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/stores/useChatStore";
import { AvatarFallback } from "@radix-ui/react-avatar";

const ChatHeader = () => {
  const { selectedUser, onlineUsers } = useChatStore();

  return (
    <div className="border-b border-zinc-800 p-4 ">
      {/* Avatar */}
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={selectedUser?.imageUrl} />
          <AvatarFallback>{selectedUser?.fullName[0]}</AvatarFallback>
        </Avatar>

        <div>
          <h2 className="font-medium">{selectedUser?.fullName}</h2>
          {onlineUsers.has(selectedUser!.clerkId) ? (
            <p className="text-xs text-zinc-400">Online</p>
          ) : (
            <p className="text-xs text-zinc-400">Offline</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
