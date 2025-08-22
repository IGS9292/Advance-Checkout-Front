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
import { LoadingButton } from "@mui/lab"; // 👈 import here
import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import CustomizedDataGrid from "../dashboard/components/CustomizedDataGrid";
import TableFilter from "../../shared/components/TableFilter";
import DownloadMenu from "../../shared/components/DownloadMenu";
import { useShopColumns } from "../shops/components/useShopColumns";
import {
  createShop,
  deleteShop,
  updateShop,
  updateShopStatus
} from "../../services/ShopService";
import { getAllPlans } from "../../services/PlanService";
import type { DateFilterState } from "../../shared/components/DateFilter";
import Search from "../../shared/components/Search";

type Plan = { id: number; order_range: string };

const baseURL = import.meta.env.VITE_API_BASE as string;

const mapOrdersToRange = (value: number | string): string => {
  const num = typeof value === "string" ? parseInt(value) : value;
  if (num >= 0 && num < 500) return "0-500";
  if (num >= 500 && num < 2000) return "500-2000";
  if (num >= 2000 && num < 10000) return "2000-10000";
  if (num >= 10000) return "10000+";
  return "0-500";
};

const ShopsListView = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [originalRows, setOriginalRows] = useState<any[]>([]);
  const [filteredRows, setFilteredRows] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilterState>({
    range: "all"
  });
  const [orderRanges, setOrderRanges] = useState<string[]>([]);
  const [loading, setLoading] = useState(false); // 👈 add loading state

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
      shopUrl: "",
      shopContactNo: "",
      ordersPerMonth: "",
      email: "",
      status: "approved",
      shopAccessToken: "Not generated"
    }
  });

  const handleEdit = (row: any) => {
    setEditingRow(row);
    setValue("shopName", row.shopName);
    setValue("shopUrl", row.shopUrl);
    setValue("shopContactNo", row.shopContactNo);
    setValue("ordersPerMonth", mapOrdersToRange(row.ordersPerMonth));
    setValue("email", row.users);
    setValue("status", row.status);
    setValue("shopAccessToken", row.shopAccessToken || "");
    setOpenDialog(true);
  };

  const handleDelete = async (row: any) => {
    if (window.confirm("Delete this shop?")) {
      await deleteShop(row.id);
      fetchColumnsAndData(setOriginalRows, setFilteredRows, baseURL);
    }
  };

  const handleApprove = async (id: number) => {
    await updateShopStatus(id, "approved");
    alert("✅ Request approved and email sent successfully");
    fetchColumnsAndData(setOriginalRows, setFilteredRows, baseURL);
  };

  const handleReject = async (id: number) => {
    await updateShopStatus(id, "rejected");
    fetchColumnsAndData(setOriginalRows, setFilteredRows, baseURL);
  };

  const { columnsMeta: dynamicCols, fetchColumnsAndData } = useShopColumns(
    handleEdit,
    handleDelete,
    handleApprove,
    handleReject
  );

  useEffect(() => {
    fetchColumnsAndData(setOriginalRows, setFilteredRows, baseURL);
    const fetchPlans = async () => {
      const data = await getAllPlans();
      const plans = Array.isArray(data) ? data : data?.plans || [];
      setOrderRanges(plans.map((p: Plan) => p.order_range));
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    const filtered = filteredRows.filter((row) => {
      const shopNameMatch = row.shopName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const userMatch = row.users
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const contactNoMatch = row.shopContactNo?.includes(searchTerm);
      const statusMatch = row.status
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      return shopNameMatch || userMatch || contactNoMatch || statusMatch;
    });
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
    setLoading(true); // start loading
    try {
      const payload = {
        shopName: data.shopName,
        shopUrl: data.shopUrl,
        shopContactNo: data.shopContactNo,
        ordersPerMonth: data.ordersPerMonth,
        status: data.status,
        shopAccessToken: data.shopAccessToken
      };
      if (editingRow) {
        await updateShop(editingRow.id, payload);
        alert("✅ shop details updated ");
      } else {
        await createShop({ ...payload, email: data.email });
        alert("✅ shop added and email sent successfully");
      }
      handleCloseDialog();
      fetchColumnsAndData(setOriginalRows, setFilteredRows, baseURL);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", lg: "100%" } }}>
      {/* Top bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2
        }}
      >
        <Typography component="h2" variant="h6">
          Shops
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
          >
            Add Shop
          </Button>
        </Stack>
      </Box>

      {/* DataGrid */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Box sx={{ width: "100%", overflowX: "auto" }} ref={gridRef}>
            <CustomizedDataGrid rows={rows} columns={dynamicCols} />
          </Box>
        </Grid>
      </Grid>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingRow ? "Edit Shop" : "Add New Shop"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} mt={1}>
              <FormControl fullWidth required>
                <FormLabel>Shop Name</FormLabel>
                <Controller
                  name="shopName"
                  control={control}
                  rules={{ required: "Shop Name is required." }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      error={!!errors.shopName}
                      helperText={errors.shopName?.message}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth required>
                <FormLabel>User Email</FormLabel>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "User email is required.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email"
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      disabled={Boolean(editingRow)}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </FormControl>
              <FormControl fullWidth>
                <FormLabel>Shop Access Token</FormLabel>
                <Controller
                  name="shopAccessToken"
                  control={control}
                  render={({ field }) => <TextField {...field} />}
                />
              </FormControl>

              <FormControl fullWidth>
                <FormLabel>Shop URL</FormLabel>
                <Controller
                  name="shopUrl"
                  control={control}
                  render={({ field }) => <TextField {...field} />}
                />
              </FormControl>

              <FormControl fullWidth required>
                <FormLabel>Contact Number</FormLabel>
                <Controller
                  name="shopContactNo"
                  control={control}
                  rules={{ required: "Contact Number is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      error={!!errors.shopContactNo}
                      helperText={errors.shopContactNo?.message}
                      inputProps={{
                        maxLength: 10,
                        inputMode: "numeric",
                        pattern: "\\d{10}"
                      }}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth required>
                <FormLabel htmlFor="ordersPerMonth">Orders per month</FormLabel>
                <Controller
                  name="ordersPerMonth"
                  control={control}
                  rules={{ required: "Please select an option" }}
                  render={({ field }) => (
                    <TextField
                      select
                      {...field}
                      id="ordersPerMonth"
                      error={!!errors.ordersPerMonth}
                      helperText={errors.ordersPerMonth?.message}
                    >
                      {orderRanges.map((range, idx) => (
                        <MenuItem key={idx} value={range}>
                          {range}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </FormControl>

              <FormControl fullWidth required>
                <FormLabel>Status</FormLabel>
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: "Status Required" }}
                  render={({ field }) => (
                    <TextField
                      select
                      {...field}
                      // error={!!errors.ordersPerMonth}
                      // helperText={errors.ordersPerMonth?.message}
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
};

export default ShopsListView;
