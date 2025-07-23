// src/services/ChatSupportService.ts
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

export const getAdminUsers = async (token?: string) => {
  if (!token) throw new Error("No token provided");

  const response = await axios.get(`${baseURL}/v1/get-admin-users`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data; // Expected: [{ id, email }]
};


export const fetchChatMessages = async (
  from: string,
  to: string,
  token?: string
) => {
  const response = await axios.get(`${baseURL}/v1/chat/messages`, {
    params: { from, to },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
