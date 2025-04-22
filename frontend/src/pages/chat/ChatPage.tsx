import Topbar from "@/components/Topbar";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import UsersList from "./components/UsersList";
import ChatHeader from "./components/ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarImage } from "@/components/ui/avatar";

const ChatPage = () => {
  const { user } = useUser();
  const { messages, selectedUser, fetchUsers, fetchMessages } = useChatStore();

  // fetch users if user authenticated
  useEffect(() => {
    if (user) fetchUsers();
  }, [fetchUsers, user]);

  // fetch messages if a user is selected
  useEffect(() => {
    if (selectedUser) fetchMessages(selectedUser.clerkId); //or ._id
  }, [selectedUser, fetchMessages]);
  return (
    <main className="h-full rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden">
      <Topbar />

      {/* Grid Layout div */}
      <div className=" grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-180px)]">
        {/* Left Side usersList */}
        <UsersList />

        {/* Right Side Chat: Chat Messages container */}

        <div className="flex flex-col h-full">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <ChatHeader />

              {/* Chat Container: Messages we will use ScrollArea component */}
              <ScrollArea className="h-[calc(100vh-340px)]">
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex items-start gap-3 ${
                        message.senderId === user?.id ? "flex-row-reverse" : ""
                      } `}
                    >
                      <Avatar className="size-8">
                        <AvatarImage
                          src={
                            message.senderId === user?.id
                              ? user.imageUrl
                              : selectedUser?.imageUrl
                          }
                        />
                      </Avatar>

                      {/* Message content and createdAt */}

                      <div
                        className={` rounded-lg p-3 max-w-[70%] ${
                          message.senderId === user?.id
                            ? "bg-green-500"
                            : "bg-zinc-800"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs text-zinc-300 mt-1 block">
                          {message.createdAt.split("T")[0]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Chat Input */}
            </>
          ) : (
            <NoConversationPlaceholder />
          )}
        </div>
      </div>
    </main>
  );
};

export default ChatPage;

const NoConversationPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full space-y-6">
    <img src="/spotify.png" alt="Spotify" className="size-16 animate-bounce" />
    <div className="text-center">
      <h3 className="text-zinc-300 text-lg font-medium mb-1">
        No conversation selected
      </h3>
      <p className="text-zinc-500 text-sm">Choose a friend to start chatting</p>
    </div>
  </div>
);
