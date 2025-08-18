import * as React from "react";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getActivePlanByShop } from "../../../services/PlanService";

interface Plan {
  id: number;
  name: string;
  order_range: string;
  status: string;
}

interface CardAlertProps {
  shopId: number; // Logged-in shop ID
}

export default function CardAlert({ shopId }: CardAlertProps) {
  if (!shopId) return null;
  const [plan, setPlan] = useState<Plan | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivePlan = async () => {
      try {
        const activePlan = await getActivePlanByShop(shopId);
        setPlan(activePlan);
      } catch (err) {
        console.error("Error fetching active plan:", err);
      }
    };
    // if (shopId)
    fetchActivePlan();
  }, [shopId]);

  const handleUpgrade = () => {
    navigate(`/upgrade-plan/${plan?.id ?? ""}`);
  };

  if (!plan) {
    return null; // No active plan, hide card
  }

  return (
    <Card variant="outlined" sx={{ m: 1.5, flexShrink: 0 }}>
      <CardContent>
        <AutoAwesomeRoundedIcon fontSize="small" />
        <Typography gutterBottom sx={{ fontWeight: 600 }}>
          Current Plan: {plan.name}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
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
