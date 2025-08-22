import {
  Box,
  Typography,
  Button,
  Stack,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  FormLabel
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import CustomizedDataGrid from "../dashboard/components/CustomizedDataGrid";
import Search from "../../shared/components/Search";
import { useDynamicColumns } from "../paymentGateway/components/usePaymentGatewayCols";
import {
  createPaymentMethod,
  deletePaymentMethod,
  updatePaymentMethod,
  updatePaymentMethodStatus
} from "../../services/PaymentGatewayService";
import { FileUpload } from "../../shared/components/FileUpload";
import { LoadingButton } from "@mui/lab";

const baseURL = import.meta.env.VITE_API_BASE as string;

const PaymentGatewayList = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRows, setFilteredRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      paymentGatewayName: "",
      gatewayImageUrl: "",
      status: "active"
    }
  });

  const handleEdit = (row: any) => {
    setEditingRow(row);
    setValue("paymentGatewayName", row.paymentGatewayName);
    setValue("gatewayImageUrl", row.gatewayImageUrl);
    setValue("status", row.status);
    setOpenDialog(true);
  };

  const handleDelete = async (row: any) => {
    if (window.confirm("Delete this payment method?")) {
      try {
        await deletePaymentMethod(row.id);
        await fetchPaymentColumnsAndData(setRows, setFilteredRows, baseURL);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await updatePaymentMethodStatus(id, "active");
      alert(`Payment method activated successfully`);
      await fetchPaymentColumnsAndData(setRows, setFilteredRows, baseURL);
    } catch (err) {
      console.error("Approval failed", err);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await updatePaymentMethodStatus(id, "inactive");
      await fetchPaymentColumnsAndData(setRows, setFilteredRows, baseURL);
    } catch (err) {
      console.error("Rejection failed", err);
    }
  };

  const { columnsMeta: dynamicCols, fetchPaymentColumnsAndData } =
    useDynamicColumns(handleEdit, handleDelete, handleApprove, handleReject);

  useEffect(() => {
    fetchPaymentColumnsAndData(setRows, setFilteredRows, baseURL);
  }, []);

  useEffect(() => {
    const filtered = filteredRows.filter((row) => {
      return (
        row.paymentGatewayName
          ?.toLowerCase()
          .startsWith(searchTerm.toLowerCase()) ||
        row.status?.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
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
      paymentGatewayName: data.paymentGatewayName,
      gatewayImageUrl: data.gatewayImageUrl,
      status: data.status as "active" | "inactive"
    };
    setLoading(true);

    try {
      if (editingRow) {
        await updatePaymentMethod(editingRow.id, payload);
        alert("Payment method updated");
      } else {
        await createPaymentMethod(payload);
        alert("Payment method added successfully");
      }
      handleCloseDialog();
      await fetchPaymentColumnsAndData(setRows, setFilteredRows, baseURL);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const watchImage = useWatch({ control, name: "gatewayImageUrl" });

  return (
    <>
      <Box
        sx={{
          width: "100%",
          maxWidth: { sm: "100%", lg: "100%" }
        }}
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
            Payment Gateways
          </Typography>
          <Stack direction="row" spacing={2}>
            <Search onSearch={(value) => setSearchTerm(value)} />
            {/* <DownloadMenu rows={filteredRows} columns={columns} /> */}

            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenDialog}
            >
              Add Payment Method
            </Button>
          </Stack>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Box sx={{ width: "100%", overflowX: "auto" }}>
              <CustomizedDataGrid rows={rows} columns={columns} />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingRow ? "Edit Payment Method" : "Add New Payment Method"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} mt={1}>
              <FormControl fullWidth required>
                <FormLabel>Payment Gateway Name</FormLabel>
                <Controller
                  name="paymentGatewayName"
                  control={control}
                  rules={{ required: "Payment Gateway Name is required." }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      error={!!errors.paymentGatewayName}
                      helperText={errors.paymentGatewayName?.message}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth>
                <FormLabel>Gateway Image</FormLabel>

                {/* Upload Button */}
                <FileUpload
                  onUploadSuccess={(url: any) => {
                    setValue("gatewayImageUrl", url);
                  }}
                />

                {/* Optional image preview */}
                {watchImage && (
                  <Box mt={1}>
                    <img
                      src={watchImage}
                      alt="Preview"
                      style={{ width: 150, borderRadius: 8 }}
                    />
                  </Box>
                )}
              </FormControl>

              <FormControl fullWidth required>
                <FormLabel>Status</FormLabel>
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: "Status is required." }}
                  render={({ field }) => (
                    <TextField select {...field}>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </TextField>
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
    </>
  );
};

export default PaymentGatewayList;
