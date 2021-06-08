import App, { Container } from "next/app";
import React from "react";
import { Provider } from "react-redux";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import axios from "axios";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import createStore from "../store";
import { APP_NAME } from "../lib/envariables";
import { connect } from "react-redux";
import * as actions from "../actions";
import { getCookiees } from "../lib/session";
import LanguageContext from "../context/languageContext";
const muiTheme = getMuiTheme({
  palette: {
    primary1Color: "rgb(30, 198, 159)"
  },
  datePicker: {
    selectColor: "rgb(30, 198, 159)",
    headerColor: "rgb(30, 198, 159)",
    buttonTextColor: "rgb(30, 198, 159)",
    calendarYearBackgroundColor: "rgb(30, 198, 159)"
  },

  timePicker: {
    selectColor: "rgb(30, 198, 159)",
    headerColor: "rgb(30, 198, 159)",
    accentColor: "rgb(30, 198, 159)",
    clockColor: "rgb(30, 198, 159)"
    // clockCircleColor: "rgb(30, 198, 159)",
  }
});

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    let lang = getCookiees("lang", ctx.req) || "en";

    await ctx.store.dispatch(actions.updateLocale(lang));

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps({ ctx });
    }
    return { pageProps };
  }

  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Container>
        {/* setting up defualt title for all the pages */}
        {/* <title>{APP_NAME}</title> */}

        <Provider store={store}>
          <MuiThemeProvider muiTheme={muiTheme}>
            <LanguageContext.Provider value={{ lang: this.props.lang,selectedLang:this.props.selectedLang }}>
              <Component {...pageProps} />
            </LanguageContext.Provider>
          </MuiThemeProvider>
        </Provider>
      </Container>
    );
  }
}
const mapStateToProps = state => {
  return {
    lang: state.locale,
    selectedLang:state.selectedLang
  };
};
export default withRedux(createStore)(
  withReduxSaga({ async: true })(connect(mapStateToProps)(MyApp))
);
