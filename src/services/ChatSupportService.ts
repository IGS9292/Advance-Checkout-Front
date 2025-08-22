// services/ChatSupportService.ts
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE as string;

export const getSuperadminEmail = async (token?: string) => {
  if (!token) throw new Error("No token available");
  const response = await axios.get(`${baseURL}/v1/superadmin-email`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const getAdminUsers = async () => {
  const response = await axios.get(`${baseURL}/v1/get-admin-users`);
  return response.data;
};

export const getChatHistory = async (
  user1: string,
  user2: string,
  token?: string
) => {
  if (!token) throw new Error("No token provided");
  const response = await axios.get(`${baseURL}/v1/history/${user1}/${user2}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const allMessages = response.data;

  return allMessages.filter((msg: any) => msg.visible !== false);
};

export const fetchChatMessages = async (
  from: string,
  to: string,
  token?: string
) => {
  if (!token) throw new Error("No token provided");
  const response = await axios.get(`${baseURL}/v1/messages`, {
    params: { from, to },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const allMessages = response.data;

  const visibleMessages = allMessages.filter(
    (msg: any) => msg.visible !== false
  );

  return visibleMessages;
};

export const fetchLastChatMessage = async (
  from: string,
  to: string,
  token?: string
) => {
  if (!token) throw new Error("No token provided");
  const response = await axios.get(`${baseURL}/v1/messages`, {
    params: { from, to },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const allMessages = response.data;

  const sorted = allMessages.sort(
    (a: any, b: any) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return sorted[0];
};

export const fetchUnreadCounts = async (token: string) => {
  const res = await axios.get(`${baseURL}/v1/unread-counts`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const countMap: { [id: string]: number } = {};
  res.data.forEach((entry: any) => {
    countMap[entry.senderId] = parseInt(entry.unreadCount);
  });
  return countMap;
};

export const markMessagesAsRead = async (fromUserId: string, token: string) => {
  const res = await axios.post(
    `${baseURL}/v1/mark-read`,
    { fromUserId },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return res.data;
};

export const deleteChatMessages = async (
  userId: string,
  otherUserId: string,
  token?: string
) => {
  const res = await axios.delete(
    `${baseURL}/v1/delete-messages/${userId}/${otherUserId}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return res.data;
};
