// services/paymentMethodService.ts
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE as string;

export const getAvailablePaymentMethods = async (token?: string) => {
  // console.log("Shop ID : ", token);

  if (!token) throw new Error("No token available");
  try {
    const response = await axios.get(`${baseURL}/v1/payment-method-shop`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch payment methods:", error);
    throw error;
  }
};

export const savePaymentGatewayCredentials = async (
  token: string,
  body: {
    gatewayId: number;
    api_key: string;
    api_secret_key: string;
    status?: string;
  }
) => {
  if (!token) throw new Error("No token available");
  try {
    const response = await axios.post(
      `${baseURL}/v1/payment-method-shop/gateway-active`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Failed to save credentials:", error);
    throw new Error(
      error.response?.data?.message || "Failed to save credentials"
    );
  }
};
