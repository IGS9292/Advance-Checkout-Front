import * as React from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { useLocation, Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: "center"
  }
}));


const PATH_TITLES: { [key: string]: string } = {
  dashboard: "Dashboard",
  analytics: "Analytics",
  clients: "Clients",
  bargraph: "Bar Graph View",
  linechart: "Line Chart View"

};

export default function NavbarBreadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <StyledBreadcrumbs
      separator={<NavigateNextRoundedIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      <Link component={RouterLink} underline="hover" color="inherit" to="/">
        Home
      </Link>

      {pathnames.map((value, index) => {
        const isLast = index === pathnames.length - 1;
        const to = "/" + pathnames.slice(0, index + 1).join("/");
        const title = PATH_TITLES[value] || decodeURIComponent(value);

        return isLast ? (
          <Typography key={to} color="text.primary" fontWeight={600}>
            {title}
          </Typography>
        ) : (
          <Link
            key={to}
            component={RouterLink}
            underline="hover"
            color="inherit"
            to={to}
          >
            {title}
          </Link>
        );
      })}
    </StyledBreadcrumbs>
  );
}
