import React, { Fragment } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const Dashboard: NextPage = () => {
  const { t } = useTranslation();

  return (
    <Fragment>
      <Head>
        <title>{t(`common:projectTitle`)}</title>
      </Head>
      <Container
        sx={{
          mt: 12,
          mb: 10,
        }}
      >
        <Typography>Hello</Typography>
      </Container>
    </Fragment>
  );
};

export default Dashboard;
