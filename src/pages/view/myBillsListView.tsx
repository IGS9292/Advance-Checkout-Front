import {
  Box,
  Typography,
  Stack,
  Grid,
  Modal,
  Paper,
  Button
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import CustomizedDataGrid from "../dashboard/components/CustomizedDataGrid";
import Search from "../../shared/components/Search";
import TableFilter from "../../shared/components/TableFilter";
import DownloadMenu from "../../shared/components/DownloadMenu";
import type { DateFilterState } from "../../shared/components/DateFilter";
import { useAuth } from "../../contexts/AuthContext";
import { UseMyBillsCols } from "../billing/components/useMyBillsCols";

export default function MyBillsListView() {
  const [rows, setRows] = useState<any[]>([]);
  const [originalRows, setOriginalRows] = useState<any[]>([]);
  const [filteredRows, setFilteredRows] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilterState>({
    range: "all"
  });
  const { user } = useAuth();

  const [viewData, setViewData] = useState<any>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleView = (row: any) => {
    setViewData(row);
  };

  const { columnsMeta: dynamicCols, fetchBillDetails } =
    UseMyBillsCols(handleView);

  useEffect(() => {
    fetchBillDetails(setOriginalRows, setFilteredRows);
  }, []);

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
          <TableFilter
            rows={originalRows}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            onFilter={setFilteredRows}
            dateField="createdAt" // ensure API returns createdAt for customers
          />
          <DownloadMenu rows={filteredRows} columns={dynamicCols} />
        </Stack>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Box sx={{ width: "100%", overflowX: "auto" }} ref={gridRef}>
            <CustomizedDataGrid rows={rows} columns={dynamicCols} />
          </Box>
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
