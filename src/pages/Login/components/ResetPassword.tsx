import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../../services/AuthService";
import {
  Typography,
  Button,
  OutlinedInput,
  Alert,
  Box,
  Stack
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { showToast } from "../../../helper/toastHelper";

interface ResetFormInputs {
  newPassword: string;
}

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetFormInputs>();

  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: ResetFormInputs) => {
    setLoading(true);
    try {
      const res = await resetPassword(token, data.newPassword);
      setAlertType("success");
      showToast.success(" Password changed successfully");
      setMessage(res.message || " Password changed successfully.");
      setTimeout(() => navigate("/signin"), 2000);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "❌ Invalid or expired link.";
      showToast.error(errorMsg);

      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      maxWidth={480}
      mx="auto"
      mt={12}
      p={4}
      boxShadow={3}
      borderRadius={2}
      bgcolor="#fff"
      display="flex"
      flexDirection="column"
      gap={2}
    >
      <Typography variant="h5" fontWeight="bold">
        Set a New Password
      </Typography>

      <Typography variant="body2" color="text.secondary">
        Enter your new password below to reset your account access.
      </Typography>

      <OutlinedInput
        type="password"
        placeholder="New Password"
        fullWidth
        {...register("newPassword", {
          required: "Password is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters"
          }
        })}
      />

      {errors.newPassword && (
        <Typography color="error" variant="body2">
          {errors.newPassword.message}
        </Typography>
      )}

      {message && (
        <Alert severity={alertType} sx={{ mt: 1 }}>
          {message}
        </Alert>
      )}

      <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
        <Button onClick={() => navigate("/signin")}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </Stack>
    </Box>
  );
}
