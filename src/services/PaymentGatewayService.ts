import axios from "axios";

// Create a single axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  withCredentials: true // ✅ send cookies / credentials
});

// Use api instance for all requests
export const getAllPaymentMethods = async () => {
  const res = await api.get("/v1/payment-method");
  return res.data;
};

export const createPaymentMethod = async (data: {
  paymentGatewayName: string;
  gatewayImage?: string;
  status?: "active" | "inactive";
}) => {
  const res = await api.post("/v1/payment-method", data);
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
  const res = await api.put(`/v1/payment-method/${id}`, data);
  return res.data;
};

export const updatePaymentMethodStatus = async (
  id: number,
  status: "active" | "inactive"
) => {
  const res = await api.put(`/v1/payment-method/${id}/status`, { status });
  return res.data;
};

export const deletePaymentMethod = async (id: string | number) => {
  const res = await api.delete(`/v1/payment-method/${id}`);
  return res.data;
};
