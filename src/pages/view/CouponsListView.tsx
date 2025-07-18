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
  TextField
} from "@mui/material";
import { useState, useEffect } from "react";
import CustomizedDataGrid from "../dashboard/components/CustomizedDataGrid";
// import { getCoupons, deleteCoupon } from "../../services/CouponService";
// import { getCouponColumns } from "../coupons/useCouponColumns";

export default function CouponsListView() {
  const [rows, setRows] = useState<any[]>([]);
  const [columns, setColumns] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);

  const fetchCoupons = async () => {
    try {
      //   const { coupons } = await getCoupons(); // expects { coupons: [...] }
      //   setRows(coupons);
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
      //   await deleteCoupon(row.id);
      fetchCoupons();
    }
  };

  useEffect(() => {
    // setColumns(getCouponColumns(handleEdit, handleDelete));
    fetchCoupons();
  }, []);

  return (
    <Box p={2}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Coupons</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Coupon
        </Button>
        {/* <Tooltip title="Sync Data">
  <Button variant="contained" onClick={() => setOpen(true)}>
    <SyncIcon />
  </Button>
</Tooltip> */}

        {/* <Button variant="contained"startIcon={<SyncIcon />} >
          sync
        </Button> */}
      </Box>
      <CustomizedDataGrid rows={rows} columns={columns} />

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
