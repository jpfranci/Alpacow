import React from "react";
import "./App.css";
import NavBar from "./pages/common/nav";
import { Redirect, Route, Switch } from "react-router";
import { HOME_PAGE } from "./common/links";
import { ThemeProvider } from "@material-ui/core/styles";
import HomePage from "./pages/home/home";
import theme from "./common/theme";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      <Switch>
        <Route path={HOME_PAGE} component={HomePage} />
        <Redirect to={HOME_PAGE} />
      </Switch>
    </ThemeProvider>
  );
};

export default App;
