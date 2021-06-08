import { postWithToken, get, patchWithToken, deleteReq } from "../lib/request";
import { setCookie, getCookie, removeCookie } from "../lib/session";

const token = getCookie("token", "");

export const addAddress = async (data) => {
  try {
    const response = await postWithToken("/address", data);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response,
    };
 
    return err;
  }
};

export const getAddress = async () => {

  let userId =  getCookie('sid');
  try {
    const response = await get(`/address/${userId}`, token);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response,
    };
   
    return err;
  }
};

export const patchAddress = async (data) => {
  try {
    const response = await patchWithToken("/address", data);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response,
    };
 
    return err;
  }
};

export const deleteAddress = async (id) => {
  try {
    const response = await deleteReq("/address/" + id.toString());
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response,
    };
  
    return err;
  }
};

export const productDetails = async (productId) => {
  let lat = getCookie("lat");
  let long = getCookie("long");

  try {
    const response = await get(
      `/business/productDetails/${productId}/${lat}/${long}`
    );
    return response;
  } catch (error) {
  
    return error;
  }
};
