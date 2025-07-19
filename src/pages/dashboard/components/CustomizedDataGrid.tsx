import { DataGrid, type GridColDef, type GridRowsProp } from "@mui/x-data-grid";

type Props = {
  rows: GridRowsProp;
  columns: GridColDef[]; // 👈 Add this
};

export default function CustomizedDataGrid({ rows, columns }: Props) {
  return (
    <>
      <DataGrid
        // checkboxSelection
        rows={rows}
        columns={columns}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        initialState={{
          pagination: { paginationModel: { pageSize: 15 } }
        }}
        pageSizeOptions={[10, 20, 50]}
        disableColumnResize
        density="compact"
        slotProps={{
          filterPanel: {
            filterFormProps: {
              logicOperatorInputProps: {
                variant: "outlined",
                size: "small"
              },
              columnInputProps: {
                variant: "outlined",
                size: "small",
                sx: { mt: "auto" }
              },
              operatorInputProps: {
                variant: "outlined",
                size: "small",
                sx: { mt: "auto" }
              },
              valueInputProps: {
                InputComponentProps: {
                  variant: "outlined",
                  size: "small"
                }
              }
            }
          }
        }}
      />
    </>
  );
}
