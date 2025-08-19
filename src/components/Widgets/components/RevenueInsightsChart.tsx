import {
  Card,
  Typography,
  Box,
  Stack,
  IconButton,
  Popover,
  Tooltip,
  CircularProgress
} from "@mui/material";
import {
  FilterAltOutlined,
  FilterAltOffOutlined,
  DragIndicatorOutlined
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import DoubleBarChart, { type RevenueMonth } from "../charts/DoubleBarChart";
import { getRevenueInsights } from "../../../services/WidgetService";
import YearDateFilter, {
  type DateFilterState
} from "../../../shared/components/YearDateFilter";

const RevenueInsights = () => {
  const [data, setData] = useState<RevenueMonth[]>([]);

  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Default filter: this_year
  const [dateFilter, setDateFilter] = useState<DateFilterState>({
    range: "this_year"
  });

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const isFilterApplied =
    dateFilter.range !== "this_year" &&
    !(
      dateFilter.range === "custom" &&
      !dateFilter.startDate &&
      !dateFilter.endDate
    );

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || undefined;
      const res = await getRevenueInsights(token, dateFilter);
      setData(res);
    } catch (err) {
      console.error("Error fetching revenue insights:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, [dateFilter]);

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
          Revenue Insights
        </Typography>
      </Box>

      {/* Filter & icons */}
      <Stack
        direction="row"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          alignItems: "center"
        }}
      >
        <Tooltip title="Filter by date">
          <IconButton
            sx={{ border: "none", boxShadow: "none" }}
            onClick={handleFilterClick}
          >
            <FilterAltOutlined color="primary" />
          </IconButton>
        </Tooltip>

        {isFilterApplied && (
          <Tooltip title="Clear filter">
            <IconButton
              sx={{ border: "none", boxShadow: "none" }}
              onClick={() => setDateFilter({ range: "this_year" })}
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
          <YearDateFilter
            filter={dateFilter}
            setFilter={(f) => {
              setDateFilter(f);
              handleFilterClose();
            }}
            onClear={() => {
              setDateFilter({ range: "this_year" });
              handleFilterClose();
            }}
          />
        </Popover>

        <DragIndicatorOutlined color="action" sx={{ cursor: "grab" }} />
      </Stack>

      {/* Chart */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", flexGrow: 1 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DoubleBarChart data={data} />
      )}
    </Card>
  );
};

export default RevenueInsights;
