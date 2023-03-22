import React, { FC } from "react";
import NextLink from "next/link";
import useTranslation from "next-translate/useTranslation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import { useTheme } from "@mui/material/styles";
import { Company } from "../../types";

const CompanyCard: FC<{ company: Company }> = ({ company }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <NextLink href={`/companies/${company.id}`} passHref>
      <Card variant="outlined" sx={{ borderRadius: "16px" }}>
        <CardActionArea>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "center", sm: "start" },
              p: 2,
            }}
          >
            <CardMedia
              component="div"
              sx={{
                flex: { xs: "0 0 100px", sm: "0 0 200px", md: "0 0 200px" },
                width: { xs: 100, sm: 200, md: 200 },
                height: { xs: 100, sm: 200, md: 200 },
                backgroundSize: "contain",
                backgroundPosition: "center center",
                borderRadius: "50%",
                border: `${theme.palette.divider.toString()} 1px solid`,
                backgroundImage: `url(${
                  company.logo_url !== ""
                    ? company.logo_url
                    : "/img/no_image.png"
                })`,
              }}
            />
            <CardContent
              sx={{
                minHeight: { xs: 100, sm: 200, md: 200 },
                display: "flex",
                alignItems: { xs: "center", sm: "start" },
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h5"
                fontSize="1.4rem"
                color="primary"
                fontWeight="bold"
              >
                {company.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {`${t("companies:tin")}: ${company.tin}`}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {company.description.length > 400
                  ? `${company.description.slice(0, 400)}...`
                  : company.description}
              </Typography>
            </CardContent>
          </Box>
        </CardActionArea>
      </Card>
    </NextLink>
  );
};

export default CompanyCard;
