import React, { useEffect, useState } from "react";
import { Stack, Tooltip, IconButton, Popover } from "@mui/material";
import { FilterAltOutlined, FilterAltOffOutlined } from "@mui/icons-material";
import DateFilter from "./DateFilter";
import type { DateFilterState } from "../../shared/components/DateFilter";

interface TableFilterProps {
  rows: any[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  dateFilter: DateFilterState;
  setDateFilter: (val: DateFilterState) => void;
  onFilter: (filteredRows: any[]) => void;
  dateField?: string;
}

const TableFilter: React.FC<TableFilterProps> = ({
  rows,
  searchTerm,
  setSearchTerm,
  dateFilter,
  setDateFilter,
  onFilter,
  dateField = "createdAt"
}) => {
  const [filteredData, setFilteredData] = useState<any[]>([]);

  useEffect(() => {
    if (!rows || rows.length === 0) {
      onFilter([]);
      setFilteredData([]);
      return;
    }

    const filtered = rows.filter((row) => {
      const rowDate = row[dateField] ? new Date(row[dateField]) : null;

      // Date filter
      let matchDate = true;
      if (dateFilter.range && dateFilter.range !== "all" && rowDate) {
        const now = new Date();

        switch (dateFilter.range) {
          case "today":
            matchDate = rowDate.toDateString() === now.toDateString();
            break;
          case "yesterday": {
            const yesterday = new Date();
            yesterday.setDate(now.getDate() - 1);
            matchDate = rowDate.toDateString() === yesterday.toDateString();
            break;
          }

          case "this_week": {
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            matchDate = rowDate >= startOfWeek && rowDate <= endOfWeek;
            break;
          }
          case "last_week": {
            const startOfLastWeek = new Date(now);
            startOfLastWeek.setDate(now.getDate() - now.getDay() - 7);
            const endOfLastWeek = new Date(startOfLastWeek);
            endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
            matchDate = rowDate >= startOfLastWeek && rowDate <= endOfLastWeek;
            break;
          }
          case "last_month": {
            const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const end = new Date(now.getFullYear(), now.getMonth(), 0);
            matchDate = rowDate >= start && rowDate <= end;
            break;
          }
          case "custom":
            if (dateFilter.startDate && dateFilter.endDate) {
              const from = new Date(dateFilter.startDate);
              const to = new Date(dateFilter.endDate);
              matchDate = rowDate >= from && rowDate <= to;
            }
            break;
        }
      }

      // Search filter
      const searchMatch = Object.values(row).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );

      return matchDate && searchMatch;
    });

    setFilteredData(filtered);
    onFilter(filtered);
  }, [rows, searchTerm, dateFilter]);

  // Popover state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleFilterClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);

  const isFilterApplied = dateFilter.range && dateFilter.range !== "all";

  const handleClearFilter = () => {
    setDateFilter({ range: "all" });
    setSearchTerm("");
    handleFilterClose();
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">


      <Tooltip title="Filter by date">
        <IconButton
          sx={{ border: "none", outline: "none", boxShadow: "none" }}
          onClick={handleFilterClick}
        >
          <FilterAltOutlined color="primary" />
        </IconButton>
      </Tooltip>

      {isFilterApplied && (
        <Tooltip title="Clear filter">
          <IconButton
            sx={{ border: "none", outline: "none", boxShadow: "none" }}
            onClick={handleClearFilter}
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
          onClear={handleClearFilter}
        />
      </Popover>
    </Stack>
  );
};

export default TableFilter;
