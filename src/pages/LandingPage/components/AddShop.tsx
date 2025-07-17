import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  MenuItem,
  Stack,
  Container,
  TextField
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AppTextField from "../../../shared/components/TextField";
import { requestShop } from "../../../services/ShopService";
// import { useShopContext } from "../../../contexts/ShopContext";

const StyledBox = styled("div")(({ theme }) => ({
  alignSelf: "center",
  width: "100%",
  height: 400,
  marginTop: theme.spacing(8),
  borderRadius: theme.shape.borderRadius,
  outline: "6px solid",
  outlineColor: "hsla(220, 25%, 80%, 0.2)",
  border: "1px solid",
  borderColor: theme.palette.grey[200],
  boxShadow: "0 0 12px 8px hsla(220, 25%, 80%, 0.2)",
  backgroundImage: `url(${
    import.meta.env.VITE_TEMPLATE_IMAGE_URL || "https://mui.com"
  }/static/screenshots/material-ui/getting-started/templates/dashboard.jpg)`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  [theme.breakpoints.up("sm")]: {
    marginTop: theme.spacing(10),
    height: 700
  },
  ...theme.applyStyles?.("dark", {
    boxShadow: "0 0 24px 12px hsla(210, 100%, 25%, 0.2)",
    backgroundImage: `url(${
      import.meta.env.VITE_TEMPLATE_IMAGE_URL || "https://mui.com"
    }/static/screenshots/material-ui/getting-started/templates/dashboard-dark.jpg)`
  })
}));

const AddShop: React.FC = () => {
  // const context = useShopContext();
  // if (!context) return null;

  // const { fetchShops } = context;

  const [formData, setFormData] = useState({
    shopName: "",
    shopUrl: "",
    email: "",
    shopContactNo: "",
    ordersPerMonth: "",
    status: "pending"
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      shopName: formData.shopName,
      shopUrl: formData.shopUrl,
      shopContactNo: formData.shopContactNo,
      ordersPerMonth: parseInt(formData.ordersPerMonth, 10),
      email: formData.email,
      status: formData.status as "pending" | "approved" | "rejected"
    };

    try {
      await requestShop(payload);
      // await fetchShops();
      alert("✅ Request submitted. Await approval.");
      setFormData({
        shopName: "",
        shopUrl: "",
        email: "",
        shopContactNo: "",
        ordersPerMonth: "",
        status: "pending"
      });
    } catch (err) {
      console.error("❌ Error:", err);
    }
  };

  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: "100%",
        backgroundRepeat: "no-repeat",
        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)",
        ...theme.applyStyles?.("dark", {
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)"
        })
      })}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
          position: "relative"
        }}
      >
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: "center", width: { xs: "100%", sm: "70%" } }}
        >
          <Typography
            variant="h3"
            textAlign="center"
            sx={{ fontSize: "clamp(2rem, 6vw, 3rem)" }}
          >
            Add Your Shop
          </Typography>
          <Typography textAlign="center" color="text.secondary">
            Fill in your store details and request access for your online
            checkout demo.
          </Typography>
        </Stack>

        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="flex-start"
          mt={4}
          sx={{
            border: "1px solid",
            borderColor: "lightgray",
            borderRadius: 2,
            p: 2
          }}
        >
          {/* Video Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Here’s what happens when you book a demo, Checkout the demo...
            </Typography>
            <Box
              component="video"
              controls
              src="/demo-video.mp4"
              width="100%"
              sx={{ borderRadius: 2, boxShadow: 3, backgroundColor: "#000" }}
            />
          </Grid>

          {/* Form Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <AppTextField
                  label="Full Name (Shop Name)"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  label="Shop URL"
                  name="shopUrl"
                  value={formData.shopUrl}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="User Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  label="Contact Number"
                  name="shopContactNo"
                  value={formData.shopContactNo}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  select
                  label="Orders per month"
                  name="ordersPerMonth"
                  value={formData.ordersPerMonth}
                  onChange={handleChange}
                  fullWidth
                  required
                >
                  <MenuItem value="0-500">0 - 500</MenuItem>
                  <MenuItem value="500-2000">500 - 2000</MenuItem>
                  <MenuItem value="2000-10000">2000 - 10000</MenuItem>
                  <MenuItem value="10000+">10000+</MenuItem>
                </TextField>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ py: 1.5, fontWeight: "bold" }}
                >
                  Request to Add Shop
                </Button>
              </Stack>
            </form>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AddShop;
