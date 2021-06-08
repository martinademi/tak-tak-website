import { delay } from "redux-saga";
import { all, call, put, take, takeLatest } from "redux-saga/effects";
import axios from "axios";

import * as actions from "../actions/index";
import {
  setCookie,
  getCookie,
  getCookiees,
  removeCookie
} from "../lib/session";
import {
  addToCartService,
  getCart,
  editCart,
  deleteCart
} from "../services/cart";

const enTranslationMessages = require("../translations/en.json");
const deTranslationMessages = require("../translations/ar.json");

export function* selectLanguageSaga(action) {
  action.lang == "en"
    ? yield put(actions.updateLocale(action.lang))
    : yield put(actions.updateLocale(action.lang));
}
