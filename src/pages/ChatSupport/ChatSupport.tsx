import { Box, Stack } from "@mui/material";
import ChatList, { type AdminUser } from "./components/ChatList";
import ChatBox from "./components/ChatBox";
import ChatBoxAdmin from "./components/ChatBoxAdmin";
import socket from "../../socket/socket";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const ChatSupportView = () => {
  const { user, role } = useAuth(); // role = "0" for superadmin, "1" for admin
  const [userId] = useState(user?.id || ""); // fallback
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  if (role === "0") {
    return (
      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        height="88vh"
        overflow="hidden"
      >
        <Stack direction="row" width="100%" height="100%">
          <ChatList
            userId={userId}
            setSelectedUser={setSelectedUser}
            socket={socket}
          />
          <ChatBox
            userId={userId}
            selectedUser={selectedUser}
            socket={socket}
          />
        </Stack>
      </Box>
    );
  }

  if (role === "1") {
    return (
      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        height="88vh"
        overflow="hidden"
      >
        <Stack width="100%" height="100%">
          <ChatBoxAdmin userId={userId} socket={socket} />
        </Stack>
      </Box>
    );
  }

  return null; // Fallback if no valid role
};

export default ChatSupportView;
