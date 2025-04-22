import Topbar from "@/components/Topbar";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import UsersList from "./components/UsersList";

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

        {/* Right Side Chat */}
      </div>
    </main>
  );
};

export default ChatPage;
