import React, { useEffect, useState } from "react";
import "./App.css";
import NavBar from "./pages/common/nav/nav";
import { Redirect, Route, Switch } from "react-router";
import {
  EXAMPLE_PAGE,
  HOME_PAGE,
  POST_PAGE,
  PROFILE_PAGE,
} from "./common/links";
import { MuiThemeProvider } from "@material-ui/core/styles";
import HomePage from "./pages/home/home";
import PostPage from "./pages/post/post";
import darkTheme from "./common/theme";
import ExamplePage from "./pages/example/example";
import { ThemeProvider } from "styled-components";
import { useAppDispatch } from "./redux/store";
import { loginFromCookie } from "./redux/slices/user-slice";
import { unwrapResult } from "@reduxjs/toolkit";
import ProfilePage from "./pages/profile/profile";

const App = () => {
  const [appLoaded, setAppLoaded] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const tryToLoginFromCookie = async () => {
      try {
        const dispatchResult = await dispatch(loginFromCookie());
        unwrapResult(dispatchResult);
      } finally {
        setAppLoaded(true);
      }
    };
    tryToLoginFromCookie();
  }, []);

  if (!appLoaded) {
    return null;
  }

  return (
    <MuiThemeProvider theme={darkTheme}>
      <ThemeProvider theme={darkTheme}>
        <NavBar />
        <Switch>
          <Route path={POST_PAGE} component={PostPage} />
          <Route path={HOME_PAGE} component={HomePage} />
          <Route path={PROFILE_PAGE} component={ProfilePage} />
          <Route path={EXAMPLE_PAGE} component={ExamplePage} />
          <Redirect to={HOME_PAGE} />
        </Switch>
      </ThemeProvider>
    </MuiThemeProvider>
  );
};

export default App;
