import { Box, Typography, Button, Alert } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const EmailVerified = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verified, setVerified] = useState(false);

  const from = location.state?.from;
  const formData = location.state?.formData || {};

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get("verified") === "true") {
      setVerified(true);
    }
  }, [location.search]);

  const handleContinue = () => {
    navigate(from, {
      state: {
        formData,
        verified: true
      }
    });
  };
  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h4" gutterBottom>
        Email Verified 🎉
      </Typography>

      {verified && (
        <Alert severity="success" sx={{ my: 2 }}>
          Your email has been successfully verified.
        </Alert>
      )}

      <Typography variant="body1" gutterBottom>
        You can now continue to complete your form.
      </Typography>

      <Button variant="contained" sx={{ mt: 4 }} onClick={handleContinue}>
        Continue...
      </Button>
    </Box>
  );
};

export default EmailVerified;
