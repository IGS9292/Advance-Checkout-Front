import {
  Box,
  Typography,
  Stack,
  Grid,
  Modal,
  Paper,
  Button,
  Chip
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import CustomizedDataGrid from "../dashboard/components/CustomizedDataGrid";
import Search from "../../shared/components/Search";
import TableFilter from "../../shared/components/TableFilter";
import DownloadMenu from "../../shared/components/DownloadMenu";
import type { DateFilterState } from "../../shared/components/DateFilter";
import { useAuth } from "../../contexts/AuthContext";
import {
  downloadInvoice,
  downloadReceipt
} from "../../services/billingService";
import { showToast } from "../../helper/toastHelper";
import { useNavigate } from "react-router-dom";
import { UseShopsBillsCols } from "../billing/components/useShopsBillsCols";

export default function ShopsBillsListView() {
  const [rows, setRows] = useState<any[]>([]);
  const [originalRows, setOriginalRows] = useState<any[]>([]);
  const [filteredRows, setFilteredRows] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilterState>({
    range: "all"
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const [viewData, setViewData] = useState<any>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // 🔹 Handlers
  const handleView = (row: any) => {
    setViewData(row);
  };

  const handlePayNow = (row: any) => {
    console.log("💳 Pay Now:", row);
    // 👉 trigger Razorpay/Stripe here
  };

  const handleDownloadReceipt = async (row: any) => {
    try {
      await downloadReceipt(row.id, user?.token);
    } catch (err) {
      console.error("❌ Failed to download receipt:", err);
    }
  };

  const handleDownloadInvoice = async (row: any) => {
    try {
      await downloadInvoice(row.id, user?.token);
    } catch (err) {
      showToast.error("Failed to download invoice");
      console.error("❌ Failed to download invoice:", err);
    }
  };

  const handleDelete = async (row: any) => {
    if (window.confirm("Delete this order detail?")) {
      try {
        // await deleteShopBill(row.id, user?.token)
        fetchShopsBillsDetails(setOriginalRows, setFilteredRows);
      } catch (err) {
        console.error("❌ Delete failed:", err);
      }
    }
  };

  const { columnsMeta: dynamicCols, fetchShopsBillsDetails } =
    UseShopsBillsCols(
      handleView,
      handleDownloadInvoice,
      handleDelete
      // handlePayNow,
      // handleDownloadReceipt
    );

  useEffect(() => {
    fetchShopsBillsDetails(setOriginalRows, setFilteredRows);
  }, []);

  useEffect(() => {
    const filtered = filteredRows.filter((row) => {
      const shopMatch = row.shopName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const userMatch = row.userEmail
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const planMatch = row.planName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const statusMatch = row.paymentStatus
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      return shopMatch || userMatch || planMatch || statusMatch;
    });
    setRows(filtered);
  }, [searchTerm, filteredRows]);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2
        }}
      >
        <Typography component="h2" variant="h6">
          Shops Bills
        </Typography>
        <Stack direction="row" spacing={0.5}>
          <Search onSearch={(value) => setSearchTerm(value)} />
          <TableFilter
            rows={originalRows}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            onFilter={setFilteredRows}
            dateField="purchasedDate" // filter by purchased date
          />
          <DownloadMenu rows={filteredRows} columns={dynamicCols} />
        </Stack>
      </Box>

      {/* Table */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Box sx={{ width: "100%", overflowX: "auto" }} ref={gridRef}>
            <CustomizedDataGrid rows={rows} columns={dynamicCols} />
          </Box>
        </Grid>
      </Grid>

      {/* View Bill Modal */}
      <Modal
        open={!!viewData}
        onClose={() => setViewData(null)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Paper sx={{ p: 3, width: 500, maxHeight: "80vh", overflowY: "auto" }}>
          <Typography variant="h6" gutterBottom>
            Bill Details
          </Typography>

          {viewData && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ border: "1px solid #ddd", borderRadius: 1, p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Shop: {viewData.shopName}
                </Typography>
                <Typography variant="body2">
                  User Email: {viewData.userEmail}
                </Typography>
                <Typography variant="body2">
                  Plan: {viewData.planName}
                </Typography>
                <Typography variant="body2">
                  Purchased: {viewData.purchasedDate}
                </Typography>
                <Typography variant="body2">
                  Ends: {viewData.endDate}
                </Typography>
                <Typography variant="body2">
                  Amount: ₹{viewData.amount}
                </Typography>
                <Typography variant="body2" sx={{ display: "flex", gap: 1 }}>
                  Payment Status:
                  <Chip
                    label={viewData.paymentStatus}
                    color={
                      viewData.paymentStatus === "paid"
                        ? "success"
                        : viewData.paymentStatus === "overdue"
                        ? "error"
                        : "warning"
                    }
                    size="small"
                    variant="outlined"
                  />
                </Typography>
              </Box>

              {viewData.paymentStatus !== "paid" ? (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handlePayNow(viewData)}
                  sx={{
                    minWidth: "auto",
                    boxShadow: "none",
                    "&:hover": {
                      // boxShadow: "none",
                      backgroundColor: (theme) => theme.palette.success.main
                    }
                  }}
                >
                  Pay Now
                </Button>
              ) : (
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDownloadReceipt(viewData)}
                  >
                    Download Receipt
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleDownloadInvoice(viewData)}
                  >
                    Download Invoice
                  </Button>
                </Stack>
              )}
            </Box>
          )}
        </Paper>
      </Modal>
    </Box>
  );
}
