// components/AppPasswordField.tsx
import React, { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import type { TextFieldProps } from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";

const AppPasswordField: React.FC<TextFieldProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      {...props}
      type={showPassword ? "text" : "password"}
      fullWidth
      variant={props.variant || "outlined"}
      InputProps={{
        ...props.InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword((prev) => !prev)}
              edge="end"
              size="small"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        )
      }}
      sx={{
        ...props.sx,
        "& .MuiOutlinedInput-root": {
          color: "#4B4B4B",
          "& fieldset": {
            borderColor: "#ccc"
          },
          "&:hover fieldset": {
            borderColor: "#bbb"
          },
          "&.Mui-focused fieldset": {
            borderColor: "#a6a6a6"
          }
        },
        "& .MuiInputLabel-root": {
          color: "#777",
          "&.Mui-focused": {
            color: "#777"
          }
        }
      }}
    />
  );
};

export default AppPasswordField;
