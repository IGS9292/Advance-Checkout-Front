import axios from "axios";
import { getAllShops } from "./ShopService";
import { getOrders } from "./OrderService";

const baseURL = import.meta.env.VITE_API_BASE as string;
// export const fetchDashboardData = async (
//   { startDate, endDate },
//   token: string
// ) => {
//   const response = await axios.get(`${baseURL}/dashboard-data`, {
//     params: { startDate, endDate },
//     headers: { Authorization: `Bearer ${token}` }
//   });
//   return response.data;
// };

export const fetchDashboardCounts = async (token: string) => {
  try {
    const [shopsRes, ordersRes] = await Promise.all([
      getAllShops(),
      getOrders(token)
    ]);

    const totalShops = Array.isArray(shopsRes.shops)
      ? shopsRes.shops.length
      : 0;

    const totalOrders = Array.isArray(ordersRes) ? ordersRes.length : 0;

    return { totalShops, totalOrders };
  } catch (error) {
    console.error("Error fetching dashboard counts:", error);
    return { totalShops: 0, totalOrders: 0 };
  }
};

export const getOrdersPerDay = async (
  token: string,
  dateFilter?: { range?: string; from?: string; to?: string }
) => {
  const res = await axios.get(`${baseURL}/v1/orders-per-day`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: dateFilter // this adds ?range=this_week etc.
  });
  return res.data;
};


export const getOrdersByShop = async (token?: string) => {
  if (!token) throw new Error("No token available");
  const response = await axios.get(`${baseURL}/v1/orders-by-shop`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getCouponUsageStats = async (token: string) => {
  const res = await axios.get(`${baseURL}/v1/coupons-usage`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
