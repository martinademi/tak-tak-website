import { post, patch } from "../lib/request";
import $ from 'jquery'
import { setCookie, getCookie, removeCookie } from '../lib/session'


export const sendOtp = async (phone, cc) => {
  // let cc = $(".signup-form .selected-dial-code").text();
  try {
    const response = await post("/customer/sendOtp", {
      mobile: phone,
      countryCode: cc,
    }
    );
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }
  
    return err;
  }
};

export const forgotPassword = async (data) => {
  try {
    const response = await post("/customer/forgotPassword", data);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }
   
    return err;
  }
};

export const verifyOtp = async (data) => {
  try {
    const response = await post("/customer/verifyOtp", data);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }
  
    return err;
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await patch("/customer/password", data);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }
 
    return err;
  }
};  