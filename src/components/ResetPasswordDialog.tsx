import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography
} from "@mui/material";
import { requestPasswordReset } from "../services/AuthService";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ResetPasswordDialog: React.FC<Props> = ({ open, onClose }) => {
  const baseURL = import.meta.env.VITE_API_BASE as string;

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await requestPasswordReset(email);
      setMessage(res.data.message || "✅ Reset link sent to your email.");
    } catch (err: any) {
      setMessage(
        err.response?.data?.message || "❌ Failed to send reset link."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Request Password Reset</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Enter your email"
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            margin="dense"
          />
          {message && (
            <Typography
              variant="body2"
              color={message.includes("❌") ? "error" : "primary"}
              sx={{ mt: 2 }}
            >
              {message}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ResetPasswordDialog;
