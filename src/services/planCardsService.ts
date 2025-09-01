import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE as string;

export const getActivePlanByShop = async (shopId: number) => {
  try {
    const res = await axios.get(
      `${baseURL}/v1/shopPlanCards/${shopId}/active-plan`
    );
    if (res.data.success && res.data.plan?.status === "active") {
      return res.data.plan;
    }
    return null;
  } catch (err) {
    console.error("Error fetching active plan for shop:", err);
    return null;
  }
};

export const renewShopPlan = async (shopId: number, planId: number) => {
  try {
    const res = await axios.post(`${baseURL}/v1/shopPlanCards/renew-plan`, {
      shopId,
      planId
    });

    if (res.data.success) {
      return res.data;
    } else {
      throw new Error(res.data.message || "Plan renewal failed");
    }
  } catch (err: any) {
    console.error("Error renewing shop plan:", err);
    throw err;
  }
};
