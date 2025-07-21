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

const baseURL = import.meta.env.VITE_API_BASE as string;
export default function CouponsListView() {
  const [rows, setRows] = useState<any[]>([]);
  // const [columns, setColumns] = useState<GridColDef[]>([]);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRows, setFilteredRows] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

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
      status: ""
    }
  });
  const handleEdit = (row: any) => {
    setEditingRow(row);
    setValue("title", row.title);
    setValue("discount", row.discount);
    setValue("usageLimit", row.usageLimit);
    setValue("startsAt", row.startsAt);
    setValue("endsAt", row.endsAt);
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
      await updateCouponStatus(id, "approved");
      alert("✅ Request approved and email sent successfully");
      fetchCouponsDetails(setRows, setFilteredRows, baseURL);
    } catch (err) {
      console.error("Approval failed", err);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await updateCouponStatus(id, "rejected");
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
    console.log("🟢 onSubmit triggered", data);
    const payload = {
      title: data.title,
      couponDetails: {
        discount: data.discount,
        usageLimit: parseInt(data.usageLimit),
        startsAt: data.startsAt,
        endsAt: data.endsAt
      },
      status: data.status
      // status: data.status as "pending" | "approved" | "rejected"
    };
    try {
      if (editingRow) {
        // console.log("edit FORM SUBMITTED", data);

        await updateCoupon(editingRow.id, payload);
        alert("✅ shop details updated ");
        // console.log("Updated shop with:", payload);
      } else {
        // await createShop(payload);

        await createCoupon(payload);
        alert("✅ shop added and email sent successfully");
      }
      handleCloseDialog();
      await fetchCouponsDetails(setRows, setFilteredRows, baseURL);
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
        <Grid size={{ xs: 12, lg: 12 }}>
          <CustomizedDataGrid rows={rows} columns={columns} />
        </Grid>
      </Grid>

      {/* <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      > */}
      {/* <DialogTitle>{editingRow ? "Edit Coupon" : "Add Coupon"}</DialogTitle>
        <DialogContent> */}
      {/* You can build a form here using react-hook-form like in ShopsListView */}
      {/* <Typography>Form coming soon...</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained">Save</Button>
        </DialogActions> */}
      {/* </Dialog> */}
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
                  rules={{ required: "Required" }}
                  render={({ field }) => <TextField {...field} />}
                />
              </FormControl>

              <FormControl fullWidth required>
                <FormLabel>Discount</FormLabel>
                <Controller
                  name="discount"
                  control={control}
                  rules={{ required: "Required" }}
                  render={({ field }) => <TextField {...field} />}
                />
              </FormControl>

              <FormControl fullWidth required>
                <FormLabel>Usage Limit</FormLabel>
                <Controller
                  name="usageLimit"
                  control={control}
                  rules={{ required: "Required" }}
                  render={({ field }) => <TextField {...field} type="number" />}
                />
              </FormControl>

              <FormControl fullWidth required>
                <FormLabel>Starts At</FormLabel>
                <Controller
                  name="startsAt"
                  control={control}
                  rules={{ required: "Required" }}
                  render={({ field }) => <TextField {...field} type="date" />}
                />
              </FormControl>

              <FormControl fullWidth required>
                <FormLabel>Ends At</FormLabel>
                <Controller
                  name="endsAt"
                  control={control}
                  rules={{ required: "Required" }}
                  render={({ field }) => <TextField {...field} type="date" />}
                />
              </FormControl>

              <FormControl fullWidth required>
                <FormLabel>Status</FormLabel>
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: "Required" }}
                  render={({ field }) => (
                    <TextField select {...field}>
                      <MenuItem value="approved">approved</MenuItem>
                      <MenuItem value="pending">pending</MenuItem>
                    </TextField>
                  )}
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
