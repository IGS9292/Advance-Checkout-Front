import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import CountChart from "./charts/CountChart";
import LineChart from "../../components/Widgets/charts/LineChart";
import {
  Box,
  Card,
  IconButton,
  Popover,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import OrdersPerDayChart from "./components/OrdersPerDayChart";
import OrdersByShopChart from "./components/OrdersByShopChart";
import ShopStatusChart from "./components/ShopStatusChart";
import CouponUsageBarChart from "./components/CouponUsageBarChart";
import {
  DragIndicatorOutlined,
  FilterAltOffOutlined,
  FilterAltOutlined
} from "@mui/icons-material";
import { useState } from "react";
import type { DateFilterState } from "../../shared/components/DateFilter";
import DateFilter from "../../shared/components/DateFilter";

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function DashboardGrid() {
  const { user } = useAuth();
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
  const layouts = {
    lg: [
      { i: "totalShops", x: 0, y: 0, w: 6, h: 2 },
      { i: "totalOrders", x: 6, y: 0, w: 6, h: 2 },
      { i: "ordersPerDay", x: 0, y: 2, w: 6, h: 5 },
      { i: "ordersByShop", x: 6, y: 2, w: 6, h: 5 },
      { i: "shopStatus", x: 0, y: 6, w: 6, h: 5 },
      { i: "couponUsage", x: 6, y: 6, w: 6, h: 5 },
      { i: "revenueTrend", x: 0, y: 6, w: 6, h: 5 }
    ]
  };

  return (
    <Box sx={{ width: "100%" }}>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        cols={{ lg: 12, md: 10, sm: 6 }}
        rowHeight={60}
        isDraggable
        isResizable
        draggableHandle=".drag-handle"
      >
        <div key="totalOrders">
          <CountChart label="Total Shops" type="shops" />
        </div>

        <div key="totalShops">
          <CountChart label="Total Orders" type="orders" token={user?.token} />
        </div>
        <div key="ordersPerDay">
          <OrdersPerDayChart />
        </div>
        <div key="ordersByShop">
          <OrdersByShopChart />
        </div>
        <div key="shopStatus">
          <ShopStatusChart />
        </div>

        <div key="couponUsage">
          <CouponUsageBarChart />
        </div>

        <div key="revenueTrend">
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
                Revenue Trend
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

            <LineChart
              xData={["Jan", "Feb", "Mar", "Apr", "May"]}
              yData={[5000, 7000, 6000, 9000, 8500]}
              label="Revenue ($)"
            />
          </Card>
        </div>
      </ResponsiveGridLayout>
    </Box>
  );
}
