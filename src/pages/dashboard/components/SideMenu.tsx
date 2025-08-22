import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useState } from "react";
import MenuContent from "./MenuContent";
import OptionsMenu from "./OptionsMenu";
import advanceCheckoutLogo from "../../../assets/advanceCheckoutLogo.png";
import { useAuth } from "../../../contexts/AuthContext";

interface StyledDrawerProps {
  open: boolean;
}
const drawerWidth = 230;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1.5),
  height: 70
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open"
})<StyledDrawerProps>(({ theme, open }) => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  overflowX: "hidden",
  width: open ? drawerWidth : 60,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: open
      ? theme.transitions.duration.enteringScreen
      : theme.transitions.duration.leavingScreen
  }),
  "& .MuiDrawer-paper": {
    width: open ? drawerWidth : 64,
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: open
        ? theme.transitions.duration.enteringScreen
        : theme.transitions.duration.leavingScreen
    })
  }
}));

export default function SideMenu() {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const { user } = useAuth();

  const handleToggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        {open ? (
          <img
            src={advanceCheckoutLogo}
            alt="Advance Checkout Logo"
            style={{ height: 40, width: "auto", maxWidth: "100%" }}
          />
        ) : (
          <Box sx={{ width: 40 }} />
        )}

        <Tooltip title={open ? "Collapse Sidebar" : "Expand Sidebar"}>
          <IconButton
            onClick={handleToggleDrawer}
            size="small"
            sx={{
              boxShadow: "none",
              "&:focus": {
                outline: "none"
              }
            }}
          >
            {open ? <ChevronLeftIcon /> : <MenuRoundedIcon />}
          </IconButton>
        </Tooltip>
      </DrawerHeader>

      <Divider />

      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <MenuContent drawerOpen={open} />
      </Box>

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
        sx={{
          p: 2,
          borderTop: "1px solid",
          borderColor: "divider"
        }}
      >
        <Avatar alt={user?.shopName || "User"} sx={{ width: 34, height: 34 }}>
          {user?.shopName?.[0]?.toUpperCase() || ""}
        </Avatar>

        {open && (
          <Box sx={{ flexGrow: 1, mx: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {user?.shopName || "No shop"}
            </Typography>
            <Tooltip title={user?.email || "user@example.com"}>
              <Typography
                variant="caption"
                noWrap
                sx={{
                  color: "text.secondary",
                  maxWidth: 115,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "block"
                }}
              >
                {user?.email || "user@example.com"}
              </Typography>
            </Tooltip>
          </Box>
        )}

        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}
