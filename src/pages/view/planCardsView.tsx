import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
  Chip
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getActivePlanByShop, getAllPlans } from "../../services/PlanService";
import { showToast } from "../../helper/toastHelper";
import RazorpayCheckout from "../../components/razorpay/razorpayCheckout";

type Plan = {
  id: number;
  plan_name: string;
  order_range: string;
  sales_fee: string;
  charges?: string;
};

const PlanCardsView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentPlanId } = location.state || {};

  const [plans, setPlans] = useState<Plan[]>([]);
  const [activePlan, setActivePlan] = useState<Plan | null>(null);
  const { shopId, user } = useAuth();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getAllPlans();
        setPlans(Array.isArray(data) ? data : data?.plans || []);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    const fetchActivePlan = async () => {
      try {
        if (shopId) {
          const data = await getActivePlanByShop(shopId);
          setActivePlan(data || null);
        }
      } catch (error) {
        console.error("Error fetching active plan:", error);
      }
    };

    fetchPlans();
    fetchActivePlan();
  }, [shopId]);

  const handleCheckout = (plan: Plan) => {
    if (!user) {
      navigate("/signin");
      return;
    }

    if (!shopId) {
      showToast.error("⚠️ Please connect your shop first");
      return;
    }

    RazorpayCheckout({
      planId: plan.id,
      shopId,
      amount: Number(plan.sales_fee) * 1000,
      onSuccess: () =>
        showToast.success(`Upgraded to ${plan.plan_name} successfully!`),
      onFailure: () => showToast.error("Payment failed")
    });
  };

  return (
    <Box width="100%">
      <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
        Choose the plan that fits your GMV
      </Typography>

      <Typography
        variant="subtitle1"
        color="text.secondary"
        align="center"
        mb={4}
      >
        Pick the best plan based on your sales growth
      </Typography>

      <Grid container spacing={3}>
        {plans.map((plan) => {
          const isActive = activePlan && activePlan.id === plan.id;

          return (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={plan.id}>
              <Paper
                // elevation={1}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  transition: "0.3s",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: "1",
                  justifyContent: "space-between",
                  border: isActive ? "1px solid #4caf50" : "0px solid #eee",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 1
                  }
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    color="primary"
                    gutterBottom
                  >
                    {plan.plan_name}
                  </Typography>

                  <Typography
                    variant="h2"
                    fontWeight="bold"
                    color="text.primary"
                  >
                    {parseFloat(plan.sales_fee).toFixed(1)}%
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="body2" color="text.secondary">
                    Growth based fee <br />
                    (% of your sales).
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={500}
                    mt={1}
                  >
                    Best suited for <b>{plan.order_range}</b>
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={1}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontSize="15px"
                      fontWeight={500}
                    >
                      Starting from
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontSize="15px"
                      fontWeight={600}
                    >
                      ₹{plan.charges ?? "0.00"}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1 }} />
                  <Typography
                    variant="body2"
                    fontSize="15px"
                    align="center"
                    fontWeight={600}
                    color="grey.400"
                    sx={{ mt: 3 }}
                  >
                    Billed Monthly
                  </Typography>
                </Box>

                <Box mt={3}>
                  {isActive ? (
                    // <Chip
                    //   label="Active"
                    //   color="success"
                    //   variant="outlined"
                    //   sx={{ fontWeight: 600, width: "100%" }}
                    // />
                    <Button variant="outlined" fullWidth disabled={isActive}>
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleCheckout(plan)}
                    >
                      {user
                        ? activePlan
                          ? "Upgrade Now"
                          : "Buy Now"
                        : "Buy Now"}
                    </Button>
                  )}
                </Box>
              </Paper>
            </Grid>
          );
        })}

        {plans.length === 0 && (
          <Typography
            variant="body1"
            align="center"
            sx={{ width: "100%", mt: 4 }}
          >
            No plans available.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default PlanCardsView;
