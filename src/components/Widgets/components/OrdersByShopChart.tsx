import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { getOrdersByShop } from "../../../services/WidgetService";
import BarChart from "../charts/BarChart";

export default function OrdersByShopChart() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOrdersByShop(user?.token);
        setCategories(data.map((item: any) => item.shopName));
        setValues(data.map((item: any) => item.orderCount));
      } catch (err) {
        console.error("Failed to fetch orders by shop:", err);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div key="ordersByShop">
      <BarChart
        title="Orders by Shop"
        categories={categories}
        values={values}
      />
    </div>
  );
}
