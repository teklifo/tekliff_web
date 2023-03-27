import React, { FC, Fragment } from "react";
import useTranslation from "next-translate/useTranslation";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { ColumnInformation } from "../../types";

const MatchFileds: FC<{
  formik: any;
  columns: ColumnInformation[];
}> = ({ formik, columns }) => {
  const { t } = useTranslation();

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
    </Fragment>
  );
};

export default MatchFileds;
