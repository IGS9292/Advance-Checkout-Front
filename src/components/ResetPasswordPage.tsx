import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { PasswordStrengthMeter } from "../shared/components/PasswordStrengthMeter"; // Optional
import zxcvbn from "zxcvbn";
import { resetPassword } from "../services/AuthService";

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  // const baseURL = import.meta.env.VITE_API_BASE as string;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("❌ Invalid or missing token.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    // 🔐 Check password strength using zxcvbn
    const { score } = zxcvbn(newPassword);
    if (score < 2) {
      setMessage("❌ Password is too weak. Use a stronger password.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, newPassword);
      setMessage("✅ Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "❌ Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Paper elevation={4} className="p-8 max-w-md w-full space-y-4">
        <Typography variant="h5" className="text-center font-bold">
          Reset Your Password
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            fullWidth
          />
          <PasswordStrengthMeter password={newPassword} />

          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            fullWidth
          />

          {message && (
            <Typography
              variant="body2"
              color={message.startsWith("✅") ? "success.main" : "error.main"}
            >
              {message}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} /> : null}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ResetPasswordPage;
