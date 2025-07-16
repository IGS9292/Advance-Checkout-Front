import * as React from "react";
import { Avatar, Chip, Tooltip, Box } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import type {
  GridColDef,
  GridRenderCellParams,
  GridCellParams
} from "@mui/x-data-grid";
import { getAllShops } from "../../../../services/ShopService";

// Utils
function getDaysInMonth(month: number, year: number): string[] {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString("en-US", { month: "short" });
  return Array.from(
    { length: date.getDate() },
    (_, i) => `${monthName} ${i + 1}`
  );
}

// Sparkline Cell Renderer
export function renderSparklineCell(params: GridRenderCellParams<number[]>) {
  if (!params.value?.length) return null;
  const days = getDaysInMonth(4, 2024);

  return (
    <Box display="flex" alignItems="center" height="100%">
      <SparkLineChart
        data={params.value}
        width={params.colDef.computedWidth || 100}
        height={32}
        plotType="bar"
        showHighlight
        showTooltip
        color="hsl(210, 98%, 42%)"
        xAxis={{ scaleType: "band", data: days }}
      />
    </Box>
  );
}

// Status Chip
export function renderStatus(status: "Online" | "Offline") {
  const colors: Record<string, "success" | "default"> = {
    Online: "success",
    Offline: "default"
  };
  return <Chip label={status} color={colors[status]} size="small" />;
}

// Avatar renderer (currently disabled)
export function renderAvatar(
  params: GridCellParams<{ name: string; color: string }>
) {
  if (!params.value) return "";
  return <></>;
}

// Editable Columns Generator
export const useDynamicColumns = (
  handleEdit: (row: any) => void,
  handleDelete: (row: any) => void
) => {
  const [columnsMeta, setColumnsMeta] = React.useState<GridColDef[]>([]);

  const fetchColumnsAndData = async (
    setRows: React.Dispatch<any[]>,
    baseURL: string
  ) => {
    try {
      // console.log(" Calling:", `${baseURL}/v1/shops`);

      const data = await getAllShops();
      const rawShops = data.shops || [];
      const sampleRow = rawShops[0] || {};

      console.log("Raw API response:", data);
      console.log("Shops array:", data.shops);
      // 1️⃣ Define the desired column order
      const orderedFields = [
        "id",
        "name",
        "users", // 👈 Put users right after shop name
        "status",
        "eventCount"
      ];
      // 2️⃣ Generate inferred columns
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

      // 3️⃣ Apply ordering using orderedFields
      const mappedColumns: GridColDef[] = orderedFields
        .map((field) => {
          const col = inferredColumns.find((c: any) => c.field === field);
          if (!col) return null;
          return {
            ...col,
            headerName: field === "users" ? "User" : col.headerName, // Optional rename
            ...(col.type === "number" && {
              align: "right",
              headerAlign: "right"
            })
          };
        })
        .filter(Boolean) as GridColDef[];

      // 4️⃣ Add Action column at the end
      mappedColumns.push({
        field: "actions",
        headerName: "Action",
        sortable: false,
        filterable: false,
        align: "center",
        headerAlign: "center",
        width: 100,
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
      });

      // User Email Column if User exists
      // mappedColumns.push({
      //   field: "userEmail",
      //   headerName: "User Email",
      //   flex: 1,
      //   minWidth: 160,
      //   valueGetter: (params: any) => params.row.User?.email || "N/A"
      // });

      setRows(rawShops);
      setColumnsMeta(mappedColumns);
    } catch (err) {
      console.error("Failed to fetch shops", err);
      alert("❌ Failed to load shops. Please check your server logs.");
    }
  };

  return { columnsMeta, fetchColumnsAndData };
};
