import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { getOrdersByShop } from "../../../services/WidgetService";
import BarChart from "../charts/BarChart";
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
import {
  DragIndicatorOutlined,
  FilterAltOffOutlined,
  FilterAltOutlined
} from "@mui/icons-material";
import type { DateFilterState } from "../../../shared/components/DateFilter";
import DateFilter from "../../../shared/components/DateFilter";

export default function OrdersByShopChart() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);

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
      {/* Title center aligned */}
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
