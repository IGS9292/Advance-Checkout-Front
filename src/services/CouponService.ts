// src/services/CouponService.ts
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE as string;

export const getCoupons = async (token?: string) => {
  if (!token) throw new Error("No token available");
  const response = await axios.get(`${baseURL}/v1/coupons`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const createCoupon = async (couponData: any) => {
  const response = await axios.post(`${baseURL}/v1/coupons`, couponData);
  return response.data;
};

export const updateCoupon = async (id: number, updatedData: any) => {
  const response = await axios.put(`${baseURL}/v1/coupons/${id}`, updatedData);
  return response.data;
};

export const deleteCoupon = async (id: number) => {
  const response = await axios.delete(`${baseURL}/v1/coupons/${id}`);
  return response.data;
};

export const updateCouponStatus = async (
  id: number,
  status: "pending" | "approved" | "rejected"
) => {
  const response = await axios.patch(`${baseURL}/v1/coupons/${id}/status`, {
    status
  });
  return response.data;
};
