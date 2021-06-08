import React, { Component } from "react";
// import language from '../translations/langage';
import langContext from "../context/languageContext";

const Language = Customcomponent => {
  return class extends Component {
    render() {
      return (
        <langContext.Consumer>
          {ctx => {
            return (
              <Customcomponent
                {...this.props}
                lang={ctx.lang}
                selectedLang={ctx.selectedLang}
              ></Customcomponent>
            );
          }}
        </langContext.Consumer>
      );
    }
  };
};

export default Language;
