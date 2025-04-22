import Topbar from "@/components/Topbar";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import UsersList from "./components/UsersList";
import ChatHeader from "./components/ChatHeader";

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
