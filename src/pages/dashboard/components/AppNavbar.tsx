import * as React from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MuiToolbar from "@mui/material/Toolbar";
import { tabsClasses } from "@mui/material/Tabs";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SideMenuMobile from "./SideMenuMobile";
import MenuButton from "./MenuButton";
import ColorModeIconDropdown from "../../../shared/shared-theme/ColorModeIconDropdown";
import advanceCheckoutLogo from "../../../assets/advanceCheckoutLogo.png";

const Toolbar = styled(MuiToolbar)({
  width: "100%",
  padding: "12px",
  display: "flex",
  flexDirection: "column",
  alignItems: "start",
  justifyContent: "center",
  gap: "12px",
  flexShrink: 0,
  [`& ${tabsClasses.flexContainer}`]: {
    gap: "8px",
    p: "8px",
    pb: 0
  }
});

export default function AppNavbar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        display: { xs: "flex", md: "none" },
        boxShadow: 0,
        bgcolor: "background.paper",
        backgroundImage: "none",
        borderBottom: "1px solid",
        borderColor: "divider",
        top: "var(--template-frame-height, 0px)"
      }}
    >
      <Toolbar variant="regular">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          {/* Logo Section */}
          <Box sx={{ display: "flex", alignItems: "center", height: 40 }}>
            <img
              src={advanceCheckoutLogo}
              alt="Advance Checkout Logo"
              style={{ height: "100%", width: "auto" }}
            />
          </Box>
          {/* Theme & Menu Controls */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <ColorModeIconDropdown />
            <MenuButton aria-label="menu" onClick={toggleDrawer(true)}>
              <MenuRoundedIcon />
            </MenuButton>
            <SideMenuMobile open={open} toggleDrawer={toggleDrawer} />
          </Stack>{" "}
        </Stack>

        {/* Drawer Component */}
        <SideMenuMobile open={open} toggleDrawer={toggleDrawer} />
      </Toolbar>
    </AppBar>
  );
}