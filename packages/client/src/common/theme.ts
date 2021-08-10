import { createMuiTheme } from "@material-ui/core";

/**
 * Dark theme conflicts with action group colours at the moment
 */
const darkTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#303030",
    },
    secondary: {
      main: "#DDDDDD",
    },
    // type: 'dark',
  },
});

export default darkTheme;
