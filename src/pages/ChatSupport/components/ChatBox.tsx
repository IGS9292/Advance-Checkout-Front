import { useEffect, useRef, useState } from "react";
import { socket } from "../../../socket/socket";
import { format, isValid, parseISO } from "date-fns";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack
} from "@mui/material";
import { fetchChatMessages } from "../../../services/ChatSupportService";
import { useAuth } from "../../../contexts/AuthContext";

interface Message {
  from: string;
  to: string;
  message: string;
  timestamp: number;
}

interface ChatBoxProps {
  currentUserId: string;
  targetUserId: string;
}

const ChatBox = ({ currentUserId, targetUserId }: ChatBoxProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const token = user?.token; // Use token from AuthContext

        if (!token || !currentUserId || !targetUserId) return;

        const messagesFromDB = await fetchChatMessages(
          currentUserId,
          targetUserId,
          token
        );
        setMessages(messagesFromDB);
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    };

    loadChatHistory();
  }, [currentUserId, targetUserId, user?.token]);

  useEffect(() => {
    socket.emit("register", { userId: currentUserId });

    socket.on("receive_message", (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("typing", (data) => {
      if (data.from === targetUserId) {
        setIsPartnerTyping(true);
        setTimeout(() => setIsPartnerTyping(false), 2000);
      }
    });

    return () => {
      socket.off("receive_message");
      socket.off("typing");
    };
  }, [currentUserId, targetUserId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendTypingSignal = () => {
    if (!typing) {
      setTyping(true);
      socket.emit("typing", { from: currentUserId, to: targetUserId });
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => setTyping(false), 1000);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      from: currentUserId,
      to: targetUserId,
      message: newMessage,
      timestamp: Date.now()
    };
    socket.emit("send_message", msg);
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };


const groupByDate = (msgs: Message[]) => {
  return msgs.reduce((acc, msg) => {
    const rawDate = msg.timestamp;

    // Try to parse ISO string or date object
    const parsedDate = typeof rawDate === "string" ? parseISO(rawDate) : new Date(rawDate);

    // Skip invalid dates
    if (!isValid(parsedDate)) return acc;

    const date = format(parsedDate, "yyyy-MM-dd");

    acc[date] = acc[date] ? [...acc[date], msg] : [msg];
    return acc;
  }, {} as Record<string, Message[]>);
};

  const groupedMessages = groupByDate(messages);

  return (
    <Paper variant="outlined" sx={{ p: 2, width: "100%" }}>
      <Box
        sx={{
          height: 300,
          overflowY: "auto",
          backgroundColor: "#f9f9f9",
          p: 1,
          mb: 2,
          borderRadius: 1
        }}
      >
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <Box key={date}>
            <Typography
              variant="caption"
              align="center"
              display="block"
              sx={{ color: "#666", my: 1 }}
            >
              {format(new Date(date), "MMM d, yyyy")}
            </Typography>
            {msgs.map((msg, i) => (
              <Box
                key={i}
                display="flex"
                justifyContent={
                  msg.from === currentUserId ? "flex-end" : "flex-start"
                }
                my={0.5}
              >
                <Box maxWidth="70%">
                  <Box
                    sx={{
                      backgroundColor:
                        msg.from === currentUserId ? "#1976d2" : "#e0e0e0",
                      color: msg.from === currentUserId ? "#fff" : "#000",
                      px: 2,
                      py: 1,
                      borderRadius: 2
                    }}
                  >
                    {msg.message}
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#666",
                      mt: 0.5,
                      textAlign: msg.from === currentUserId ? "right" : "left"
                    }}
                  >
                    {format(new Date(msg.timestamp), "hh:mm a")}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        ))}
        <div ref={chatEndRef} />
      </Box>

      {isPartnerTyping && (
        <Typography variant="caption" color="text.secondary" mb={1}>
          {targetUserId} is typing...
        </Typography>
      )}

      <Stack direction="row" spacing={1}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            sendTypingSignal();
            if (e.key === "Enter") sendMessage();
          }}
        />
        <Button variant="contained" onClick={sendMessage}>
          Send
        </Button>
      </Stack>
    </Paper>
  );
};

export default ChatBox;
