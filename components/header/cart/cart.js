import React from "react";
import RaisedButton from 'material-ui/RaisedButton'

import Wrapper from "../../../hoc/wrapperHoc";
import { BASE_COLOR, CART_PICKUP, CART_DELIVERY, CART_PICKUP_BTN, CART_DELIVERY_BTN } from "../../../lib/envariables";
import LanguageWrapper from "../../../hoc/language"
const style = {
    width: '100%'
};

const buttonGreen = {
    width: '100%',
    backgroundColor: BASE_COLOR,
    height: '40px',
    lineHeight: '40px'
}
const overlayStyle = {
    width: '100%',
    height: '40px',
}
const buttonBlue = {
    width: '100%',
    backgroundColor: "#2196f3",
    height: '40px',
    lineHeight: '40px'
}
const lableFill = {
    fontSize: '13px',
    fontWeight: '700',
    color: '#fff'
}

const buttonMobileBlue = {
    width: '100%',
    backgroundColor: "#2196f3",
    height: '35px',
    lineHeight: '35px'
}


const buttonMobileGreen = {
    width: '100%',
    backgroundColor: BASE_COLOR,
    height: '35px',
    lineHeight: '35px'
}


const getFloatSum = (a, b) => parseFloat(Number(a.valueOf()) + Number(b.valueOf())).toFixed(2);


const getItemPrice = (cart, product) => {
    let priceHtml;
    switch (cart.storeType) {
        // for food cart prices
        case 1:
            priceHtml = (
                <p>{cart.currencySymbol}{getFloatSum(parseFloat(product.finalPrice).toFixed(2), parseFloat(product.addOnsPrice).toFixed(2))}
                    {/* {product.finalPrice < product.unitPrice ? <span className="product-price-before">{cartItem.currencySymbol} {product.unitPrice}</span> : ''} */}
                </p>

            )
            return priceHtml;

        // for other stores like grocery, pharmacy etc
        default:
            priceHtml = (
                <p>
                    {parseFloat(product.finalPrice).toFixed(2) < parseFloat(product.unitPrice).toFixed(2) ? <span className="product-price-before">{cart.currencySymbol}{parseFloat(product.unitPrice).toFixed(2)}</span> : ''}
                    {"  "}
                    {cart.currencySymbol}{parseFloat(product.finalPrice).toFixed(2)}
                </p>

            )
            return priceHtml;
    }
}

const CartContent = (props) => {

    const { cart } = props;
    const {lang} = props
    return (
        <Wrapper>
            <div className="cartPopMenu">
                <div className="row">
                    {cart && cart.cart && cart.cart.map((cartItem, index) =>
                        <div className="col-12" key={"cartHov" + index}>
                            <div className="row">
                                <div className="col-2">
                                    <img src={cartItem.storeLogo} height="30px" />
                                </div>
                                <div className="col-10">
                                    <p className="storeName">
                                        {cartItem.storeName}
                                        <span className="storeArea">{cartItem.areaName}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="col-12 my-3 px-0 py-2" style={{ borderBottom: "1px dashed #a9abb2", borderTop: "1px dashed #a9abb2", }}>
                                {cartItem.products && cartItem.products.map((product, pKey) =>
                                    <div className="row my-1" key={"prodHov" + pKey}>
                                        <div className="col-7">
                                            <p>{product.itemName}  *  {product.quantity}</p>
                                        </div>
                                        <div className="col-5 cartPrice">
                                            {getItemPrice(cartItem, product)}
                                            {/* <p>{cartItem.currencySymbol}  {getItemPrice(cartItem, product)} {product.finalPrice < product.unitPrice ? <span className="product-price-before">{cartItem.currencySymbol} {product.unitPrice}</span> : ''}</p> */}
                                            {/* <p>{cartItem.currencySymbol}  {parseFloat(product.unitPrice || product.finalPrice).toFixed(2)}</p> */}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {index === cart.cart.length - 1 ?
                                <div className="col-12 mt-3 px-0">
                                    <div className="row">
                                        <div className="col-7">
                                            <p>
                                                {lang.subTotal||"Sub Total"}
                                                <span className="storeArea">{lang.extraChargeApply||"Extra charges may apply"}</span>
                                            </p>
                                        </div>
                                        <div className="col-5 cartPrice">
                                            <p>
                                                {cart && cart.cart && cart.cart.cartDiscount&& cart.cart.cartDiscount.length > 0 ?
                                                    <span className="product-price-before" style={{ margin: "0px 5px", fontWeight: 400 }}>{cartItem.currencySymbol}{parseFloat(cart.cartTotal).toFixed(2)}</span>
                                                    : ''
                                                }
                                                <span>{cartItem.currencySymbol}{parseFloat(cart.totalPrice).toFixed(2)}</span>
                                            </p>
                                        </div>
                                    </div>

                                </div> : ''
                            }

                        </div>
                    )}

                    <div className="col-12">
                        <div className="row mt-3">
                            <div className="col-6 p-2 text-center">
                                <RaisedButton label={lang.selfPickup||"Self Pickup"||CART_PICKUP_BTN} overlayStyle={overlayStyle} secondary={true} style={style} buttonStyle={buttonMobileBlue} labelStyle={lableFill}
                                    onClick={(event) => props.setDeliveryType(2, event)}
                                />
                            </div>

                            <div className="col-6 p-2 text-center">
                                <RaisedButton label={lang.requestDelivery||"Request Delivery"||CART_DELIVERY_BTN} overlayStyle={overlayStyle} secondary={true} style={style} buttonStyle={buttonMobileGreen} labelStyle={lableFill}
                                    onClick={(event) => props.setDeliveryType(1, event)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* <div className="col-12 mt-3">
                        
                        <a className="chkButtonCont" onClick={(event) => props.setDeliveryType(1, event)} href="/checkout">
                            <button className="chkButton">Checkout</button>
                        </a>
                    </div> */}
                </div>
            </div>
        </Wrapper>
    )
}

export default LanguageWrapper(CartContent);