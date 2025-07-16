import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE as string;

export const getAllShops = async () => {
  const res = await axios.get(`${baseURL}/v1/shops`);
  return res.data;
};

export const deleteShop = async (shopId: string | number) => {
  const res = await axios.delete(`${baseURL}/v1/shops/${shopId}`);
  return res.data;
};

export const updateShop = async (
  shopId: string | number,
  data: { name: string; status: string; eventCount: number }
) => {
  const res = await axios.put(`${baseURL}/v1/shops/${shopId}`, data);
  return res.data;
};

export const createShop = async (data: {
  name: string;
  status: string;
  eventCount: number;
   email: string;
}) => {
  const res = await axios.post(`${baseURL}/v1/shops`, data);
  return res.data;
};
