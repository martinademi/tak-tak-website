import axios from 'axios'
import { get, post } from "../lib/request";
import * as enVariables from '../lib/envariables'


export const ipinfo = async () => {
    return axios.get('https://ipinfo.io', {
        headers: { "Content-Type": "application/json" }
    });
};

export const getTipValue = async () => {
    return axios.get(enVariables.API_HOST + '/admin/tip', {
        headers: { "Content-Type": "application/json", 'language': 'en' }
    })
}
export const appConfig = async () => {
    return axios.get(enVariables.API_HOST + '/customer/config', {
        headers: { "Content-Type": "application/json", 'language': 'en' }
    })
}


export const getCityList = async () => {
    return axios.get(enVariables.API_HOST + '/admin/city', {
        headers: { "Content-Type": "application/json", 'language': 'en' }
    })
}


export const getStoreCategories = async () => {
    try {
        const response = await get('/store/categories');
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }
       
        return err;
    }
};

export const getCitywiseCategories = async (cityId) => {
    try {
        const response = await get(`/store/categories/${cityId}`);
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }

        return err;
    }
};


export const getCityZones = async (cityId) => {
    try {
        const response = await get('/city/zones/' + cityId);
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }
       
        return err;
    }
};

export const getCityPlans = async (cityId) => {
    try {
        const response = await get('/city/storeplans/' + cityId);
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }
       
        return err;
    }
};

export const StoreSignUp = async (data) => {
    try {
        const response = await post("/store", data);
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }
       
        return err;
    }
};


