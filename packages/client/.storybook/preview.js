import React from "react";

import { ThemeProvider, StylesProvider } from "@material-ui/core/styles";
import theme from "../src/common/theme";
import { Provider } from "react-redux";
import store from "../src/redux/store";

export const decorators = [
  (Story) => (
    <StylesProvider injectFirst>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Story />
        </ThemeProvider>
      </Provider>
    </StylesProvider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
