import { useEffect, useState } from "react";
import ChatBox from "./components/ChatBox";
import ChatList from "./components/ChatList";
import { useAuth } from "../../contexts/AuthContext";
import { getSuperadminEmail } from "../../services/ChatSupportService";
import { Box, CircularProgress, Typography } from "@mui/material";

const ChatSupport = () => {
  const { user, role } = useAuth();
  const [superadminEmail, setSuperadminEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmail = async () => {
      if (role === "1" && user?.token) {
        try {
          const data = await getSuperadminEmail(user.token);
          setSuperadminEmail(data.email);
        } catch (error) {
          console.error("Failed to fetch superadmin email:", error);
        }
      }
      setLoading(false);
    };
    fetchEmail();
  }, [role, user?.token]);

  if (loading || !user?.email) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
      >
        <CircularProgress />
        <Typography variant="body1" ml={2}>
          Loading chat...
        </Typography>
      </Box>
    );
  }

  if (role === "1") {
    if (!superadminEmail)
      return (
        <Box textAlign="center" mt={4}>
          <Typography color="error">Unable to load chat</Typography>
        </Box>
      );
    return (
      <Box p={2}>
        <ChatBox currentUserId={user.email} targetUserId={superadminEmail} />
      </Box>
    );
  }

  if (role === "0") {
    return (
      <Box p={2}>
        <ChatList currentUserId={user.email} />
      </Box>
    );
  }

  return (
    <Box textAlign="center" mt={4}>
      <Typography color="error">Invalid user role</Typography>
    </Box>
  );
};

export default ChatSupport;
