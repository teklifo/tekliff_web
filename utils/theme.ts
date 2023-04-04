import { createTheme } from "@mui/material/styles";

export const primaryColor = "#5CC163";
export const lightPrimaryColor = "#7ACD7F";
export const lightColor = "#FFFFFF";
export const darkColor = "#1F1C21";
export const softDarkColor = "#29262C";
export const lightBodyColor = "#F0F9F1";
export const darkBodyColor = "#141414";

export const lightTheme = createTheme({
  typography: {
    fontSize: 13,
  },
  palette: {
    primary: {
      main: primaryColor,
      contrastText: lightColor,
    },
    secondary: {
      main: lightColor,
    },
  },
});

export const darkTheme = createTheme({
  typography: {
    fontSize: 13,
  },
  palette: {
    mode: "dark",
    primary: {
      main: lightPrimaryColor,
      contrastText: darkColor,
    },
    secondary: {
      main: softDarkColor,
    },
  },
});
