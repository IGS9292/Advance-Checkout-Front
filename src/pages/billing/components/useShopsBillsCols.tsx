import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import type { AxiosError } from "axios";
import { Box, Tooltip, Chip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import { DeleteOutlined } from "@mui/icons-material";
import { showToast } from "../../../helper/toastHelper";
import { getAllShopsBills } from "../../../services/allShopsBillingService";

export const UseShopsBillsCols = (
  onView: (row: any) => void,
  onDownloadInvoice: (row: any) => void,
  handleDelete: (row: any) => void
) => {
  const [columnsMeta, setColumnsMeta] = useState<GridColDef[]>([]);
  const { user, logout } = useAuth();

  const fetchShopsBillsDetails = async (
    setRows: React.Dispatch<React.SetStateAction<any[]>>,
    setFilteredRows: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    try {
      const data = await getAllShopsBills(user?.token);

      const bills = Array.isArray(data?.data) ? data.data : [];

      const flattened = bills.map((bill: any, index: number) => ({
        ...bill,
        srNo: index + 1
      }));

      const orderedFields = [
        { field: "srNo", header: "Sr No." },
        { field: "shopName", header: "Shop Name" },
        { field: "userEmail", header: "User Email" },
        { field: "planName", header: "Plan Name" },
        { field: "purchasedDate", header: "Purchased Date" },
        { field: "endDate", header: "End Date" },
        { field: "planStatus", header: "Plan Status" },
        { field: "amount", header: "Amount" },
        { field: "paymentStatus", header: "Payment Status" }
      ];

      const mappedColumns: GridColDef[] = orderedFields.map((f) => {
        // Payment Status as colored Chip
        if (f.field === "paymentStatus") {
          return {
            ...f,
            header: "Payment Status",
            flex: 1,
            minWidth: 120,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams) => {
              let color: "success" | "warning" | "error" | "default" =
                "default";
              let label = params.value;

              switch (params.value) {
                case "paid":
                  color = "success";
                  label = "Paid";
                  break;
                case "unpaid":
                  color = "warning";
                  label = "Unpaid";
                  break;
                case "overdue":
                  color = "error";
                  label = "Overdue";
                  break;
              }

              return (
                <Chip
                  label={label}
                  color={color}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
              );
            }
          };
        }

        return {
          field: f.field,
          headerName: f.header,
          flex: 1,
          minWidth: 120,
          align: f.field === "srNo" ? "center" : "left",
          headerAlign: f.field === "srNo" ? "center" : "left"
        };
      });

      // 👁 Actions column
      mappedColumns.push({
        field: "actions",
        headerName: "Actions",
        sortable: false,
        filterable: false,
        align: "center",
        headerAlign: "center",
        minWidth: 160,
        renderCell: (params) => (
          <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
            {/* View Details */}
            <Tooltip title="View Bill Details">
              <Box
                component="span"
                sx={{ cursor: "pointer", color: "primary.main" }}
                onClick={() => onView(params.row)}
              >
                <VisibilityIcon fontSize="small" />
              </Box>
            </Tooltip>

            {/* Delete Bill */}
            <Tooltip title="Delete Bill">
              <Box
                component="span"
                sx={{ cursor: "pointer", color: "error.main" }}
                onClick={() => handleDelete(params.row)}
              >
                <DeleteOutlined fontSize="small" />
              </Box>
            </Tooltip>

            {/* Download Invoice */}
            <Tooltip title="Download Invoice">
              <Box
                component="span"
                sx={{ cursor: "pointer" }}
                onClick={() => onDownloadInvoice(params.row)}
              >
                <DownloadIcon fontSize="small" />
              </Box>
            </Tooltip>
          </Box>
        )
      });

      setFilteredRows(flattened);
      setRows(flattened);
      setColumnsMeta(mappedColumns);
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.status === 401) {
        showToast.error("⚠️ Session expired. Please log in again.");
        logout();
      } else {
        console.error("❌ Failed to fetch bills", err);
        showToast.error("❌ Failed to load bills. Please check server logs.");
      }
    }
  };

  return { columnsMeta, fetchShopsBillsDetails };
};
