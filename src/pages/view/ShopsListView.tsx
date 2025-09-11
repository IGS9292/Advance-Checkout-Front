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
  FormLabel,
  Menu,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Modal,
  Paper
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { LoadingButton } from "@mui/lab";
import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import CustomizedDataGrid from "../dashboard/components/CustomizedDataGrid";
import TableFilter from "../../shared/components/TableFilter";
import DownloadMenu from "../../shared/components/DownloadMenu";
import { useShopColumns } from "../shops/components/useShopColumns";
import {
  createShop,
  deleteShop,
  processShopRequest,
  updateShop,
  updateShopStatus
} from "../../services/ShopService";
import { getAllPlans } from "../../services/PlanService";
import type { DateFilterState } from "../../shared/components/DateFilter";
import Search from "../../shared/components/Search";
import { showToast } from "../../helper/toastHelper";
import { AccountTreeOutlined, VisibilityRounded } from "@mui/icons-material";
import { GridCloseIcon } from "@mui/x-data-grid";

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
  const [loading, setLoading] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewRow, setViewRow] = useState<any>(null);

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
    showToast.success("Request approved and email sent successfully");
    fetchColumnsAndData(setOriginalRows, setFilteredRows, baseURL);
  };

  const handleReject = async (id: number) => {
    await updateShopStatus(id, "rejected");
    fetchColumnsAndData(setOriginalRows, setFilteredRows, baseURL);
  };

  const handleProcessedRequest = async (id: number) => {
    await processShopRequest(id, "processed");
    showToast.success("Request marked as processed");
    fetchColumnsAndData(setOriginalRows, setFilteredRows, baseURL);
  };

  const handleView = (row: any) => {
    setViewRow(row);
    // console.log("rowwwwwwwwwww-----", row);
    setOpenViewDialog(true);
  };

  // upgradeShopPlan
  const {
    columnsMeta: dynamicCols,
    fetchColumnsAndData,
    anchorEl,
    open,
    menuRowId,
    handleClose
  } = useShopColumns(
    handleEdit,
    handleDelete,
    handleApprove,
    handleReject,
    handleProcessedRequest
    // orderRanges
  );

  useEffect(() => {
    fetchColumnsAndData(setOriginalRows, setFilteredRows, baseURL);
    const fetchPlans = async () => {
      const data = await getAllPlans();
      const plans = Array.isArray(data) ? data : data?.plans || [];
      // setOrderRanges(plans.map((p: Plan) => p.order_range));
      setOrderRanges(plans);
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
    setLoading(true);
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
        showToast.success("Shop details updated");
      } else {
        await createShop({ ...payload, email: data.email });
        showToast.success("Shop added and email sent successfully");
      }
      handleCloseDialog();
      fetchColumnsAndData(setOriginalRows, setFilteredRows, baseURL);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || err.message || "Something went wrong";
      showToast.error(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
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

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Box sx={{ width: "100%", overflowX: "auto" }} ref={gridRef}>
            <CustomizedDataGrid rows={rows} columns={dynamicCols} />
          </Box>
        </Grid>
      </Grid>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {menuRowId &&
          (() => {
            const row = originalRows.find((r) => r.id === menuRowId);
            if (!row) return null;

            const { status } = row;

            switch (status) {
              case "approved":
                return (
                  <MenuItem
                    onClick={() => {
                      const row = originalRows.find((r) => r.id === menuRowId);
                      if (row) handleView(row);
                      handleClose();
                    }}
                  >
                    <ListItemIcon>
                      <VisibilityRounded fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>View Details</ListItemText>
                  </MenuItem>
                );

              case "pending":
                return [
                  <MenuItem
                    key="view"
                    onClick={() => {
                      const row = originalRows.find((r) => r.id === menuRowId);
                      if (row) handleView(row);
                      handleClose();
                    }}
                  >
                    <ListItemIcon>
                      <VisibilityRounded fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>View Details</ListItemText>
                  </MenuItem>,
                  <Divider key="divider-1" />,
                  <MenuItem
                    key="process"
                    onClick={() => {
                      handleProcessedRequest(menuRowId);
                      handleClose();
                    }}
                  >
                    <ListItemIcon>
                      <AccountTreeOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Process Request</ListItemText>
                  </MenuItem>,
                  <Divider key="divider-2" />,
                  <MenuItem
                    key="reject"
                    onClick={() => {
                      handleReject(menuRowId);
                      handleClose();
                    }}
                  >
                    <ListItemIcon>
                      <CancelOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Reject Request</ListItemText>
                  </MenuItem>
                ];

              case "processed":
                return (
                  <>
                    <MenuItem
                      onClick={() => {
                        const row = originalRows.find(
                          (r) => r.id === menuRowId
                        );
                        if (row) handleView(row);
                        handleClose();
                      }}
                    >
                      <ListItemIcon>
                        <VisibilityRounded fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>View Details</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      onClick={() => {
                        handleApprove(menuRowId);
                        handleClose();
                      }}
                    >
                      <ListItemIcon>
                        <CheckCircleOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Approve Request</ListItemText>
                    </MenuItem>
                    <Divider />,
                    <MenuItem
                      onClick={() => {
                        handleReject(menuRowId);
                        handleClose();
                      }}
                    >
                      <ListItemIcon>
                        <CancelOutlinedIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Reject Request</ListItemText>
                    </MenuItem>
                  </>
                );

              case "rejected":
                return [
                  <MenuItem
                    key="view"
                    onClick={() => {
                      const row = originalRows.find((r) => r.id === menuRowId);
                      if (row) handleView(row);
                      handleClose();
                    }}
                  >
                    <ListItemIcon>
                      <VisibilityRounded fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>View Details</ListItemText>
                  </MenuItem>
                  //,  <Divider />,
                  // <MenuItem
                  //   key="approve"
                  //   onClick={() => {
                  //     handleApprove(menuRowId);
                  //     handleClose();
                  //   }}
                  // >
                  //   <ListItemIcon>
                  //     <CheckCircleOutlineIcon fontSize="small" />
                  //   </ListItemIcon>
                  //   <ListItemText>Approve Request</ListItemText>
                  // </MenuItem>,
                ];

              default:
                return null;
            }
          })()}
      </Menu>

      {/* View Shop Details Modal */}
      <Modal
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Paper
          sx={{
            p: 3,
            width: 500,
            maxHeight: "80vh",
            overflowY: "auto",
            position: "relative"
          }}
        >
          {/* Close Icon */}
          <IconButton
            aria-label="close"
            onClick={() => setOpenViewDialog(false)}
            size="small"
            sx={{ position: "absolute", top: 8, right: 8, border: "none" }}
          >
            <GridCloseIcon />
          </IconButton>

          {/* Title */}
          <Typography variant="h6" gutterBottom>
            Shop Details
          </Typography>

          {/* Shop Details */}
          {viewRow ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography>
                <b>Shop Name:</b> {viewRow.shopName}
              </Typography>
              <Typography>
                <b>User Email:</b> {viewRow.users}
              </Typography>
              <Typography>
                <b>Contact No:</b> {viewRow.shopContactNo}
              </Typography>
              <Typography>
                <b>Shop URL:</b> {viewRow.shopUrl}
              </Typography>
              {/* <Typography>
                <b>Plan Name:</b> {viewRow.planName}
              </Typography> */}
              <Typography>
                <b>Orders/Month:</b> {viewRow.ordersPerMonth}
              </Typography>
              <Typography>
                <b>Status:</b> {viewRow.status}
              </Typography>
              <Typography>
                <b>Access Token:</b>{" "}
                {viewRow.shopAccessToken || "Not generated"}
              </Typography>
            </Box>
          ) : (
            <Typography>No details available</Typography>
          )}

          {/* Close Button */}
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={() => setOpenViewDialog(false)}
              variant="contained"
            >
              Close
            </Button>
          </Box>
        </Paper>
      </Modal>

      {/* Add/Edit Shop Dialog */}
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
              {/* Shop Name */}
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

              {/* Email */}
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

              {/* Token */}
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
                      {/* {orderRanges.map((range, idx) => (
                        <MenuItem key={idx} value={range}>
                          {range}
                        </MenuItem>
                      ))} */}
                      {orderRanges.map((plan: any, idx: number) => (
                        <MenuItem key={idx} value={plan.order_range}>
                          {plan.order_range} ({plan.plan_name})
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
                      disabled={!!editingRow}
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
};

export default ShopsListView;
