import { delay } from 'redux-saga'
import { all, call, put, take, takeLatest } from 'redux-saga/effects'
import axios from "axios";

import * as actions from "../actions/index"
import { setCookie, getCookie, getCookiees, removeCookie } from '../lib/session'
import { addToCartService, getCart, editCart, deleteCart, cartNewWithAddOns } from '../services/cart'

export function* addToCartSaga(action) {
    yield put(actions.loadingStart())
    const cartResponse = yield addToCartService(action.data);
    
    
    yield cartResponse.error ?
        cartResponse.status == 498 ?
            yield put(actions.expSession())
            : ''
        : yield put(actions.getCart())
        ;
    yield put(actions.loadingStop());
}

export function* repeatCartSaga(action) {
    yield put(actions.loadingStart())
    const cartResponse = yield cartNewWithAddOns(action.data)
    yield put(actions.getCart())
    yield put(actions.loadingStop())
}

export function* getCartSaga(action) {
    const getCartResponse = yield getCart()
    let cartData; let cartProducts = [];

    getCartResponse.error ?
        yield put(actions.updateCart([], []))
        : (
            cartData = yield getCartResponse.data.data,
            cartProducts = [],
            cartData.cart ? yield cartData.cart.map((cart, index) => {
                cart.products ? cart.products.map((product, index) => {
                    cartProducts.push(product)
                }) : ''
            }) : '',
            yield put(actions.updateCart(getCartResponse.data.data, cartProducts))
        )
}

export function* editCartSaga(action) {
    const editcartRes = yield action.data.quantity > 0 ? editCart(action.data) : deleteCart(action.data);
    yield put(actions.getCart())
}

export function* selectDeliveryTypeSaga(action) {
    yield setCookie("deliveryType", action.delivery)
}