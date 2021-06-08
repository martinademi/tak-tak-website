import * as actionTypes from "./actionTypes";
import Lanugage from "../translations/langage";
export const selectLocale = lang => {
 
  return {
    type: actionTypes.LOCALE_SELECT,
    lang: lang
  };
};

export const updateLocale = selectedLang => {
 
  return {
    type: actionTypes.UPDATE_LOCALE,
    lang: Lanugage[selectedLang],
    selectedLang: selectedLang
  };
};
