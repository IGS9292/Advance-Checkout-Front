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
  data: {
    shopName: string;
    shopUrl: string;
    shopContactNo: string;
    ordersPerMonth: number;
    status: string;
  }
) => {
  const res = await axios.put(`${baseURL}/v1/shops/${shopId}`, data);
  return res.data;
};
export const requestShop = async (data: {
  shopName: string;
  shopUrl: string;
  shopContactNo: string;
  ordersPerMonth: number;
  email: string;
}) => {
  const res = await axios.post(`${baseURL}/v1/shops/request`, data);
  return res.data;
};

export const createShop = async (data: {
  shopName: string;
  shopUrl: string;
  shopContactNo: string;
  ordersPerMonth: number;
  email: string;
  status?: "pending" | "approved" | "rejected";
}) => {
  const res = await axios.post(`${baseURL}/v1/shops`, data);
  // alert("shop alreadyeists",res.data)
  return res.data;
};
export const updateShopStatus = async (
  id: number,
  status: "approved" | "rejected"
) => {
  const res = await axios.patch(`${baseURL}/v1/${id}/status`, { status });
  return res.data;
};
