import * as actionTypes from './actionTypes';

export const guestLogin = () => {
  return {
    type: actionTypes.AUTH_INIT_GUEST_LOGIN
  };
}

export const serverLogin = () => {
  return {
    type: actionTypes.SERVER_LOGIN
  }
}

export const updateServerStore = (token, zonedetails, products) => {
  return {
    type: actionTypes.UPDATE_SERVER_STORE,
    zone: zonedetails,
    products: products,
    token: token
  }
}
export const updateHomeProductList = (products) => {
  return {
    type: actionTypes.UPDATE_PRODUCTS_HOME,
    products: products,
  }
}

export const guestActivate = () => {
  return {
    type: actionTypes.ACTIVATE_GUEST
  };
}

export const expSession = () => {
  return {
    type: actionTypes.SESN_EXP
  }
}

export const getZones = (lat, long) => {
  return {
    type: actionTypes.INIT_GET_ZONE,
    lat: lat,
    long: long
  };
}

export const activateZone = (zoneId, currencySymbol) => {
  return {
    type: actionTypes.INIT_OPTR_ZONE,
    zoneId: zoneId,
    currencySymbol:currencySymbol
  }
}

export const auth = (username) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    username: username
  }
}

export const updateState = (username, zoneDetails, token, authorized) => {
  return {
    type: actionTypes.UPDATE_STATES,
    username: username,
    zoneDetails: zoneDetails,
    token: token,
    authorized: authorized
  }
}

export const checkCookies = (req) => {
  return {
    type: actionTypes.INIT_CHECK_COOKIES,
    req: req
  }
}

export const loadingStart = () => {
  return {
    type: actionTypes.LOADER_START
  };
}

export const loadingStop = () => {
  return {
    type: actionTypes.LOADER_STOP
  };
}


export const getAppConfig = () => {
  return {
    type: actionTypes.INIT_APP_CONFIG
  }
}

export const updateAppConfig = (data) => {
  return {
    type: actionTypes.UPDATE_APP_CONFIG,
    data: data
  }
}

export const alert = (data) => {
  return {
    type: actionTypes.INIT_ALERT,
    data: data
  }
}

export const selectedStore = (storeid) => {
  return {
    type: actionTypes.SELECTED_STORE,
    storeId: storeid,
  }
}

export const updateSelectedStore = (data) => {
  return {
    type: actionTypes.UPDATE_SELECTED_STORE,
    data: data
  }
}









