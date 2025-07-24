import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Tooltip, Box, Chip } from "@mui/material";
import { getOrders } from "../../../services/OrderService";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import type { AxiosError } from "axios";

export const UseOrderColumns = (
  handleEdit: (row: any) => void,
  handleDelete: (row: any) => void
) => {
  const [columnsMeta, setColumnsMeta] = useState<GridColDef[]>([]);
  const { user, role, logout } = useAuth();

  const fetchOrderDetails = async (
    setRows: React.Dispatch<any[]>,
    setFilteredRows: React.Dispatch<any[]>,
    baseURL: string
  ) => {
    try {
      const data = await getOrders(user?.token);
      let orders = Array.isArray(data) ? data : [];

      // Add SrNo and flatten shopName (for superadmin)
      orders = orders.map((order: any, index: number) => ({
        ...order,
        srNo: index + 1,
        shopName: order?.shop?.shopName || undefined
      }));

      // Select fields based on role
      const orderedFields =
        role === "0"
          ? ["srNo", "shopName", "order_id", "order_qty", "total_amount"] // Superadmin
          : ["srNo", "order_id", "order_qty", "total_amount"]; // Admin

      // Dynamically infer columns from the first row
      const inferredColumns = Object.keys(orders[0] || {}).map((key) => ({
        field: key,
        headerName:
          key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
        flex: 1,
        minWidth: 120,
        type: typeof orders[0]?.[key] === "number" ? "number" : "string"
      }));

      const mappedColumns: GridColDef[] = orderedFields
        .map((field) => {
          const col = inferredColumns.find((c) => c.field === field);
          if (!col) return null;

          if (field === "srNo") {
            return {
              ...col,
              headerName: "Sr No.",
              width: 60,
              align: "center",
              headerAlign: "center",
              sortable: false
            };
          }

          if (field === "shopName") {
            return {
              ...col,
              headerName: "Shop Name"
            };
          }

          return {
            ...col,
            ...(col.type === "number" && {
              align: "center",
              headerAlign: "center"
            })
          };
        })
        .filter(Boolean) as GridColDef[];

      // Add action buttons column
      mappedColumns.push({
        field: "actions",
        headerName: "Actions",
        sortable: false,
        filterable: false,
        align: "center",
        headerAlign: "center",
        width: 140,
        renderCell: (params) => {
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                justifyContent: "center"
              }}
            >
              <Tooltip title="Edit">
                <Box
                  component="span"
                  sx={{ cursor: "pointer", color: "primary.main" }}
                  onClick={() => handleEdit(params.row)}
                >
                  <EditOutlinedIcon fontSize="small" />
                </Box>
              </Tooltip>

              <Tooltip title="Delete">
                <Box
                  component="span"
                  sx={{ cursor: "pointer", color: "error.main" }}
                  onClick={() => handleDelete(params.row)}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </Box>
              </Tooltip>
            </Box>
          );
        }
      });

      setFilteredRows(orders);
      setRows(orders);
      setColumnsMeta(mappedColumns);
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
        logout();
      } else {
        console.error("❌ Failed to fetch orders", err);
        alert("❌ Failed to load orders. Please check your server logs.");
      }
    }
  };

  return { columnsMeta, fetchOrderDetails };
};
