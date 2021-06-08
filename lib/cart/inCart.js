
const findCartIndex = (cart, product) => {
    return cart.findIndex((item) => item.childProductId == product.childProductId || item.childProductId == product.productId);
}

export const inCart = (cart, product) => {
    if (cart) {
        let index = findCartIndex(cart, product);
        if (index >= 0 && cart[index].quantity > 0) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}