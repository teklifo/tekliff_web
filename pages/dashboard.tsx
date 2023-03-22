import React, { Fragment } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import DashboardCard from "../components/dashboard/DashboardCard";
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
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h1"
          textAlign="center"
          fontSize="48px"
          fontWeight="bold"
        >
          {t("dashboard:title")}
        </Typography>
        <Typography
          variant="h1"
          textAlign={"center"}
          fontSize={"24px"}
          sx={{ my: { xs: 2, md: 8 } }}
        >
          {t("dashboard:subtitle")}
        </Typography>
        <Grid
          container
          spacing={{ xs: 1, md: 2 }}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <DashboardCard
            route="/companies"
            title={t("dashboard:companiesTitle")}
            subtitle={t("dashboard:companiesSubtitle")}
          />
          <DashboardCard
            route="/user/companies"
            title={t("dashboard:myCompaniesTitle")}
            subtitle={t("dashboard:myCompaniesSubtitle")}
          />
          <DashboardCard
            route="/user/companies"
            title={t("dashboard:myCompaniesTitle")}
            subtitle={t("dashboard:myCompaniesSubtitle")}
          />
          <DashboardCard
            route="/user/companies"
            title={t("dashboard:myCompaniesTitle")}
            subtitle={t("dashboard:myCompaniesSubtitle")}
          />
        </Grid>
      </Container>
    </Fragment>
  );
};

export default Dashboard;
