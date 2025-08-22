// src/pages/view/PlanListView.tsx
import {
  Box,
  Typography,
  Stack,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormLabel
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import CustomizedDataGrid from "../dashboard/components/CustomizedDataGrid";
import Search from "../../shared/components/Search";
import DownloadMenu from "../../shared/components/DownloadMenu";
import { usePlanColumns } from "../plan/components/usePlanColumns";
import { createPlan, updatePlan, deletePlan } from "../../services/PlanService";
import { LoadingButton } from "@mui/lab";

const baseURL = import.meta.env.VITE_API_BASE as string;

export default function PlanListView() {
  const [rows, setRows] = useState<any[]>([]);
  const [originalRows, setOriginalRows] = useState<any[]>([]);
  const [filteredRows, setFilteredRows] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  // const [dateFilter, setDateFilter] = useState<DateFilterState>({
  //   range: "all"
  // });
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);

  const gridRef = useRef<HTMLDivElement>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      plan_name: "",
      order_range: "",
      sales_fee: ""
    }
  });

  const handleEdit = (row: any) => {
    setEditingRow(row);
    setValue("plan_name", row.plan_name || "");
    setValue("order_range", row.order_range || "");
    setValue("sales_fee", row.sales_fee || "");
    setOpenDialog(true);
  };

  const handleDelete = async (row: any) => {
    if (window.confirm(`Delete plan: ${row.plan_name}?`)) {
      try {
        await deletePlan(row.id);
        await fetchPlans(setOriginalRows, setFilteredRows);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const { columnsMeta, fetchPlans } = usePlanColumns(handleEdit, handleDelete);

  // Initial fetch
  useEffect(() => {
    fetchPlans(setOriginalRows, setFilteredRows);
  }, []);

  // Search filter
  useEffect(() => {
    const filtered = filteredRows.filter((row) =>
      row.plan_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setRows(filtered);
  }, [searchTerm, filteredRows]);

  const handleOpenDialog = () => {
    reset();
    setEditingRow(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRow(null);
    reset();
  };

  const onSubmit = async (data: any) => {
    const payload = {
      plan_name: data.plan_name,
      order_range: data.order_range,
      sales_fee: data.sales_fee
    };
    setLoading(true);
    try {
      if (editingRow) {
        await updatePlan(editingRow.id, payload);
        alert("✅ Plan updated");
      } else {
        await createPlan(payload);
        alert("✅ Plan created successfully");
      }
      handleCloseDialog();
      await fetchPlans(setOriginalRows, setFilteredRows);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2
        }}
      >
        <Typography component="h2" variant="h6">
          Plans
        </Typography>
        <Stack direction="row" spacing={2}>
          <Search onSearch={setSearchTerm} />
          {/* <TableFilter
            rows={originalRows}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            onFilter={setFilteredRows}
            dateField="createdAt" // make sure API returns createdAt for plans
          /> */}
          <DownloadMenu rows={filteredRows} columns={columnsMeta} />
          <Button variant="contained" onClick={handleOpenDialog}>
            Add Plan
          </Button>
        </Stack>
      </Box>

      {/* Table */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Box sx={{ width: "100%", overflowX: "auto" }} ref={gridRef}>
            <CustomizedDataGrid rows={rows} columns={columnsMeta} />
          </Box>
        </Grid>
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingRow ? "Edit Plan" : "Add Plan"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} mt={1}>
              {/* Plan Name */}
              <FormControl fullWidth required>
                <FormLabel>Plan Name</FormLabel>
                <Controller
                  name="plan_name"
                  control={control}
                  rules={{ required: "Plan Name is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      error={!!errors.plan_name}
                      helperText={errors.plan_name?.message}
                    />
                  )}
                />
              </FormControl>

              {/* Order Range */}
              <FormControl fullWidth required>
                <FormLabel>Order Range</FormLabel>
                <Controller
                  name="order_range"
                  control={control}
                  rules={{ required: "Order Range is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      error={!!errors.order_range}
                      helperText={errors.order_range?.message}
                    />
                  )}
                />
              </FormControl>

              {/* Sales Fee */}
              <FormControl fullWidth required>
                <FormLabel>Sales Fee (%)</FormLabel>
                <Controller
                  name="sales_fee"
                  control={control}
                  rules={{
                    required: "Sales Fee is required",
                    validate: (value) =>
                      !isNaN(Number(value)) || "Sales Fee must be a number"
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      error={!!errors.sales_fee}
                      helperText={errors.sales_fee?.message}
                    />
                  )}
                />
              </FormControl>
            </Stack>

            <DialogActions sx={{ mt: 2 }}>
              <Button onClick={handleCloseDialog} variant="outlined">
                Cancel
              </Button>
              <LoadingButton
                variant="contained"
                type="submit"
                loading={loading}
              >
                {editingRow ? "Update" : "Save"}
              </LoadingButton>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
