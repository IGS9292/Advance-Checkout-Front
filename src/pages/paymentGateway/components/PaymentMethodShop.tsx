import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormLabel,
  Chip
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import {
  getAvailablePaymentMethods,
  savePaymentGatewayCredentials
} from "../../../services/PaymentMethodShopService";
import { useAuth } from "../../../contexts/AuthContext";

interface Gateway {
  id: number;
  paymentGatewayName: string;
  gatewayImageUrl: string;
  status: "active" | "inactive";
  shopConnections?: {
    api_key: string;
    api_secret_key: string;
    status: "active" | "inactive";
  }[];
}

interface CredentialFormInput {
  api_key: string;
  api_secret_key: string;
}

const PaymentMethodShop = () => {
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [selectedGateway, setSelectedGateway] = useState<Gateway | null>(null);
  const { user } = useAuth();
  const token = user?.token;

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<CredentialFormInput>();

  const fetchGateways = async () => {
    if (!token) return;
    try {
      const data = await getAvailablePaymentMethods(token);
      setGateways(data);
    } catch (err) {
      console.error("Error loading gateways", err);
    }
  };

  useEffect(() => {
    fetchGateways();
  }, [token]);

  const handleSetupClick = (gateway: Gateway) => {
    setSelectedGateway(gateway);
    reset({ api_key: "", api_secret_key: "" });
  };

  const onSubmit = async (data: CredentialFormInput) => {
    if (!selectedGateway || !token) return;

    try {
      await savePaymentGatewayCredentials(token, {
        gatewayId: selectedGateway.id,
        api_key: data.api_key,
        api_secret_key: data.api_secret_key,
        status: "active"
      });

      setSelectedGateway(null);
      await fetchGateways();
    } catch (error) {
      console.error("Error saving credentials", error);
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        {gateways.map((gateway) => {
          const configured = gateway.shopConnections?.[0];
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={gateway.id}>
              <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
                <Box display="flex" justifyContent="center" mb={2}>
                  <Avatar
                    src={gateway.gatewayImageUrl}
                    alt={gateway.paymentGatewayName}
                    sx={{ width: 64, height: 64 }}
                    variant="square"
                  />
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  {gateway.paymentGatewayName}
                </Typography>
                <Box
                  mt={2}
                  sx={{
                    minHeight: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {configured?.status === "active" ? (
                    <Chip
                      label="Active"
                      color="success"
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                  ) : (
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => handleSetupClick(gateway)}
                      sx={{ minHeight: 32, padding: "4px 8px" }}
                    >
                      Click to setup
                    </Button>
                  )}
                </Box>
              </Paper>
            </Grid>
          );
        })}
        {gateways.length === 0 && (
          <Typography variant="body1">No gateways available.</Typography>
        )}
      </Grid>

      <Dialog
        open={!!selectedGateway}
        onClose={() => setSelectedGateway(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Setup {selectedGateway?.paymentGatewayName}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogContent dividers>
            <FormControl fullWidth required margin="normal">
              <FormLabel>API Key</FormLabel>
              <Controller
                name="api_key"
                control={control}
                rules={{ required: "API Key is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    error={!!errors.api_key}
                    helperText={errors.api_key?.message}
                  />
                )}
              />
            </FormControl>

            <FormControl fullWidth required margin="normal">
              <FormLabel>API Secret Key</FormLabel>
              <Controller
                name="api_secret_key"
                control={control}
                rules={{ required: "API Secret Key is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    error={!!errors.api_secret_key}
                    helperText={errors.api_secret_key?.message}
                  />
                )}
              />
            </FormControl>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setSelectedGateway(null)}>Cancel</Button>
            <Button variant="contained" type="submit">
              Save & Activate
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default PaymentMethodShop;
