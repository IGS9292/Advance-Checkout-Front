import React, { useState } from "react";
import { Tooltip, IconButton, Popover } from "@mui/material";
import { FilterAltOutlined, FilterAltOffOutlined } from "@mui/icons-material";
import DateFilter from "./DateFilter";

interface FilterViewProps {
  dateFilter: any;
  setDateFilter: (filter: any) => void;
}

const FilterView: React.FC<FilterViewProps> = ({
  dateFilter,
  setDateFilter
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const isFilterApplied = dateFilter?.range && dateFilter.range !== "today";

  return (
    <>
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
            onClick={() => setDateFilter({ range: "today" })}
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
    </>
  );
};

export default FilterView;
