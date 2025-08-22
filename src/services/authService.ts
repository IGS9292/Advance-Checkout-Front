import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE as string;

export const loginUser = async ({
  email,
  password,
  token
}: {
  email: string;
  password: string;
  token: string;
}) => {
  const res = await axios.post(`${baseURL}/auth/login`, {
    email,
    password,
    token
  });
  return res.data;
};

export const signupUser = async ({
  email,
  password,
  shopName
}: {
  email: string;
  password: string;
  shopName: string | null;
}) => {
  const res = await axios.post(`${baseURL}/auth/signup`, {
    email,
    password,
    shopName
  });
  return res.data;
};

export const sendVerificationLink = async (email: string) => {
  const res = await axios.post(`${baseURL}/auth/send-verification`, { email });
  return res.data;
};

export const requestPasswordReset = async (email: string) => {
  const res = await axios.post(`${baseURL}/auth/request-reset-password`, {
    email
  });
  return res.data;
};

export const resetPassword = async (token: any, newPassword: string) => {
  const res = await axios.post(`${baseURL}/auth/reset-password/${token}`, {
    newPassword
  });
  return res.data;
};
