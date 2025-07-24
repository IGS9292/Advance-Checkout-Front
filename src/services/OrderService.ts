// src/services/OrderService.ts
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE as string;

export const getOrders = async (token?: string) => {
  if (!token) throw new Error("No token available");
  const response = await axios.get(`${baseURL}/v1/orders`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const createOrder = async (orderData: any, token?: string) => {
  const response = await axios.post(`${baseURL}/v1/orders`, orderData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateOrder = async (
  id: number,
  updatedData: any,
  token?: string
) => {
  const response = await axios.put(`${baseURL}/v1/orders/${id}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const deleteOrder = async (id: number, token?: string) => {
  const response = await axios.delete(`${baseURL}/v1/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
