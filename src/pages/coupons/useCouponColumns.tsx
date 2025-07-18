// src/pages/coupons/useCouponColumns.ts
import type { GridColDef } from "@mui/x-data-grid";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Tooltip, Box } from "@mui/material";

export const getCouponColumns = (
  handleEdit: (row: any) => void,
  handleDelete: (row: any) => void
): GridColDef[] => [
  { field: "couponCode", headerName: "Code", flex: 1, minWidth: 100 },
  { field: "discountType", headerName: "Type", flex: 1, minWidth: 100 },
  { field: "discountAmount", headerName: "Amount", flex: 1, minWidth: 100 },
  { field: "expirationDate", headerName: "Expiry", flex: 1, minWidth: 100 },
  { field: "status", headerName: "Status", flex: 1, minWidth: 100 },
  {
    field: "actions",
    headerName: "Actions",
    sortable: false,
    width: 140,
    renderCell: (params) => (
      <Box sx={{ display: "flex", gap: 1 }}>
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
    )
  }
];
