import React, { Fragment, ChangeEvent } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import type { NextPage, GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import { getCompanies } from "../actions/company";
import { PaginatedCompaniesList } from "../types";

const Companies: NextPage<PaginatedCompaniesList> = ({
  result,
  pagination,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const handlePageChange = (_event: ChangeEvent<unknown>, page: number) => {
    router.push(
      {
        pathname: "/companies",
        query: { page, limit: 1 },
      },
      undefined,
      { shallow: false }
    );
  };

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
        <Typography>Hello</Typography>
        {result.map((company) => {
          return <div key={company.id}>{company.name}</div>;
        })}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            page={pagination.current}
            count={pagination.total}
            onChange={handlePageChange}
            size="large"
            color="primary"
          />
        </Box>
      </Container>
    </Fragment>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await getCompanies(context.query);

  return {
    props: { result: response.result, pagination: response.pagination },
  };
};

export default Companies;
