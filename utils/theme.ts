import { createTheme } from "@mui/material/styles";

export const primaryColor = "#407BFF";
export const lightPrimaryColor = "#709DFF";
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
    primary: {
      main: lightPrimaryColor,
      contrastText: darkColor,
    },
    secondary: {
      main: softDarkColor,
    },
  },
});
