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
  MenuItem
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useState, useEffect } from "react";
import CustomizedDataGrid from "../dashboard/components/CustomizedDataGrid";
import {
  deleteCoupon,
  updateCouponStatus,
  updateCoupon,
  createCoupon
} from "../../services/CouponService";
import { useCouponColumns } from "../coupons/useCouponColumns";
import SyncIcon from "@mui/icons-material/Sync";
import Search from "../../shared/components/Search";
import TableFilter from "../../shared/components/TableFilter";
import DownloadMenu from "../../shared/components/DownloadMenu";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import type { DateFilterState } from "../../shared/components/DateFilter";

const baseURL = import.meta.env.VITE_API_BASE as string;

export default function CouponsListView() {
  const [rows, setRows] = useState<any[]>([]);
  const [originalRows, setOriginalRows] = useState<any[]>([]);
  const [filteredRows, setFilteredRows] = useState<any[]>([]);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilterState>({
    range: "all"
  });
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
        fetchCouponsDetails(setOriginalRows, setFilteredRows, baseURL);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await updateCouponStatus(id, "approved", user?.token);
      alert("✅ Request approved and email sent successfully");
      fetchCouponsDetails(setOriginalRows, setFilteredRows, baseURL);
    } catch (err) {
      console.error("Approval failed", err);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await updateCouponStatus(id, "rejected", user?.token);
      fetchCouponsDetails(setOriginalRows, setFilteredRows, baseURL);
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
    fetchCouponsDetails(setOriginalRows, setFilteredRows, baseURL);
  }, []);

  const handleSync = async () => {
    setLoading(true);
    try {
      await fetchCouponsDetails(setOriginalRows, setFilteredRows, baseURL);
    } catch (err) {
      console.error("Sync failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔎 Apply search on filteredRows
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
    setLoading(true);
    try {
      if (editingRow) {
        const payload = {
          couponDetails: couponDetailsPayload,
          status: data.status
        };
        await updateCoupon(editingRow.id, payload, user?.token);
        alert("✅ Coupon details updated ");
      } else {
        const payload = {
          title: data.title,
          couponDetails: couponDetailsPayload,
          status: data.status
        };
        await createCoupon(payload, user?.token);
        alert("✅ Coupon created successfully");
      }

      handleCloseDialog();
      await fetchCouponsDetails(setOriginalRows, setFilteredRows, baseURL);
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
      {/* Header */}
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
          <TableFilter
            rows={originalRows}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            onFilter={setFilteredRows}
            dateField="createdAt" // make sure API returns createdAt
          />
          <DownloadMenu rows={filteredRows} columns={columns} />
          <Button variant="contained" onClick={handleOpenDialog}>
            Add Coupon
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<SyncIcon />}
            onClick={handleSync}
            disabled={loading}
          >
            {loading ? "Syncing..." : "Sync"}
          </Button>
        </Stack>
      </Box>

      {/* Table */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <CustomizedDataGrid rows={rows} columns={columns} />
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
        <DialogTitle>{editingRow ? "Edit Coupon" : "Add Coupon"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} mt={1}>
              {/* Coupon Title */}
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
                      disabled={!!editingRow}
                    />
                  )}
                />
              </FormControl>

              {/* Discount */}
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

              {/* Usage Limit */}
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

              {/* Starts At */}
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

              {/* Ends At */}
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

              {/* Status */}
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
