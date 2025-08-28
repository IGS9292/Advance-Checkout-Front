import type { GridColDef } from "@mui/x-data-grid";
import { getAllPlans } from "../../../services/PlanService";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import type { AxiosError } from "axios";
import { Box, Tooltip, Typography } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { showToast } from "../../../helper/toastHelper";

export const usePlanColumns = (
  onEdit: (row: any) => void,
  onDelete: (row: any) => void
) => {
  const [columnsMeta, setColumnsMeta] = useState<GridColDef[]>([]);
  const { logout } = useAuth();

  const fetchPlans = async (
    setRows: React.Dispatch<any[]>,
    setFilteredRows: React.Dispatch<any[]>
  ) => {
    try {
      const data = await getAllPlans();

      const flattened = (data?.plans || []).map((plan: any, index: number) => ({
        ...plan,
        srNo: index + 1
      }));

      const orderedFields = [
        { field: "srNo", header: "Sr No." },
        { field: "plan_name", header: "Plan Name" },
        { field: "order_range", header: "Order Range" },
        { field: "sales_fee", header: "Sales Fee (%)" },
        { field: "charges", header: "Charges (₹)" }
      ];

      const mappedColumns: GridColDef[] = orderedFields.map((f) => {
        if (f.field === "charges") {
          return {
            field: f.field,
            headerName: f.header,
            flex: 1,
            minWidth: 120,
            align: "left",
            headerAlign: "left",
            renderCell: (params) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                  pl: 0,
                  pr: 0
                }}
              >
                <Typography variant="body2">
                  {params.value ? `₹${params.value}` : "-"}
                </Typography>
              </Box>
            )
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

      mappedColumns.push({
        field: "actions",
        headerName: "Actions",
        sortable: false,
        filterable: false,
        align: "center",
        headerAlign: "center",
        minWidth: 160,
        flex: 0.6,
        renderCell: (params) => (
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
                onClick={() => onEdit(params.row)}
              >
                <EditOutlinedIcon fontSize="small" />
              </Box>
            </Tooltip>

            <Tooltip title="Delete">
              <Box
                component="span"
                sx={{ cursor: "pointer", color: "error.main" }}
                onClick={() => onDelete(params.row)}
              >
                <DeleteOutlineIcon fontSize="small" />
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
        showToast.error("Session expired. Please log in again.");
        logout();
      } else {
        console.error("❌ Failed to fetch plans", err);
        showToast.error(
          "❌ Failed to load plans. Please check your server logs."
        );
      }
    }
  };

  return { columnsMeta, fetchPlans };
};
