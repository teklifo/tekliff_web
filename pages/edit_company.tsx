import React, { Fragment, useState, useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import type { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import { useTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import BusinessIcon from "@mui/icons-material/Business";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import CopyrightIcon from "@mui/icons-material/Copyright";
import ImageIcon from "@mui/icons-material/Image";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { useFormik } from "formik";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import CompanyContacts from "../components/editCompany/CompanyContacts";
import { createCompany } from "../actions/company";
import { AppContext } from "../store/appContext";
import Failure from "../utils/errors/failure";
import ServerError from "../utils/errors/serverError";
import { CompanyContact, CompanyType } from "../types";

interface CompanyForm {
  name: string;
  tin: string;
  type: CompanyType;
  logoUrl: string;
  description: string;
  facebook: string;
  instagram: string;
  youtube: string;
}

const CreateCompany: NextPage = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const theme = useTheme();

  const {
    state: { auth },
  } = useContext(AppContext);

  const companyTypes = [
    {
      value: "entity",
      label: t("editCompany:entity"),
    },
    {
      value: "physical",
      label: t("editCompany:physical"),
    },
  ];

  const [contacts, setContacts] = useState<CompanyContact[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const validationSchema = yup.object({
    name: yup.string().required(t("common:fieldIsRequired")),
    tin: yup
      .string()
      .length(10, t("editCompany:invalidTin"))
      .required(t("common:fieldIsRequired")),
    type: yup.string().required(t("common:fieldIsRequired")),
  });

  const formik = useFormik<CompanyForm>({
    initialValues: {
      name: "",
      tin: "",
      type: "entity",
      description: "",
      logoUrl: "",
      facebook: "",
      instagram: "",
      youtube: "",
    },
    validationSchema,
    onSubmit: async (values: CompanyForm) => {
      setLoading(true);

      try {
        await createCompany(auth.token ?? "", {
          id: 0,
          name: values.name,
          tin: values.tin,
          type: values.type,
          logo_url: values.logoUrl,
          description: values.description,
          contacts: {
            address: contacts
              .filter((contact) => contact.type === "address")
              .map((contact) => contact.value),
            email: contacts
              .filter((contact) => contact.type === "email")
              .map((contact) => contact.value),
            phone: contacts
              .filter((contact) => contact.type === "phone")
              .map((contact) => contact.value),
            website: contacts
              .filter((contact) => contact.type === "websait")
              .map((contact) => contact.value),
          },
          socials: {
            facebook: values.facebook,
            instragram: values.instagram,
            youtube: values.youtube,
          },
          created_at: new Date(Date.now()),
          updated_at: new Date(Date.now()),
        });
        router.push({ pathname: `/` });
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
        <form onSubmit={formik.handleSubmit}>
          <Typography variant="h1" fontSize={32} align="center">
            {t("editCompany:titleCreate")}
          </Typography>
          {/* Main info */}
          <Box sx={{ my: 4 }}>
            <Typography
              variant="h5"
              align="left"
              sx={{ color: theme.palette.text.secondary, mb: 1 }}
            >
              {t("editCompany:mainInfo")}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {/* Name */}
            <TextField
              id="name"
              name="name"
              value={formik.values.name}
              type={"text"}
              label={t("editCompany:name")}
              margin="dense"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon />
                  </InputAdornment>
                ),
              }}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            {/* TIN */}
            <TextField
              id="tin"
              name="tin"
              value={formik.values.tin}
              type={"text"}
              label={t("editCompany:tin")}
              margin="dense"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FingerprintIcon />
                  </InputAdornment>
                ),
              }}
              onChange={formik.handleChange}
              error={formik.touched.tin && Boolean(formik.errors.tin)}
              helperText={formik.touched.tin && formik.errors.tin}
            />
            {/* Type */}
            <TextField
              id="type"
              name="type"
              value={formik.values.type}
              type={"text"}
              select
              label={t("editCompany:type")}
              margin="dense"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CopyrightIcon />
                  </InputAdornment>
                ),
              }}
              onChange={formik.handleChange}
              error={formik.touched.type && Boolean(formik.errors.type)}
              helperText={formik.touched.type && formik.errors.type}
            >
              {companyTypes.map((companyType) => (
                <MenuItem key={companyType.value} value={companyType.value}>
                  {companyType.label}
                </MenuItem>
              ))}
            </TextField>
            {/* Logo */}
            <TextField
              id="logoUrl"
              name="logoUrl"
              value={formik.values.logoUrl}
              type={"text"}
              label={t("editCompany:logoUrl")}
              margin="dense"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ImageIcon />
                  </InputAdornment>
                ),
              }}
              onChange={formik.handleChange}
              error={formik.touched.logoUrl && Boolean(formik.errors.logoUrl)}
              helperText={formik.touched.logoUrl && formik.errors.logoUrl}
            />
            {/* Description */}
            <TextField
              id="description"
              name="description"
              value={formik.values.description}
              type={"text"}
              label={t("editCompany:description")}
              margin="dense"
              fullWidth
              multiline
              rows={4}
              onChange={formik.handleChange}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />
          </Box>
          {/* Contacts */}
          <Box sx={{ my: 4 }}>
            <Typography
              variant="h5"
              align="left"
              sx={{ color: theme.palette.text.secondary, mb: 1 }}
            >
              {t("editCompany:contacts")}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <CompanyContacts contacts={contacts} setContacts={setContacts} />
          </Box>
          {/* Socials */}
          <Box sx={{ my: 4 }}>
            <Typography
              variant="h5"
              align="left"
              sx={{ color: theme.palette.text.secondary, mb: 1 }}
            >
              {t("editCompany:socials")}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {/* Facebook */}
            <TextField
              id="facebook"
              name="facebook"
              value={formik.values.facebook}
              type={"text"}
              label={t("editCompany:facebook")}
              margin="dense"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FacebookIcon />
                  </InputAdornment>
                ),
              }}
              onChange={formik.handleChange}
              error={formik.touched.facebook && Boolean(formik.errors.facebook)}
              helperText={formik.touched.facebook && formik.errors.facebook}
            />
            {/* Instagram */}
            <TextField
              id="instagram"
              name="instagram"
              value={formik.values.instagram}
              type={"text"}
              label={t("editCompany:instagram")}
              margin="dense"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <InstagramIcon />
                  </InputAdornment>
                ),
              }}
              onChange={formik.handleChange}
              error={
                formik.touched.instagram && Boolean(formik.errors.instagram)
              }
              helperText={formik.touched.instagram && formik.errors.instagram}
            />
            {/* YouTube */}
            <TextField
              id="youtube"
              name="youtube"
              value={formik.values.youtube}
              type={"text"}
              label={t("editCompany:youtube")}
              margin="dense"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <YouTubeIcon />
                  </InputAdornment>
                ),
              }}
              onChange={formik.handleChange}
              error={formik.touched.youtube && Boolean(formik.errors.youtube)}
              helperText={formik.touched.youtube && formik.errors.youtube}
            />
          </Box>
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
              <Typography fontWeight="bold">
                {t("editCompany:create")}
              </Typography>
            )}
          </Button>
        </form>
      </Container>
    </Fragment>
  );
};

export default CreateCompany;
