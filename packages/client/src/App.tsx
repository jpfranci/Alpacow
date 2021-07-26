import React, { useEffect } from "react";
import "./App.css";
import NavBar from "./pages/common/nav/nav";
import { Redirect, Route, Switch } from "react-router";
import { EXAMPLE_PAGE, HOME_PAGE, POST_PAGE } from "./common/links";
import { MuiThemeProvider } from "@material-ui/core/styles";
import HomePage from "./pages/home/home";
import PostPage from "./pages/post/post";
import darkTheme from "./common/theme";
import ExamplePage from "./pages/example/example";
import { ThemeProvider } from "styled-components";
import { useAppDispatch } from "./redux/store";
import { getUser } from "./services/cookies";
import { setUser, UserState } from "./redux/slices/user-slice";

const App = () => {
  const dispatch = useAppDispatch();
  // check session
  useEffect(() => {
    const userState = getUser();
    if (userState) {
      dispatch(setUser(userState as UserState));
    }
  }, []);

  return (
    <MuiThemeProvider theme={darkTheme}>
      <ThemeProvider theme={darkTheme}>
        <NavBar />
        <Switch>
          <Route path={POST_PAGE} component={PostPage} />
          <Route path={HOME_PAGE} component={HomePage} />
          <Route path={EXAMPLE_PAGE} component={ExamplePage} />
          <Redirect to={HOME_PAGE} />
        </Switch>
      </ThemeProvider>
    </MuiThemeProvider>
  );
};

export default App;
