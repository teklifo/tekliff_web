import React, { FC } from "react";
import useTranslation from "next-translate/useTranslation";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as yup from "yup";
import useWindowSize from "../../utils/hooks/useWindowSize";
import { CompanyContact } from "../../types";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const websaitRegExp =
  /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

const RequestForm: FC<{
  open: boolean;
  onClose: (_contact: CompanyContact | null) => void;
}> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const { width } = useWindowSize();

  const fullScreen = (width ?? 0) < 900;

  const validationSchema = yup.object({
    value: yup
      .string()
      .required(t("common:fieldIsRequired"))
      .when("type", {
        is: "email",
        then: yup.string().email(t("editCompany:invalidEmail")),
      })
      .when("type", {
        is: "websait",
        then: yup
          .string()
          .matches(websaitRegExp, t("editCompany:invalidWebsait")),
      })
      .when("type", {
        is: "phone",
        then: yup.string().matches(phoneRegExp, t("editCompany:invalidPhone")),
      }),
  });

  const formik = useFormik<CompanyContact>({
    initialValues: {
      type: "phone",
      value: "",
    },
    validationSchema,
    onSubmit: async (values: CompanyContact) => {
      onClose(values);
    },
  });

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose(null);
      }}
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          width: { md: "800px" },
          maxWidth: { md: "800px" },
        },
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          {t("editCompany:contactTitle")}
          {
            <IconButton
              aria-label="close"
              onClick={() => {
                return onClose(null);
              }}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                p: 2,
              }}
            >
              <CloseIcon sx={{ fontSize: "18px" }} />
            </IconButton>
          }
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            select
            id="type"
            name="type"
            value={formik.values.type}
            type={"text"}
            fullWidth
            onChange={formik.handleChange}
            error={formik.touched.type && Boolean(formik.errors.type)}
            helperText={formik.touched.type && formik.errors.type}
          >
            <MenuItem value={"phone"}> {t("editCompany:phone")}</MenuItem>
            <MenuItem value={"email"}> {t("editCompany:email")}</MenuItem>
            <MenuItem value={"address"}> {t("editCompany:address")}</MenuItem>
            <MenuItem value={"websait"}> {t("editCompany:websait")}</MenuItem>
          </TextField>
          <TextField
            id="value"
            name="value"
            value={formik.values.value}
            type={"text"}
            fullWidth
            onChange={formik.handleChange}
            error={formik.touched.value && Boolean(formik.errors.value)}
            helperText={formik.touched.value && formik.errors.value}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            variant="contained"
            disableElevation
            size="large"
            autoFocus
          >
            <Typography fontWeight="bold">{t("editCompany:add")}</Typography>
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RequestForm;
