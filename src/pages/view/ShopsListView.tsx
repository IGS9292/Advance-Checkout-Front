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
import { useForm, Controller } from "react-hook-form";
import CustomizedDataGrid from "../dashboard/components/CustomizedDataGrid";
import Search from "../dashboard/components/Search";
import { useDynamicColumns } from "../dashboard/internals/data/gridData";
import {
  createShop,
  deleteShop,
  updateShop,
  updateShopStatus
} from "../../services/ShopService";

const baseURL = import.meta.env.VITE_API_BASE as string;
// const mapOrdersToRange = (value: number | string) => {
//   const num = typeof value === "string" ? parseInt(value) : value;
//   if (num <= 500) return "0-500";
//   if (num <= 2000) return "500-2000";
//   if (num <= 10000) return "2000-10000";
//   return "10000+";
// };

const ShopsListView = () => {
  const [rows, setRows] = useState<any[]>([]);
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
      shopName: "",
      shopUrl: "",
      shopContactNo: "",
      ordersPerMonth: "",
      email: "",
      status: "approved"
    }
  });

  const handleEdit = (row: any) => {
    setEditingRow(row);
    setValue("shopName", row.shopName);
    setValue("shopUrl", row.shopUrl);
    setValue("shopContactNo", row.shopContactNo);
    setValue("ordersPerMonth", row.ordersPerMonth);
    const email = row.users;
    setValue("email", email);
    setValue("status", row.status);
    setOpenDialog(true);
  };

  const handleDelete = async (row: any) => {
    if (window.confirm("Delete this shop?")) {
      try {
        await deleteShop(row.id);
        fetchColumnsAndData(setRows, baseURL);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await updateShopStatus(id, "approved");
      alert("✅ Request approved and email sent successfully");
      fetchColumnsAndData(setRows, baseURL);
    } catch (err) {
      console.error("Approval failed", err);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await updateShopStatus(id, "rejected");
      fetchColumnsAndData(setRows, baseURL);
    } catch (err) {
      console.error("Rejection failed", err);
    }
  };

  const { columnsMeta: dynamicCols, fetchColumnsAndData } = useDynamicColumns(
    handleEdit,
    handleDelete,
    handleApprove,
    handleReject
  );

  useEffect(() => {
    fetchColumnsAndData(setRows, baseURL);
  }, []);

  const columns = dynamicCols;
  //  const handleOpenDialog = () => setOpenDialog(true);

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
      shopName: data.shopName,
      shopUrl: data.shopUrl,
      shopContactNo: data.shopContactNo,
      ordersPerMonth: parseInt(data.ordersPerMonth, 10),
      status: data.status as "pending" | "approved" | "rejected"
    };

    //   export const updateShop = async (
    // shopId: string | number,
    // data: {
    //   shopName: string;
    //   shopUrl: string;
    //   shopContactNo: string;
    //   ordersPerMonth: number;
    //   status: string;
    // }
    //   // const payload = {
    //   shopName: data.shopName,
    //   shopUrl: data.shopUrl,
    //   shopContactNo: data.shopContactNo,
    //   ordersPerMonth: parseInt(data.ordersPerMonth),
    //   email: data.email,
    //   status: data.status as "pending" | "approved" | "rejected"
    // };
    try {
      if (editingRow) {
        // console.log("edit FORM SUBMITTED", data);

        await updateShop(editingRow.id, payload);
        alert("✅ shop details updated ");
        // console.log("Updated shop with:", payload);
      } else {
        // await createShop(payload);

        await createShop({ ...payload, email: data.email });
        alert("✅ shop added and email sent successfully");
      }
      handleCloseDialog();
      fetchColumnsAndData(setRows, baseURL);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  return (
    <>
      {errors.shopName && <span>{errors.shopName.message}</span>}

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
            Shops
          </Typography>
          <Stack direction="row" spacing={2}>
            <Search />
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenDialog}
            >
              Add Shop
            </Button>
          </Stack>
        </Box>

        <Grid container spacing={2} columns={12}>
          <Grid size={{ xs: 12, lg: 9 }}>
            <CustomizedDataGrid rows={rows} columns={columns} />
          </Grid>
        </Grid>
      </Box>

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
                  rules={{ required: "Required" }}
                  render={({ field }) => <TextField {...field} />}
                />
              </FormControl>

              <FormControl fullWidth required>
                <FormLabel>User Email</FormLabel>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email"
                    }
                  }}
                  render={({ field }) => (
                    <TextField {...field} disabled={Boolean(editingRow)} />
                  )}
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
                  rules={{ required: "Required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
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
                <FormLabel>Orders per month</FormLabel>
                <Controller
                  name="ordersPerMonth"
                  control={control}
                  rules={{ required: "Required" }}
                  render={({ field }) => (
                    <TextField select {...field}>
                      <MenuItem value="0-500">0 - 500</MenuItem>
                      <MenuItem value="500-2000">500 - 2000</MenuItem>
                      <MenuItem value="2000-10000">2000 - 10000</MenuItem>
                      <MenuItem value="10000+">10000+</MenuItem>
                    </TextField>
                  )}
                />
              </FormControl>

              <FormControl fullWidth required>
                <FormLabel>Status</FormLabel>
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: "Required" }}
                  render={({ field }) => <TextField {...field} />}
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
    </>
  );
};

export default ShopsListView;
