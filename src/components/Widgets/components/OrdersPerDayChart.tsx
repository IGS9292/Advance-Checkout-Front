import { useEffect, useState } from "react";
import { Box, Card, CircularProgress, Stack, Typography } from "@mui/material";
import LineChart from "../charts/LineChart";
import { getOrdersPerDay } from "../../../services/WidgetService";
import { useAuth } from "../../../contexts/AuthContext";
import { DragIndicatorOutlined } from "@mui/icons-material";
import { type DateFilterState } from "../../../shared/components/DateFilter";
import FilterView from "../../../shared/components/FilterView";

interface SeriesData {
  name: string;
  data: number[];
}

export default function OrdersPerDayChart() {
  const { user } = useAuth();
  const [xData, setXData] = useState<string[]>([]);
  const [yData, setYData] = useState<SeriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<DateFilterState>({
    range: "today"
  });
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getOrdersPerDay(user?.token || "", dateFilter);

        // 1. Generate all days of selected month
        const now = new Date();
        const year = dateFilter?.startDate
          ? new Date(dateFilter.startDate).getFullYear()
          : now.getFullYear();
        const month = dateFilter?.startDate
          ? new Date(dateFilter.startDate).getMonth()
          : now.getMonth();

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const allDays: string[] = Array.from(
          { length: daysInMonth },
          (_, i) => {
            const d = new Date(year, month, i + 1);
            return `${String(d.getDate()).padStart(2, "0")}-${String(
              d.getMonth() + 1
            ).padStart(2, "0")}-${d.getFullYear()}`;
          }
        );

        // 2. Group data shop-wise
        const shopMap: Record<number, Record<string, number>> = {};

        res.forEach((r: any) => {
          const date = new Date(r.day);
          const key = `${String(date.getDate()).padStart(2, "0")}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}-${date.getFullYear()}`;

          if (!shopMap[r.shopId]) shopMap[r.shopId] = {};
          shopMap[r.shopId][key] = Number(r.total_orders);
        });

        // 3. Build single "Total Orders" series
        const totalOrdersPerDay = allDays.map((d) => {
          return Object.values(shopMap).reduce((sum, dayOrders) => {
            return sum + (dayOrders[d] || 0);
          }, 0);
        });

        const totalSeries: SeriesData[] = [
          {
            name: "Total Orders",
            data: totalOrdersPerDay
          }
        ];

        setXData(allDays);
        setYData(totalSeries);
      } catch (err) {
        console.error("Failed to fetch orders per day", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.token, dateFilter]);

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
          Orders per Day
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
        <LineChart xData={xData} yData={yData} />
      )}
    </Card>
  );
}
