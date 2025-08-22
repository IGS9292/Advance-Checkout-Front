import { useEffect, useState } from "react";
import { getAllShops } from "../../../services/ShopService";
import PieChart from "../charts/PieChart";
import { Box, Card, CircularProgress, Stack, Typography } from "@mui/material";
import { DragIndicatorOutlined } from "@mui/icons-material";
import type { DateFilterState } from "../../../shared/components/DateFilter";
import FilterView from "../../../shared/components/FilterView";

const ShopStatusChart = () => {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<DateFilterState>({
    range: "today"
  });

  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        setLoading(true);
        const res = await getAllShops();
        const shops = res?.shops || [];

        const statusCounts: any = {
          approved: 0,
          pending: 0
        };

        shops.forEach((shop: any) => {
          const status = shop.status;
          if (statusCounts.hasOwnProperty(status)) {
            statusCounts[status]++;
          }
        });

        const formattedData: any = [
          { name: "Approved", value: statusCounts.approved },
          { name: "Pending", value: statusCounts.pending }
        ];

        setData(formattedData);
      } catch (error) {
        console.error("Failed to fetch shop statuses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatusCounts();
  }, []);

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
          Shop Status
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
        {/* <FilterView dateFilter={dateFilter} setDateFilter={setDateFilter} /> */}

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
        <PieChart data={data} />
      )}
    </Card>
  );
};

export default ShopStatusChart;
