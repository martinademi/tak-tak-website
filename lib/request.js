import axios from "axios";
import { setCookie, getCookie, removeCookie } from './session'
import * as enVariables from './envariables'

const API_HOST = enVariables.API_HOST

const getUrl = endpoint => API_HOST + endpoint;

export const post = async (endpoint, data) => {
  return axios.post(getUrl(endpoint), data, {
    headers: { "Content-Type": "application/json", 'language': 'en' }
  });
};

export const patch = async (endpoint, data) => {
  return axios.patch(getUrl(endpoint), data, {
    headers: { "Content-Type": "application/json", 'language': 'en' }
  });
};

export const get = async (endpoint, mytoken) => {
  
  axios.defaults.headers.common['authorization'] = await getCookie('token', '')
  return axios.get(getUrl(endpoint), {
    headers: { "Content-Type": "application/json", 'language': 'en' }
  });
};


export const postWithToken = async (endpoint, data) => {
  axios.defaults.headers.common['authorization'] = await getCookie('token', '')
  return axios.post(getUrl(endpoint), data, {
    headers: { "Content-Type": "application/json", 'language': 'en' }
  });
};

export const patchWithToken = async (endpoint, data) => {
  axios.defaults.headers.common['authorization'] = await getCookie('token', '')
  return axios.patch(getUrl(endpoint), data, {
    headers: { "Content-Type": "application/json", 'language': 'en' }
  });
};

export const putWithToken = async (endpoint, data) => {
  axios.defaults.headers.common['authorization'] = await getCookie('token', '')
  return axios.put(getUrl(endpoint), data, {
    headers: { "Content-Type": "application/json", 'language': 'en' }
  });
};

export const deleteReq = async (endpoint) => {
  axios.defaults.headers.common['authorization'] = await getCookie('token', '')
  return axios.delete(getUrl(endpoint), {
    headers: { "Content-Type": "application/json", 'language': 'en' }
  });
};
   
// export const get = async (endpoint, jwt) => {
//   const headers = jwt
//     ? {
//         headers: { Authorization: `Bearer ${jwt}` }
//       }
//     : null;
//   return axios.get(getUrl(endpoint), headers);
// };   