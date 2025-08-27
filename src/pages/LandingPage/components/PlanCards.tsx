import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAllPlans } from "../../../services/PlanService";

type Plan = {
  id: number;
  plan_name: string;
  order_range: string;
  sales_fee: string; // stored as string from API
};

export default function LandingPlanCards() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getAllPlans();
        setPlans(Array.isArray(data) ? data : data?.plans || []);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };
    fetchPlans();
  }, []);

  return (
    <Box sx={{ py: 8, px: { xs: 2, sm: 4, md: 8 }, textAlign: "center" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Choose the plan that fits in your GMV
      </Typography>

      <Grid container spacing={3} justifyContent="center" sx={{ mt: 3 }}>
        {plans.map((plan) => (
          <Grid size={{ xs: 12, sm: 9, md: 5.5, lg: 2.5 }} key={plan.id}>
            <Card
              id={`plan-${plan.id}`}
              sx={{
                height: "100%",
                borderRadius: 4,
                boxShadow: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                p: 2
              }}
            >
              <CardContent sx={{ textAlign: "left" }}>
                <Typography
                  variant="h5"
                  fontSize="24px"
                  color="secondary"
                  fontWeight="bold"
                  gutterBottom
                >
                  {plan.plan_name}
                </Typography>

                <Typography variant="h1" fontWeight="bold" fontSize="64px">
                  {parseFloat(plan.sales_fee).toFixed(1)}%
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontSize="16px"
                  sx={{ mt: 1, mb: 2 }}
                >
                  Growth based fee <br />
                  (% of your sales).
                  <br />
                  <br />
                  Best suited for brands doing <b>{plan.order_range}</b>
                </Typography>
              </CardContent>

              <Box sx={{ textAlign: "center", mb: 1 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate("/signin")}
                >
                  Buy Now
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
