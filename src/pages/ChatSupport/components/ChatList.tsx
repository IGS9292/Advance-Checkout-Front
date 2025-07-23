import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Paper,
  Badge
} from "@mui/material";
import {
  getAdminUsers,
  fetchUnreadCounts,
  markMessagesAsRead
} from "../../../services/ChatSupportService";
import {
  loadUnreadCounts,
  saveUnreadCounts,
  clearUnreadCountForUser
} from "../../../shared/utils/helper/unreadStorage";
import { useAuth } from "../../../contexts/AuthContext";

export interface AdminUser {
  id: string;
  email: string;
  shop?: {
    shopName: string;
  };
}

interface Props {
  userId: string;
  setSelectedUser: (user: AdminUser) => void;
  socket: any;
}

const ChatList: React.FC<Props> = ({ userId, setSelectedUser, socket }) => {
  const [connected, setConnected] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<{
    [userId: string]: number;
  }>(loadUnreadCounts());

  const { user } = useAuth();
  const token = user?.token;
  // 🔹 Fetch unread counts on mount
  useEffect(() => {
    const fetchCounts = async () => {
      if (!token) return;
      try {
        const counts = await fetchUnreadCounts(token);
        setUnreadCounts(counts);
        saveUnreadCounts(counts);
      } catch (err) {
        console.error("Failed to fetch unread counts", err);
      }
    };
    fetchCounts();
  }, [token]);

  // 🔹 Handle new incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message: any) => {
      if (message.senderId !== userId) {
        const isCurrentChatOpen = false; // replace with `selectedUser?.id === message.senderId` if available

        if (!isCurrentChatOpen) {
          setUnreadCounts((prev) => {
            const updated = {
              ...prev,
              [message.senderId]: (prev[message.senderId] || 0) + 1
            };
            saveUnreadCounts(updated);
            return updated;
          });
        }
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, userId]);

  // 🔹 Connect socket
  useEffect(() => {
    if (!connected && userId) {
      socket.connect();
      socket.on("connect", () => {
        socket.emit("join", { userId });
        setConnected(true);
      });
    }
    return () => {
      socket.disconnect();
    };
  }, [userId]);

  // 🔹 Load Admin Users
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const data = await getAdminUsers();
        const filtered = data.filter((user: AdminUser) => user.id !== userId);
        setAdminUsers(filtered);
      } catch (err) {
        console.error("Failed to fetch admin users", err);
      }
    };
    fetchAdmins();
  }, [userId]);

  // 🔹 Handle user click
  const handleUserClick = async (user: AdminUser) => {
    setSelectedUser(user);
    if (token) {
      try {
        await markMessagesAsRead(user.id, token);
      } catch (err) {
        console.error("Failed to mark messages as read", err);
      }
    }
    const updated = clearUnreadCountForUser(user.id);
    setUnreadCounts(updated);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: 250,
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ p: 2 }}>
        Chat List - Shops Name
      </Typography>
      <Divider />

      <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
        <List>
          {adminUsers.map((user) => (
            <ListItem key={user.id} disablePadding>
              <ListItemButton onClick={() => handleUserClick(user)}>
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  <ListItemText primary={user.shop?.shopName || user.email} />
                  <Badge
                    color="error"
                    badgeContent={unreadCounts[user.id] || 0}
                    invisible={!unreadCounts[user.id]}
                    sx={{ ml: 1 }} // margin-left for spacing
                  />
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default ChatList;
