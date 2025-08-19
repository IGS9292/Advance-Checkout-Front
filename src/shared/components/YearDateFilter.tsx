import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField
} from "@mui/material";
import { useState, useEffect } from "react";

const presetOptions = [
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "this_year", label: "This Year" },
  { value: "last_year", label: "Last Year" },
  { value: "custom", label: "Custom Range" }
];

type DateFilterRange =
  | "this_month"
  | "last_month"
  | "this_year"
  | "last_year"
  | "custom";

export interface DateFilterState {
  range: DateFilterRange;
  startDate?: string;
  endDate?: string;
}

interface Props {
  filter: DateFilterState;
  setFilter: (filter: DateFilterState) => void;
  onClear: () => void;
}

export default function YearDateFilter({ filter, setFilter, onClear }: Props) {
  // Default range: this_year
  const [localFilter, setLocalFilter] = useState<DateFilterState>(
    filter || { range: "this_year" }
  );

  useEffect(() => {
    // Initialize with this_year if not set
    if (!filter) {
      setLocalFilter({ range: "this_year" });
      setFilter({ range: "this_year" });
    }
  }, [filter, setFilter]);

  const handleClear = () => {
    setLocalFilter({ range: "this_year" });
    setFilter({ range: "this_year" });
    onClear();
  };

  const handleApply = () => {
    setFilter(localFilter);
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <FormControl size="small" fullWidth>
        <InputLabel>Date Range</InputLabel>
        <Select
          label="Date Range"
          value={localFilter.range}
          onChange={(e) =>
            setLocalFilter((prev) => ({
              ...prev,
              range: e.target.value as DateFilterRange
            }))
          }
        >
          {presetOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {localFilter.range === "custom" && (
        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            size="small"
            type="date"
            label="Start"
            value={localFilter.startDate || ""}
            onChange={(e) =>
              setLocalFilter((prev) => ({
                ...prev,
                startDate: e.target.value
              }))
            }
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            size="small"
            type="date"
            label="End"
            value={localFilter.endDate || ""}
            onChange={(e) =>
              setLocalFilter((prev) => ({
                ...prev,
                endDate: e.target.value
              }))
            }
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      )}

      <Box display="flex" justifyContent="space-between" mt={1}>
        <Button variant="outlined" onClick={handleClear}>
          Clear
        </Button>
        <Button
          variant="contained"
          onClick={handleApply}
          disabled={
            localFilter.range === filter.range &&
            (localFilter.range !== "custom" ||
              (localFilter.startDate === filter.startDate &&
                localFilter.endDate === filter.endDate))
          }
        >
          Apply
        </Button>
      </Box>
    </Box>
  );
}
