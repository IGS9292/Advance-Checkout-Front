// DownloadMenu.tsx
import { Divider, IconButton, Menu, MenuItem } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import { useState } from "react";

type DownloadMenuProps = {
  rows: any[];
  columns: any[];
};

export default function DownloadMenu({ rows, columns }: DownloadMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      rows.map((row) => {
        const obj: any = {};
        columns.forEach((col) => {
          obj[col.headerName || col.field] = row[col.field];
        });
        return obj;
      })
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "table_data.xlsx");
    handleCloseMenu();
  };

  const handleExportImage = async () => {
    // 1. Build a full HTML table string with forced light colors
    let tableHTML = `
    <table border="1" style="
      border-collapse: collapse;
      font-family: Arial;
      background-color: white;
      color: black;
      width: 100%;
    ">
  `;

    // Header
    tableHTML += "<thead><tr>";
    columns.forEach((col) => {
      tableHTML += `<th style="
      padding: 8px;
      background-color: #f0f0f0;
      color: black;
      border: 1px solid #ccc;
      text-align: left;
    ">${col.headerName || col.field}</th>`;
    });
    tableHTML += "</tr></thead>";

    // Body
    tableHTML += "<tbody>";
    rows.forEach((row) => {
      tableHTML += "<tr>";
      columns.forEach((col) => {
        tableHTML += `<td style="
        padding: 6px;
        border: 1px solid #ccc;
        color: black;
      ">${row[col.field] || ""}</td>`;
      });
      tableHTML += "</tr>";
    });
    tableHTML += "</tbody></table>";

    // 2. Render the table offscreen
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "-9999px";
    container.style.backgroundColor = "white";
    container.innerHTML = tableHTML;
    document.body.appendChild(container);

    // 3. Convert HTML table to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: "#ffffff"
    });
    const link = document.createElement("a");
    link.download = "table.jpg";
    link.href = canvas.toDataURL("image/jpeg", 1.0);
    link.click();

    // Cleanup
    document.body.removeChild(container);
    handleCloseMenu();
  };

  return (
    <>
      <IconButton
        onClick={handleOpenMenu}
        sx={{ border: "none", outline: "none", boxShadow: "none" }}
      >
        <DownloadIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleExportExcel} sx={{ padding: "3px" }}>
          Download Excel
        </MenuItem>
        <Divider sx={{ width: "100%" }} />
        <MenuItem onClick={handleExportImage} sx={{ padding: "3px" }}>
          Download Image
        </MenuItem>
      </Menu>
    </>
  );
}
