// components/Widgets/dynamic/CouponUsageBarWidget.tsx
import { useEffect, useState } from "react";
import BarChart from "../charts/BarChart";
import { getCouponUsageStats } from "../../../services/WidgetService";
import { useAuth } from "../../../contexts/AuthContext";
import { Box, Card, CircularProgress, Stack, Typography } from "@mui/material";
import { DragIndicatorOutlined } from "@mui/icons-material";
import type { DateFilterState } from "../../../shared/components/DateFilter";
import FilterView from "../../../shared/components/FilterView";

export default function CouponUsageBarChart() {
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
        const stats = await getCouponUsageStats(user?.token || "");
        setCategories(stats.map((s: any) => s.couponTitle));
        setValues(stats.map((s: any) => s.usageCount));
      } catch (err) {
        console.error("Failed to load coupon usage stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.token]);

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
          Coupon Usage Count
        </Typography>
      </Box>

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
        <BarChart categories={categories} values={values} label="Usage Count" />
      )}
    </Card>
  );
}
