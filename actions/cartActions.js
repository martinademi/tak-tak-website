import * as actionTypes from "./actionTypes";

export const initAddCart = data => {
  return {
    type: actionTypes.INIT_ADD_CART,
    data: data
  };
};

export const getCart = () => {
  return {
    type: actionTypes.GET_CART
  };
};

export const updateCart = (data, cartProducts) => {
  return {
    type: actionTypes.UPDATE_CART,
    data: data,
    cartProducts: cartProducts
  };
};

export const editCard = data => {
  return {
    type: actionTypes.EDIT_CART,
    data: data
  };
};

export const deliveryType = deliveryType => {
  return {
    type: actionTypes.DELIVERY_TYPE,
    delivery: deliveryType
  };
};

export const repeatCart = data => {
  return {
    type: actionTypes.REPEAT_CART,
    data: data
  };
};

export const expireCart = (data, cart) => {
  return {
    type: actionTypes.EXP_CART,
    payload: data,
    cart: cart
  };
};
