// src/pages/view/CouponsListView.tsx
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
  FormLabel,
  MenuItem,
  CircularProgress
} from "@mui/material";
import { useState, useEffect } from "react";
import CustomizedDataGrid from "../dashboard/components/CustomizedDataGrid";
import {
  getCoupons,
  deleteCoupon,
  updateCouponStatus,
  updateCoupon,
  createCoupon
} from "../../services/CouponService";
import { useCouponColumns } from "../coupons/useCouponColumns";
import SyncIcon from "@mui/icons-material/Sync";
import Search from "../../shared/components/Search";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";

const baseURL = import.meta.env.VITE_API_BASE as string;
export default function CouponsListView() {
  const [rows, setRows] = useState<any[]>([]);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRows, setFilteredRows] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: "",
      discount: "",
      usageLimit: "",
      startsAt: "",
      endsAt: "",
      status: "pending"
    }
  });
  const handleEdit = (row: any) => {
    setEditingRow(row);
    setValue("title", row.title);
    setValue("discount", row.couponDetail?.value || "");
    setValue("usageLimit", row.couponDetail?.usage_limit || "");
    setValue("startsAt", row.couponDetail?.starts_at?.slice(0, 10) || "");
    setValue("endsAt", row.couponDetail?.ends_at?.slice(0, 10) || "");
    setValue("status", row.status);

    setOpenDialog(true);
  };

  const handleDelete = async (row: any) => {
    if (window.confirm("Delete this coupon?")) {
      try {
        await deleteCoupon(row.id);
        fetchCouponsDetails(setRows, setFilteredRows, baseURL);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await updateCouponStatus(id, "approved", user?.token);
      alert("✅ Request approved and email sent successfully");
      fetchCouponsDetails(setRows, setFilteredRows, baseURL);
    } catch (err) {
      console.error("Approval failed", err);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await updateCouponStatus(id, "rejected", user?.token);
      fetchCouponsDetails(setRows, setFilteredRows, baseURL);
    } catch (err) {
      console.error("Rejection failed", err);
    }
  };

  const { columnsMeta: dynamicCols, fetchCouponsDetails } = useCouponColumns(
    handleEdit,
    handleDelete,
    handleApprove,
    handleReject
  );

  useEffect(() => {
    fetchCouponsDetails(setRows, setFilteredRows, baseURL);
  }, []);

  const handleSync = async () => {
    setLoading(true);
    try {
      await fetchCouponsDetails(setRows, setFilteredRows, baseURL);
    } catch (err) {
      console.error("Sync failed:", err);
    } finally {
      setLoading(false);
    }
  };
  // Filter rows based on searchTerm
  useEffect(() => {
    const filtered = filteredRows.filter((row) => {
      const couponTitleMatch = row.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const statusMatch = row.status
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      return couponTitleMatch || statusMatch;
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
    const couponDetailsPayload = {
      discount: parseFloat(data.discount),
      usageLimit: parseInt(data.usageLimit),
      startsAt: data.startsAt,
      endsAt: data.endsAt
    };

    try {
      if (editingRow) {
        const payload = {
          couponDetails: couponDetailsPayload,
          status: data.status
        };
        console.log("🟢 onSubmit payload", payload);
        await updateCoupon(editingRow.id, payload, user?.token);
        alert("✅ Coupon details updated ");
      } else {
        // ✅ Send `title` when creating new coupon
        const payload = {
          title: data.title,
          couponDetails: couponDetailsPayload,
          status: data.status
        };
        console.log("🟢 onSubmit payload", payload);
        await createCoupon(payload, user?.token);
        alert("✅ Coupon created successfully");
      }

      handleCloseDialog();
      await fetchCouponsDetails(setRows, setFilteredRows, baseURL);
    } catch (err) {
      console.error("Save failed:", err);
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
          Coupons
        </Typography>

        <Stack direction="row" spacing={2}>
          <Search onSearch={(value) => setSearchTerm(value)} />
          {/* <Button variant="contained" onClick={() => setOpen(true)}> */}
          <Button variant="contained" onClick={handleOpenDialog}>
            Add Coupon
          </Button>
          <Button
            variant="contained"
            color="secondary"
            loading={loading}
            loadingPosition="start"
            startIcon={<SyncIcon />}
            onClick={handleSync}
          >
            Sync
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
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingRow ? "Edit Coupon" : "Add Coupon"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} mt={1}>
              <FormControl fullWidth required>
                <FormLabel>Coupon Title</FormLabel>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: "Title required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      error={!!errors.title}
                      helperText={errors.title?.message}
                    />
                  )}
                  disabled={!!editingRow}
                />
              </FormControl>

              <FormControl fullWidth required>
                <FormLabel>Discount</FormLabel>
                <Controller
                  name="discount"
                  control={control}
                  rules={{ required: "Discount required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      error={!!errors.discount}
                      helperText={errors.discount?.message}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth required>
                <FormLabel>Usage Limit</FormLabel>
                <Controller
                  name="usageLimit"
                  control={control}
                  rules={{ required: "Usage limit required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      error={!!errors.usageLimit}
                      helperText={errors.usageLimit?.message}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth required>
                <FormLabel>Starts At</FormLabel>
                <Controller
                  name="startsAt"
                  control={control}
                  rules={{ required: "Starts at required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="date"
                      error={!!errors.startsAt}
                      helperText={errors.startsAt?.message}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth required>
                <FormLabel>Ends At</FormLabel>
                <Controller
                  name="endsAt"
                  control={control}
                  rules={{ required: "Ends at required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="date"
                      error={!!errors.endsAt}
                      helperText={errors.endsAt?.message}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth required>
                <FormLabel>Status</FormLabel>
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: "Status required" }}
                  render={({ field }) => (
                    <TextField
                      select
                      {...field}
                      error={!!errors.status}
                      helperText={errors.status?.message}
                    >
                      <MenuItem value="approved">approved</MenuItem>
                      <MenuItem value="pending">pending</MenuItem>
                    </TextField>
                  )}
                />
              </FormControl>
            </Stack>

            <DialogActions sx={{ mt: 2 }}>
              <Button onClick={handleCloseDialog}  variant="outlined">Cancel</Button>
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
