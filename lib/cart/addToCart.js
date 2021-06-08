import { getCookie } from "../session";

export const addToCartExFunc = (myCart) => {
  
    return new Promise((resolve, reject) => {

        cartAuth(myCart, getCookie("dlvxCartLmt")) ? reject("Clear Cart") : resolve(1)
    })
}


// Cart Allowed Type: 

// 1. SingleCart SIngle Store
// 2. SingleCart Multiple Store
// 3. SingleCart Multiple Store Muliple Category

const cartAuth = (myCart, cartAllowedType) => {
    let currentSelectedStore = getCookie("storeId");
    let currentStoreCatType = getCookie("categoryType");

    switch (parseInt(cartAllowedType)) {
        case 1:
            if (myCart && myCart.cart && myCart.cart[0] && myCart.cart[0].storeId != currentSelectedStore) {
               
                return true
            } else {
               
                return false
            }
        case 2:
            let uniqueStoreFlag = false;
           

            // check if cart is not empty , else return false
            if (myCart && myCart.cart && myCart.cart.length > 0) {
                myCart.cart.map((item, index) => {
                    if (item.storeType != currentStoreCatType) {
                        uniqueStoreFlag = true;
                        return uniqueStoreFlag;
                    }
                })
                return uniqueStoreFlag;
            } else {
                return false
            }
            break;
        case 3:
            return !myCart || myCart && myCart.length < 1 ? false : false;
            // return true;
            break;
    }
}