import {
  Box,
  Typography,
  Stack,
  Grid,
  Modal,
  Paper,
  ListItem,
  ListItemText,
  List
} from "@mui/material";
import { useState, useEffect } from "react";
import CustomizedDataGrid from "../dashboard/components/CustomizedDataGrid";
import Search from "../../shared/components/Search";
import { useAuth } from "../../contexts/AuthContext";
import { UseCustomerCols } from "../customers/components/useCustomerCols";

export default function CustomersListView() {
  const [rows, setRows] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRows, setFilteredRows] = useState<any[]>([]);
  const { user } = useAuth();

  const [viewData, setViewData] = useState<any>(null);

  const handleView = (row: any) => {
    setViewData(row);
  };

  const { columnsMeta: dynamicCols, fetchCustomerDetails } =
    UseCustomerCols(handleView);

  useEffect(() => {
    fetchCustomerDetails(setRows, setFilteredRows);
  }, []);

  // ✅ filter by name or mobile number
  useEffect(() => {
    const filtered = filteredRows.filter((row) => {
      const nameMatch = row.fullname
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const mobileMatch = row.mobile_no
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      return nameMatch || mobileMatch;
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
          Customers
        </Typography>
        <Stack direction="row" spacing={2}>
          <Search onSearch={(value) => setSearchTerm(value)} />
        </Stack>
      </Box>

      {/* Table */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <CustomizedDataGrid rows={rows} columns={dynamicCols} />
        </Grid>
      </Grid>
      {/* View Modal */}
      <Modal
        open={!!viewData}
        onClose={() => setViewData(null)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Paper sx={{ p: 3, width: 500, maxHeight: "80vh", overflowY: "auto" }}>
          <Typography variant="h6" gutterBottom>
            Customer Addresses
          </Typography>

          {viewData && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Default address */}
              <Box
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: 1,
                  p: 2
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ mb: 1 }}
                >
                  Default Address
                </Typography>
                <Typography variant="body2">{viewData.address}</Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {viewData.mobile_no || "987654321"} | {viewData.email}
                </Typography>
              </Box>

              {/* Other addresses */}
              <Box
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: 1,
                  p: 2
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ mb: 1 }}
                >
                  Other Addresses
                </Typography>

                {viewData.otherAddresses?.length > 0 ? (
                  viewData.otherAddresses.map((addr: any, idx: number) => (
                    <Box key={idx} sx={{ mb: 1 }}>
                      <Typography variant="body2">{addr.address}</Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        {`${addr.mobile_no || "987654321"} | ${
                          addr.email || ""
                        }`}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    -
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </Paper>
      </Modal>
    </Box>
  );
}
