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
import { useState } from "react";

const presetOptions = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "this_week", label: "This Week" },
  { value: "last_week", label: "Last Week" },
  { value: "last_month", label: "Last Month" },
  { value: "custom", label: "Custom Range" }
];

type DateFilterRange =
  | "all"
  | "today"
  | "yesterday"
  | "this_week"
  | "last_week"
  | "last_month"
  | "custom";

export interface DateFilterState {
  range?: DateFilterRange;
  startDate?: string;
  endDate?: string;
}

interface Props {
  filter: DateFilterState;
  setFilter: (filter: DateFilterState) => void;
  onClear: () => void;
}

export default function DateFilter({ filter, setFilter, onClear }: Props) {
  const [localFilter, setLocalFilter] = useState<DateFilterState>({
    range: filter?.range && filter.range !== "all" ? filter.range : "today"
  });

  const handleClear = () => {
    setLocalFilter({ range: "today" });
    setFilter({ range: "today" });
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
