// src/services/OrderService.ts
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE as string;

export const getAllCustomers  = async (token?: string) => {
  if (!token) throw new Error("No token available");
  const response = await axios.get(`${baseURL}/v1/customers`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
