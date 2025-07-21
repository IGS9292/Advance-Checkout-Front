import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import MenuButton from "./MenuButton";
import MenuContent from "./MenuContent";
import CardAlert from "./CardAlert";
import { useAuth } from "../../../contexts/AuthContext"; // adjust path as needed
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";

interface SideMenuMobileProps {
  open: boolean | undefined;
  toggleDrawer: (newOpen: boolean) => () => void;
}

export default function SideMenuMobile({
  open,
  toggleDrawer
}: SideMenuMobileProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out...");
    logout();
    navigate("/");
  };
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: "none",
          backgroundColor: "background.paper"
        }
      }}
    >
      <Stack
        sx={{
          maxWidth: "70dvw",
          height: "100%"
        }}
      >
        <Stack direction="row" sx={{ p: 1, pb: 0, gap: 1 }}>
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: "center", flexGrow: 1, p: 1 }}
          >
            <Avatar
              sizes="small"
              alt="Profile Image"
              src="/static/images/avatar/7.jpg"
              sx={{ width: 24, height: 24 }}
            >
              {" "}
              {!user?.shopName ? "" : user?.shopName[0].toUpperCase()}
            </Avatar>

            <Stack direction="column" sx={{ alignItems: "left" }}>
              <Typography component="p" variant="h6">
                {user?.shopName || "No shop"}
              </Typography>
              <Tooltip title={user?.email || "user@example.com"}>
                <Typography
                  variant="caption"
                  noWrap
                  sx={{
                    color: "text.secondary",
                    maxWidth: 140,
                    display: "block"
                  }}
                >
                  {user?.email || "user@example.com"}
                </Typography>
              </Tooltip>
            </Stack>
          </Stack>
          <MenuButton showBadge>
            <NotificationsRoundedIcon />
          </MenuButton>
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          <MenuContent />
          <Divider />
        </Stack>
        <CardAlert />
        <Stack sx={{ p: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<LogoutRoundedIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}
