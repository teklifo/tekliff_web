import React, {
  ChangeEventHandler,
  Fragment,
  useState,
  useContext,
  useEffect,
} from "react";
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
import MatchFileds from "../components/itemsDownload/MatchFields";
import { AppContext } from "../store/appContext";
import { downloadItems } from "../actions/items";
import Failure from "../utils/errors/failure";
import ServerError from "../utils/errors/serverError";
import { ColumnInformation } from "../types";

const DataGrid = dynamic(() => import("react-data-grid"), { ssr: false });

export interface ItemsDownloadForm {
  company: number;
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
  const [rows, setRows] = useState<{ [propKey: string]: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const validationSchema = yup.object({
    company: yup.number().min(1, t("common:fieldIsRequired")),
    nameColumn: yup.string().required(t("common:fieldIsRequired")),
    externalIdColumn: yup.string().required(t("common:fieldIsRequired")),
  });

  const {
    state: {
      auth: { user, isInit, token },
    },
  } = useContext(AppContext);

  useEffect(() => {
    if (!user && isInit) router.push({ pathname: "/", query: {} });
  }, [isInit, user, router]);

  const formik = useFormik<ItemsDownloadForm>({
    initialValues: {
      company: 0,
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
    onSubmit: async (values: ItemsDownloadForm) => {
      setLoading(true);

      try {
        await downloadItems(
          token ?? "",
          values.company,
          rows.map((row) => {
            return {
              id: 0,
              external_id: row[values.externalIdColumn],
              name: row[values.nameColumn],
              number: row[values.numberColumn],
              is_service:
                (row[values.isServiceColumn] ?? "").toUpperCase() === "YES",
              is_available:
                !row[values.isAvailableColumn] ||
                row[values.isAvailableColumn].toUpperCase() === "YES",
              sell_price: parseInt(row[values.sellPriceColumn]),
              purchase_price: parseInt(row[values.purchasePriceColumn]),
              images: (row[values.imagesColumn] ?? " ").split(","),
              company: values.company,
              created_at: new Date(Date.now()),
              updated_at: new Date(Date.now()),
            };
          })
        );
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

  if (!user) return null;

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
          <Typography align="center" color="text.secondary" sx={{ mb: 2 }}>
            {t("itemsDownload:subtitle")}
          </Typography>
          <TextField
            id="company"
            name="company"
            value={formik.values.company}
            type={"text"}
            select
            label={t(`itemsDownload:company`)}
            margin="dense"
            fullWidth
            onChange={formik.handleChange}
            error={formik.touched.company && Boolean(formik.errors.company)}
            helperText={formik.touched.company && formik.errors.company}
            sx={{ mb: 2 }}
          >
            {user.companies.map((company) => (
              <MenuItem key={company.id} value={company.id}>
                {company.name}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            fullWidth
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
          {columns.length > 0 && (
            <Fragment>
              <Box sx={{ my: 2 }}>
                <DataGrid columns={columns} rows={rows} />
              </Box>
              <MatchFileds formik={formik} columns={columns} />
              <Button
                type="submit"
                variant="contained"
                startIcon={<FileDownloadIcon />}
                fullWidth
                disabled={loading}
                disableElevation
                sx={{ py: 1, mt: 2 }}
              >
                {loading ? (
                  <CircularProgress color="inherit" size="2rem" />
                ) : (
                  <Typography fontWeight="bold">
                    {t("itemsDownload:download")}
                  </Typography>
                )}
              </Button>
            </Fragment>
          )}
        </form>
      </Container>
    </Fragment>
  );
};

export default ItemsDownload;
