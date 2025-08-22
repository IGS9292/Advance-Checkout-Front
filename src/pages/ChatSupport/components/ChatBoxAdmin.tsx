import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import ChatBox from "./ChatBox";
import { useAuth } from "../../../contexts/AuthContext";
import { getSuperadminEmail } from "../../../services/ChatSupportService";
import { type AdminUser } from "./ChatList";

interface Props {
  userId: string;
  socket: any;
}

const ChatBoxAdmin = ({ userId, socket }: Props) => {
  const [superadmin, setSuperadmin] = useState<AdminUser | null>(null);
  const { user } = useAuth();

  const fetchSuperadmin = async () => {
    try {
      const data = await getSuperadminEmail(user?.token);
      setSuperadmin({
        id: data.id,
        email: data.email
      });
    } catch (err) {
      console.error("Failed to fetch superadmin:", err);
    }
  };

  useEffect(() => {
    if (user?.token && userId) {
      if (!socket.connected) {
        socket.connect(); //  Connect if not already
      }

      socket.emit("join", { userId });
      //  Join with object format
      fetchSuperadmin();
    }
  }, [user?.token, userId]);

  if (!superadmin) return <CircularProgress />;

  return <ChatBox userId={userId} selectedUser={superadmin} socket={socket} />;
};

export default ChatBoxAdmin;
