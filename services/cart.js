import { postWithToken, get, patchWithToken, post, deleteReq, putWithToken } from "../lib/request"
import { setCookie, getCookie, removeCookie } from '../lib/session'

const token = getCookie('token', '');

export const addToCartService = async (data) => {
  try {
    const response = await postWithToken("/cart", data);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }
    return err;
  }
};

export const editFavtService = async (data) => {
  try {
    const response = await postWithToken("/favorite", data);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }

    return err;
  }
};

export const addToWishlistService = async (data) => {
  try {
    const response = await postWithToken("/wishList", data);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }

    return err;
  }
};

export const getCart = async () => {
  try {
    const response = await get("/cart", token);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }

    return err;
  }
};

export const editCart = async (data) => {
  try {
    const response = await patchWithToken("/cart", data);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }

    return err;
  }
};

export const editAddOnCart = async (data) => {
  try {
    const response = await patchWithToken("/cartAddOns", data);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }
    return err;
  }
};

export const cartNewWithAddOns = async (data) => {
  try {
    const response = await patchWithToken("/cartNewWithAddOns", data);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }

    return err;
  }
};

export const getFavtProducts = async (sid, zoneid) => {

  try {
    const response = await get("/favorite/" + zoneid + "/" + sid, token);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }

    return err;
  }
}

export const createWishList = async (data) => {
  try {
    const response = await postWithToken("/wishList", data);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }

    return err;
  }
};

export const addProductToWishList = async (data) => {
  try {
    const response = await postWithToken("/wishList/product", data);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }

    return err;
  }
};

export const getWishlist = async (listId, storeId) => {
 let zoneID=getCookie("zoneid","")
 let StoreId =getCookie("storeId","") || 0
  try {
    const response = await get("/wishList/" + zoneID + "/"+ listId + "/" + StoreId, token);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }

    return err;
  }
}

export const removeFromWishList = async (data) => {
  try {
    const response = await patchWithToken("/wishList/product", data);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }
    return err;
  }
};

export const deleteCart = async (data) => {
  try {
    const response = await deleteReq("/cart/" + data.cartId + "/" + data.childProductId + "/" + data.unitId);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }

    return err;
  }
}

export const clearOutCart = async (data) => {
  try {

    const response = await postWithToken("/dispatcher/cart/clear", data);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }

    return err;
  }
};

export const checkOutCart = async (data) => {
  try {
   
    const response = await postWithToken("/customer/order", data);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }

    return err;
  }
};



export const cancelOrder = async (data) => {
  try {
   
    const response = await putWithToken("/customer/order", data);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }

    return err;
  }
};

export const getCancelReasons = async (data) => {
  try {
    const response = await get('/reasons', token);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }

    return err;
  }
}


export const getOffers = async (data) => {
  try {
    const response = await get('/business/home/' + data.zoneID + '/' + data.storeID + '/0/' + data.type + '/0', token);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }

    return err;
  }
}

export const getPromoCodeByCity = async(cityId) =>{
   // let storeID =getCookie("storeId")
   try {
    const response = await get('/promoByCityId/' + cityId , token);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }

    return err;
  }
}

export const getCoupons = async (cityId,storeID) => {
  // let storeID =getCookie("storeId")
  try {
    const response = await get('/promoByCityId/' + cityId + "/" +storeID, token);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }

    return err;
  }
}
export const validateCoupon = async (data) => {
  try {
    const response = await post('/customer/promoCodeValidation', data);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }

    return err;
  }
}

export const getFareApi = async (data) => {
  try {
    const response = await postWithToken("/business/fare", data);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }

    return err;
  }
};

export const getCards = async (cityId) => {
  try {
    const response = await get('/card', token);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }

    return err;
  }
}

export const addCard = async (data) => {
  try {
    const response = await postWithToken("/card", data);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }

    return err;
  }
};

export const setDefaultCard = async (data) => {
  try {
    const response = await patchWithToken("/card", data);
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }

    return err;
  }
};

export const deleteCard = async (id) => {
  try {
    const response = await deleteReq("/card/" + id.toString());
    return response;
  } catch (error) {
    const err = {
      error: true,
      ...error.response
    }

    return err;
  }
};  