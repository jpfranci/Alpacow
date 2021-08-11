import React, { useEffect, useState } from "react";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "./pages/common/nav/nav";
import { Redirect, Route, Switch } from "react-router";
import {
  EXAMPLE_PAGE,
  HOME_PAGE,
  OTHER_USER_PAGE,
  POST_PAGE,
  PROFILE_PAGE,
} from "./common/links";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { toast, ToastContainer } from "react-toastify";
import HomePage from "./pages/home/home";
import PostPage from "./pages/post/post";
import darkTheme from "./common/theme";
import ExamplePage from "./pages/example/example";
import { ThemeProvider } from "styled-components";
import { useAppDispatch } from "./redux/store";
import { loginFromCookie } from "./redux/slices/user-slice";
import { unwrapResult } from "@reduxjs/toolkit";
import ActionableError from "./errors/actionable-error";
import ProfilePage from "./pages/profile/profile";

const App = () => {
  const [appLoaded, setAppLoaded] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const tryToLoginFromCookie = async () => {
      try {
        const dispatchResult = await dispatch(loginFromCookie());
        unwrapResult(dispatchResult);
      } catch (err) {
        // ignore no session
      } finally {
        setAppLoaded(true);
      }
    };
    tryToLoginFromCookie();

    const handleUnhandledRejection = async (event: PromiseRejectionEvent) => {
      try {
        await event.promise;
      } catch (err) {
        if (err instanceof ActionableError) {
          toast.error(err.message);
        }
        // If actionable error from our server then show toast with message
        else if (err.response?.data?.errorCode) {
          toast.error(err.response?.data?.message);
        } else {
          toast.error("An unknown error occurred");
        }
      } finally {
        event.stopPropagation();
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
  }, []);

  if (!appLoaded) {
    return null;
  }

  return (
    <MuiThemeProvider theme={darkTheme}>
      <ThemeProvider theme={darkTheme}>
        <NavBar />
        <ToastContainer
          limit={3}
          autoClose={5000}
          hideProgressBar={true}
          position={"top-right"}
          draggable={false}
        />
        <Switch>
          <Route path={POST_PAGE} component={PostPage} />
          <Route path={HOME_PAGE} component={HomePage} />
          <Route
            path={PROFILE_PAGE}
            component={(props) => <ProfilePage {...props} />}
          />
          <Route path={OTHER_USER_PAGE} component={ProfilePage} />
          <Route path={EXAMPLE_PAGE} component={ExamplePage} />
          <Redirect to={HOME_PAGE} />
        </Switch>
      </ThemeProvider>
    </MuiThemeProvider>
  );
};

export default App;
