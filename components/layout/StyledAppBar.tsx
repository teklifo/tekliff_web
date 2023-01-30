import React, { FC, Fragment, useState, useContext, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Hidden from "@mui/material/Hidden";
import MaterialLink from "@mui/material/Link";
import { useTheme, alpha } from "@mui/material/styles";
import PaymentsIcon from "@mui/icons-material/Payments";
import LoginIcon from "@mui/icons-material/Login";
import Cookies from "js-cookie";
import ThemeSwitch from "./ThemeSwitch";
import UserMenu from "../UserMenu";
import { AppContext } from "../../store/appContext";
import { setTheme } from "../../actions/theme";
import useWindowSize from "../../utils/hooks/useWindowSize";

const StyledAppbar: FC<{
  displaySearchBar: boolean;
}> = ({ displaySearchBar }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const theme = useTheme();
  const { width } = useWindowSize();

  const appBarRef = useRef(null);

  const lgScreen = (width && width > 1480) || false;

  const {
    state: {
      auth: { user, isInit },
      theme: appTheme,
    },
    dispatch,
  } = useContext(AppContext);

  const darkModeToggle = () => {
    const newValue = appTheme === "dark" ? "light" : "dark";
    setTheme(newValue)(dispatch);
  };

  const switchLanguage = (locale: string) => {
    Cookies.set("NEXT_LOCALE", locale, { expires: 365 });
    router.push(router.asPath, undefined, { locale });
  };

  return (
    <Fragment>
      <AppBar
        ref={appBarRef}
        position={!displaySearchBar ? "fixed" : "relative"}
        color={"transparent"}
        variant={"outlined"}
        elevation={0}
        sx={{
          borderBottom: displaySearchBar ? "none" : null,
          backdropFilter: "blur(20px)",
          backgroundColor: alpha(theme.palette.background.default, 0.7),
        }}
      >
        <Toolbar
          sx={{
            justifyContent: {
              md: lgScreen ? "end" : "space-between",
              xs: "center",
            },
          }}
        >
          {/* Logo */}
          <Link href="/" passHref>
            <MaterialLink
              underline="none"
              sx={{
                position: lgScreen ? "absolute" : "initial",
                top: lgScreen ? "50%" : "auto",
                left: lgScreen ? "50%" : "auto",
                transform: lgScreen ? "translate(-50%, -50%)" : "auto",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <PaymentsIcon fontSize="large" color="primary" sx={{ mx: 1 }} />
                <Typography variant="h6" color="primary" fontSize="1.5rem">
                  {t("common:projectTitle")}
                </Typography>
              </Box>
            </MaterialLink>
          </Link>
          <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            <Hidden mdDown>
              {/* Theme switch */}
              <ThemeSwitch
                checked={appTheme === "dark"}
                onChange={darkModeToggle}
                sx={{ mr: 2 }}
              />
              {/* User menu / auth button */}
              {user ? (
                <UserMenu user={user} />
              ) : (
                <Link href="/auth" passHref>
                  <Button
                    variant={"contained"}
                    startIcon={<LoginIcon />}
                    disableElevation
                    sx={{ mr: 4 }}
                  >
                    {t("common:authButton")}
                  </Button>
                </Link>
              )}
              {/* Language */}
              <Box sx={{ mx: 2 }}>
                {router.locales?.map((locale) => {
                  return router.locale !== locale ? (
                    <Button
                      key={locale}
                      variant="text"
                      color="inherit"
                      onClick={() => {
                        return switchLanguage(locale);
                      }}
                    >
                      {locale}
                    </Button>
                  ) : null;
                })}
              </Box>
            </Hidden>
          </Box>
        </Toolbar>
      </AppBar>
    </Fragment>
  );
};

export default StyledAppbar;
