import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Paper
} from "@mui/material";
import { getAdminUsers } from "../../../services/ChatSupportService";

interface Props {
  userId: string;
  setSelectedUser: (user: AdminUser) => void;
  socket: any;
}
export interface AdminUser {
  id: string;
  email: string;
  shop?: {
    shopName: string;
  };
}

const ChatList: React.FC<Props> = ({ userId, setSelectedUser, socket }) => {
  const [connected, setConnected] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    if (!connected && userId) {
      socket.connect(); // ✅ connect first
      socket.on("connect", () => {
        socket.emit("join", { userId });
        // ✅ fix: pass object, not just string
        setConnected(true);
      });
    }
    return () => {
      socket.disconnect();
    };
  }, [userId]);

  // ✅ Fetch real users
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        // const token = localStorage.getItem("token"); // or from context
        const data = await getAdminUsers();
        // Optional: exclude self
        const filtered = data.filter((user: AdminUser) => user.id !== userId);
        setAdminUsers(filtered);
      } catch (err) {
        console.error("Failed to fetch admin users", err);
      }
    };

    fetchAdmins();
  }, [userId]);

  return (
    <Paper
      elevation={3}
      sx={{
        width: 300,
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ p: 2 }}>
        Chat List - Shops Name
      </Typography>
      <Divider />

      {/* Scrollable user list */}
      <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
        <List>
          {adminUsers.map((user) => (
            <ListItem key={user.id} disablePadding>
              <ListItemButton onClick={() => setSelectedUser(user)}>
                <ListItemText primary={user.shop?.shopName || user.email} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default ChatList;
