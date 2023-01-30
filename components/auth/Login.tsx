import React, { FC, Fragment, useState, useContext, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import EmailIcon from "@mui/icons-material/Email";
import Lock from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Close from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as yup from "yup";
import { AppContext } from "../../store/appContext";
import { loadUser, loginUser } from "../../actions/auth";
import Failure from "../../utils/errors/failure";
import ServerError from "../../utils/errors/serverError";
import { ErrorAlert } from "../../types";

interface LoginForm {
  email: string;
  password: string;
}

const Login: FC<{ redirect: boolean }> = ({ redirect }) => {
  const {
    state: {
      auth: { user },
    },
    dispatch,
  } = useContext(AppContext);

  const { t } = useTranslation();

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [errorAlert, setErrorAlert] = useState<ErrorAlert>({
    message: "",
    open: false,
  });

  useEffect(() => {
    if (user) {
      if (user.role === "moderator") {
        router.push({ pathname: "/post_review" });
      } else if (redirect) {
        router.push({ pathname: "/" });
      }
    }
  }, [redirect, router, user]);

  const validationSchema = yup.object({
    email: yup
      .string()
      .required(t("auth:errorEmail"))
      .email(t("auth:invalidEmail")),
    password: yup.string().required(t("auth:errorPassword")),
  });

  const formik = useFormik<LoginForm>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values: LoginForm) => {
      const { email, password } = values;

      setLoading(true);

      try {
        await loginUser(email, password)(dispatch);
        await loadUser()(dispatch);
      } catch (error) {
        let errorMessage = "";
        if (error instanceof Failure) {
          errorMessage = error.message;
        } else if (error instanceof ServerError) {
          errorMessage = t("common:serverError");
        } else {
          errorMessage = t("common:unknownError");
        }
        setErrorAlert((prevState) => {
          return { ...prevState, open: true, message: errorMessage };
        });
      }

      setLoading(false);
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const closeAlert = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setErrorAlert((prevState) => {
      return { ...prevState, open: false, message: "" };
    });
  };

  return (
    <Fragment>
      <form onSubmit={formik.handleSubmit}>
        <Typography variant="h1" fontSize={32} align="center">
          {t("auth:signInSubtitle")}
        </Typography>
        <TextField
          id="email"
          name="email"
          value={formik.values.email}
          type={"text"}
          autoComplete={"username"}
          label={t("auth:email")}
          margin="dense"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          id="password"
          name="password"
          value={formik.values.password}
          type={showPassword ? "text" : "password"}
          autoComplete={"current-password"}
          label={t("auth:password")}
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
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          disableElevation
          sx={{ mt: 1, py: 1 }}
        >
          {loading ? (
            <CircularProgress color="inherit" size="2rem" />
          ) : (
            t("auth:loginButton")
          )}
        </Button>
        <Link href="/reset_password" passHref>
          <Button variant="text" fullWidth sx={{ mt: 2 }}>
            {t("auth:oopsforgotPassword")}
          </Button>
        </Link>
        {errorAlert.open ? (
          <Alert
            severity="error"
            sx={{ width: "100%", mt: 2 }}
            action={
              <IconButton aria-label="close" size="small" onClick={closeAlert}>
                <Close fontSize="inherit" sx={{ p: 0.2 }} />
              </IconButton>
            }
          >
            {errorAlert.message}
          </Alert>
        ) : null}
      </form>
    </Fragment>
  );
};

export default Login;
