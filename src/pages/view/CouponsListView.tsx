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
  Grid
} from "@mui/material";
import { useState, useEffect } from "react";
import CustomizedDataGrid from "../dashboard/components/CustomizedDataGrid";
import { getCoupons, deleteCoupon } from "../../services/CouponService";
import { getCouponColumns } from "../coupons/useCouponColumns";
import SyncIcon from "@mui/icons-material/Sync";
import type { GridColDef } from "@mui/x-data-grid";
import Search from "../../shared/components/Search";

export default function CouponsListView() {
  const [rows, setRows] = useState<any[]>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [open, setOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);

  const fetchCoupons = async () => {
    try {
      const { coupons } = await getCoupons(); // expects { coupons: [...] }
      setRows(coupons);
    } catch (err) {
      alert("Failed to load coupons");
    }
  };

  const handleEdit = (row: any) => {
    setEditingRow(row);
    setOpen(true);
  };

  const handleDelete = async (row: any) => {
    if (confirm("Delete this coupon?")) {
      await deleteCoupon(row.id);
      fetchCoupons();
    }
  };

  useEffect(() => {
    setColumns(getCouponColumns(handleEdit, handleDelete));
    fetchCoupons();
  }, []);

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
          <Search />
          <Button variant="contained" onClick={() => setOpen(true)}>
            Add Coupon
          </Button>

          <Button
            variant="contained"
            startIcon={<SyncIcon />}
            onClick={() => console.log("Sync clicked")}
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

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingRow ? "Edit Coupon" : "Add Coupon"}</DialogTitle>
        <DialogContent>
          {/* You can build a form here using react-hook-form like in ShopsListView */}
          <Typography>Form coming soon...</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
