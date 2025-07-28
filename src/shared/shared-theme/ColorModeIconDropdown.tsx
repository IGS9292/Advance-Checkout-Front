import * as React from "react";
import DarkModeIcon from "@mui/icons-material/DarkModeRounded";
import LightModeIcon from "@mui/icons-material/LightModeRounded";
import IconButton from "@mui/material/IconButton";
import type { IconButtonOwnProps } from "@mui/material/IconButton";
import { useColorScheme } from "@mui/material/styles";

const COLOR_MODE_KEY = "color-mode";

export default function ColorModeIconDropdown(props: IconButtonOwnProps) {
  const { mode, setMode } = useColorScheme();

  // On mount, set initial mode from localStorage or system
  React.useEffect(() => {
    const savedMode = localStorage.getItem(COLOR_MODE_KEY);
    if (savedMode === "light" || savedMode === "dark") {
      setMode(savedMode);
    } else {
      // Default to system mode
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const systemDefault = prefersDark ? "dark" : "light";
      setMode(systemDefault);
      localStorage.setItem(COLOR_MODE_KEY, systemDefault);
    }
  }, [setMode]);

  const handleToggle = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem(COLOR_MODE_KEY, newMode);
  };

  const icon = mode === "dark" ? <DarkModeIcon /> : <LightModeIcon />;

  return (
    <IconButton onClick={handleToggle} size="small" {...props}>
      {icon}
    </IconButton>
  );
}
