

import * as actionTypes from './actionTypes';


export const getProfile = () => {
    return {
        type: actionTypes.GET_PROFILE
    };
}

export const setUserProfile = (data) => {
    return {
        type: actionTypes.SET_PROFILE,
        payload: data
    };
}    