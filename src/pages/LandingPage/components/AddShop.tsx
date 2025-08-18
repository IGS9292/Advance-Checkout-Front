import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  MenuItem,
  Stack,
  Container,
  TextField,
  FormLabel,
  FormControl
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useForm, Controller } from "react-hook-form";
import { requestShop } from "../../../services/ShopService";
import { getAllPlans } from "../../../services/PlanService";

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

type Plan = {
  id: number;
  order_range: string;
};

const AddShop: React.FC = () => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      shopName: "",
      shopUrl: "",
      email: "",
      shopContactNo: "",
      ordersPerMonth: "",
      status: "pending"
    }
  });

  const [orderRanges, setOrderRanges] = useState<string[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getAllPlans();
        const plans = Array.isArray(data) ? data : data?.plans || [];
        const ranges = plans.map((plan: Plan) => plan.order_range);
        console.log("order ranges->>>>", ranges);
        setOrderRanges(ranges);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };
    fetchPlans();
  }, []);

  const onSubmit = async (data: any) => {
    const payload = {
      shopName: data.shopName,
      shopUrl: data.shopUrl,
      shopContactNo: data.shopContactNo,
      ordersPerMonth: data.ordersPerMonth,
      email: data.email,
      status: data.status as "pending" | "approved" | "rejected"
    };

    try {
      await requestShop(payload);
      alert("✅ Request submitted. Await approval.");
      reset();
    } catch (err) {
      console.error("❌ Error submitting shop request:", err);
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
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <FormControl fullWidth required>
                  <FormLabel htmlFor="shopName">
                    Full Name (Shop Name)
                  </FormLabel>
                  <Controller
                    name="shopName"
                    control={control}
                    rules={{ required: "Shop name is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="shopName"
                        error={!!errors.shopName}
                        helperText={errors.shopName?.message}
                      />
                    )}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <FormLabel htmlFor="shopUrl">Shop URL</FormLabel>
                  <Controller
                    name="shopUrl"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} id="shopUrl" />
                    )}
                  />
                </FormControl>

                <FormControl fullWidth required>
                  <FormLabel htmlFor="email">User Email</FormLabel>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email"
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="email"
                        type="email"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                    )}
                  />
                </FormControl>

                <FormControl fullWidth required>
                  <FormLabel htmlFor="shopContactNo">Contact Number</FormLabel>
                  <Controller
                    name="shopContactNo"
                    control={control}
                    rules={{ required: "Contact number is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="shopContactNo"
                        error={!!errors.shopContactNo}
                        helperText={errors.shopContactNo?.message}
                      />
                    )}
                  />
                </FormControl>

                {/* <FormControl fullWidth required>
                  <FormLabel htmlFor="ordersPerMonth">
                    Orders per month
                  </FormLabel>
                  <Controller
                    name="ordersPerMonth"
                    control={control}
                    rules={{ required: "Please select an option" }}
                    render={({ field }) => (
                      <TextField
                        select
                        {...field}
                        id="ordersPerMonth"
                        error={!!errors.ordersPerMonth}
                        helperText={errors.ordersPerMonth?.message}
                      >
                        <MenuItem value="0-500">0 - 500</MenuItem>
                        <MenuItem value="500-2000">500 - 2000</MenuItem>
                        <MenuItem value="2000-10000">2000 - 10000</MenuItem>
                        <MenuItem value="10000+">10000+</MenuItem>
                      </TextField>
                    )}
                  />
                </FormControl> */}

                <FormControl fullWidth required>
                  <FormLabel htmlFor="ordersPerMonth">
                    Orders per month
                  </FormLabel>
                  <Controller
                    name="ordersPerMonth"
                    control={control}
                    rules={{ required: "Please select an option" }}
                    render={({ field }) => (
                      <TextField
                        select
                        {...field}
                        id="ordersPerMonth"
                        error={!!errors.ordersPerMonth}
                        helperText={errors.ordersPerMonth?.message}
                      >
                        {orderRanges.map((range, idx) => (
                          <MenuItem key={idx} value={range}>
                            {range}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </FormControl>

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
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AddShop;
