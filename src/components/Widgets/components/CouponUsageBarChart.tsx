// components/Widgets/dynamic/CouponUsageBarWidget.tsx
import  { useEffect, useState } from "react";
import BarChart from "../charts/BarChart";
import { getCouponUsageStats } from "../../../services/WidgetService";
import { useAuth } from "../../../contexts/AuthContext";

export default function CouponUsageBarChart() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await getCouponUsageStats(user?.token || "");
        setCategories(stats.map((s: any) => s.couponTitle));
        setValues(stats.map((s: any) => s.usageCount));
      } catch (err) {
        console.error("Failed to load coupon usage stats", err);
      }
    };

    fetchData();
  }, [user?.token]);

  return (
    <BarChart
      title="Coupon Usage Count"
      categories={categories}
      values={values}
      label="Usage Count"
    />
  );
}
