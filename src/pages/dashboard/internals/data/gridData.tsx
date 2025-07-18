import * as React from "react";
import { Avatar, Chip, Tooltip, Box } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { getAllShops } from "../../../../services/ShopService";

// const statusMap: Record<
//   number,
//   { label: string; color: "success" | "warning" | "default" }
// > = {
//   0: { label: "Pending", color: "warning" },
//   1: { label: "Approved", color: "success" }
// };

export const useDynamicColumns = (
  handleEdit: (row: any) => void,
  handleDelete: (row: any) => void,
  handleApprove: (id: number) => void,
  handleReject: (id: number) => void
) => {
  const [columnsMeta, setColumnsMeta] = React.useState<GridColDef[]>([]);

  const fetchColumnsAndData = async (
    setRows: React.Dispatch<any[]>,
    baseURL: string
  ) => {
    try {
      const data = await getAllShops();
      const rawShops = Array.isArray(data.shops) ? data.shops : [];

      const sampleRow = rawShops[0] || {};
      // console.log("Shops Data:", rawShops);

      const orderedFields = [
        "shopName",
        "users",
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

          if (field === "status") {
            return {
              ...col,
              headerName: "Status",
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
            ...(col.type === "number" && {
              align: "right",
              headerAlign: "right"
            })
          };
        })
        .filter(Boolean) as GridColDef[];

      // 👇 Action column
      mappedColumns.push({
        field: "actions",
        headerName: "Actions",
        sortable: false,
        filterable: false,
        align: "center",
        headerAlign: "center",
        width: 180,
        renderCell: (params) => {
          const isPending = params.row.status === "pending";

          return (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
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

      setRows(rawShops);
      setColumnsMeta(mappedColumns);
    } catch (err) {
      console.error("Failed to fetch shops", err);
      alert("❌ Failed to load shops. Please check your server logs.");
    }
  };

  return { columnsMeta, fetchColumnsAndData };
};
