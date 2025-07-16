import {
  Box,
  Typography,
  Button,
  Stack,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress
} from "@mui/material";
import { useState, useEffect } from "react";
import CustomizedDataGrid from "../dashboard/components/CustomizedDataGrid";
import Search from "../dashboard/components/Search";
import { useDynamicColumns } from "../dashboard/internals/data/gridData";
import { createShop, deleteShop, updateShop } from "../../services/ShopService";
import AppTextField from "../../shared/components/TextField";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { sendVerificationLink } from "../../services/authService";

const baseURL = import.meta.env.VITE_API_BASE as string;

const ShopsListView = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [rows, setRows] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    user: "",
    status: "Online",
    eventCount: ""
  });
  const [editingRow, setEditingRow] = useState<any>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.formData) {
      setFormData(location.state.formData);
    }
    if (location.state?.verified) {
      setIsVerified(true);
      setVerifySuccess(true);
    }
  }, [location.state]);

  const handleSendVerification = async () => {
    try {
      setLoading(true);
      setVerifySuccess(false);
      setVerifyError(null);

      const { user } = formData;
      console.log("sendverification email link user:", user);
      if (!user) return setVerifyError("Please enter an email to verify");

      await sendVerificationLink(user);
      setVerifySuccess(true);
      alert("Verification email sent!");
      navigate("/email-verified", {
        state: {
          from: "/shops",
          formData
        }
      });
    } catch (err: any) {
      setVerifyError(err.message || "❌ Failed to send verification email.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row: any) => {
    setEditingRow(row);
    setFormData({
      name: row.name,
      user: row.user, //cek here user email update
      status: row.status,
      eventCount: row.eventCounts
    });
    setOpenDialog(true);
  };

  const handleDelete = async (row: any) => {
    if (window.confirm("Delete this shop?")) {
      try {
        await deleteShop(row.id);
        fetchColumnsAndData(setRows, baseURL);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const { columnsMeta: dynamicCols, fetchColumnsAndData } = useDynamicColumns(
    handleEdit,
    handleDelete
  );

  useEffect(() => {
    fetchColumnsAndData(setRows, baseURL);
  }, []);

  const columns = dynamicCols;

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRow(null);
    setFormData({
      name: "",
      user: "",
      status: "Online",
      eventCount: ""
    });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const payload = {
      name: formData.name,
      status: formData.status,
      eventCount: Number(formData.eventCount) || 0,
      email: formData.user 
    };
    try {
      if (editingRow) {
        await updateShop(editingRow.id, {
          name: payload.name,
          status: payload.status,
          eventCount: payload.eventCount
        });
      } else {
        await createShop(payload);
      }
      handleCloseDialog();
      fetchColumnsAndData(setRows, baseURL);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  return (
    <>
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2
          }}
        >
          <Typography component="h2" variant="h6">
            Shops
          </Typography>
          <Stack direction="row" spacing={2}>
            <Search />
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenDialog}
            >
              Add Shop
            </Button>
          </Stack>
        </Box>

        <Grid container spacing={2} columns={12}>
          <Grid size={{ xs: 12, lg: 9 }}>
            <CustomizedDataGrid rows={rows} columns={columns} />
          </Grid>
        </Grid>
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="text-xl font-semibold text-white bg-gray-900">
          {editingRow ? "Edit Shop" : "Add New Shop"}
        </DialogTitle>

        <DialogContent className="bg-gray-900">
          <Box className="flex items-center justify-center bg-gray-900 py-6">
            <Box
              component="form"
              className="bg-gray-800 text-white shadow-lg rounded-xl px-6 py-8 w-full max-w-md"
            >
              <Stack spacing={2}>
                <AppTextField
                  label="Shop Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  className="w-full"
                  InputProps={{
                    className: "text-white"
                  }}
                  InputLabelProps={{ className: "text-white" }}
                />

                <Box className="flex gap-2 items-stretch">
                  <AppTextField
                    label="User Email"
                    name="user"
                    value={formData.user}
                    onChange={handleChange}
                    fullWidth
                    disabled={Boolean(editingRow)}
                    className="w-full"
                    InputProps={{
                      className: "text-white"
                    }}
                    InputLabelProps={{ className: "text-white" }}
                  />
                  {!editingRow && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleSendVerification}
                      disabled={!formData.user || isVerified || loading}
                      className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white px-3 font-semibold"
                    >
                      {isVerified ? (
                        "Verified"
                      ) : loading ? (
                        <CircularProgress size={20} sx={{ color: "black" }} />
                      ) : (
                        "Verify Email"
                      )}
                    </Button>
                  )}
                </Box>

                {verifySuccess && (
                  <Alert severity="success" className="text-green-400">
                    📩 Verification link sent!
                  </Alert>
                )}
                {verifyError && (
                  <Alert severity="error" className="text-red-400">
                    {verifyError}
                  </Alert>
                )}

                <AppTextField
                  label="Event Count"
                  name="eventCount"
                  value={formData.eventCount}
                  onChange={handleChange}
                  fullWidth
                  className="w-full"
                  InputProps={{ className: "text-white" }}
                  InputLabelProps={{ className: "text-white" }}
                />

                <AppTextField
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  fullWidth
                  className="w-full"
                  InputProps={{ className: "text-white" }}
                  InputLabelProps={{ className: "text-white" }}
                />

                <Box className="flex justify-end mt-4 gap-2">
                  <Button
                    variant="outlined"
                    onClick={handleCloseDialog}
                    className="text-white border-white hover:border-gray-400 hover:text-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                  >
                    {editingRow ? "Update" : "Create"}
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShopsListView;
