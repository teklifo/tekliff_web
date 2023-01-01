import React, {
  FC,
  Fragment,
  useState,
  useContext,
  useEffect,
  useCallback,
  createRef,
  ReactNode,
} from 'react';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import Close from '@mui/icons-material/Close';
import { SnackbarProvider, SnackbarKey } from 'notistack';
import nprogress from 'nprogress';
import { loadUser } from '../../actions/auth';
import { AppContext } from '../../store/appContext';
import StyledAppbar from './StyledAppBar';
import { lightTheme, darkTheme } from '../../utils/theme';
import StyledBottomNavigation from './StyledBottomNavigation';

const Layout: FC<{
  displayBottomNavigationBar: boolean;
  displaySearchBar: boolean;
  hideAppbar: boolean;
  initDarkMode: boolean;
  children: ReactNode;
}> = ({
  displayBottomNavigationBar,
  displaySearchBar,
  hideAppbar,
  initDarkMode,
  children,
}) => {
  const router = useRouter();

  const {
    state: { theme: appTheme },
    dispatch,
  } = useContext(AppContext);

  const [darkMode, setDarkMode] = useState(initDarkMode);

  const loadUserFromToken = useCallback(async () => {
    loadUser()(dispatch);
  }, [dispatch]);

  useEffect(() => {
    if (router.pathname !== '/user_load') {
      loadUserFromToken();
    }
  }, [loadUserFromToken, router.pathname]);

  useEffect(() => {
    setDarkMode(appTheme === 'dark');
  }, [appTheme]);

  const notistackRef = createRef<SnackbarProvider>();
  const onClickDismiss = (key: SnackbarKey) => {
    return () => {
      if (notistackRef.current) notistackRef.current.closeSnackbar(key);
    };
  };

  Router.events.on('routeChangeStart', () => {
    return nprogress.start();
  });

  Router.events.on('routeChangeComplete', () => {
    return nprogress.done();
  });

  Router.events.on('routeChangeError', () => {
    return nprogress.done();
  });

  return (
    <Fragment>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <meta charSet="UTF-8" />
        <meta
          name="theme-color"
          content={
            darkMode
              ? darkTheme.palette.background.default.toString()
              : lightTheme.palette.background.default.toString()
          }
        />
      </Head>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <SnackbarProvider
          ref={notistackRef}
          maxSnack={3}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          hideIconVariant={true}
          action={(key) => {
            return (
              <IconButton onClick={onClickDismiss(key)}>
                <Close color={'secondary'} fontSize="small" sx={{ p: 0.2 }} />
              </IconButton>
            );
          }}
        >
          <CssBaseline />
          {!hideAppbar && <StyledAppbar displaySearchBar={displaySearchBar} />}
          <Fragment>{children}</Fragment>
          {displayBottomNavigationBar && <StyledBottomNavigation />}
        </SnackbarProvider>
      </ThemeProvider>
    </Fragment>
  );
};

export default Layout;
