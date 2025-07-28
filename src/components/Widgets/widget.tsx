import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import CountChart from "./charts/CountChart";

import LineChart from "../../components/Widgets/charts/LineChart";

import { Box, Card } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import OrdersPerDayChart from "./components/OrdersPerDayChart";
import OrdersByShopChart from "./components/OrdersByShopChart";
import ShopStatusChart from "./components/ShopStatusChart";
import CouponUsageBarChart from "./components/CouponUsageBarChart";

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function DashboardGrid() {
  const { user } = useAuth();
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
        isResizable
        isDraggable
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
          <Card sx={{ height: "100%", p: 2 }}>
            <OrdersByShopChart />
          </Card>
        </div>
        <div key="shopStatus">
          <Card sx={{ height: "100%", p: 2 }}>
            <ShopStatusChart />
          </Card>
        </div>
        <div key="couponUsage">
          <Card sx={{ height: "100%", p: 2 }}>
            <CouponUsageBarChart />
          </Card>
        </div>
        <div key="revenueTrend">
          <Card sx={{ height: "100%", p: 2 }}>
            <LineChart
              title="Revenue Trend"
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
