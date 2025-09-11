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
  Badge,
  ListItemAvatar,
  Avatar,
  Tooltip
} from "@mui/material";
import {
  getAdminUsers,
  fetchUnreadCounts,
  markMessagesAsRead,
  fetchLastChatMessage
} from "../../../services/ChatSupportService";
import {
  loadUnreadCounts,
  saveUnreadCounts,
  clearUnreadCountForUser
} from "../../../shared/utils/helper/unreadStorage";
import { useAuth } from "../../../contexts/AuthContext";
import type { ChatMessage } from "./ChatBox";
import { format } from "date-fns";

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
  const [lastMessages, setLastMessages] = useState<Record<string, ChatMessage>>(
    {}
  );

  const { user } = useAuth();
  const token = user?.token;

  // 🔹 Fetch unread counts
  useEffect(() => {
    const fetchCounts = async () => {
      if (!token) return;
      try {
        const counts = await fetchUnreadCounts(token);
        setUnreadCounts(counts);
        saveUnreadCounts(counts);
      } catch (err) {
        console.error("Failed to fetch unread counts", err);
        // console.log(err);
      }
    };
    fetchCounts();
  }, [token]);

  // 🔹 Handle incoming messages (live update)
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message: ChatMessage) => {
      const otherUserId =
        message.senderId === userId ? message.receiverId : message.senderId;

      const isCurrentChatOpen = false; // Could be improved by passing selectedUser from parent

      if (!isCurrentChatOpen && message.senderId !== userId) {
        setUnreadCounts((prev) => {
          const updated = {
            ...prev,
            [message.senderId]: (prev[message.senderId] || 0) + 1
          };
          saveUnreadCounts(updated);
          return updated;
        });
      }

      // 🔹 Update last message in real-time
      setLastMessages((prev) => {
        if (
          !prev[otherUserId] ||
          new Date(message.timestamp) > new Date(prev[otherUserId].timestamp)
        ) {
          return {
            ...prev,
            [otherUserId]: message
          };
        }
        return prev;
      });
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, userId]);

  // 🔹 Socket connection
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

  // 🔹 Fetch last messages
  useEffect(() => {
    const loadLastMessages = async () => {
      const messagesMap: Record<string, any> = {};

      for (const u of adminUsers) {
        const lastMessage = await fetchLastChatMessage(
          userId,
          u.id,
          user?.token
        );
        if (lastMessage) {
          messagesMap[u.id] = lastMessage;
        }
      }

      setLastMessages(messagesMap);
    };

    if (user && adminUsers.length) {
      loadLastMessages();
    }
  }, [adminUsers, user]);

  // 🔹 User click handler
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
                  <ListItemAvatar>
                    <Badge
                      color="error"
                      badgeContent={unreadCounts[user.id] || 0}
                      invisible={!unreadCounts[user.id]}
                      overlap="circular"
                      anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                      <Avatar sx={{ height: 36, width: 36, fontSize: 15 }}>
                        {user.shop?.shopName
                          ? user.shop.shopName.charAt(0).toUpperCase()
                          : user.email.charAt(0).toUpperCase()}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.shop?.shopName || user.email}
                    secondary={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%"
                        }}
                      >
                        <Tooltip
                          title={
                            lastMessages[user.id]
                              ? `${
                                  lastMessages[user.id].senderId === userId
                                    ? "You: "
                                    : ""
                                }${lastMessages[user.id].message}`
                              : ""
                          }
                          placement="top-start"
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                            sx={{
                              maxWidth: "160px",
                              overflow: "hidden",
                              textOverflow: "ellipsis"
                            }}
                          >
                            {lastMessages[user.id]
                              ? `${
                                  lastMessages[user.id].senderId === userId
                                    ? "You: "
                                    : ""
                                }${lastMessages[user.id].message}`
                              : "No messages yet"}
                          </Typography>
                        </Tooltip>

                        {lastMessages[user.id] && (
                          <Typography
                            variant="caption"
                            color="text.disabled"
                            sx={{ ml: 2, whiteSpace: "nowrap", flexShrink: 0 }}
                          >
                            {format(
                              new Date(lastMessages[user.id].timestamp),
                              "p"
                            )}
                          </Typography>
                        )}
                      </Box>
                    }
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
