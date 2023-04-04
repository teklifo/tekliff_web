import React, { FC, ReactNode, MouseEventHandler } from "react";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import DownloadIcon from "@mui/icons-material/Download";
import { useTheme } from "@mui/material/styles";

interface ItemOption {
  id: string;
  name: string;
  route: string;
  icon: ReactNode;
  onClick: MouseEventHandler<HTMLDivElement>;
}

const drawerWidth = 250;

const StyledDrawer: FC<{
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}> = ({ mobileOpen, handleDrawerToggle }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();

  const { pathname } = router;

  const options: ItemOption[] = [
    {
      id: "dashboard",
      name: t("common:dashboard"),
      route: "/dashboard",
      icon: <DashboardIcon />,
      onClick: () => {
        return router.push({ pathname: "/dashboard" });
      },
    },
    {
      id: "myCompanies",
      name: t("common:myCompaniesTitle"),
      route: "/user/companies",
      icon: <BusinessIcon />,
      onClick: () => {
        return router.push({ pathname: "/user/companies" });
      },
    },
    {
      id: "companies",
      name: t("common:companiesTitle"),
      route: "/companies",
      icon: <BusinessCenterIcon />,
      onClick: () => {
        return router.push({ pathname: "/companies" });
      },
    },
    {
      id: "items_download",
      name: t("common:itemsDownloadTitle"),
      route: "/items_download",
      icon: <DownloadIcon />,
      onClick: () => {
        return router.push({ pathname: "/items_download" });
      },
    },
  ];

  const drawer = (mobile: boolean) => {
    return (
      <Box sx={{ mt: 8 }}>
        <List>
          {options.map((option) => {
            const selected = option.route === pathname;
            return (
              <ListItem key={option.id}>
                <ListItemButton
                  selected={selected}
                  onClick={(event) => {
                    if (mobile) handleDrawerToggle();
                    option.onClick(event);
                  }}
                  sx={{
                    borderRadius: 2,
                    "&.Mui-selected": {
                      backgroundColor: theme.palette.primary.main,
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: selected
                        ? theme.palette.primary.contrastText.toString()
                        : null,
                    }}
                  >
                    {option.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={option.name}
                    sx={{
                      color: selected
                        ? theme.palette.primary.contrastText.toString()
                        : null,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    );
  };

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { sm: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer(true)}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        {drawer(false)}
      </Drawer>
    </Box>
  );
};

export default StyledDrawer;
