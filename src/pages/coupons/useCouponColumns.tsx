import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Tooltip, Box, Chip } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { getCoupons } from "../../services/CouponService";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export const useCouponColumns = (
  handleEdit: (row: any) => void,
  handleDelete: (row: any) => void,
  handleApprove: (id: number) => void,
  handleReject: (id: number) => void
) => {
  const [columnsMeta, setColumnsMeta] = useState<GridColDef[]>([]);
  const { user } = useAuth();

  const fetchCouponsDetails = async (
    setRows: React.Dispatch<any[]>,
    setFilteredRows: React.Dispatch<any[]>,
    baseURL: string
  ) => {
    try {
      const data = await getCoupons(user?.token);
      // const data = await getCoupons();
      // console.log("✅ Fetched coupons:", data);

      let coupons = Array.isArray(data.coupons) ? data.coupons : [];

      // 🔹 Flatten couponDetails & add srNo
      coupons = coupons.map((c: any, index: number) => {
        const { couponDetails = {}, shop = {} } = c;

        return {
          ...c,
          srNo: index + 1,
          shopName: shop.shopName || "-",
          discount: couponDetails.discount || "-",
          usageLimit: couponDetails.usageLimit || "-",
          startsAt: couponDetails.startsAt
            ? new Date(couponDetails.startsAt).toISOString().split("T")[0]
            : "-",
          endsAt: couponDetails.endsAt
            ? new Date(couponDetails.endsAt).toISOString().split("T")[0]
            : "-"
        };
      });

      const orderedFields = [
        "srNo",
        "title",
        "shopName",
        "discount",
        "usageLimit",
        "startsAt",
        "endsAt"
      ];

      const inferredColumns = Object.keys(coupons[0] || {}).map((key) => ({
        field: key,
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
        flex: 1,
        minWidth: 120,
        type: typeof coupons[0]?.[key] === "number" ? "number" : "string"
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

      // 🔹 Add Status Column
      mappedColumns.push({
        field: "status",
        headerName: "Status",
        width: 120,
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
      });

      // 🔹 Add Actions Column
      mappedColumns.push({
        field: "actions",
        headerName: "Actions",
        sortable: false,
        filterable: false,
        align: "center",
        headerAlign: "center",
        width: 140,
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

      setFilteredRows(coupons);
      setRows(coupons);
      setColumnsMeta(mappedColumns);
    } catch (err) {
      console.error("❌ Failed to fetch coupons", err);
      alert("❌ Failed to load coupons. Please check your server logs.");
    }
  };

  return { columnsMeta, fetchCouponsDetails };
};
