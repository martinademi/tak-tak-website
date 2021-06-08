export {
  guestLogin,
  serverLogin,
  updateServerStore,
  guestActivate,
  getZones,
  activateZone,
  auth,
  updateState,
  checkCookies,
  updateHomeProductList,
  loadingStart,
  loadingStop,
  getAppConfig,
  updateAppConfig,
  alert,
  selectedStore,
  updateSelectedStore,
  expSession
} from "./auth";

export { getProfile, setUserProfile } from "./profile";

export { initLocChange, initLocError, getLocation } from "./locate";

export {
  getCategory,
  getStores,
  getStoresByType,
  updateStores,
  changeStoreAction
} from "./category";

export {
  initAddCart,
  getCart,
 
  updateCart,
  editCard,
  deliveryType,
  repeatCart,
  expireCart
} from "./cartActions";

export { selectLocale, updateLocale } from "./language";
