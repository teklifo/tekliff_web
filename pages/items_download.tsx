import React, { ChangeEventHandler, Fragment, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import type { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import dynamic from "next/dynamic";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useFormik } from "formik";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import * as XLSX from "xlsx";
import "react-data-grid/lib/styles.css";
import Failure from "../utils/errors/failure";
import ServerError from "../utils/errors/serverError";

const DataGrid = dynamic(() => import("react-data-grid"), { ssr: false });

interface ColumnInformation {
  key: string;
  name: string;
}

export interface ItemsDownloadForm {
  nameColumn: string;
  externalIdColumn: string;
  numberColumn: string;
  sellPriceColumn: string;
  purchasePriceColumn: string;
  isServiceColumn: string;
  imagesColumn: string;
  isAvailableColumn: string;
}

const ItemsDownload: NextPage = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [columns, setColumns] = useState<ColumnInformation[]>([]);
  const [rows, setRows] = useState<{}[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const validationSchema = yup.object({
    nameColumn: yup.string().required(t("common:fieldIsRequired")),
  });

  const formik = useFormik<ItemsDownloadForm>({
    initialValues: {
      nameColumn: "",
      externalIdColumn: "",
      numberColumn: "",
      sellPriceColumn: "",
      purchasePriceColumn: "",
      isServiceColumn: "",
      imagesColumn: "",
      isAvailableColumn: "",
    },
    validationSchema,
    onSubmit: async (_values: ItemsDownloadForm) => {
      setLoading(true);

      try {
        router.push({ pathname: "/dashboard" });
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

  const readFile: ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);

    const data = XLSX.utils.sheet_to_json<[]>(
      workbook.Sheets[workbook.SheetNames[0]],
      { header: 1 }
    );

    setColumns(data[0].map((r) => ({ key: r, name: r })));
    setRows(
      data.slice(1).map((r) =>
        r.reduce((acc, x, i) => {
          acc[data[0][i]] = x;
          return acc;
        }, {})
      )
    );

    e.target.files = null;
  };

  const fields = [
    {
      name: "nameColumn",
      label: t(`itemsDownload:name`),
      value: formik.values.nameColumn,
      touched: formik.touched.nameColumn,
      error: formik.errors.nameColumn,
    },
    {
      name: "externalIdColumn",
      label: t(`itemsDownload:externalId`),
      value: formik.values.externalIdColumn,
      touched: formik.touched.externalIdColumn,
      error: formik.errors.externalIdColumn,
    },
    {
      name: "numberColumn",
      label: t(`itemsDownload:number`),
      value: formik.values.numberColumn,
      touched: formik.touched.numberColumn,
      error: formik.errors.numberColumn,
    },
    {
      name: "sellPriceColumn",
      label: t(`itemsDownload:sellPrice`),
      value: formik.values.sellPriceColumn,
      touched: formik.touched.sellPriceColumn,
      error: formik.errors.sellPriceColumn,
    },
    {
      name: "purchasePriceColumn",
      label: t(`itemsDownload:purchasePrice`),
      value: formik.values.purchasePriceColumn,
      touched: formik.touched.purchasePriceColumn,
      error: formik.errors.purchasePriceColumn,
    },
    {
      name: "isServiceColumn",
      label: t(`itemsDownload:isService`),
      value: formik.values.isServiceColumn,
      touched: formik.touched.isServiceColumn,
      error: formik.errors.isServiceColumn,
    },
    {
      name: "imagesColumn",
      label: t(`itemsDownload:images`),
      value: formik.values.imagesColumn,
      touched: formik.touched.imagesColumn,
      error: formik.errors.imagesColumn,
    },
    {
      name: "isAvailableColumn",
      label: t(`itemsDownload:isAvailable`),
      value: formik.values.isAvailableColumn,
      touched: formik.touched.isAvailableColumn,
      error: formik.errors.isAvailableColumn,
    },
  ];

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
          <Typography
            variant="h1"
            fontSize={"2rem"}
            fontWeight="bold"
            align="center"
            gutterBottom
          >
            {t("itemsDownload:title")}
          </Typography>
          <Typography align="center" color="text.secondary" sx={{ mb: 4 }}>
            {t("itemsDownload:subtitle")}
          </Typography>
          <Button
            variant="contained"
            component="label"
            startIcon={<InsertDriveFileIcon />}
          >
            {t("itemsDownload:selectFile")}
            <input
              hidden
              accept=".xlsx, .xls, .csv, .ods"
              multiple
              type="file"
              onChange={readFile}
            />
          </Button>
          <Box sx={{ my: 4 }}>
            <DataGrid columns={columns} rows={rows} />
          </Box>
          {fields.map((field) => {
            return (
              <TextField
                key={field.name}
                id={field.name}
                name={field.name}
                value={field.value}
                type={"text"}
                select
                label={field.label}
                margin="dense"
                fullWidth
                onChange={formik.handleChange}
                error={field.touched && Boolean(field.error)}
                helperText={field.touched && field.error}
              >
                <MenuItem key={"empty"} value={""}>
                  {"-"}
                </MenuItem>
                {columns.map((column) => (
                  <MenuItem key={column.key} value={column.key}>
                    {column.key}
                  </MenuItem>
                ))}
              </TextField>
            );
          })}
          <Button
            type="submit"
            variant="contained"
            startIcon={<FileDownloadIcon />}
            fullWidth
            disabled={loading}
            disableElevation
            sx={{ py: 1, mt: 4 }}
          >
            {loading ? (
              <CircularProgress color="inherit" size="2rem" />
            ) : (
              <Typography fontWeight="bold">
                {t("itemsDownload:download")}
              </Typography>
            )}
          </Button>
        </form>
      </Container>
    </Fragment>
  );
};

export default ItemsDownload;
