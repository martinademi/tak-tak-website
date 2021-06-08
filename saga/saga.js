
import { delay } from 'redux-saga'
import { all, call, put, take, takeLatest } from 'redux-saga/effects'
import axios from "axios";

import * as actions from "../actions/index"
import { setCookie, getCookie, getCookiees, removeCookie } from '../lib/session'
import redirect from "../lib/redirect"
import { authenticateGuest, getLocationZone } from "../services/guestLogin"
import { authenticate, appConfig } from '../services/auth'
import { ipinfo } from '../services/getIpInfo'
import { getCategoriesApi, getStores, getAllStoreList } from '../services/category'
import { select } from 'redux-saga/effects';
import { redirectIfAuthenticated, getJwt, getLocation } from "../lib/auth";

const getStoresList = (state) => state.stores;


export function* serverLogin(action) {
    const res = yield authenticateGuest()
    yield axios.defaults.headers.common['authorization'] = res.data.token
    const zone = yield getLocationZone("13.0196", "77.5968")
    const products = yield getCategoriesApi(zone.data.zoneId, 0, "13.0196", "77.5968", res.data.token)
    yield put(actions.updateServerStore(res.data.token, zone.data, products.data))
}


export function* changeStoreSaga(action) {
    yield put(actions.loadingStart())
   
    const token = yield getCookiees("token", action.req)
    yield axios.defaults.headers.common['authorization'] = token
    const products = yield getCategoriesApi(0, action.storeId, 0, 0, token)
    yield put(actions.updateHomeProductList(products.data))
    yield put(actions.loadingStop())
}


export function* initGuestLogin(action) {
    // calling guest login api
    const res = yield authenticateGuest()
    const LOC_API = yield axios.get('https://ipapi.co/json')
    yield setCookie("token", res.data.token)
    yield setCookie("sid", res.data.sid)
    yield setCookie("lat", LOC_API.data.latitude)
    yield setCookie("long", LOC_API.data.longitude)
    yield axios.defaults.headers.common['authorization'] = res.data.token
    yield put(actions.getZones(LOC_API.data.latitude, LOC_API.data.longitude))
    yield put(actions.guestActivate())
}

export function* getUserZone(action) {
    const res = yield getLocationZone(action.lat, action.long)
    res.error ? (
        yield setCookie("authenticatedZone", false),
        yield put(actions.initLocError({ status: true, message: res.data.message })))
        : (
            yield put(actions.initLocError({ status: false, message: '' })),
            yield setCookie("zoneDetails", JSON.stringify(res.data)),
            yield setCookie("zoneid", res.data.zoneId),
            yield setCookie("cityid", res.data.cityId),
            yield setCookie("grc_currencySymbol", res.data.currencySymbol),
            yield put(actions.activateZone(res.data.zoneId, res.data.currencySymbol))
        )
}

// export function* getZoneCurrency(action) {
//     const res = yield getLocationZone(action.lat, action.long)
//     res.error ? ''
//         : (
//             yield setCookie("grc_currencySymbol", res.data.currencySymbol),
//             yield put(actions.activateZone(res.data.zoneId, res.data.currencySymbol)) 
//         )
// }

export function* initLogin(action) {
    yield delete axios.defaults.headers.common["authorization"]
}

export function* checkCookies(action) {
    // getCookiees("username", ctx.req)
    const username = yield getCookiees("username", action.req)
    const token = yield getCookiees("token", action.req)
    const zoneDetails = yield getCookiees("zoneDetails", action.req)
    const authorized = yield getCookiees("authorized", action.req)
    yield axios.defaults.headers.common['authorization'] = token
    yield put(actions.updateState(username, zoneDetails, token, authorized))
}

export function* initLocChange(action) {
  
    yield setCookie("place", action.place)
    yield setCookie("lat", action.lat)
    yield setCookie("long", action.long)
    yield axios.defaults.headers.common['authorization'] = action.token
    yield put(actions.getZones(action.lat, action.long))
}

export function* getStoreSaga(action) {
    const storeres = yield getStores(getCookie("zoneid", ""), 0, getCookie("lat", ""), getCookie("long", ""))
    storeres.error ? "" : (
        yield put(actions.updateStores(storeres.data))
    )
}

export function* getStoresByType(action) {
    const storeres = yield getAllStoreList(action.data)
    storeres.error ? "" : (
        yield put(actions.updateStores(storeres.data))
    )
}

export function* getGeoLocationSaga(action) {
    action.payload.then((result) => {
        setCookie("lat", result.coords.latitude)
        setCookie("long", result.coords.longitude)
        put(actions.getZones(result.coords.latitude, result.coords.longitude))
    }, (error) => {
       
    })
}


export function* getAppConfigSaga(action) {
   
    const appC = yield appConfig();
    let { data } = appC
   
    yield put(actions.updateAppConfig(data.data))
}

export function* updateStore(action) {
    const getSt = yield select(getStoresList);
   

    const storeIndex = yield getSt && getSt.data && getSt.data.findIndex((item) => item.businessId == action.storeId || item.storeId == action.storeId)

    if (storeIndex > -1) {
        const selectedStore = yield getSt.data[storeIndex]
        yield put(actions.updateSelectedStore(selectedStore))
    }
}



