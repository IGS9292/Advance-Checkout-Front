import { useEffect, useState } from "react";
import {
  Card,
  Typography,
  CircularProgress,
  Box,
  IconButton,
  Popover,
  Tooltip
} from "@mui/material";
import { getAllShops } from "../../../services/ShopService";
import { getOrders } from "../../../services/OrderService";
import {
  DragIndicatorOutlined,
  FilterAltOffOutlined,
  FilterAltOutlined
} from "@mui/icons-material";
import type { DateFilterState } from "../../../shared/components/DateFilter";
import DateFilter from "../../../shared/components/DateFilter";

interface CountChartProps {
  label: string;
  type: "orders" | "shops";
  token?: string;
}

export default function CountChart({ label, type, token }: CountChartProps) {
  const [value, setValue] = useState<number | null>(null);

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
      </Box>

      {/* Centered content */}
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
