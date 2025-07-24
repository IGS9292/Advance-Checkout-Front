import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../auth/useAuth";

const mainListItems = [
  { text: "Home", icon: <HomeRoundedIcon />, path: "/dashboard" },
  { text: "Analytics", icon: <AnalyticsRoundedIcon />, path: "/analytics" },
  { text: "Clients", icon: <PeopleRoundedIcon />, path: "/clients" },
  { text: "Orders", icon: <AssignmentRoundedIcon />, path: "/orders" },
  { text: "Coupons", icon: <AssignmentRoundedIcon />, path: "/coupons" },
  { text: "Checkout", icon: <AssignmentRoundedIcon />, path: "/checkout" },
  { text: "Shops", icon: <AssignmentRoundedIcon />, path: "/shops" },
  {
    text: "Chat Support",
    icon: <AssignmentRoundedIcon />,
    path: "/chatsupport" // role: "1"
  } // Admin
  // {
  //   text: "Support",
  //   icon: <AssignmentRoundedIcon />,
  //   path: "/chatlist",
  //   role: "0"
  // } // SuperAdmin
];

const secondaryListItems = [
  { text: "Settings", icon: <SettingsRoundedIcon />, path: "/settings" },
  { text: "About", icon: <InfoRoundedIcon />, path: "/about" },
  { text: "Feedback", icon: <HelpRoundedIcon />, path: "/feedback" }
];

export default function MenuContent() {
  const { role } = useAuth(); // "0" = superadmin, "1" = admin
  const location = useLocation();
  const basePath = role === "0" ? "/superadmin-dashboard" : "/admin-dashboard";

  const filteredMainItems = mainListItems.filter((item) => {
    if (item.text === "Shops" && role !== "0") return false;
    if (item.text === "Checkout" && role !== "1") return false;
    if (item.text === "Coupons" && role !== "1") return false;
    // if (item.text === "Support" && item.role && item.role !== role)
    // return false;
    return true;
  });

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {filteredMainItems.map((item, index) => {
          const fullPath = `${basePath}${item.path}`;
          return (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                selected={location.pathname === fullPath}
                component={Link}
                to={fullPath}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <List dense>
        {secondaryListItems.map((item, index) => {
          const fullPath = `${basePath}${item.path}`;
          return (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={Link}
                to={fullPath}
                selected={location.pathname === fullPath}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Stack>
  );
}
