import React from "react";
import "./App.css";
import NavBar from "./pages/common/nav";
import { Redirect, Route, Switch } from "react-router";
import { EXAMPLE_PAGE, HOME_PAGE } from "./common/links";
import { ThemeProvider } from "@material-ui/core/styles";
import HomePage from "./pages/home/home";
import theme from "./common/theme";
import ExamplePage from "./pages/example/example";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      <Switch>
        <Route path={HOME_PAGE} component={HomePage} />
        <Route path={EXAMPLE_PAGE} component={ExamplePage} />
        <Redirect to={HOME_PAGE} />
      </Switch>
    </ThemeProvider>
  );
};

export default App;
