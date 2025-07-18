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
  MenuItem
} from "@mui/material";
import { useState, useEffect } from "react";
import CustomizedDataGrid from "../dashboard/components/CustomizedDataGrid";
import Search from "../dashboard/components/Search";
import { useDynamicColumns } from "../dashboard/internals/data/gridData";
import {
  createShop,
  deleteShop,
  updateShop,
  updateShopStatus
} from "../../services/ShopService";
// import { useShopContext } from "../../contexts/ShopContext";

const baseURL = import.meta.env.VITE_API_BASE as string;

const ShopsListView = () => {
  // const context = useShopContext();

  // if (!context) return null;

  // const { shops, fetchShops } = useShopContext();
  const [rows, setRows] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    shopName: "",
    shopUrl: "",
    shopContactNo: "",
    ordersPerMonth: "",
    email: "",
    status: "pending"
  });
  const [editingRow, setEditingRow] = useState<any>(null);
  // useEffect(() => {
  //   fetchShops(); // make sure this is called ONCE when component loads
  // }, []);
  // useEffect(() => {
  //   console.log("🔄 Shops from context updated:", shops);
  //   setRows(shops);
  // }, [shops]);

  const handleEdit = (row: any) => {
    setEditingRow(row);
    setFormData({
      shopName: row.shopName,
      shopUrl: row.shopUrl,
      shopContactNo: row.shopContactNo,
      ordersPerMonth: row.ordersPerMonth,
      email: row.email,
      status: String(row.status)
    });
    setOpenDialog(true);
  };

  const handleDelete = async (row: any) => {
    if (window.confirm("Delete this shop?")) {
      try {
        await deleteShop(row.id);
        fetchColumnsAndData(setRows, baseURL); // Refresh
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };
  const handleApprove = async (id: number) => {
    try {
      await updateShopStatus(id, "approved");
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

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRow(null);
    setFormData({
      shopName: "",
      shopUrl: "",
      shopContactNo: "",
      ordersPerMonth: "",
      email: "",
      status: "pending"
    });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const payload = {
      shopName: formData.shopName,
      shopUrl: formData.shopUrl,
      shopContactNo: formData.shopContactNo,
      ordersPerMonth: parseInt(formData.ordersPerMonth),
      email: formData.email,
      status: formData.status as "pending" | "approved" | "rejected"
    };
    try {
      if (editingRow) {
        await updateShop(editingRow.id, payload);
      } else {
        await createShop(payload);
      }

      //         const isRequestMode = role === "1"; // true if normal admin (not superadmin)
      //     if (editingRow) {
      //         await updateShop(editingRow.id, payload); // editing existing shop
      //       } else {
      //         if (isRequestMode) {
      //           // user requesting a shop (status will default to pending in backend)
      //           await requestShop(payload);
      //         } else {
      //           // superadmin creating a shop directly
      //           await createShop(payload);
      //         }
      //       }
      handleCloseDialog();
      fetchColumnsAndData(setRows, baseURL);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  return (
    <>
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
          <Stack spacing={2} mt={1}>
            <TextField
              label="Shop Name"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="User Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              disabled={Boolean(editingRow)}
            />
            <TextField
              label="Shop URL"
              name="shopUrl"
              value={formData.shopUrl}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Contact Number"
              name="shopContactNo"
              value={formData.shopContactNo}
              onChange={(e) => {
                const input = e.target.value;
                if (/^\d{0,10}$/.test(input)) {
                  handleChange(e);
                }
              }}
              fullWidth
              inputProps={{
                maxLength: 10,
                inputMode: "numeric",
                pattern: "\\d{10}"
              }}
            />
            <TextField
              select
              label="Orders per month"
              name="ordersPerMonth"
              value={formData.ordersPerMonth}
              onChange={handleChange}
              fullWidth
              required
            >
              <MenuItem value="0-50">0 - 500</MenuItem>
              <MenuItem value="51-200">500 - 2000</MenuItem>
              <MenuItem value="201-1000">2000 - 10000</MenuItem>
              <MenuItem value="1000+">10000+</MenuItem>
            </TextField>

            <TextField
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingRow ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ShopsListView;
