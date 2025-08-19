import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CircularProgress,
  IconButton,
  Popover,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import LineChart from "../charts/LineChart";
import { getOrdersPerDay } from "../../../services/WidgetService";
import { useAuth } from "../../../contexts/AuthContext";
import {
  DragIndicatorOutlined,
  FilterAltOffOutlined,
  FilterAltOutlined
} from "@mui/icons-material";
import DateFilter, {
  type DateFilterState
} from "../../../shared/components/DateFilter";

interface SeriesData {
  name: string;
  data: number[];
}

export default function OrdersPerDayChart() {
  const { user } = useAuth();
  const [xData, setXData] = useState<string[]>([]);
  const [yData, setYData] = useState<SeriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dateFilter, setDateFilter] = useState<DateFilterState>({
    range: "today"
  });
  const open = Boolean(anchorEl);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const isFilterApplied =
    dateFilter.range !== "today" &&
    !(
      dateFilter.range === "custom" &&
      !dateFilter.startDate &&
      !dateFilter.endDate
    );

  const handleFilterClose = () => {
    setAnchorEl(null);
  };
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
            name: "Total Orders", // ✅ only one label
            data: totalOrdersPerDay
          }
        ];

        setXData(allDays);
        setYData(totalSeries); // ✅ single-line chart
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
      {/* Title center aligned */}
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography variant="h6" color="textSecondary">
          Orders per Day
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
        <Tooltip title={"Filter by date"}>
          <IconButton
            sx={{
              borderColor: "transparent",
              outline: "none",
              border: "none",
              boxShadow: "none",
              "&:focus": {
                outline: "none"
              }
            }}
            onClick={(event) => {
              handleFilterClick(event);
            }}
          >
            <FilterAltOutlined color="primary" />
          </IconButton>
        </Tooltip>

        {isFilterApplied && (
          <Tooltip title={"Clear filter"}>
            <IconButton
              sx={{
                borderColor: "transparent",
                outline: "none",
                border: "none",
                boxShadow: "none",
                "&:focus": {
                  outline: "none"
                }
              }}
              onClick={(event) => {
                setDateFilter({ range: "today" });
              }}
            >
              <FilterAltOffOutlined color="primary" />
            </IconButton>
          </Tooltip>
        )}
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleFilterClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{ sx: { p: 2, minWidth: 300 } }}
        >
          <DateFilter
            filter={dateFilter}
            setFilter={(f) => {
              setDateFilter(f);
              handleFilterClose();
            }}
            onClear={() => {
              setDateFilter({ range: "today" });
              handleFilterClose();
            }}
          />
        </Popover>
        <DragIndicatorOutlined
          color="action"
          className="drag-handle"
          sx={{ cursor: "grab" }}
        />
      </Stack>

      {/* Content */}
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
