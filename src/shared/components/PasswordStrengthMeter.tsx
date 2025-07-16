import React from "react";
import zxcvbn from "zxcvbn";
import { LinearProgress, Typography, Box } from "@mui/material";

interface Props {
  password: string;
}

const getStrengthLabel = (score: number) => {
  switch (score) {
    case 0:
      return "Very Weak";
    case 1:
      return "Weak";
    case 2:
      return "Fair";
    case 3:
      return "Good";
    case 4:
      return "Strong";
    default:
      return "";
  }
};

export const PasswordStrengthMeter: React.FC<Props> = ({ password }) => {
  const { score } = zxcvbn(password);

  const strengthColor = [
    "#ff4d4f", // red
    "#ff7a45", // orange
    "#faad14", // gold
    "#52c41a", // green
    "#1890ff" // blue (strong)
  ];

  return (
    <Box mt={1}>
      <LinearProgress
        variant="determinate"
        value={(score + 1) * 20}
        sx={{
          height: 8,
          borderRadius: 5,
          backgroundColor: "#f0f0f0",
          "& .MuiLinearProgress-bar": {
            backgroundColor: strengthColor[score]
          }
        }}
      />
      <Typography variant="caption" color="textSecondary">
        Strength: {getStrengthLabel(score)}
      </Typography>
    </Box>
  );
};
