import axios from "axios";
const baseUrl = import.meta.env.VITE_API_BASE;

export const createRazorpayOrder = async (
  planId: number,
  shopId: number,
  amount: number
) => {
  const { data } = await axios.post(`${baseUrl}/v1/razorpay/create-order`, {
    planId,
    shopId,
    amount
  });

  if (!data.success) throw new Error("Failed to create Razorpay order");
  return data.order;
};

export const verifyRazorpayPayment = async (
  response: any,
  planId: number,
  shopId: number
) => {
  const { data } = await axios.post(`${baseUrl}/v1/razorpay/verify-payment`, {
    ...response,
    planId,
    shopId
  });
  return data;
};
