import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import Router from "next/router";
import { IconButton } from 'material-ui';
import EditAddOns from "../FoodTheme/Dialog/editAddOn";
import OptionsDialog from "../FoodTheme/Dialog/optionsDialog";
import AddOnDialog from "../FoodTheme/Dialog/addOnDialog";
import { BASE_COLOR, CART_PICKUP_BTN, CART_DELIVERY_BTN, EXTRA_NOTES, NOTES_VAR } from '../../lib/envariables';
import LanguageWrapper from "../../hoc/language"
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

const lableMobileFill = {
    fontSize: '11px',
    fontWeight: '700'
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


class CartContent extends React.Component {

    constructor(props) {
        super(props);
        this.openAddOnDialog = this.openAddOnDialog.bind(this);
    }

    state = {
        storesNotes: {}
    }

    getCartItems = (cart) => {
        let total = 0;
        cart && cart.map((item) => total += item.products.length)
        return total
    }

    getGeneralCart = (cart, index, isMobile) => {
        const props = this.props;
        const {lang}  = this.props
        return (
            // myCart.cart ? myCart.cart.map((cart, index) =>
            <div key={'cartno-' + index} className="row mb-3 generalSliderCart">
                <div className="col-12 mb-3 py-3 cart-store-headers" style={{ background: '#fff', borderBottom: "1px solid #eee" }}>
                    <div className="row align-items-center">
                        <div className="col-2">
                            <img className="absolute-center"
                                style={{ width: '50px', height: '50px', borderRadius: '50px', border: '1px solid #ddd' }} src={cart.storeLogo} />
                        </div>
                        <div className="col-7 pl-1">
                            <h5 className="cart-title oneLineSetter">{cart.storeName}</h5>
                            <p className="cart-description lineSetter">{cart.storeAddress}</p>
                        </div>
                        <div className="col-3 text-center">
                            <strong className="cartStoreTotPrice"><span>{cart.currencySymbol} </span><span></span> {parseFloat(cart.storeUnitPrice).toFixed(2)}</strong>
                        </div>
                    </div>

                    <div className="row px-3">
                        <div className="col-12 free-delivery text-center">
                            {cart.storeUnitPrice > cart.freeDeliveryAbove ?
                                <p>{lang.freeDelivery||"Free delivery applicable"}</p>
                                :
                                <p> {lang.add||"add"} <span>{cart.currencySymbol}</span><span>{parseFloat(cart.freeDeliveryAbove - cart.storeUnitPrice).toFixed(2)}</span> {lang.for||"for"} <span className="freeDel">{lang.freeDeli||"Free Delivery"}</span></p>
                            }
                        </div>
                    </div>
                </div>
                {cart.products ? cart.products.map((product, index) =>
                    <div key={'cartlist' + index} className="col-12 py-3 border-bottom" style={{ background: '#fff', paddingBottom: "10px" }}>
                        <div className="row align-items-center pl-2">

                            <div className="col-2">
                                <img className="absolute-center"
                                    style={{ width: '50px', height: '50px' }}
                                    src={product.itemImageURL} />
                            </div>
                            <div className="col-7 pr-0">
                                <p className="cart-product oneLineSetter" title={product.itemName}>{product.itemName}</p>
                                <p className="oneLineDisplay" title={product.unitName} style={{ fontSize: '11px', color: '#999' }}>{product.unitName}</p>
                            </div>
                            <div className="col-3 px-0 text-center">
                                <div className="align-items-center calculator-market">
                                    <div onClick={(event) => props.editCart(product, '', 1, event)} className="substract" ></div>
                                    <div className="qtyNum">{product.quantity}</div>
                                    <div className="addition" onClick={(event) => props.editCart(product, '', 2, event)}>+</div>
                                </div>

                                {/* {product.finalPrice !== product.unitPrice ? <span className='oneLineSetter' style={{ fontSize: '9px', color: '#999', textDecoration: 'line-through' }}>{cart.currencySymbol} {parseFloat(product.unitPrice).toFixed(2)}</span> : ''} */}
                                <span className='oneLineSetter sliderCartPrice' style={{ fontSize: '11.5px', color: '#999', width: isMobile ? "70px" : "93px" }}><strong> {cart.currencySymbol}{parseFloat(product.finalPrice).toFixed(2)} </strong> </span>
                                {parseFloat(product.finalPrice).toFixed(2) < parseFloat(product.unitPrice).toFixed(2) ? <span className="product-price-before sliderCartPrice oneLineSetter" style={{ width: isMobile ? "70px" : "93px" }}>{cart.currencySymbol}{parseFloat(product.unitPrice).toFixed(2)}</span> : ''}
                            </div>
                        </div>
                    </div>)
                    : ''}

                <div className="notesCont">
                    <input type="text" placeholder={EXTRA_NOTES} className="extraNotesBox" id={"cartSlider-" + cart.storeId} onChange={this.props.handleCartNotes} />
                </div>

            </div>
            // ) : ''
        )
    }

    getFoodCart = (cart, index, isMobile) => {
        const props = this.props;
        const {lang}  = this.props
        return (
            // myCart.cart ? myCart.cart.map((cart, index) =>
            <div key={'cartno-' + index} className="row mb-3">
                <div className="col-12 mb-3 py-3 cart-store-headers" style={{ background: '#fff', borderBottom: "1px solid #eee" }}>
                    <div className="row align-items-center">
                        <div className="col-2">
                            <img className="absolute-center"
                                style={{ width: '50px', height: '50px', borderRadius: '50px', border: '1px solid #ddd' }} src={cart.storeLogo} />
                        </div>
                        <div className="col-7 pl-1">
                            <h5 className="cart-title oneLineSetter">{cart.storeName}</h5>
                            <p className="cart-description lineSetter">{cart.storeAddress}</p>
                        </div>
                        <div className="col-3 pl-0 text-center">
                            <strong className="cartStoreTotPrice"><span>{cart.currencySymbol} </span><span></span> {parseFloat(cart.storeUnitPrice).toFixed(2)}</strong>
                        </div>
                    </div>

                    <div className="row px-3">
                        <div className="col-12 free-delivery text-center">
                            {Number(parseFloat(cart.storeUnitPrice).toFixed(2)) > Number(parseFloat(cart.freeDeliveryAbove).toFixed(2)) ?
                                <p>{lang.freeDelivery||"Free delivery applicable"}</p>
                                :
                                <p> {lang.add||"add"} <span>{cart.currencySymbol}</span><span>{parseFloat(parseFloat(cart.freeDeliveryAbove).toFixed(2) - parseFloat(cart.storeUnitPrice).toFixed(2)).toFixed(2)}</span> {lang.for||"for"} <span className="freeDel">{lang.freeDeli||"Free Delivery"}</span></p>
                            }
                        </div>
                    </div>
                </div>
                {cart.products ? cart.products.map((product, index) =>
                    <div key={'cartlist' + index} className="col-12 py-3 border-bottom" style={{ background: '#fff', paddingBottom: "10px" }}>
                        <div className="row align-items-center pl-2">

                            <div className="col-2">
                                <img className="absolute-center"
                                    style={{ width: '50px', height: '50px' }}
                                    src={product.itemImageURL} />
                            </div>
                            <div className="col-7 pr-0">
                                <p className="cart-product oneLineSetter" title={product.itemName}>{product.itemName}</p>
                                <p className="oneLineDisplay" title={product.unitName} style={{ fontSize: '11px', color: '#999' }}>{product.unitName}</p>
                                {product.addOnAvailable ==
                                    1 ? (
                                        <a onClick={() => this.openEditAddOnDialog(product)} className="cart-product-desc cartCutBtn d-block">
                                            <span className="mx-0">customize</span>
                                        </a>
                                    ) : (
                                        ""
                                    )}
                            </div>
                            <div className="col-3 px-0 text-center">
                                <div className="align-items-center calculator-market">
                                    <div onClick={(event) => props.editCart(product, '', 1, event)} className="substract" ></div>
                                    <div className="qtyNum">{product.quantity}</div>
                                    <div className="addition" onClick={(event) => this.openOptionsDialog(product, 2, event)}>+</div>
                                </div>

                                {/* {product.finalPrice !== product.unitPrice ? <span className='oneLineSetter' style={{ fontSize: '9px', color: '#999', textDecoration: 'line-through' }}>{cart.currencySymbol} {parseFloat(product.unitPrice).toFixed(2)}</span> : ''} */}
                                <span className='oneLineSetter sliderCartPrice' style={{ fontSize: '11.5px', color: '#999', width: isMobile ? "70px" : "93px" }}><strong> {cart.currencySymbol || "€"} {parseFloat(product.unitPrice + product.addOnsPrice).toFixed(2)} </strong> </span>
                            </div>
                        </div>
                    </div>)
                    : ''}
            </div>
            // ) : ''
        )
    }

    openOptionsDialog(product, type, event) {
        product.addOnAvailable > 0 ?
            this.optionRef.openOptionsDialog(product) :
            this.props.editCart(product, '', type, event)
    }

    openEditAddOnDialog(cartProduct) {
        this.editRef.openProductDialog(cartProduct);
    }

    openAddOnDialog(addons) {
        this.dialogRef.openProductDialog(addons);
    }

    componentDidMount = () => {
        this.setState({ storesNotes: JSON.parse(localStorage.getItem(NOTES_VAR)) }, () => {

            setTimeout(() => {
                if (this.state.storesNotes) {
                    for (const key of Object.keys(this.state.storesNotes)) {
                        document.getElementById("cartSlider-" + key) ? document.getElementById("cartSlider-" + key).value = this.state.storesNotes[key] : ''
                    }
                }
            }, 1500);

        })
    }
    render() {
        const props = this.props;
        const currencySymbol = null;
        const {lang}  = this.props
        const windowWidth = this.props.windowWidth;

        return (
            <div>
                {props.myCart.cart ?
                    <div className="" style={{ background: '#f3f3f3' }}>
                        <div className="col-12 py-2 px-1" style={{ position: 'fixed', zIndex: '999', top: '0px', color: '#fff', background: '#282C3F', borderBottom: "1px solid #eee" }}>
                            <div className="col-12 py-1">
                                <div className="row px-3 align-items-center">

                                    <div className="col-10 px-0 text-left">
                                        <h6 className="innerPage-heading lineSetter">{lang.myCart||"My Cart "} {this.getCartItems(props.myCart.cart) > 0 ? " - " + this.getCartItems(props.myCart.cart) + " Items " : ''}</h6>
                                    </div>
                                    <div className="col-2 text-right">
                                        <IconButton onClick={props.handleClose} style={{ height: '30px', padding: '0px 12px', color: "#fff" }}>
                                            <img src='/static/images/updated/close-white.svg' width="15" />
                                            &times;
                                    </IconButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 scroller cartUi" style={{ overflowY: 'auto', height: windowWidth <= 576 ? 'calc(100vh - 60px - 73px)' : 'calc(100vh - 100px)' }}>
                            {/* mobile-hide */}
                            <div className="row mobile-hide">

                                {/* body */}
                                <div className="col" style={{ marginTop: '60px' }}>
                                    {props.myCart && props.myCart && props.myCart.cart.map((cart, index) =>
                                        cart.storeType == 1 ? this.getFoodCart(cart, index) :
                                            this.getGeneralCart(cart, index)
                                    )}

                                    <div className="row" >
                                        <div className="col py-2 px-3" style={{ background: '#fff' }}>
                                            {props.myCart.cartTotal && props.myCart.cartTotal > 0 ?
                                                <div className="row pr-2" >
                                                    <div className="col-6 text-left">{lang.subTotal||"Sub Total"}</div>
                                                    <div className="col-6 text-right"><span className='oneLineSetter'>{props.myCart.cart[0].currencySymbol} {parseFloat(props.myCart.cartTotal).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                                : ''}
                                            {props.myCart.exclusiveTaxes && props.myCart.exclusiveTaxes.length > 0 ?
                                                <div className="row pr-2" style={{ margin: '5px 0px' }} >
                                                    <div className="col-6 p-0 text-left" ><b>{lang.taxes||"Taxes"}</b></div>
                                                    <div className="col-12 p-0 my-2 text-left" style={{ fontSize: "13px", color: "rgb(104, 107, 120)" }} >
                                                        {props.myCart.exclusiveTaxes.map((tax, index) =>
                                                            <div className="row" key={'carttax' + index}>
                                                                {/* <div className="col-6 text-left"> */}

                                                                <div className="col-6 text-left" >{tax.taxtName} ({tax.taxValue + "%"})</div>
                                                                <div className="col-6 text-right"><span className='oneLineSetter'>{props.myCart.cart[0].currencySymbol} {parseFloat(tax.price).toFixed(2)}</span>
                                                                </div>
                                                            </div>)
                                                        }
                                                    </div>
                                                </div>
                                                : ''}


                                            {props.myCart.cartDiscount && props.myCart.cartDiscount > 0 ?
                                                <div className="row pr-2    ">
                                                    <div className="col-6 text-left">{lang.yourSaving||"Your Savings"}</div>
                                                    <div className="col-6 text-right "><span className='oneLineSetter'>- {props.myCart.cart[0].currencySymbol} {parseFloat(props.myCart.cartDiscount).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                                : ''}
                                        </div>
                                    </div>
                                </div>


                                {/* body */}
                                {/* pos-fix */}


                                <div className="cartPricenDeliverySectionBt" style={{ borderTop: '0.5px solid #ddd' }}>

                                    <div className="col-12 py-2" style={{ background: '#fff' }}>
                                        <div className="row pr-3 align-items-center">
                                            <div className="col-6 text-left finalTotalIncludingTaxesTag">{lang.total||"Total"}</div>
                                            <div className="col-6 text-right"><strong className="finalTotalIncludingTaxesTag " >{props.myCart.cart[0].currencySymbol} {parseFloat(props.myCart.finalTotalIncludingTaxes).toFixed(2)}</strong></div>
                                        </div>
                                    </div>

                                    <div className="col-12 px-4" style={{ background: '#fff' }}>
                                        <div className="row align-items-center">

                                            <div className="col-6 p-1 text-center">
                                                <RaisedButton className="w-100 customRaisedBtn" label={lang.selfPickup||"Self Pickup"||CART_PICKUP_BTN} secondary={true} buttonStyle={buttonBlue} overlayStyle={overlayStyle} labelStyle={lableFill}
                                                    onClick={() => props.setDeliveryType(2)}
                                                />
                                            </div>
                                            <div className="col-6 p-1 text-center">
                                                <RaisedButton className="w-100 customRaisedBtn" label={lang.requestDelivery||"Request Delivery"||CART_DELIVERY_BTN} secondary={true} buttonStyle={buttonGreen} overlayStyle={overlayStyle} labelStyle={lableFill}
                                                    onClick={() => props.setDeliveryType(1)}
                                                />
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                {/* pos-fix */}
                            </div>
                            {/* mobile-hide */}


                            {/* mobile-show */}
                            <div className="row mobile-show">


                                <div className="col" style={{ marginTop: '50px', marginBottom: '54px' }}>

                                    {props.myCart && props.myCart && props.myCart.cart.map((cart, index) =>
                                        cart.storeType == 1 ? this.getFoodCart(cart, index, true) :
                                            this.getGeneralCart(cart, index, true)
                                    )}



                                    <div className="row px-md-3">
                                        <div className="col py-2 px-3"
                                            style={{ background: props.myCart.cartDiscount && props.myCart.cartDiscount > 0 || props.myCart.exclusiveTaxes && props.myCart.exclusiveTaxes.length > 0 ? '#fff' : 'transparent' }}>
                                            {props.myCart.cartDiscount && props.myCart.cartDiscount > 0 ?
                                                <div className="row" >
                                                    <div className="col-6 text-left" >{lang.subTotal||"Sub Total"}</div>
                                                    <div className="col-6 text-right pr-2"><span className='oneLineSetter'>{props.myCart.cart[0].currencySymbol}{parseFloat(props.myCart.cartTotal).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                                : ''}
                                            {props.myCart.exclusiveTaxes && props.myCart.exclusiveTaxes.length > 0 ? props.myCart.exclusiveTaxes.map((tax, index) =>
                                                <div className="row" key={'carttax' + index}>
                                                    {/* <div className="col-6 text-left"> */}
                                                    <div className="col-6 text-left" >{tax.taxtName}</div>
                                                    <div className="col-6 text-right pr-2"><span className='oneLineSetter'>{props.myCart.cart[0].currencySymbol}{parseFloat(tax.price).toFixed(2)}</span>
                                                    </div>
                                                </div>)
                                                : ''}


                                            {props.myCart.cartDiscount && props.myCart.cartDiscount > 0 ?
                                                <div className="row">
                                                    <div className="col-6 text-left">{lang.yourSaving||"Your Savings"}</div>
                                                    <div className="col-6 text-right pr-2"><span className='oneLineSetter'>- {props.myCart.cart[0].currencySymbol}{parseFloat(props.myCart.cartDiscount).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                                : ''}
                                        </div>
                                    </div>
                                </div>


                                <div style={{ position: "fixed", bottom: "73px", width: "100%", background: "#fff", padding: "10px 0", zIndex: "9999" }}>
                                    <div className="col py-2 px-3"
                                    // style={{ position: 'fixed', borderTop: '0.5px solid #ccc', borderBottom: '0.5px solid #ccc', bottom: props.mobile ? "108px" : "0px", background: '#fff' }}
                                    >
                                        <div className="row" >
                                            <div className="col-6 text-left finalTotalIncludingTaxesTag" style={{ fontSize: '16px' }}>{lang.total||"Total"}</div>
                                            <div className="col-6 text-right">
                                                {/* cartTotal */}
                                                <strong className="finalTotalIncludingTaxesTag" >
                                                    {props.myCart.cart[0].currencySymbol}{parseFloat(props.myCart.finalTotalIncludingTaxes).toFixed(2)}</strong>

                                            </div>
                                        </div>
                                    </div>

                                    <div className="col px-4"
                                    // style={{ position: 'fixed', bottom: props.mobile ? "58px" : "0px", background: '#fff' }}
                                    >
                                        <div className="row" >

                                            <div className="col-6 p-2 text-center">
                                                <RaisedButton label={lang.selfPickup||"Self Pickup"||CART_PICKUP_BTN} overlayStyle={overlayStyle} secondary={true} style={style} buttonStyle={buttonMobileBlue} labelStyle={lableMobileFill}
                                                    onClick={() => props.setDeliveryType(2)}
                                                />
                                            </div>

                                            <div className="col-6 p-2 text-center">
                                                <RaisedButton label={lang.requestDelivery||"Request Delivery"||CART_DELIVERY_BTN} overlayStyle={overlayStyle} secondary={true} style={style} buttonStyle={buttonMobileGreen} labelStyle={lableMobileFill}
                                                    onClick={() => props.setDeliveryType(1)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* mobile-show */}
                        </div>
                    </div>
                    :
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 py-2 px-1" style={{ position: 'fixed', zIndex: '9', top: '0px', background: '#fff', borderBottom: "1px solid #eee" }}>
                                <div className="col-12">
                                    <div className="row align-items-center">
                                        <div className="col-2 pl-0">
                                            <IconButton onClick={props.handleClose} style={{ height: '30px', padding: '0px 12px' }}>
                                                <img src='/static/icons/Common/BackIcon.imageset/back_btn@2x.png' width="24" />
                                            </IconButton>
                                        </div>
                                        <div className="col-8 px-0 text-center">
                                            <h6 className="innerPage-heading lineSetter">{lang.myCart||"My Cart"}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 py-5 mt-5 text-center" style={{ height: '63.5vh', width: '100%' }}>
                                <img src="/static/icons/EmptyScreens/EmptyCart.imageset/empty_cart@3x.png" width='150' />
                            </div>
                            <div className="col-12 text-center ">
                                <RaisedButton label="Cart is empty" onClick={props.handleClose} secondary={true} style={style} buttonStyle={buttonBlue} />
                            </div>
                        </div>
                    </div>
                }


                {/* cart product management dialogs */}

                <EditAddOns
                    onRef={ref => (this.editRef = ref)}
                    showLoginHandler={this.showLoginHandler}
                    isAuthorized={true || this.props.isAuthorized}
                />

                <OptionsDialog
                    onRef={ref => (this.optionRef = ref)}
                    showLoginHandler={this.showLoginHandler}
                    openAddOnDialog={this.openAddOnDialog}
                    isAuthorized={true || this.props.isAuthorized}
                />

                <AddOnDialog
                    onRef={ref => (this.dialogRef = ref)}
                    showLoginHandler={this.props.showLoginHandler}
                    isAuthorized={true || this.props.isAuthorized}
                    currencySymbol={currencySymbol || "€"} myCart={this.props.myCart}
                />
            </div>
        )
    }

}

export default LanguageWrapper(CartContent);