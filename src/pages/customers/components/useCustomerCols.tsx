import type { GridColDef } from "@mui/x-data-grid";
import { getAllCustomers } from "../../../services/Customers.service";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import type { AxiosError } from "axios";
import { Box, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

export const UseCustomerCols = (onView: (row: any) => void) => {
  const [columnsMeta, setColumnsMeta] = useState<GridColDef[]>([]);
  const { user, logout } = useAuth();

  const fetchCustomerDetails = async (
    setRows: React.Dispatch<any[]>,
    setFilteredRows: React.Dispatch<any[]>
  ) => {
    try {
      const data = await getAllCustomers(user?.token);
      // console.log("customers token :::----", user?.token);

      // ✅ Expecting { defaultAddresses: [], otherAddresses: [] }
      const defaultAddresses = Array.isArray(data?.defaultAddresses)
        ? data.defaultAddresses
        : [];
      const otherAddresses = Array.isArray(data?.otherAddresses)
        ? data.otherAddresses
        : [];

      // ✅ Add a srNo and link other addresses to their customer_id
      const flattened = defaultAddresses.map((cust: any, index: any) => ({
        ...cust,
        srNo: index + 1,
        otherAddresses: otherAddresses.filter(
          (addr: any) => addr.customer_id === cust.customer_id
        )
      }));

      const orderedFields = [
        { field: "srNo", header: "Sr No." },
        { field: "fullname", header: "Name" },
        { field: "email", header: "Email" },
        { field: "mobile_no", header: "Mobile No." },
        { field: "address", header: "Address" },
        { field: "type", header: "Type" },
        { field: "status", header: "Status" }
      ];

      const mappedColumns: GridColDef[] = orderedFields.map((f) => ({
        field: f.field,
        headerName: f.header,
        flex: 1,
        minWidth: 120,
        align: f.field === "srNo" ? "center" : "left",
        headerAlign: f.field === "srNo" ? "center" : "left"
      }));

      // 👁 Actions column
      mappedColumns.push({
        field: "actions",
        headerName: "Actions",
        sortable: false,
        filterable: false,
        align: "center",
        headerAlign: "center",
        minWidth: 80,
        renderCell: (params) => (
          <Tooltip title="View All Addresses">
            <Box
              component="span"
              sx={{ cursor: "pointer", color: "primary.main" }}
              onClick={() => onView(params.row)}
            >
              <VisibilityIcon fontSize="small" />
            </Box>
          </Tooltip>
        )
      });

      setFilteredRows(flattened);
      setRows(flattened);
      setColumnsMeta(mappedColumns);
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
        logout();
      } else {
        console.error("❌ Failed to fetch customers", err);
        alert("❌ Failed to load customers. Please check your server logs.");
      }
    }
  };

  return { columnsMeta, fetchCustomerDetails };
};
