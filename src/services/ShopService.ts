import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE as string;

export const getAllShops = async () => {
  const res = await axios.get(`${baseURL}/v1/shops`);
  // Ensure the frontend sees `planName` instead of `activePlan`
  const shops = res.data.shops.map((shop: any) => ({
    ...shop,
    planName: shop.activePlan || null
  }));
  return { ...res.data, shops };
};

export const requestShop = async (data: {
  shopName: string;
  shopUrl: string;
  shopContactNo: string;
  ordersPerMonth: string;
  email: string;
}) => {
  const res = await axios.post(`${baseURL}/v1/shops/request`, data);
  return res.data;
};
export const createShop = async (data: {
  shopName: string;
  shopUrl: string;
  shopContactNo: string;
  ordersPerMonth: string;
  email: string;
  status?: "pending" | "approved" | "rejected";
  shopAccessToken?: string;
}) => {
  const res = await axios.post(`${baseURL}/v1/shops`, {
    ...data,
    shop_access_token: data.shopAccessToken
  });
  
  return res.data;
};

export const updateShop = async (
  shopId: string | number,
  data: {
    shopName: string;
    shopUrl: string;
    shopContactNo: string;
    ordersPerMonth: string;
    status: string;
    shopAccessToken?: string;
  }
) => {
  const res = await axios.put(`${baseURL}/v1/shops/${shopId}`, {
    ...data,
    shop_access_token: data.shopAccessToken
  });
  return res.data;
};

export const updateShopStatus = async (
  id: number,
  status: "approved" | "rejected"
) => {
  const res = await axios.patch(`${baseURL}/v1/${id}/status`, { status });
  return res.data;
};

export const deleteShop = async (shopId: string | number) => {
  const res = await axios.delete(`${baseURL}/v1/shops/${shopId}`);
  return res.data;
};