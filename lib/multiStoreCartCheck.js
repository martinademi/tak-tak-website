import { getCookie } from "./session";

const currentSelectedStoreType = getCookie("categoryType");

export const multiStoreCartCheck = (myCart, store) => {
    // check,  if the store type is not similar return true and clear cart
    if (myCart && myCart.cart && myCart.cart[0].storeType != currentSelectedStoreType) {
        return true;
    } else {
        return false;
    }
}


// export const multiStoreCartCheck = (myCart, store) => {
//     if (myCart && myCart.cart && myCart.cart[0].storeId) {
//         if (myCart.cart[0].storeId == store) {
//             return false;
//         } else {
//             return true;
//         }
//     } else {
//         return false;
//     }
// } 