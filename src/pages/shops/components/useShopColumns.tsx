import * as React from "react";
import { Avatar, Chip, Tooltip, Box } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { getAllShops } from "../../../services/ShopService";

export const useShopColumns = (
  handleEdit: (row: any) => void,
  handleDelete: (row: any) => void,
  handleApprove: (id: number) => void,
  handleReject: (id: number) => void
) => {
  const [columnsMeta, setColumnsMeta] = React.useState<GridColDef[]>([]);

  const fetchColumnsAndData = async (
    setRows: React.Dispatch<any[]>,
    setFilteredRows: React.Dispatch<any[]>,
    baseURL: string
  ) => {
    try {
      const data = await getAllShops();
      let rawShops = Array.isArray(data.shops) ? data.shops : [];


      rawShops = rawShops.map((shop: any, index: any) => ({
        ...shop,
        srNo: index + 1
      }));

      const sampleRow = rawShops[0] || {};


      const orderedFields = [
        "srNo",
        "shopName",
        "users",
        "planName",
        "shopAccessToken",
        "shopUrl",
        "shopContactNo",
        "ordersPerMonth",
        "status"
      ];

      const inferredColumns =
        data.columns && data.columns.length > 0
          ? data.columns
          : Object.keys(sampleRow).map((key) => ({
              field: key,
              headerName: key.charAt(0).toUpperCase() + key.slice(1),
              flex: 1,
              minWidth: 120,
              type: typeof sampleRow[key] === "number" ? "number" : "string"
            }));

      const mappedColumns: GridColDef[] = orderedFields
        .map((field) => {
          const col = inferredColumns.find((c: any) => c.field === field);
          if (!col) return null;
          if (field === "srNo") {
            return {
              ...col,
              headerName: "Sr No.",
              minWidth: 40,
              flex: 0.3,
              sortable: false,
              align: "center",
              headerAlign: "center"
            };
          }
          if (field === "planName") {
            return {
              ...col,
              headerName: "Active Plan",
              minWidth: 140,
              flex: 1,
              renderCell: (params: GridRenderCellParams) => (
                <Chip
                  label={params.value || "No Active Plan"}
                  color={params.value ? "primary" : "default"}
                  size="small"
                  variant="outlined"
                />
              )
            };
          }

          if (field === "shopAccessToken") {
            return {
              ...col,
              headerName: "Shop Access Token",
              editable: true
            };
          }

          if (field === "status") {
            return {
              ...col,
              headerName: "Status",
              minWidth: 120,
              flex: 1,
              renderCell: (params: GridRenderCellParams) => (
                <Chip
                  variant="outlined"
                  label={
                    params.value === "approved"
                      ? "Approved"
                      : params.value === "rejected"
                      ? "Rejected"
                      : "Pending"
                  }
                  color={
                    params.value === "approved"
                      ? "success"
                      : params.value === "rejected"
                      ? "error"
                      : "warning"
                  }
                  size="small"
                />
              )
            };
          }

          return {
            ...col,
            headerName: field === "users" ? "User" : col.headerName,
            minWidth: 120,
            flex: 1,
            editable: field === "shopAccessToken",
            ...(col.type === "number" && {
              align: "center",
              headerAlign: "center"
            })
          };
        })
        .filter(Boolean) as GridColDef[];


      mappedColumns.push({
        field: "actions",
        headerName: "Actions",
        sortable: false,
        filterable: false,
        align: "center",
        headerAlign: "center",
        minWidth: 140,
        flex: 0.5,
        renderCell: (params) => {
          const isPending = params.row.status === "pending";

          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: isPending ? 1 : 0.5,
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

              {isPending && (
                <>
                  <Tooltip title="Approve">
                    <Box
                      component="span"
                      sx={{ cursor: "pointer", color: "green" }}
                      onClick={() => handleApprove(params.row.id)}
                    >
                      <CheckCircleOutlineIcon fontSize="small" />
                    </Box>
                  </Tooltip>
                  <Tooltip title="Reject">
                    <Box
                      component="span"
                      sx={{ cursor: "pointer", color: "red" }}
                      onClick={() => handleReject(params.row.id)}
                    >
                      <CancelOutlinedIcon fontSize="small" />
                    </Box>
                  </Tooltip>
                </>
              )}
            </Box>
          );
        }
      });

      setFilteredRows(rawShops);
      setRows(rawShops);
      setColumnsMeta(mappedColumns);
    } catch (err) {
      console.error("Failed to fetch shops", err);
      alert("❌ Failed to load shops. Please check your server logs.");
    }
  };

  return { columnsMeta, fetchColumnsAndData };
};
