import * as React from "react";
import {
  Chip,
  Tooltip,
  Box,
  MenuItem,
  Menu,
  ListItemText,
  ListItemIcon,
  Divider
} from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { MoreHorizRounded } from "@mui/icons-material";

import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { getAllShops } from "../../../services/ShopService";
import { showToast } from "../../../helper/toastHelper";
import MenuButton from "../../dashboard/components/MenuButton";

export const useShopColumns = (
  handleEdit: (row: any) => void,
  handleDelete: (row: any) => void,
  handleApprove: (id: number) => void,
  handleReject: (id: number) => void,
  handleProcessedRequest: (id: number) => void
) => {
  const [columnsMeta, setColumnsMeta] = React.useState<GridColDef[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuRowId, setMenuRowId] = React.useState<number | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>, rowId: number) => {
    setAnchorEl(event.currentTarget);
    setMenuRowId(rowId);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setMenuRowId(null);
  };

  const fetchColumnsAndData = async (
    setRows: React.Dispatch<React.SetStateAction<any[]>>,
    setFilteredRows: React.Dispatch<React.SetStateAction<any[]>>,
    baseURL: string
  ) => {
    try {
      const data = await getAllShops();
      let rawShops = Array.isArray(data.shops) ? data.shops : [];

      rawShops = rawShops.map((shop: any, index: number) => ({
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

          if (field === "status") {
            return {
              ...col,
              headerName: "Status",
              minWidth: 120,
              flex: 1,
              renderCell: (params: GridRenderCellParams) => {
                let color:
                  | "default"
                  | "success"
                  | "error"
                  | "warning"
                  | "info" = "default";
                let label = "Pending";

                if (params.value === "approved") {
                  color = "success";
                  label = "Approved";
                } else if (params.value === "rejected") {
                  color = "error";
                  label = "Rejected";
                } else if (params.value === "processed") {
                  color = "info";
                  label = "Processed";
                } else if (params.value === "pending") {
                  color = "warning";
                  label = "Pending";
                }

                return (
                  <Chip
                    label={label}
                    color={color}
                    size="small"
                    variant="outlined"
                  />
                );
              }
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
        flex: 0.6,
        renderCell: (params) => {
          const isPending = params.row.status === "pending";
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                gap: 1
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
              <Tooltip title="More">
                <Box>
                  <MenuButton
                    aria-label="Open menu"
                    onClick={(e) => handleClick(e, params.row.id)}
                    sx={{
                      border: "none",
                      boxShadow: "none",
                      borderRadius: "50%"
                    }}
                  >
                    <MoreHorizRounded />
                  </MenuButton>
                </Box>
              </Tooltip>
            </Box>
          );
        }
      });

      setFilteredRows(rawShops);
      setRows(rawShops);
      setColumnsMeta(mappedColumns);
    } catch (err) {
      console.error("Failed to fetch shops", err);
      showToast.error(
        "❌ Failed to load shops. Please check your server logs."
      );
    }
  };

  return {
    columnsMeta,
    fetchColumnsAndData,
    anchorEl,
    open,
    menuRowId,
    handleClose,
    handleProcessedRequest,
    handleApprove,
    handleReject
  };
};
