import React, { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import type { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const CheckEmailAuth: NextPage = () => {
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src={"/img/check_email_auth.svg"}
            alt="check_email_auth"
            width={400}
            height={400}
          />
          <Typography variant="h1" textAlign={"center"} fontSize={60}>
            {t("checkEmailAuth:title")}
          </Typography>
          <Typography variant="subtitle1" textAlign={"center"}>
            {t("checkEmailAuth:subtitle")}
          </Typography>
          <Link href="/auth" passHref>
            <Button variant={"contained"} disableElevation sx={{ mt: 2 }}>
              {t("checkEmailAuth:backToAuth")}
            </Button>
          </Link>
        </Box>
      </Container>
    </Fragment>
  );
};

export default CheckEmailAuth;
