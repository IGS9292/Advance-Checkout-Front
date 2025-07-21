import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MenuContent from "./MenuContent";
import CardAlert from "./CardAlert";
import OptionsMenu from "./OptionsMenu";
import advanceCheckoutLogo from "../../../assets/advanceCheckoutLogo.png";
import { useAuth } from "../../../contexts/AuthContext";
import { Tooltip } from "@mui/material";

const drawerWidth = 260;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box"
  }
});

export default function SideMenu() {
  const { user } = useAuth();

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper"
        }
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mt: "calc(var(--template-frame-height, 0px) + 4px)",
          p: 1.5,
          gap: 1,
          height: 70
        }}
      >
        <img
          src={advanceCheckoutLogo}
          alt="Advance Checkout Logo"
          style={{ height: "100%", width: "100%" }}
        />
      </Box>

      <Divider />
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <MenuContent />
        <CardAlert />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider"
        }}
      >
        <Avatar
          sizes="small"
          alt="Riley Carter"
          src="/static/images/avatar/7.jpg"
          sx={{ width: 36, height: 36 }}
        >
          {!user?.shopName ? "" : user?.shopName[0].toUpperCase()}
        </Avatar>
        <Box sx={{ mr: "auto" }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, lineHeight: "16px" }}
          >
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
        </Box>

        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}
