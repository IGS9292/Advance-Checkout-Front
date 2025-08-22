import { useEffect, useState } from "react";
import {
  Card,
  Typography,
  CircularProgress,
  Box
} from "@mui/material";
import { getAllShops } from "../../../services/ShopService";
import { getOrders } from "../../../services/OrderService";
import {
  DragIndicatorOutlined
} from "@mui/icons-material";

interface CountChartProps {
  label: string;
  type: "orders" | "shops";
  token?: string;
}

export default function CountChart({ label, type, token }: CountChartProps) {
  const [value, setValue] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCount = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
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
        textAlign: "center",
        position: "relative"
      }}
    >
      {/* Top-right corner icons */}
      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          display: "flex",
          alignItems: "center"
        }}
      >
        <DragIndicatorOutlined
          color="action"
          className="drag-handle"
          sx={{ cursor: "grab" }}
        />
      </Box>


      <Typography variant="h6" color="textSecondary" mb={1}>
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
