import { createTheme } from "@mui/material/styles";

export const primaryColor = "#0066FF";
export const lightPrimaryColor = "#1F78FF";
export const lightColor = "#FFFFFF";
export const darkColor = "#1F1C21";
export const softDarkColor = "#29262C";

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
    background: {
      default: darkColor,
    },
    primary: {
      main: lightPrimaryColor,
      contrastText: darkColor,
    },
    secondary: {
      main: softDarkColor,
    },
  },
});
