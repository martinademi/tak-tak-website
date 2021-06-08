

import * as actionTypes from './actionTypes';


export const getCategory = (data) => {
    return {
        type: actionTypes.INIT_GET_CATEGORIES,
        data: data,
    };
}

export const getStores = () => {
    return {
        type: actionTypes.INIT_GET_STORES
    };
}

export const getStoresByType = (data) => {
    return {
        type: actionTypes.INIT_GET_STORES_BY_TYPE,
        data: data
    };
}

export const updateStores = (stores) => {
    return {
        type: actionTypes.UPDATE_STORES,
        data: stores
    };
}


export const changeStoreAction = (store) => {
    return {
        type: actionTypes.CHANGE_STORE,
        lat: 0,
        lng: 0,
        storeId: store.businessId
    };
}
