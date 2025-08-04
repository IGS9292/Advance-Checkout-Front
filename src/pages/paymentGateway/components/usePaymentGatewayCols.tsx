import * as React from "react";
import { Avatar, Chip, Tooltip, Box } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { getAllPaymentMethods } from "../../../services/PaymentGatewayService";
import {
  ToggleOffRounded,
  ToggleOnOutlined,
  ToggleOnRounded
} from "@mui/icons-material";

export const useDynamicColumns = (
  handleEdit: (row: any) => void,
  handleDelete: (row: any) => void,
  handleApprove: (id: number) => void,
  handleReject: (id: number) => void
) => {
  const [columnsMeta, setColumnsMeta] = React.useState<GridColDef[]>([]);

  const fetchPaymentColumnsAndData = async (
    setRows: React.Dispatch<any[]>,
    setFilteredRows: React.Dispatch<any[]>,
    baseURL: string
  ) => {
    try {
      const data = await getAllPaymentMethods();
      let paymentMethods = Array.isArray(data) ? data : [];

      paymentMethods = paymentMethods.map((item: any, index: number) => ({
        ...item,
        srNo: index + 1
      }));

      const sampleRow = paymentMethods[0] || {};

      const orderedFields = [
        "srNo",
        "gatewayImageUrl",
        "paymentGatewayName",
        "status"
      ];

      const inferredColumns = Object.keys(sampleRow).map((key) => ({
        field: key,
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
        minWidth: 120,
        flex: 1,
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
              minWidth: 80,
              flex: 0.3,
              sortable: false,
              align: "center",
              headerAlign: "center"
            };
          }

          if (field === "gatewayImageUrl") {
            return {
              ...col,
              headerName: "Image",
              // minWidth: 100,
              // flex: 0.5,
              renderCell: (params: GridRenderCellParams) => (
                <Box
                  component="img"
                  alt={params.row.paymentGatewayName}
                  src={params.value || ""}
                  sx={{
                    width: 40,
                    height: 50, // Change this for vertical rectangle (e.g. 50), or keep same as width for square
                    objectFit: "contain",
                    borderRadius: 1 // Optional: 0 for sharp, 1 for slight rounding
                  }}
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
              renderCell: (params: GridRenderCellParams) => (
                <Chip
                  variant="outlined"
                  label={params.value === "active" ? "Active" : "Inactive"}
                  color={params.value === "active" ? "success" : "default"}
                  size="small"
                />
              )
            };
          }

          return {
            ...col,
            editable: false,
            minWidth: 120,
            flex: 1,
            align: col.type === "number" ? "center" : undefined,
            headerAlign: col.type === "number" ? "center" : undefined
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
          const isInactive = params.row.status === "inactive";

          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
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

              {isInactive ? (
                <Tooltip title="Activate">
                  <Box
                    component="span"
                    sx={{ cursor: "pointer", color: "green" }}
                    onClick={() => handleApprove(params.row.id)}
                  >
                    <ToggleOnRounded />
                  </Box>
                </Tooltip>
              ) : (
                <Tooltip title="Deactivate">
                  <Box
                    component="span"
                    sx={{ cursor: "pointer", color: "red" }}
                    onClick={() => handleReject(params.row.id)}
                  >
                    <ToggleOffRounded color="error" />
                  </Box>
                </Tooltip>
              )}
            </Box>
          );
        }
      });

      setFilteredRows(paymentMethods);
      setRows(paymentMethods);
      setColumnsMeta(mappedColumns);
    } catch (err) {
      console.error("Failed to fetch payment methods", err);
      alert(
        "❌ Failed to load payment methods. Please check your server logs."
      );
    }
  };

  return { columnsMeta, fetchPaymentColumnsAndData };
};
