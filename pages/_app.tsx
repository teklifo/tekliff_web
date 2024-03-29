import "../styles/globals.css";
import Router from "next/router";
import type { AppContext, AppProps } from "next/app";
import { NextPageContext } from "next";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { parseCookies, destroyCookie } from "nookies";
import Layout from "../components/layout/Layout";
import { loadUserOnServer } from "../actions/auth";
import createEmotionCache from "../utils/createEmotionCache";
import { CustomNextPage } from "../types";
import AppProvider from "../store/appContext";

const redirectUser = (ctx: NextPageContext, location: string) => {
  if (ctx.req && ctx.res) {
    ctx.res.writeHead(302, { Location: location });
    ctx.res.end();
  } else {
    Router.push(location);
  }
};

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  Component: CustomNextPage;
  emotionCache?: EmotionCache;
}

const MyApp = (props: MyAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const { hideAppbar, displayDrawer } = Component;

  return (
    <CacheProvider value={emotionCache}>
      <AppProvider>
        <Layout
          displayDrawer={displayDrawer}
          hideAppbar={hideAppbar}
          {...pageProps}
        >
          <Component {...pageProps} />
        </Layout>
      </AppProvider>
    </CacheProvider>
  );
};

MyApp.getInitialProps = async ({ Component, ctx }: AppContext) => {
  const { token, darkMode } = parseCookies(ctx);

  let pageProps: any = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  pageProps.initDarkMode = darkMode === "ON";

  const protectedRoute = ctx.pathname === "/dashboard";

  if (!token) {
    destroyCookie(ctx, "token");
    if (protectedRoute) redirectUser(ctx, "/auth");
  } else {
    const user = await loadUserOnServer(token);

    if (!user) {
      destroyCookie(ctx, "token");
      if (protectedRoute) redirectUser(ctx, "/auth");
    }
  }

  return {
    pageProps,
  };
};

export default MyApp;
