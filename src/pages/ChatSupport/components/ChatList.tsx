import {
  Avatar,
  Badge,
  Box,
  ButtonBase,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import ChatBox from "./ChatBox";
import { useAuth } from "../../../contexts/AuthContext";
import { getAdminUsers } from "../../../services/ChatSupportService";
import { socket } from "../../../socket/socket";

interface AdminUser {
  id: string;
  name: string;
  email: string;
}

interface ChatListProps {
  currentUserId: string;
}

const ChatList = ({ currentUserId }: ChatListProps) => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<string | null>(null);
  const [unreadMessages, setUnreadMessages] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const data = await getAdminUsers(user?.token);
        setAdmins(data);
      } catch (error) {
        console.error("Failed to fetch admin users:", error);
      }
    };
    fetchAdmins();
  }, [user?.token]);

  useEffect(() => {
    if (!currentUserId) return;

    socket.emit("register", { userId: currentUserId });

    socket.on("online_users", (emails: string[]) => {
      setOnlineUsers(emails);
    });

    socket.on("receive_message", (data) => {
      if (data.from !== selectedAdmin) {
        setUnreadMessages((prev) => ({
          ...prev,
          [data.from]: (prev[data.from] || 0) + 1
        }));
      }
    });

    return () => {
      socket.off("online_users");
      socket.off("receive_message");
    };
  }, [currentUserId, selectedAdmin]);

  const handleSelectAdmin = (email: string) => {
    setSelectedAdmin(email);
    setUnreadMessages((prev) => ({ ...prev, [email]: 0 }));
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Support Chats
      </Typography>
      <Box display="flex" flexDirection="row" gap={2}>
        <List>
          {admins.map((admin) => {
            const isOnline = onlineUsers.includes(admin.email);
            const unreadCount = unreadMessages[admin.email] || 0;

            return (
              <Box
                key={admin.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: 1,
                  borderRadius: 2,
                  bgcolor:
                    selectedAdmin === admin.email
                      ? "#e3f2fd"
                      : "background.paper",
                  cursor: "pointer",
                  mb: 1,
                  "&:hover": { bgcolor: "#f5f5f5" }
                }}
                onClick={() => handleSelectAdmin(admin.email)}
              >
                <ButtonBase
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%"
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Badge
                      variant="dot"
                      color={isOnline ? "success" : "default"}
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    >
                      {/* <Avatar>{admin.name.charAt(0).toUpperCase()}</Avatar> */}
                    </Badge>

                    <Box ml={2}>
                      <Typography fontWeight={600}>{admin.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {admin.email}
                      </Typography>
                    </Box>
                  </Box>

                  {unreadCount > 0 && (
                    <Badge
                      color="error"
                      badgeContent={unreadCount}
                      sx={{ marginLeft: "auto" }}
                    />
                  )}
                </ButtonBase>
              </Box>
            );
          })}
        </List>

        {selectedAdmin && (
          <ChatBox currentUserId={currentUserId} targetUserId={selectedAdmin} />
        )}
      </Box>
    </>
  );
};

export default ChatList;
