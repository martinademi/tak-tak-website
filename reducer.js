import * as actionTypes from "./actions/actionTypes";
import { updateObject } from "./shared/utility";
import { setCookie, getCookie, removeCookie } from "./lib/session";

import Language from "./translations/langage";
// import { DEFAULT_LANG } from "./lib/envariables";
const enTranslationMessages = require("./translations/en.json");

export const initialState = {
  authenticatedZone: false,
  locationDecided: false,
  lat: "",
  long: "",
  place: "",
  guestAuth: false,
  zoneId: "",
  authorized: false,
  userName: null,
  sid: null,
  token: null,
  locErrStatus: false,
  locErrMessage: "",
  categoryList: [],
  zoneDetails: [],
  stores: [],
  loading: false,
  cartList: [],
  cartProducts: [],
  appConfig: [],
  notifications: {},
  deliveryType: null,
  userProfile: null,
  selectedStore: null,
  locale: enTranslationMessages,
  selectedLang: "en",
  sessionExpired: false
};

const serverStoreUpdate = (state, action) => {
  
  return updateObject(state, {
    guestAuth: true,
    zoneDetails: action.zone,
    categoryList: action.products,
    token: action.token
  });
};

const locationConfirmed = (state, action) => {
  return updateObject(state, { locationDecided: true, sessionExpired: false });
};

const activateGuest = (state, action) => {
  return updateObject(state, { guestAuth: true });
};

const sessionExpired = (state, action) => {
  return updateObject(state, { sessionExpired: true });
};

const getZonID = (state, action) => {
  return updateObject(state, {
    zoneId: action.zoneId,
    authenticatedZone: true,
    currencySymbol: action.currencySymbol
  });
};

const authHandler = (state, action) => {
  return updateObject(state, {
    guestAuth: false,
    authorized: true,
    userName: action.username
  });
};

const updateState = (state, action) => {
  return updateObject(state, {
    authorized: true,
    userName: action.username,
    zoneDetails: action.zoneDetails,
    token: action.token
  });
};

const updateHomeProducts = (state, action) => {
  return updateObject(state, { categoryList: action.products });
};

const updateLocation = (state, action) => {
  return updateObject(state, {
    place: action.place,
    lat: action.lat,
    long: action.long
  });
};

const errorLocation = (state, action) => {
  return updateObject(state, {
    locErrStatus: action.status,
    locErrMessage: action.message,
    authenticatedZone: false
  });
};
const categoryList = (state, action) => {
 
  return updateObject(state, { categoryList: action.data });
};

const updateStores = (state, action) => {
  return updateObject(state, { stores: action.data });
};

const getGeoLocation = (state, action) => {

  //  return updateObject(state, { place: action.place , lat :action.lat , long : action.long });
  return "";
};

const loaderStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const loaderStop = (state, action) => {
  return updateObject(state, { loading: false });
};

const updateCart = (state, action) => {
 
  return updateObject(state, {
    cartList: action.data,
    cartProducts: action.cartProducts
  });
};

const updateAppConfig = (state, action) => {
  return updateObject(state, { appConfig: action.data });
};

const updateNotifiactions = (state, action) => {
  return updateObject(state, { notifications: action.data });
};
const updateDeliveryType = (state, action) => {
  return updateObject(state, { deliveryType: action.delivery });
};
const updateProfile = (state, action) => {
  return updateObject(state, { userProfile: action.payload.data });
};
const updateSelectedStore = (state, action) => {
  return updateObject(state, { selectedStore: action.data });
};

const updateLocale = (state, action) => {
 
  return updateObject(state, {
    locale: action.lang,
    selectedLang: action.selectedLang
  });
};
const updateExpireCart = (state, action) => {
  return updateObject(state, {
    expireCart: action.payload,
    expCartData: action.cart
  });
};

export const updateLocaleFunc = (state, action) => {
 
  return updateObject(state, {
    locale: Language[action.lang],
    selectedLang: action.lang
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_SERVER_STORE:
      return serverStoreUpdate(state, action);
    case actionTypes.ACTIVATE_GUEST:
      return activateGuest(state, action);
    case actionTypes.INIT_OPTR_ZONE:
      return getZonID(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authHandler(state, action);
    case actionTypes.UPDATE_STATES:
      return updateState(state, action);
    case actionTypes.INIT_LOC_CHANGE:
      return updateLocation(state, action);
    case actionTypes.INIT_LOC_ERROR:
      return errorLocation(state, action);
    case actionTypes.INIT_GET_CATEGORIES:
      return categoryList(state, action);
    case actionTypes.UPDATE_STORES:
      return updateStores(state, action);
    case actionTypes.UPDATE_PRODUCTS_HOME:
      return updateHomeProducts(state, action);
    case actionTypes.LOADER_START:
      return loaderStart(state, action);
    case actionTypes.LOADER_STOP:
      return loaderStop(state, action);
    case actionTypes.UPDATE_CART:
      return updateCart(state, action);
    case actionTypes.UPDATE_APP_CONFIG:
      return updateAppConfig(state, action);
    case actionTypes.INIT_ALERT:
      return updateNotifiactions(state, action);
    case actionTypes.DELIVERY_TYPE:
      return updateDeliveryType(state, action);
    case actionTypes.SET_PROFILE:
      return updateProfile(state, action);
    case actionTypes.UPDATE_SELECTED_STORE:
      return updateSelectedStore(state, action);
    case actionTypes.UPDATE_LOCALE:
      return updateLocale(state, action);
    case actionTypes.LOCALE_SELECT:
      return updateLocaleFunc(state, action);
    case actionTypes.SESN_EXP:
      return sessionExpired(state, action);
    case actionTypes.EXP_CART:
      return updateExpireCart(state, action);
    default:
      return state;
  }
};

export default reducer;
