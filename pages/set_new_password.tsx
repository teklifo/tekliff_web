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
import { useFormik } from "formik";
import * as yup from "yup";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Lock from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  verifyResetPasswordToken,
  resetPassword,
  loadUser,
} from "../actions/auth";
import { AppContext } from "../store/appContext";
import Failure from "../utils/errors/failure";
import ServerError from "../utils/errors/serverError";
import { CustomNextPage } from "../types";

interface setNewPasswordForm {
  password: string;
}

interface QueryParams {
  resetPasswordToken: string;
}

type StringQueryParams = Record<keyof QueryParams, string>;

const SetNewPassword: CustomNextPage = () => {
  const { dispatch } = useContext(AppContext);
  const { t } = useTranslation();
  const router = useRouter();
  const { resetPasswordToken } = router.query as StringQueryParams;
  const { enqueueSnackbar } = useSnackbar();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [tokenIsValid, setTokenIsValid] = useState<boolean>(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validationSchema = yup.object({
    password: yup
      .string()
      .required(t("setNewPassword:errorPassword"))
      .min(6, t("setNewPassword:invalidPassword")),
  });

  const formik = useFormik<setNewPasswordForm>({
    initialValues: {
      password: "",
    },
    validationSchema,
    onSubmit: async (values: setNewPasswordForm) => {
      const { password } = values;

      setLoading(true);

      try {
        await resetPassword(resetPasswordToken, password)(dispatch);
        await loadUser()(dispatch);
        router.push({
          pathname: "/dashboard",
        });
      } catch (error) {
        let errorMessage = "";
        if (error instanceof Failure) {
          errorMessage = error.message;
        } else if (error instanceof ServerError) {
          errorMessage = t("common:serverError");
        } else {
          errorMessage = t("common:unknownError");
        }
        enqueueSnackbar(errorMessage, {
          variant: "error",
          autoHideDuration: 3000,
        });
      }

      setLoading(false);
    },
  });

  const checkResetPasswordToken = useCallback(async () => {
    setLoading(true);

    try {
      await verifyResetPasswordToken(resetPasswordToken);

      setTokenIsValid(true);
    } catch (error) {
      setTokenIsValid(false);
      let errorMessage = "";
      if (error instanceof Failure) {
        errorMessage = error.message;
      } else if (error instanceof ServerError) {
        errorMessage = t("common:serverError");
      } else {
        errorMessage = t("common:unknownError");
      }
      enqueueSnackbar(errorMessage, {
        variant: "error",
        autoHideDuration: 3000,
      });
    }

    setLoading(false);
  }, [resetPasswordToken, enqueueSnackbar, t]);

  useEffect(() => {
    checkResetPasswordToken();
  }, [checkResetPasswordToken]);

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
        {!tokenIsValid ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src={"/img/reset_password_error.svg"}
              alt="reset_password_error"
              width={400}
              height={400}
            />
            <Typography variant="h1" textAlign={"center"} fontSize={60}>
              {t("setNewPassword:failTitle")}
            </Typography>
            <Typography variant="subtitle1" textAlign={"center"}>
              {t("setNewPassword:failSubtitle")}
            </Typography>
            <Link href="/reset_password" passHref>
              <Button variant={"contained"} disableElevation sx={{ mt: 2 }}>
                {t("setNewPassword:gotToResetPassword")}
              </Button>
            </Link>
          </Box>
        ) : (
          <Fragment>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                src={"/img/set_new_password.svg"}
                alt="set_new_password"
                width={400}
                height={400}
              />
              <Typography variant="h4" textAlign={"center"}>
                {t("setNewPassword:title")}
              </Typography>
            </Box>
            <form onSubmit={formik.handleSubmit}>
              <Box
                sx={{
                  mt: 3,
                  mx: "auto",
                  display: "flex",
                  flexDirection: "column",
                  width: { xs: "auto", md: "40vw" },
                }}
              >
                {/* Password */}
                <TextField
                  id="password"
                  name="password"
                  value={formik.values.password}
                  type={showPassword ? "text" : "password"}
                  autoComplete={"current-password"}
                  label={t("setNewPassword:password")}
                  margin="dense"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={handleClickShowPassword}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disableElevation
                  disabled={loading}
                  sx={{ mt: 1, py: 1 }}
                >
                  {loading ? (
                    <CircularProgress color="inherit" size="2rem" />
                  ) : (
                    t("setNewPassword:resetPasswordButton")
                  )}
                </Button>
              </Box>
            </form>
          </Fragment>
        )}
      </Container>
    </Fragment>
  );
};

export default SetNewPassword;
