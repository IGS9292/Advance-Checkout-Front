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
  TextField
} from "@mui/material";
import { useState, useEffect } from "react";
import CustomizedDataGrid from "../dashboard/components/CustomizedDataGrid";
import Search from "../dashboard/components/Search";
import { useDynamicColumns } from "../dashboard/internals/data/gridData";
import { createShop, deleteShop, updateShop } from "../../services/ShopService";

const baseURL = import.meta.env.VITE_API_BASE as string;

const ShopsListView = () => {
  const [rows, setRows] = useState<any[]>([]);
  // const [columnsMeta, setColumnsMeta] = useState<GridColDef[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "Online",
    eventCount: ""
  });
  const [editingRow, setEditingRow] = useState<any>(null);

  const handleEdit = (row: any) => {
    setEditingRow(row);
    setFormData({
      name: row.name,
      email: row.email,
      status: row.status,
      eventCount: row.eventCount
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

  const { columnsMeta: dynamicCols, fetchColumnsAndData } = useDynamicColumns(
    handleEdit,
    handleDelete
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
      name: "",
      email: "",
      status: "Online",
      eventCount: ""
    });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const payload = {
      name: formData.name,
      status: formData.status,
      eventCount: Number(formData.eventCount) || 0,
      email: formData.email
    };
    try {
      if (editingRow) {
        await updateShop(editingRow.id, payload);
      } else {
        await createShop(payload);
      }
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
              name="name"
              value={formData.name}
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
              label="Event Count"
              name="eventCount"
              value={formData.eventCount}
              onChange={handleChange}
              fullWidth
            />
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
