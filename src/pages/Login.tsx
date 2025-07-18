import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Box, Button, Typography, Stack, Paper } from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
// import ResetPasswordDialog from "../components/ResetPasswordDialog";
import AppTextField from "../shared/components/TextField";
import AppPasswordField from "../shared/components/Password";
import { loginUser } from "../services/AuthService";

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const SUPERADMIN = "0";
  const ADMIN = "1";
  const baseURL = import.meta.env.VITE_API_BASE as string;
  const recaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string;

  const [openResetDialog, setOpenResetDialog] = useState(false);

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: ""
  });

  const [captchaToken, setCaptchaToken] = useState<string>("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCaptcha = (token: string | null) => {
    if (token) setCaptchaToken(token);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { email, password } = form;

      const data = await loginUser({
        email,
        password,
        token: captchaToken
      });

      if (!data.status) {
        alert(data.message || "Invalid login");
        return;
      }

      const userData = {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        token: data.token
      };

      login(userData);
      console.log("userdata", userData);
      console.log("userdata role", userData.role);

      if (userData.role === SUPERADMIN) {
        navigate("/superadmin-dashboard");
      } else {
        navigate("/admin-dashboard");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box className="flex items-center justify-center min-h-screen bg-gray-100">
      <Paper
        elevation={3}
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 420,
          borderRadius: 3,
          backgroundColor: "#fff"
        }}
      >
        <Typography
          variant="h5"
          textAlign="center"
          color="gray"
          fontWeight={600}
          mb={3}
        >
          Login
        </Typography>

        <Stack spacing={3}>
          <AppTextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <AppPasswordField
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <Box display="flex" justifyContent="center">
            <ReCAPTCHA sitekey={recaptchaKey} onChange={handleCaptcha} />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#de7400",
              "&:hover": { backgroundColor: "#c66700" },
              color: "#fff",
              fontWeight: "bold",
              py: 1.5,
              borderRadius: 2,
              mt: 1
            }}
          >
            Login
          </Button>

          <Box display="flex" justifyContent="space-between" fontSize="14px">
            <Typography variant="body2">
              New User?{" "}
              <Link to="/signup" className="text-blue-500 hover:underline">
                Sign Up
              </Link>
            </Typography>

            <Typography variant="body2">
              <button
                type="button"
                onClick={() => setOpenResetDialog(true)}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </Typography>
          </Box>
        </Stack>

        {/* <ResetPasswordDialog
          open={openResetDialog}
          onClose={() => setOpenResetDialog(false)}
        /> */}
      </Paper>
    </Box>
  );
};

export default Login;
