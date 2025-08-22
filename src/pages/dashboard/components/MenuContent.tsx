import * as React from "react";
import {
  Card,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip
} from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../auth/useAuth";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import PaymentRoundedIcon from "@mui/icons-material/PaymentRounded";
import SmsRoundedIcon from "@mui/icons-material/SmsRounded";
import StoreRoundedIcon from "@mui/icons-material/StoreRounded";
import { CurrencyRupeeRounded } from "@mui/icons-material";
import CardAlert from "./CardAlert";

const mainListItems = [
  { text: "Home", icon: <HomeRoundedIcon />, path: "/dashboard" },

  { text: "Orders", icon: <ShoppingCartRoundedIcon />, path: "/orders" },
  {
    text: "Coupons",
    icon: <LocalOfferRoundedIcon />,
    path: "/coupons",
    role: "1"
  },
  {
    text: "Checkout",
    icon: <PaymentRoundedIcon />,
    path: "/checkout",
    role: "1"
  },
  {
    text: "Shops",
    icon: <StoreRoundedIcon />,
    path: "/shops",
    role: "0"
  },

  {
    text: "Plan",
    icon: <AnalyticsRoundedIcon />,
    path: "/plan",
    role: "0"
  },
  {
    text: "Payment Gateway",
    icon: <CurrencyRupeeRounded />,
    path: "/payment-gateway"
  },
  {
    text: "Chat Support",
    icon: <SmsRoundedIcon />,
    path: "/chatsupport"
  },
  {
    text: "Customers",
    icon: <PeopleRoundedIcon />,
    path: "/customers",
    role: "1"
  }
];

const secondaryListItems = [
  { text: "Settings", icon: <SettingsRoundedIcon />, path: "/settings" },
  { text: "About", icon: <InfoRoundedIcon />, path: "/about" },
  { text: "Feedback", icon: <HelpRoundedIcon />, path: "/feedback" }
];

interface MenuContentProps {
  drawerOpen?: boolean;
}

export default function MenuContent({ drawerOpen = true }: MenuContentProps) {
  const { role } = useAuth(); // "0" = superadmin, "1" = admin
  const { shopId } = useAuth();

  const location = useLocation();
  const basePath = role === "0" ? "/superadmin-dashboard" : "/admin-dashboard";

  const filteredMainItems = mainListItems.filter((item) => {
    if (item.role && item.role !== role) return false;
    return true;
  });
  console.log("shopId", shopId);
  const renderMenuItem = (item: any, index: number) => {
    const fullPath = `${basePath}${item.path}`;
    const selected = location.pathname === fullPath;

    const iconElement = React.cloneElement(item.icon, { sx: { fontSize: 26 } });

    return (
      <ListItem key={index} disablePadding sx={{ display: "block" }}>
        {drawerOpen ? (
          <ListItemButton
            component={Link}
            to={fullPath}
            selected={selected}
            sx={{
              minHeight: 48,
              justifyContent: "initial",
              px: 2.5
            }}
          >
            <ListItemIcon
              sx={{ minWidth: 0, mr: 0.5, justifyContent: "center" }}
            >
              {iconElement}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ) : (
          <Tooltip title={item.text} placement="right">
            <ListItemButton
              component={Link}
              to={fullPath}
              selected={selected}
              sx={{
                minHeight: 48,
                justifyContent: "center",
                px: 2.5
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                {iconElement}
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>
        )}
      </ListItem>
    );
  };

  return (
    <>
      <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
        <List dense>{filteredMainItems.map(renderMenuItem)}</List>

        <List dense>{secondaryListItems.map(renderMenuItem)}</List>
      </Stack>

      {role === "1" && shopId && <CardAlert shopId={shopId} />}
      {/* {role === "1" && <CardAlert />} */}
    </>
  );
}
