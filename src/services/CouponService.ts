// src/services/CouponService.ts

import axios from "axios";

export const getCoupons = async () => {
  const res = await axios.get("/api/coupons"); // or include shopId if needed
  return res.data; // Expects { coupons: [...] }
};

export const deleteCoupon = async (id: number) => {
  await axios.delete(`/api/coupons/${id}`);
};
