import * as React from "react";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../contexts/AuthContext";
import { getActivePlanByShop } from "../../../services/planCardsService";

interface Plan {
  id: number;
  name: string;
  order_range: string;
  status: string;
}

interface CardAlertProps {
  shopId: number;
}

export default function CardAlert({ shopId }: CardAlertProps) {
  if (!shopId) return null;
  const [plan, setPlan] = useState<Plan | null>(null);
  const navigate = useNavigate();
  const { role } = useAuth();

  const basePath = role === "0" ? "/superadmin-dashboard" : "/admin-dashboard";

  useEffect(() => {
    const fetchActivePlan = async () => {
      try {
        const activePlan = await getActivePlanByShop(shopId);
        setPlan(activePlan);
      } catch (err) {
        console.error("Error fetching active plan:", err);
      }
    };

    fetchActivePlan();
  }, [shopId]);

  const handleUpgrade = () => {
    navigate(`${basePath}/plans-view`, {
      state: { currentPlanId: plan?.id, shopId }
    });
  };

  const handleBuyPlan = () => {
    navigate(`${basePath}/plans-view`, { state: { shopId } });
  };

  if (!plan) {
    return (
      <Card variant="outlined" sx={{ m: 1.5, flexShrink: 0 }}>
        <CardContent>
          <AutoAwesomeRoundedIcon fontSize="small" />
          <Typography gutterBottom sx={{ fontWeight: 600 }}>
            No Plan Active
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            Select a plan to get started.
          </Typography>
          <Button
            variant="contained"
            size="small"
            fullWidth
            onClick={handleBuyPlan}
          >
            Buy Plan
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ m: 1.5, flexShrink: 0 }}>
      <CardContent>
        <AutoAwesomeRoundedIcon fontSize="small" />
        <Typography gutterBottom sx={{ fontWeight: 600 }}>
          Current Plan: {plan.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{ mb: 2, color: "text.secondary", textWrap: "wrap" }}
        >
          Orders per month: {plan.order_range}
        </Typography>
        <Button
          variant="contained"
          size="small"
          fullWidth
          onClick={handleUpgrade}
        >
          Upgrade Plan
        </Button>
      </CardContent>
    </Card>
  );
}
