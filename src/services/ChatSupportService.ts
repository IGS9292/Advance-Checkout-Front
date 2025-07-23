import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE as string;

// 🔹 Get Superadmin Email
export const getSuperadminEmail = async (token?: string) => {
  if (!token) throw new Error("No token available");
  const response = await axios.get(`${baseURL}/v1/superadmin-email`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data; // { id, email }
};

// 🔹 Get Admin Users (with shopName)
export const getAdminUsers = async () => {
  // if (!token) throw new Error("No token provided");
  const response = await axios.get(`${baseURL}/v1/get-admin-users`);
  return response.data; // [{ id, email, shop: { shopName } }]
};

// 🔹 Get Chat History by path param (for socket-based history or deep load)
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
  return response.data; // List of messages
};

// 🔹 Get Messages (query-based for real-time polling/chat)
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
  console.log("Loaded from backend:", response.data);

  return response.data; // List of messages
};
