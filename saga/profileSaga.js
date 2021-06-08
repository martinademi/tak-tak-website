import { delay } from 'redux-saga'
import { all, call, put, take, takeLatest } from 'redux-saga/effects'
import axios from "axios";

import * as actions from "../actions/index"
import { setCookie, getCookie, getCookiees, removeCookie } from '../lib/session'
import { getCustomerProfile } from '../services/profileApi'

export function* getProfileSaga() {
    const profileResponse = yield getCustomerProfile();
    yield profileResponse.error ?
        profileResponse.status == 498 && getCookie("authorized") ?
            yield put(actions.expSession())
            : ''
        : yield put(actions.setUserProfile(profileResponse.data))
        ;
}
