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
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import CustomizedDataGrid from "../dashboard/components/CustomizedDataGrid";
import Search from "../../shared/components/Search";
import { usePlanColumns } from "../plan/components/usePlanColumns";
import { createPlan, updatePlan, deletePlan } from "../../services/PlanService"; // <-- you’ll need this

export default function PlanListView() {
  const [rows, setRows] = useState<any[]>([]);
  const [filteredRows, setFilteredRows] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);

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
        await fetchPlans(setRows, setFilteredRows);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const { columnsMeta, fetchPlans } = usePlanColumns(handleEdit, handleDelete);

  useEffect(() => {
    fetchPlans(setRows, setFilteredRows);
  }, []);

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

    try {
      if (editingRow) {
        await updatePlan(editingRow.id, payload);
        alert("✅ Plan updated");
      } else {
        await createPlan(payload);
        alert("✅ Plan created successfully");
      }
      handleCloseDialog();
      await fetchPlans(setRows, setFilteredRows);
    } catch (err) {
      console.error("Save failed:", err);
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
          <Search onSearch={(value) => setSearchTerm(value)} />

          <Button variant="contained" onClick={handleOpenDialog}>
            Add Plan
          </Button>
        </Stack>
      </Box>

      {/* Table */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <CustomizedDataGrid rows={rows} columns={columnsMeta} />
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
              <Button variant="contained" type="submit">
                {editingRow ? "Update" : "Save"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
