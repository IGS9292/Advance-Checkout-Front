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

// ------------------------- Plan card shop ---------------------------
export const getActivePlanByShop = async (shopId: number) => {
  try {
    const res = await axios.get(`${baseURL}/v1/shops/${shopId}/active-plan`);
    if (res.data.success && res.data.plan?.status === "active") {
      return res.data.plan;
    }
    return null;
  } catch (err) {
    console.error("Error fetching active plan for shop:", err);
    return null;
  }
};
