import React from "react";
import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";

const AppTextField: React.FC<TextFieldProps> = (props) => {
  return (
    <TextField
      fullWidth
      {...props}
      variant={props.variant || "outlined"}
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

export default AppTextField;
