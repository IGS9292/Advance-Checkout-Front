// src/services/billingService.ts
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE as string;

export const getMyBills = async (token?: string) => {
  if (!token) throw new Error("No token available");
  const response = await axios.get(`${baseURL}/v1/my-bills`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const downloadInvoice = async (billId: number, token?: string) => {
  if (!token) throw new Error("No token available");
  const response = await axios.get(`${baseURL}/v1/my-bills/invoice/${billId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    responseType: "blob" // important for PDF/image
  });

  // Trigger download in browser
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `invoice_${billId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const downloadReceipt = async (billId: number, token?: string) => {
  if (!token) throw new Error("No token available");
  const response = await axios.get(
    `${baseURL}/v1/my-bills/receipt/${billId}/receipt`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      responseType: "blob" // important for file download
    }
  );

  // Trigger download in browser
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `receipt_${billId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const createBillPayment = async (billId: number, token?: string) => {
  const res = await axios.post(
    `${baseURL}/v1/my-bills/${billId}/pay`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return res.data;
};
