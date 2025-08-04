import { DataGrid, type GridColDef, type GridRowsProp } from "@mui/x-data-grid";

type Props = {
  rows: GridRowsProp;
  columns: GridColDef[];
};

export default function CustomizedDataGrid({ rows, columns }: Props) {
  return (
    <>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        initialState={{
          pagination: { paginationModel: { pageSize: 15 } }
        }}
        pageSizeOptions={[10, 20, 50]}
        density="compact"
        hideFooterSelectedRowCount
        sx={{
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
            outline: "none"
          },
          "& .MuiDataGrid-row.Mui-selected, & .MuiDataGrid-cell.Mui-selected": {
            backgroundColor: "transparent"
          },
          "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-cell": {
            transition: "all 0.2s ease"
          }
        }}
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
