// components/Widgets/charts/OrdersPerDayChart.tsx
import { useEffect, useState } from "react";
import { Card, CircularProgress } from "@mui/material";
import LineChart from "../charts/LineChart";
import { getOrdersPerDay } from "../../../services/WidgetService";
import { useAuth } from "../../../contexts/AuthContext";

export default function OrdersPerDayChart() {
  const [xData, setXData] = useState<string[]>([]);
  const [yData, setYData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getOrdersPerDay(user?.token || "");
        const x = res.map((r: any) => {
          const date = new Date(r.day);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = String(date.getFullYear());
          return `${day}-${month}-${year}`;
        });

        const y = res.map((r: any) => r.total_orders);
        setXData(x);
        setYData(y);
      } catch (err) {
        console.error("Failed to fetch orders per day", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.token]);

  return (
    <Card sx={{ height: "100%", p: 2 }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <LineChart title="Orders per Day" xData={xData} yData={yData} />
      )}
    </Card>
  );
}
