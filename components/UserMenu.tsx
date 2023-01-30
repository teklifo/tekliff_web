import React, { Fragment, FC, useState, useContext } from "react";
import useTranslation from "next-translate/useTranslation";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "../actions/auth";
import { AppContext } from "../store/appContext";
import { User } from "../types";

const UserMenu: FC<{ user: User }> = ({ user }) => {
  const { t } = useTranslation();

  const { dispatch } = useContext(AppContext);

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout()(dispatch);
  };

  return (
    <Fragment>
      <Tooltip title={t("common:openUserMenu")}>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt={user.name} src={`${user.avatar_url}`} />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem>
          <Typography textAlign={"center"}>{user.name}</Typography>
        </MenuItem>
        <Divider />

        <Box>
          <Divider sx={{ my: 1 }} />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText>{t("common:logout")}</ListItemText>
          </MenuItem>
        </Box>
      </Menu>
    </Fragment>
  );
};

export default UserMenu;
