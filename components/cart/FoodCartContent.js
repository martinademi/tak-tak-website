import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import Router from "next/router";
import { IconButton } from 'material-ui';
import { BASE_COLOR } from '../../lib/envariables';


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


const pp = (data) => {
}

const getCartItems = (cart) => {
    let total = 0;
    cart && cart.map((item) => total += item.products.length)
    return total
}
const CartContent = (props) => (

    <div>

        {props.myCart.cart ?
            <div className="" style={{ background: '#f3f3f3' }}>
                <div className="col-12 py-2 px-1" style={{ position: 'fixed', zIndex: '999', top: '0px', color:'#fff', background: '#282C3F', borderBottom: "1px solid #eee" }}>
                    <div className="col-12 py-1">
                        <div className="row px-3 align-items-center">
                            
                            <div className="col-10 px-0 text-left">
                                <h6 className="innerPage-heading lineSetter">My Cart  {getCartItems(props.myCart.cart) > 0 ? " - " + getCartItems(props.myCart.cart) + " Items ": ''}</h6>
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
                <div className="col-12 scroller cartUi" style={{ overflowY: 'scroll', height: 'calc(100vh - 95px)' }}>
                    {/* mobile-hide */}
                    <div className="row mobile-hide">

                        {/* body */}
                        <div className="col" style={{ marginTop: '60px' }}>
                            {props.myCart.cart ? props.myCart.cart.map((cart, index) =>
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
                                            <div className="col-3 text-center">
                                                <strong className="cartStoreTotPrice"><span>{cart.currencySymbol} </span><span></span> {parseFloat(cart.storeTotalPrice).toFixed(2)}</strong>
                                            </div>
                                        </div>
                                        
                                        <div className="row px-3">
                                            <div className="col-12 free-delivery text-center">
                                                {cart.storeTotalPrice > cart.freeDeliveryAbove ?
                                                    <p>Free delivery applicable</p>
                                                    :
                                                    <p> add <span>{cart.currencySymbol}</span><span>{parseFloat(cart.freeDeliveryAbove - cart.storeTotalPrice).toFixed(2)}</span> for <span className="freeDel">Free Delivery</span></p>
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
                                                {/* <div className="col-3"> */}
                                                    {/* <div className="align-items-center calculator-market" style={{ display: 'flex', float: 'none', margin: '0px auto', padding: '0px', width: '100%' }}>
                                                        <button onClick={() => props.editCart(product, '', 1)} className="subtract" >-</button>
                                                        <div>{product.quantity}</div>
                                                        <button onClick={() => props.editCart(product, '', 2)}>+</button>
                                                    </div> */}
                                                    {/* <div className="text-center">
                                                        <button onClick={() => props.editCart(product, '', 1)} className="btn-qnty">-</button>
                                                        <span className="prod-qnty">{product.quantity}</span>
                                                        <button onClick={() => props.editCart(product, '', 2)} className="btn-qnty">+</button>
                                                    </div> */}
                                                {/* </div> */}
                                                {/* <div className="col-2 px-0 text-center">
                                                    <span className="cart-prod-prize">{cart.currencySymbol} {parseFloat(product.finalPrice).toFixed(2)}</span>
                                                </div> */}
                                                <div className="col-3 px-0 text-center">
                                                    <div className="align-items-center calculator-market">
                                                        <div onClick={(event) => props.editCart(product, '', 1, event)} className="substract" ></div>
                                                        <div className="qtyNum">{product.quantity}</div>
                                                        <div className="addition" onClick={(event) => props.editCart(product, '', 2, event)}>+</div>
                                                    </div>

                                                    {/* {product.finalPrice !== product.unitPrice ? <span className='oneLineSetter' style={{ fontSize: '9px', color: '#999', textDecoration: 'line-through' }}>{cart.currencySymbol} {parseFloat(product.unitPrice).toFixed(2)}</span> : ''} */}
                                                    <span className='oneLineSetter' style={{ fontSize: '11.5px', color: '#999' }}><strong> {cart.currencySymbol} {parseFloat(product.finalPrice).toFixed(2)} </strong> </span>
                                                </div>
                                            </div>
                                        </div>)
                                        : ''}

                                </div>
                            ) : ''
                            }

                            <div className="row" >
                                <div className="col py-2 px-3" style={{ background: '#fff' }}>
                                    {props.myCart.cartTotal && props.myCart.cartTotal > 0 ?
                                        <div className="row pr-2" >
                                            <div className="col-6 text-left" >Sub Total</div>
                                            <div className="col-6 text-right"><span className='oneLineSetter'>{props.myCart.cart[0].currencySymbol} {parseFloat(props.myCart.cartTotal).toFixed(2)}</span>
                                            </div>
                                        </div>
                                        : ''}
                                    {props.myCart.exclusiveTaxes && props.myCart.exclusiveTaxes.length > 0 ?
                                        <div className="row pr-2" style={{ margin: '5px 0px' }} >
                                            <div className="col-6 p-0 text-left" ><b>Taxes</b></div>
                                            <div className="col-12 p-0 my-2 text-left" style={{fontSize: "13px", color: "rgb(104, 107, 120)"}} >
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
                                            <div className="col-6 text-left">Your Savings</div>
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
                                    <div className="col-6 text-left finalTotalIncludingTaxesTag">Total</div>
                                    <div className="col-6 text-right"><strong className="finalTotalIncludingTaxesTag " >{props.myCart.cart[0].currencySymbol} {parseFloat(props.myCart.finalTotalIncludingTaxes).toFixed(2)}</strong></div>
                                </div>
                            </div>

                            <div className="col-12 px-4" style={{ background: '#fff' }}>
                                <div className="row align-items-center">

                                    <div className="col-6 p-1 text-center">
                                        <RaisedButton className="w-100 customRaisedBtn" label="Pick Up" secondary={true} buttonStyle={buttonBlue} overlayStyle={overlayStyle} labelStyle={lableFill}
                                            onClick={() => props.setDeliveryType(2)}
                                        />
                                    </div>
                                    <div className="col-6 p-1 text-center">
                                        <RaisedButton className="w-100 customRaisedBtn" label="Delivery" secondary={true} buttonStyle={buttonGreen} overlayStyle={overlayStyle} labelStyle={lableFill}
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
                        <div className="" style={{ marginTop: '50px', marginBottom: '54px' }}>
                            {props.myCart.cart ? props.myCart.cart.map((cart, index) =>
                                <div key={'cartno-' + index} className="col mb-2 p-0">
                                    <div className="col-12 cart-store-headers" style={{ background: '#fff', borderBottom: "0.5px solid #eee" }}>
                                        <div className="row align-items-center">
                                            <div className="col-3 text-center p-2">
                                                <img style={{ width: '45px', height: '45px', objectFit: 'cover', border: '1px solid #ddd' }} src={cart.storeLogo} />
                                            </div>
                                            <div className="col-9 px-2 padding15-Y">
                                                <div className="row align-items-center">
                                                    <div className="col-12 pl-0">
                                                        <h5 className="cart-title oneLineSetter">{cart.storeName}</h5>
                                                        <p className="cart-description oneLineSetter">{cart.storeAddress}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {cart.products ? cart.products.map((product, index) =>
                                        <div key={'cartlist' + index} className="col-12" style={{ background: '#fff' }}>
                                            <div className="row align-items-center">
                                                <div className="col-3 text-center p-2">
                                                    <a onClick={() => Router.push(`/details?id=${product.childProductId}`)} >
                                                        <img
                                                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                            src={product.itemImageURL} />
                                                    </a>
                                                </div>
                                                <div className="col-9 p-2">
                                                    <div className="row align-items-center">
                                                        <div className="col-12 pl-0">
                                                            <p className="cart-product twoLineDisplay lineSetter" title={product.itemName}>{product.itemName}</p>
                                                        </div>
                                                        <div className="col-12 pl-0">
                                                            <div className="row align-items-center">
                                                                <div className="col text-left pr-0">
                                                                    <p className='oneLineSetter' title={product.unitName} style={{ fontSize: '11.5px', color: '#999' }}>{product.unitName}</p>
                                                                </div>
                                                                <div className="col-3 px-1 text-right">
                                                                    <div className="align-items-center calculator-market" style={{ display: 'flex', float: 'none', margin: '0px auto', padding: '0px', width: '100%' }}>
                                                                        <button onClick={(event) => props.editCart(product, 1, event)} className="subtract" >-</button>
                                                                        <div style={{ fontSize: '11.5px' }}>{product.quantity}</div>
                                                                        <button onClick={(event) => props.editCart(product, 2, event)}>+</button>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3 text-right pl-0 pr-3">
                                                                    {product.finalPrice !== product.unitPrice ? <span className='oneLineSetter' style={{ fontSize: '9px', color: '#999', textDecoration: 'line-through' }}>{cart.currencySymbol} {parseFloat(product.unitPrice).toFixed(2)}</span> : ''}
                                                                    <span className='oneLineSetter' style={{ fontSize: '11.5px', color: '#999' }}><strong> {cart.currencySymbol} {parseFloat(product.finalPrice).toFixed(2)} </strong> </span>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>)
                                        : ''}

                                </div>
                            ) : ''
                            }

                            <div className="row px-3">
                                <div className="col py-2 px-3" style={{ background: '#fff' }}>
                                    {props.myCart.cartDiscount && props.myCart.cartDiscount > 0 ?
                                        <div className="row" >
                                            <div className="col-6 text-left" >Sub Total</div>
                                            <div className="col-6 text-right pr-2"><span className='oneLineSetter'>{props.myCart.cart[0].currencySymbol} {parseFloat(props.myCart.cartTotal).toFixed(2)}</span>
                                            </div>
                                        </div>
                                        : ''}
                                    {props.myCart.exclusiveTaxes && props.myCart.exclusiveTaxes.length > 0 ? props.myCart.exclusiveTaxes.map((tax, index) =>
                                        <div className="row" key={'carttax' + index}>
                                            {/* <div className="col-6 text-left"> */}
                                            <div className="col-6 text-left" >{tax.taxtName}</div>
                                            <div className="col-6 text-right pr-2"><span className='oneLineSetter'>{props.myCart.cart[0].currencySymbol} {parseFloat(tax.price).toFixed(2)}</span>
                                            </div>
                                        </div>)
                                        : ''}


                                    {props.myCart.cartDiscount && props.myCart.cartDiscount > 0 ?
                                        <div className="row">
                                            <div className="col-6 text-left">Your Savings</div>
                                            <div className="col-6 text-right pr-2"><span className='oneLineSetter'>- {props.myCart.cart[0].currencySymbol} {parseFloat(props.myCart.cartDiscount).toFixed(2)}</span>
                                            </div>
                                        </div>
                                        : ''}
                                </div>
                            </div>
                        </div>

                        <div>
                        <div className="col py-2 px-3" style={{ position: 'fixed', borderTop: '0.5px solid #ccc', borderBottom: '0.5px solid #ccc', bottom: props.mobile ? "108px" : "0px", background: '#fff' }}>
                            <div className="row" >
                                <div className="col-6 text-left" style={{ fontSize: '16px' }}>Total</div>
                                <div className="col-6 text-right">
                                    {/* cartTotal */}
                                    <strong className="finalTotalIncludingTaxesTag" >
                                        {props.myCart.cart[0].currencySymbol} {parseFloat(props.myCart.finalTotalIncludingTaxes).toFixed(2)}</strong>

                                </div>
                            </div>
                        </div>

                        <div className="col px-4" style={{ position: 'fixed', bottom: props.mobile ? "58px" : "0px", background: '#fff' }}>
                            <div className="row" >

                                <div className="col-6 p-2 text-center">
                                    <RaisedButton label="Pick Up" overlayStyle={overlayStyle} secondary={true} style={style} buttonStyle={buttonMobileBlue} labelStyle={lableFill}
                                        onClick={() => props.setDeliveryType(2)}
                                    />
                                </div>

                                <div className="col-6 p-2 text-center">
                                    <RaisedButton label="Delivery" overlayStyle={overlayStyle} secondary={true} style={style} buttonStyle={buttonMobileGreen} labelStyle={lableFill}
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
                                    <h6 className="innerPage-heading lineSetter">My Cart</h6>
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

    </div>
);

export default CartContent;