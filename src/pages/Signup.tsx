import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Stack, Alert } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AppTextField from "../shared/components/TextField";
import AppPasswordField from "../shared/components/Password";
import { sendVerificationLink, signupUser } from "../services/AuthService";

// const baseURL = import.meta.env.VITE_API_BASE as string;

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    shopName: "",
    user_type: "1" // default to admin (0 = superadmin, 1 = admin)
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [verifySuccess, setVerifySuccess] = useState<boolean>(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [emailVerified, setEmailVerified] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.formData) {
      setFormData(location.state.formData);
    }
    if (location.state?.verified) {
      setEmailVerified(true);
      setVerifySuccess(true);
    }
  }, [location.state]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get("verified") === "true") {
      setEmailVerified(true);
      setVerifySuccess(true);
    }
  }, [location.search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSendVerification = async () => {
    try {
      setVerifySuccess(false);
      setVerifyError(null);
      const { email } = formData;

      if (!email) return setVerifyError("Please enter an email to verify");

      await sendVerificationLink(email); // ✅ using service
      navigate("/email-verified", {
        state: {
          from: "/signup",
          formData
        }
      });
      setVerifySuccess(true);
    } catch (err: any) {
      setVerifyError(err.response?.data?.message || "❌ Failed to send link");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password, confirmPassword, shopName } = formData;

    // ✅ Ensure email is verified
    if (!emailVerified) {
      return setError("Please verify your email before signing up.");
    }

    // ✅ Check required fields
    if (!email || !password || !confirmPassword) {
      return setError("Email and password fields are required.");
    }

    // ✅ Passwords must match
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    // ✅ Shop name is required for admin users
    // if (user_type !== 0 && !shopName.trim()) {
    //   return setError("Shop name is required for admin users.");
    // }

    try {
      // ✅ Force user_type = 1 if shopName is present (admin)
      const userPayload = {
        email,
        password,
        shopName: shopName || null
      };

      await signupUser(userPayload);

      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <Box className="flex items-center justify-center min-h-screen bg-gray-100">
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl px-8 py-10 w-full max-w-md"
      >
        <Typography
          variant="h5"
          textAlign="center"
          color="gray"
          fontWeight={600}
          mb={3}
        >
          Sign Up
        </Typography>

        <Stack spacing={2}>
          <Box display="flex" gap={1} alignItems="stretch">
            <AppTextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {/* <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            /> */}
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={handleSendVerification}
              disabled={emailVerified}
              sx={{
                fontWeight: 500,
                height: "100%"
              }}
            >
              {emailVerified ? "Verified" : "Verify Email"}
            </Button>
          </Box>
          {verifySuccess && (
            <Alert severity="success">📩 Verification link sent!</Alert>
          )}
          {verifyError && <Alert severity="error">{verifyError}</Alert>}

          <AppPasswordField
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <AppPasswordField
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <AppTextField
            label="Shop Name"
            name="shopName"
            value={formData.shopName}
            onChange={handleChange}
            required
          />

          {error && <Alert severity="error">{error}</Alert>}
          {success && (
            <Alert severity="success">Signup successful! Redirecting...</Alert>
          )}

          <Button
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: "#de7400",
              "&:hover": { backgroundColor: "#c66700" },
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "8px",
              padding: "10px",
              mt: 1
            }}
            fullWidth
          >
            Sign Up
          </Button>

          <Typography variant="body2" className="text-center">
            Already have an account?{" "}
            <Link to={"/login"} className="text-blue-500 hover:underline">
              Login
            </Link>
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default Signup;
