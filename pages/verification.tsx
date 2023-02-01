import React, {
  Fragment,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import { useSnackbar } from "notistack";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { verifyUser, loadUser } from "../actions/auth";
import { AppContext } from "../store/appContext";
import { CustomNextPage } from "../types";

interface QueryParams {
  activationToken: string;
}

type StringQueryParams = Record<keyof QueryParams, string>;

const Verification: CustomNextPage = () => {
  const { dispatch } = useContext(AppContext);
  const { t } = useTranslation();
  const router = useRouter();
  const { activationToken } = router.query as StringQueryParams;
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState<boolean>(true);
  const [activationResult, setActivationResult] = useState<boolean>(false);

  const getCompanies = useCallback(async () => {
    setLoading(true);

    try {
      await verifyUser(activationToken)(dispatch);
      await loadUser()(dispatch);
      setActivationResult(true);
    } catch (error) {
      setActivationResult(false);
      enqueueSnackbar(t("common:serverError"), {
        variant: "error",
        autoHideDuration: 3000,
      });
    }

    setLoading(false);
  }, [activationToken, dispatch, enqueueSnackbar, t]);

  useEffect(() => {
    getCompanies();
  }, [getCompanies]);

  if (loading) {
    return (
      <Fragment>
        <Head>
          <title>{t(`common:projectTitle`)}</title>
        </Head>
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <CircularProgress color="primary" size="2rem" />
        </Container>
      </Fragment>
    );
  }

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
          {activationResult ? (
            <Fragment>
              <Image
                src={"/img/verification_success.svg"}
                alt="check_email"
                width={400}
                height={400}
              />
              <Typography variant="h1" textAlign={"center"} fontSize={60}>
                {t("verification:successTitle")}
              </Typography>
              <Typography variant="subtitle1" textAlign={"center"}>
                {t("verification:successSubtitle")}
              </Typography>
              <Link href="/auth" passHref>
                <Button variant={"contained"} disableElevation sx={{ mt: 2 }}>
                  {t("verification:gotToDashboard")}
                </Button>
              </Link>
            </Fragment>
          ) : (
            <Fragment>
              <Image
                src={"/img/verification_fail.svg"}
                alt="check_email"
                width={400}
                height={400}
              />
              <Typography variant="h1" textAlign={"center"} fontSize={60}>
                {t("verification:failTitle")}
              </Typography>
              <Typography variant="subtitle1" textAlign={"center"}>
                {t("verification:failSubtitle")}
              </Typography>
              <Link href="/auth" passHref>
                <Button variant={"contained"} disableElevation sx={{ mt: 2 }}>
                  {t("verification:gotToAuth")}
                </Button>
              </Link>
            </Fragment>
          )}
        </Box>
      </Container>
    </Fragment>
  );
};

export default Verification;
