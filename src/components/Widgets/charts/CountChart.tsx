import { useEffect, useState } from "react";
import { Card, Typography, CircularProgress } from "@mui/material";
import { getAllShops } from "../../../services/ShopService";
import { getOrders } from "../../../services/OrderService";

interface CountChartProps {
  label: string;
  type: "orders" | "shops";
  token?: string;
}

export default function CountChart({ label, type, token }: CountChartProps) {
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        if (type === "shops") {
          const res = await getAllShops();
          const count = Array.isArray(res.shops) ? res.shops.length : 0;
          setValue(count);
        } else if (type === "orders") {
          if (!token) return;
          const res = await getOrders(token);
          const count = Array.isArray(res) ? res.length : 0;
          setValue(count);
        }
      } catch (err) {
        console.error("Failed to fetch count:", err);
        setValue(0);
      }
    };

    fetchCount();
  }, [type, token]);

  return (
    <Card
      sx={{
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
      }}
    >
      <Typography variant="h6" color="textSecondary">
        {label}
      </Typography>
      {value === null ? (
        <CircularProgress size={24} />
      ) : (
        <Typography variant="h4" color="primary">
          {value}
        </Typography>
      )}
    </Card>
  );
}
