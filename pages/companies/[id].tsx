import React, { Fragment } from "react";
import Head from "next/head";
import type { NextPage, GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getCompany } from "../../actions/company";
import { getItems } from "../../actions/items";
import { Company, PaginatedItemsList } from "../../types";

const CompanyPage: NextPage<{
  company: Company;
  items: PaginatedItemsList;
}> = ({ company, items }) => {
  const { t } = useTranslation();

  console.log(company);
  console.log(items);

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
        <Typography>{company.name}</Typography>
      </Container>
    </Fragment>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const id = params?.id as string;

  const company = await getCompany(id);

  if (!company)
    return {
      notFound: true,
    };

  const response = await getItems({
    company: company.id.toString(),
    ...context.query,
  });

  return {
    props: {
      company,
      items: { result: response.result, pagination: response.pagination },
    },
  };
};

export default CompanyPage;
