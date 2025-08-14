import type {} from "@mui/x-date-pickers/themeAugmentation";
import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid/themeAugmentation";
import type {} from "@mui/x-tree-view/themeAugmentation";
import { alpha, useTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "./components/AppNavbar";
import Header from "./components/Header";
import SideMenu from "./components/SideMenu";
import AppTheme from "../../shared/shared-theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations
} from "./theme/customizations";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useEffect } from "react";
import RouteTracker from "../../helper/RouteTracker";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations
};

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const navigate = useNavigate();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  // Store last route when it changes
  useEffect(() => {
    if (accessToken && location.pathname !== "/login") {
      localStorage.setItem("lastPath", location.pathname);
    }
  }, [location, accessToken]);

  // Restore last route on mount
  useEffect(() => {
    const lastPath = localStorage.getItem("lastPath");
    if (accessToken && lastPath && location.pathname === "/") {
      navigate(lastPath);
    }
  }, []);

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <Box>
          {!isMobile && <SideMenu />}
          <AppNavbar />
        </Box>
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto"
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 }
            }}
          >
            <Header />
            {/* <Checkout/> */}
            <RouteTracker />
            <Outlet />

            {/* <MainGrid /> */}
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
