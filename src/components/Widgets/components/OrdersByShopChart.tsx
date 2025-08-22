import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { getOrdersByShop } from "../../../services/WidgetService";
import BarChart from "../charts/BarChart";
import { Box, Card, CircularProgress, Stack, Typography } from "@mui/material";
import { DragIndicatorOutlined } from "@mui/icons-material";
import type { DateFilterState } from "../../../shared/components/DateFilter";
import FilterView from "../../../shared/components/FilterView";

export default function OrdersByShopChart() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<DateFilterState>({
    range: "today"
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getOrdersByShop(user?.token);
        setCategories(data.map((item: any) => item.shopName));
        setValues(data.map((item: any) => item.orderCount));
      } catch (err) {
        console.error("Failed to fetch orders by shop:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <Card
      sx={{
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative"
      }}
    >
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography variant="h6" color="textSecondary">
          Orders by shop
        </Typography>
      </Box>

      {/* Icons top-right absolutely positioned */}
      <Stack
        direction="row"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          alignItems: "center"
        }}
      >
        <FilterView dateFilter={dateFilter} setDateFilter={setDateFilter} />

        <DragIndicatorOutlined
          color="action"
          className="drag-handle"
          sx={{ cursor: "grab" }}
        />
      </Stack>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", flexGrow: 1 }}>
          <CircularProgress />
        </Box>
      ) : (
        <BarChart
          categories={categories}
          values={values}
          label="Orders by Shop"
        />
      )}
    </Card>
  );
}
