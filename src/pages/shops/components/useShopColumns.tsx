import * as React from "react";
import { Chip, Tooltip, Box } from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
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
      // plans: any[] // ⬅ accept plans
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
        { field: "srNo", header: "Sr No." },
        { field: "shopName", header: "Shop Name" },
        { field: "users", header: "Users" },
        { field: "planName", header: "Active Plan" },
        { field: "shopAccessToken", header: "Shop Acces Token" },
        { field: "shopUrl", header: "Shop Url" },
        { field: "shopContactNo", header: "Shop Contact No" },
        { field: "ordersPerMonth", header: "Orders Per Month" },
        { field: "status", header: "Status" }
      ];
     

      const mappedColumns: GridColDef[] = orderedFields.map((f) => {
        // Sr No column
        if (f.field === "srNo") {
          return {
            field: f.field,
            headerName: f.header,
            minWidth: 80,
            flex: 0.3,
            sortable: false,
            align: "center",
            headerAlign: "center"
          };
        }

        if (f.field === "planName") {
          return {
            field: f.field,
            headerName: f.header,
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

        

        if (f.field === "status") {
          return {
            field: f.field,
            headerName: f.header,
            minWidth: 120,
            flex: 1,
            renderCell: (params: GridRenderCellParams) => {
              let color: "default" | "success" | "error" | "warning" | "info" =
                "default";
              let label = params.value || "Pending";

              switch (params.value) {
                case "approved":
                  color = "success";
                  label = "Approved";
                  break;
                case "rejected":
                  color = "error";
                  label = "Rejected";
                  break;
                case "processed":
                  color = "info";
                  label = "Processed";
                  break;
                case "pending":
                default:
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

        // Default columns
        return {
          field: f.field,
          headerName: f.header === "users" ? "User" : f.header,
          minWidth: 120,
          flex: 1,
          editable: f.field === "shopAccessToken",
          ...(typeof sampleRow[f.field] === "number" && {
            align: "center",
            headerAlign: "center"
          })
        };
      });

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
