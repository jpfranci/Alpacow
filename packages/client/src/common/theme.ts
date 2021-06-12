import blue from "@material-ui/core/colors/blue";
import { createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});

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
