// AuthService.ts
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE as string;

export const refreshAccessToken = async () => {
  const res = await axios.get(`${baseURL}/auth/refresh-token`, {
    withCredentials: true
  });
  return res.data.accessToken;
};

export const loginUser = async ({
  email,
  password,
  token
}: {
  email: string;
  password: string;
  token: string;
}) => {
  const res = await axios.post(
    `${baseURL}/auth/login`,
    {
      email,
      password,
      token
    },
    { withCredentials: true }
  ); // to send/receive HTTP-only cookie

  // This returns { user, accessToken }
  return res.data;
};

// AuthService.ts
export const getCurrentUser = async (token: string) => {
  const res = await axios.get(`${baseURL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  });
  return res.data.user;
};

export const signupUser = async ({
  email,
  password,
  shopName
}: // user_type
{
  email: string;
  password: string;
  shopName: string | null;
  // user_type: number;
}) => {
  const res = await axios.post(`${baseURL}/auth/signup`, {
    email,
    password,
    shopName
    // user_type
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
