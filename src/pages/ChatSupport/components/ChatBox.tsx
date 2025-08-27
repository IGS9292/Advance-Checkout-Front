import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  IconButton,
  Avatar,
  Tooltip
} from "@mui/material";
import type { AdminUser } from "./ChatList";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import {
  deleteChatMessages,
  fetchChatMessages,
  getChatHistory
} from "../../../services/ChatSupportService";
import { format, isThisWeek, isToday, isYesterday } from "date-fns";
import { GridDeleteIcon } from "@mui/x-data-grid";

interface Props {
  userId: string;
  selectedUser: AdminUser | null;
  socket: any;
}

export interface ChatMessage {
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
}

const ChatBox: React.FC<Props> = ({ userId, selectedUser, socket }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const endRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const groupByDate = (msgs: ChatMessage[]) => {
    return msgs.reduce((acc: Record<string, ChatMessage[]>, msg) => {
      const date = new Date(msg.timestamp);
      let dateKey = format(date, "dd-MM-yyyy");

      if (isToday(date)) {
        dateKey = "Today";
      } else if (isYesterday(date)) {
        dateKey = "Yesterday";
      } else if (isThisWeek(date, { weekStartsOn: 1 })) {
        // Show weekday name like "Monday"
        dateKey = format(date, "EEEE");
      } else {
        // Older than this week: fallback to full date
        dateKey = format(date, "dd-MM-yyyy");
      }

      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(msg);
      return acc;
    }, {});
  };

  useEffect(() => {
    const loadChat = async () => {
      if (!userId || !selectedUser) return;
      try {
        const loadedMessages = await fetchChatMessages(
          userId,
          selectedUser.id,
          user?.token
        );
        setMessages(
          loadedMessages.map((msg: any) => ({
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            message: msg.message,
            timestamp: msg.timestamp
          }))
        );
      } catch (err) {
        console.error("Error loading messages", err);
      }
    };
    loadChat();
  }, [selectedUser, userId, user?.token]);

  useEffect(() => {
    if (!selectedUser) return;
    const handler = (msg: any) => {
      const from = msg.senderId || msg.fromId;
      const to = msg.receiverId || msg.toId;
      const isCurrentChat =
        (from === userId && to === selectedUser.id) ||
        (to === userId && from === selectedUser.id);

      if (isCurrentChat) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receive_message", handler);
    return () => socket.off("receive_message", handler);
  }, [selectedUser, userId]);

  // Scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim() || !selectedUser) return;

    const payload = {
      from: userId,
      to: selectedUser.id,
      message
    };
    socket.emit("send_message", payload);
    setMessages((prev) => [
      ...prev,
      {
        senderId: userId,
        receiverId: selectedUser.id,
        message,
        timestamp: new Date().toISOString()
      }
    ]);
    setMessage("");
  };

  const grouped = groupByDate(messages);

  const handleDeleteMessages = async () => {
    if (!userId || !selectedUser?.id) return;

    const confirm = window.confirm(
      "Are you sure you want to delete all messages?"
    );
    if (!confirm) return;

    try {
      await deleteChatMessages(userId, selectedUser.id, user?.token);
      const updated = await fetchChatMessages(
        userId,
        selectedUser.id,
        user?.token
      );
      setMessages(updated);
    } catch (error) {
      console.error("Failed to delete messages:", error);
    }
  };
  return (
    <Box
      sx={{
        flex: 1,
        p: 2,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderLeft: "1px solid #ccc"
      }}
    >
      {selectedUser ? (
        <>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 1,
                width: "100%"
              }}
            >
              <Avatar sx={{ height: 36, width: 36, fontSize: 15 }}>
                {selectedUser.shop?.shopName
                  ? selectedUser.shop.shopName.charAt(0).toUpperCase()
                  : selectedUser.email.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h6" gutterBottom>
                {selectedUser.shop?.shopName || selectedUser.email}
              </Typography>
            </Box>
            <Tooltip title="Delete Chat">
              <IconButton
                onClick={handleDeleteMessages}
                size="small"
                sx={{
                  color: "error.main",
                  mb: 1,
                  outline: "none",
                  border: "none",
                  boxShadow: "none",
                  "&:focus": {
                    outline: "none"
                  }
                }}
              >
                <GridDeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              mb: 2,
              pr: 1
            }}
          >
            {Object.entries(grouped).map(([date, msgs], index) => (
              <Box key={date} sx={{ mt: index !== 0 ? 3 : 0 }}>
                {" "}
                <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {date}
                  </Typography>
                </Box>
                {msgs.map((msg, idx) => {
                  const isSender = String(msg.senderId) === String(userId);
                  return (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        justifyContent: isSender ? "flex-end" : "flex-start",
                        mt: idx === 0 ? 0 : 1.5
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: isSender
                            ? "primary.light"
                            : "grey.200",
                          px: 2,
                          pt: 1,
                          pb: 2.5, // space for timestamp
                          borderRadius: "24px",
                          minWidth: "10%",
                          maxWidth: "70%",
                          width: "fit-content",
                          position: "relative",
                          wordBreak: "break-word",
                          boxShadow: 1,
                          alignSelf: isSender ? "flex-end" : "flex-start"
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: isSender ? "inherit" : "black",
                            pr: 4 // space for timestamp if message is short
                          }}
                        >
                          {msg.message}
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{
                            position: "absolute",
                            bottom: 6,
                            right: 10,
                            fontSize: "0.65rem",
                            color: "#555"
                          }}
                        >
                          {format(new Date(msg.timestamp), "p")}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            ))}
            <div ref={endRef} />
          </Box>

          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              placeholder="Type message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button variant="contained" onClick={handleSend}>
              Send
            </Button>
          </Stack>
        </>
      ) : (
        <Typography variant="h6" color="text.secondary" sx={{ m: "auto" }}>
          Select a user to start chatting
        </Typography>
      )}
    </Box>
  );
};

export default ChatBox;
