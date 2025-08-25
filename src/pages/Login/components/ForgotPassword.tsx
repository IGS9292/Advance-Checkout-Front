import * as React from "react";
import { useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import OutlinedInput from "@mui/material/OutlinedInput";
import { requestPasswordReset } from "../../../services/AuthService";
import { showToast } from "../../../helper/toastHelper";

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPassword({
  open,
  handleClose
}: ForgotPasswordProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordFormData>();

  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      const response = await requestPasswordReset(data.email);
      showToast.success("📧 Reset link sent to your email!");
      setMessage(response.message || "Reset link sent!");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Something went wrong.";
      showToast.error(errorMessage);
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: "form",
          onSubmit: handleSubmit(onSubmit),
          sx: { backgroundImage: "none" }
        }
      }}
    >
      <DialogTitle>Reset password</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
      >
        <DialogContentText>
          Enter your account&apos;s email address, and we&apos;ll send you a
          link to reset your password.
        </DialogContentText>

        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="email"
          placeholder="Email address"
          type="email"
          fullWidth
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address"
            }
          })}
        />
        {errors.email && (
          <DialogContentText color="error">
            {errors.email.message}
          </DialogContentText>
        )}
        {message && (
          <DialogContentText color="primary">{message}</DialogContentText>
        )}
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" type="submit" disabled={loading}>
          {loading ? "Sending..." : "Continue"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
