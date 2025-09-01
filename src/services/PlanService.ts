// src/services/planService.ts
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE as string;

export const getAllPlans = async () => {
  const res = await axios.get(`${baseURL}/v1/plans`);
  return res.data;
};

export const getPlanById = async (id: number) => {
  const res = await axios.get(`${baseURL}/v1/plans/${id}`);
  return res.data;
};

export const createPlan = async (planData: {
  plan_name: string;
  order_range: string;
  sales_fee: number;
  charges?: number;
}) => {
  const res = await axios.post(`${baseURL}/v1/plans`, planData);
  return res.data;
};

export const updatePlan = async (
  id: number,
  planData: {
    plan_name?: string;
    order_range?: string;
    sales_fee?: number;
    charges?: number;
  }
) => {
  const res = await axios.put(`${baseURL}/v1/plans/${id}`, planData);
  return res.data;
};

export const deletePlan = async (id: number) => {
  const res = await axios.delete(`${baseURL}/v1/plans/${id}`);
  return res.data;
};
