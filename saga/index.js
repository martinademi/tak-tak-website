import { takeEvery, all } from "redux-saga/effects";

import * as actionTypes from "../actions/actionTypes";

import {
  serverLogin,
  initGuestLogin,
  getUserZone,
  checkCookies,
  initLocChange,
  getStoreSaga,
  getStoresByType,
  getGeoLocationSaga,
  changeStoreSaga,
  getAppConfigSaga,
  updateStore
} from "./saga";

import {
  addToCartSaga,
  getCartSaga,
  editCartSaga,
  selectDeliveryTypeSaga,
  repeatCartSaga
} from "./cartsaga";

import { selectLanguageSaga } from "./language";

import { getProfileSaga } from "./profileSaga";

export function* watchAuth() {
  yield takeEvery(actionTypes.SERVER_LOGIN, serverLogin);
  yield takeEvery(actionTypes.AUTH_INIT_GUEST_LOGIN, initGuestLogin);
  yield takeEvery(actionTypes.INIT_GET_ZONE, getUserZone);
  yield takeEvery(actionTypes.INIT_CHECK_COOKIES, checkCookies);
  yield takeEvery(actionTypes.INIT_LOC_CHANGE, initLocChange);
  yield takeEvery(actionTypes.INIT_GET_STORES, getStoreSaga);
  yield takeEvery(actionTypes.GET_LOCATION, getGeoLocationSaga);
  yield takeEvery(actionTypes.CHANGE_STORE, changeStoreSaga);
  yield takeEvery(actionTypes.INIT_ADD_CART, addToCartSaga);
  yield takeEvery(actionTypes.GET_CART, getCartSaga);
  yield takeEvery(actionTypes.EDIT_CART, editCartSaga);
  yield takeEvery(actionTypes.INIT_APP_CONFIG, getAppConfigSaga);
  yield takeEvery(actionTypes.DELIVERY_TYPE, selectDeliveryTypeSaga);
  yield takeEvery(actionTypes.GET_PROFILE, getProfileSaga);
  yield takeEvery(actionTypes.SELECTED_STORE, updateStore);
  yield takeEvery(actionTypes.LOCALE_SELECT, selectLanguageSaga);
  yield takeEvery(actionTypes.REPEAT_CART, repeatCartSaga);
}

export function* watchServerLogin() {
  yield takeEvery(actionTypes.SERVER_LOGIN, serverLogin);
}
export function* watchGuestLogin() {
  yield takeEvery(actionTypes.AUTH_INIT_GUEST_LOGIN, initGuestLogin);
}
export function* watchUserZone() {
  yield takeEvery(actionTypes.INIT_GET_ZONE, getUserZone);
}
export function* watchCookies() {
  yield takeEvery(actionTypes.INIT_CHECK_COOKIES, checkCookies);
}
export function* watchLocChange() {
  yield takeEvery(actionTypes.INIT_LOC_CHANGE, initLocChange);
}
export function* watchGetStores() {
  yield takeEvery(actionTypes.INIT_GET_STORES, getStoreSaga);
}
export function* watchGetStoresByType() {
  yield takeEvery(actionTypes.INIT_GET_STORES_BY_TYPE, getStoresByType);
}
export function* watchGeoLoc() {
  yield takeEvery(actionTypes.GET_LOCATION, getGeoLocationSaga);
}
export function* watchChangeStore() {
  yield takeEvery(actionTypes.CHANGE_STORE, changeStoreSaga);
}
export function* watchAddToCart() {
  yield takeEvery(actionTypes.INIT_ADD_CART, addToCartSaga);
}
export function* watchGetCart() {
  yield takeEvery(actionTypes.GET_CART, getCartSaga);
}
export function* watchEditCart() {
  yield takeEvery(actionTypes.EDIT_CART, editCartSaga);
}
export function* watchAppConfig() {
  yield takeEvery(actionTypes.INIT_APP_CONFIG, getAppConfigSaga);
}
export function* watchsetDelivType() {
  yield takeEvery(actionTypes.DELIVERY_TYPE, selectDeliveryTypeSaga);
}
export function* watchGetProfile() {
  yield takeEvery(actionTypes.GET_PROFILE, getProfileSaga);
}
export function* watchUpdateStore() {
  yield takeEvery(actionTypes.SELECTED_STORE, updateStore);
}
export function* watchLangSelect() {
  yield takeEvery(actionTypes.LOCALE_SELECT, selectLanguageSaga);
}
export function* repeatCart() {
  yield takeEvery(actionTypes.REPEAT_CART, repeatCartSaga);
}

export function* rootSaga() {
  yield all([
    watchServerLogin(),
    watchGuestLogin(),
    watchUserZone(),
    watchCookies(),
    watchLocChange(),
    watchGetStores(),
    watchGetStoresByType(),
    watchGeoLoc(),
    watchChangeStore(),
    watchAddToCart(),
    watchGetCart(),
    watchEditCart(),
    watchAppConfig(),
    watchsetDelivType(),
    watchGetProfile(),
    watchUpdateStore(),
    watchLangSelect(),
    repeatCart()
  ]);
}
