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

export const createCoupon = async (couponData: any, token?: string) => {
  const response = await axios.post(`${baseURL}/v1/coupons`, couponData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateCoupon = async (
  id: number,
  updatedData: any,
  token?: string
) => {
  const response = await axios.put(`${baseURL}/v1/coupons/${id}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateCouponStatus = async (
  id: number,
  status: "pending" | "approved" | "rejected",
  token?: string
) => {
  const response = await axios.put(
    `${baseURL}/v1/coupons/${id}/status`,
    {
      status
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export const deleteCoupon = async (id: number) => {
  const response = await axios.delete(`${baseURL}/v1/coupons/${id}`);
  return response.data;
};
