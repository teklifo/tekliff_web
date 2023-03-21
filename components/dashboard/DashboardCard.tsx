import React, { FC } from "react";
import NextLink from "next/link";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";

interface DashboardCardProps {
  route: string;
  title: string;
  subtitle: string;
}

const DashboardCard: FC<DashboardCardProps> = ({ route, title, subtitle }) => {
  return (
    <Grid item xs={6}>
      <NextLink href={route} passHref>
        <Card variant="outlined" sx={{ borderRadius: "16px" }}>
          <CardActionArea>
            <CardContent
              sx={{
                minHeight: "150px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h5"
                color="primary"
                fontWeight="bold"
                gutterBottom
              >
                {title}
              </Typography>
              <Typography color="text.secondary">{subtitle}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </NextLink>
    </Grid>
  );
};

export default DashboardCard;
