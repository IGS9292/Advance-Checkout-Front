// src/pages/view/OrderListView.tsx
import {
  Box,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControl,
  FormLabel
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useState, useEffect, useRef } from "react";
import CustomizedDataGrid from "../dashboard/components/CustomizedDataGrid";
import SyncIcon from "@mui/icons-material/Sync";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import { UseOrderColumns } from "../orders/components/UseOrderColumns";
import {
  createOrder,
  deleteOrder,
  updateOrder
} from "../../services/OrderService";
import type { DateFilterState } from "../../shared/components/DateFilter";
import TableFilter from "../../shared/components/TableFilter";
import DownloadMenu from "../../shared/components/DownloadMenu";
import Search from "../../shared/components/Search";

const baseURL = import.meta.env.VITE_API_BASE as string;

export default function OrderListView() {
  const { user, role } = useAuth();
  const [rows, setRows] = useState<any[]>([]);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [originalRows, setOriginalRows] = useState<any[]>([]); // <- always raw API
  const [filteredRows, setFilteredRows] = useState<any[]>([]); // <- what grid shows
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilterState>({
    range: "all"
  });

  const gridRef = useRef<HTMLDivElement>(null);
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      shopName: "",
      order_id: "",
      order_qty: "",
      total_amount: ""
    }
  });

  const handleEdit = (row: any) => {
    setEditingRow(row);
    setValue("shopName", row.shopName || "");
    setValue("order_id", row.order_id || "");
    setValue("order_qty", row.order_qty || "");
    setValue("total_amount", row.total_amount || "");
    setOpenDialog(true);
  };

  const handleDelete = async (row: any) => {
    if (window.confirm("Delete this order detail?")) {
      try {
        await deleteOrder(row.id, user?.token);
        fetchOrderDetails(setRows, setFilteredRows, baseURL);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const { columnsMeta: dynamicCols, fetchOrderDetails } = UseOrderColumns(
    handleEdit,
    handleDelete
  );

  useEffect(() => {
    fetchOrderDetails(setOriginalRows, setFilteredRows, baseURL);
  }, []);

  const handleSync = async () => {
    setLoading(true);
    try {
      await fetchOrderDetails(setOriginalRows, setFilteredRows, baseURL);
    } catch (err) {
      console.error("Sync failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = filteredRows.filter((row) => {
      const orderQty = String(row.order_qty)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const shopName = row.shopName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      return orderQty || shopName;
    });
    setRows(filtered);
  }, [searchTerm, filteredRows]);

  const columns = dynamicCols;

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
      order_id: data.order_id,
      order_qty: data.order_qty,
      total_amount: data.total_amount
    };
    setLoading(true);
    try {
      if (editingRow) {
        await updateOrder(editingRow.id, payload, user?.token);
        alert("✅ Order details updated");
      } else {
        await createOrder(payload, user?.token);
        alert("✅ Order created successfully");
      }

      handleCloseDialog();
      await fetchOrderDetails(setRows, setFilteredRows, baseURL);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px", lg: "100%" } }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2
        }}
      >
        <Typography component="h2" variant="h6">
          Orders
        </Typography>

        <Stack direction="row" spacing={2}>
          <Search onSearch={setSearchTerm} />
          <TableFilter
            rows={originalRows}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            onFilter={setFilteredRows}
            dateField="createdAt"
          />
          <DownloadMenu rows={filteredRows} columns={dynamicCols} />
          {role == "1" && (
            <Button variant="contained" onClick={handleOpenDialog}>
              Add Order
            </Button>
          )}
          <Button
            variant="contained"
            color="secondary"
            disabled={loading}
            startIcon={<SyncIcon />}
            onClick={handleSync}
          >
            {loading ? "Syncing..." : "Sync"}
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Box sx={{ width: "100%", overflowX: "auto" }} ref={gridRef}>
            <CustomizedDataGrid rows={filteredRows} columns={dynamicCols} />
          </Box>
        </Grid>
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingRow ? "Edit Order Details" : "Add Order"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} mt={1}>
              {role === "0" && (
                <FormControl fullWidth>
                  <FormLabel>Shop Name</FormLabel>
                  <Controller
                    name="shopName"
                    control={control}
                    render={({ field }) => <TextField {...field} disabled />}
                  />
                </FormControl>
              )}

              <FormControl fullWidth required>
                <FormLabel>Order Id</FormLabel>
                <Controller
                  name="order_id"
                  control={control}
                  rules={{ required: "Order Id required " }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      error={!!errors.order_id}
                      helperText={errors.order_id?.message}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth required>
                <FormLabel>Order Quantity</FormLabel>
                <Controller
                  name="order_qty"
                  control={control}
                  rules={{ required: "Order Quantity Required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      error={!!errors.order_qty}
                      helperText={errors.order_qty?.message}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth required>
                <FormLabel>Total Amount</FormLabel>
                <Controller
                  name="total_amount"
                  control={control}
                  rules={{ required: "Total Amount required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      error={!!errors.total_amount}
                      helperText={errors.total_amount?.message}
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
                loading={loading} // 👈 spinner
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
