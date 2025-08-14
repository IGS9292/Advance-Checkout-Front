import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE as string;

export const getAllPaymentMethods = async () => {
  const res = await axios.get(`${baseURL}/v1/payment-method`);
  return res.data;
};

export const createPaymentMethod = async (data: {
  paymentGatewayName: string;
  gatewayImage?: string;
  status?: "active" | "inactive";
}) => {
  const res = await axios.post(`${baseURL}/v1/payment-method`, data);
  return res.data;
};

export const updatePaymentMethod = async (
  id: number,
  data: {
    paymentGatewayName: string;
    gatewayImage?: string;
    status?: "active" | "inactive";
  }
) => {
  const res = await axios.put(`${baseURL}/v1/payment-method/${id}`, data);
  return res.data;
};

export const updatePaymentMethodStatus = async (
  id: number,
  status: "active" | "inactive"
) => {
  const res = await axios.patch(`${baseURL}/v1/payment-method/${id}/status`, {
    status
  });
  return res.data;
};

export const deletePaymentMethod = async (id: string | number) => {
  const res = await axios.delete(`${baseURL}/v1/payment-method/${id}`);
  return res.data;
};