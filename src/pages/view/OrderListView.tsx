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
import { useState, useEffect } from "react";
import CustomizedDataGrid from "../dashboard/components/CustomizedDataGrid";
import SyncIcon from "@mui/icons-material/Sync";
import Search from "../../shared/components/Search";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import { UseOrderColumns } from "../orders/components/UseOrderColumns";
import {
  createOrder,
  deleteOrder,
  updateOrder
} from "../../services/OrderService";



const baseURL = import.meta.env.VITE_API_BASE as string;

export default function OrderListView() {
  const [rows, setRows] = useState<any[]>([]);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRows, setFilteredRows] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user,role } = useAuth();

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
        await deleteOrder(row.id,user?.token);
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
    fetchOrderDetails(setRows, setFilteredRows, baseURL);
  }, []);

  const handleSync = async () => {
    setLoading(true);
    try {
      await fetchOrderDetails(setRows, setFilteredRows, baseURL);
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
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
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
          <Search onSearch={(value) => setSearchTerm(value)} />
          <Button variant="contained" onClick={handleOpenDialog}>
            Add Order
          </Button>
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
          <CustomizedDataGrid rows={rows} columns={columns} />
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
                  rules={{ required: "Required" }}
                  render={({ field }) => <TextField {...field} />}
                />
              </FormControl>

              <FormControl fullWidth required>
                <FormLabel>Order Quantity</FormLabel>
                <Controller
                  name="order_qty"
                  control={control}
                  rules={{ required: "Required" }}
                  render={({ field }) => <TextField {...field} type="number" />}
                />
              </FormControl>

              <FormControl fullWidth required>
                <FormLabel>Total Amount</FormLabel>
                <Controller
                  name="total_amount"
                  control={control}
                  rules={{ required: "Required" }}
                  render={({ field }) => <TextField {...field} type="number" />}
                />
              </FormControl>
            </Stack>

            <DialogActions sx={{ mt: 2 }}>
              <Button onClick={handleCloseDialog}>Cancel</Button>
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
