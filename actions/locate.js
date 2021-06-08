import * as actionTypes from './actionTypes';

export const initLocChange = (locationDetails) => {
    return {
        type: actionTypes.INIT_LOC_CHANGE,
        place: locationDetails.address,
        lat: locationDetails.lat,
        long: locationDetails.lng,
        token: locationDetails.token
    };
}

export const initLocError = (err) => {
    return {
        type: actionTypes.INIT_LOC_ERROR,
        message: err.message,
        status: err.status
    }
}

export const getLocation = () => {
    const geolocation = navigator.geolocation;
    let latlongs;
    const location = new Promise((resolve, reject) => {
        if (!geolocation) {
            reject(new Error('Not Supported'));
        }
        geolocation.getCurrentPosition((position) => {
            resolve(position);
        }, () => {
            reject(new Error('Permission denied'));
        });
    });


    return {
        type: actionTypes.GET_LOCATION,
        payload:location
    }
};