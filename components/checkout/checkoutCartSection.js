import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import orange from '@material-ui/core/colors/orange';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import { getCookie } from '../../lib/session';
import EditAddOns from "../FoodTheme/Dialog/editAddOn";
import OptionsDialog from "../FoodTheme/Dialog/optionsDialog";
import AddOnDialog from "../FoodTheme/Dialog/addOnDialog";
import { EXTRA_NOTES } from '../../lib/envariables';

const ExpansionPanel = withStyles({
    root: {
        border: '1px solid rgba(0,0,0,.125)',
        width: "100%",
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
    },
    expanded: {
        margin: 'auto',
    },
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
    root: {
        backgroundColor: '#fff',
        borderBottom: '0.5px solid rgba(0,0,0,.125)',
        marginBottom: 0,
        padding: 5,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(props => <MuiExpansionPanelSummary {...props} />);

ExpansionPanelSummary.muiName = 'ExpansionPanelSummary';

const ExpansionPanelDetails = withStyles(theme => ({
    root: {
        padding: theme.spacing.unit * 2,
    },
}))(MuiExpansionPanelDetails);


const styles = theme => ({
    colorSwitchBase: {
        color: orange[700],
        '&$colorChecked': {
            color: orange[800],
            '& + $colorBar': {
                backgroundColor: orange[800],
            },
        },
    },
    colorBar: {},
    colorChecked: {},
})

class CheckoutCart extends React.Component {
    constructor(props) {
        super(props);
        this.openAddOnDialog = this.openAddOnDialog.bind(this);
        this.openEditAddOnDialog = this.openEditAddOnDialog.bind(this);
    }
    state = {
        expanded: 'panel1',
        isPanelClicked: false
    }
    handleChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false, isPanelClicked: true
        });
    };
    getFloatSum = (a, b) => parseFloat(Number(a.valueOf()) + Number(b.valueOf())).toFixed(2);

    getPriceBasedOnCartType = (finalPrice, product, type) => {

        switch (type) {
            case "1":
                return this.getFloatSum(parseFloat(finalPrice).toFixed(2), parseFloat(product.addOnsPrice).toFixed(2))
            case "2":
                return parseFloat(finalPrice).toFixed(2)
        }
        // 1. for dining cart
        // 2. for grocery
    }
    getFinalPrice = (finalPrice, product) => {
        return this.getPriceBasedOnCartType(finalPrice, product, getCookie("categoryType"))
    }

    getGeneralCart = (cart) => {
        const props = this.props;

        return (

            <div className={cart.products && cart.products.length == 1 ? "row w-100" : "row"}>
                {/* cart products details */}
                {cart.products && cart.products.length == 1 ?
                    cart.products.map((product, index) =>
                        <div key={'cartlist' + index} className="col-12 py-2 pr-0 checkOutCart" style={{ background: '#fff', borderBottom: "1px solid #eee" }}>
                            <div className="row align-items-center">
                                <div className="col-8">
                                    <p style={{ fontSize: '11px' }} className="cart-product twoLineDisplay">{product.itemName}</p>
                                    <p className="cart-product-desc" style={{ fontSize: '10px', color: '#999' }}>{product.unitName}</p>
                                </div>
                                <div className="col-4 px-0 text-right">
                                   {product.outOfStock ?
                                    <div className="outOfStoke_wrapper">
                                        <p style={{color:"red",fontWeight:"500"}}>**Out Of Stock </p>
                                    </div>
                                    
                                    : <div className="align-items-center calculator-market" style={{ marginLeft: "calc(100% - 70px )" }}>
                                    <div onClick={() => this.props.editCart(product, '', 1)} className="substract" ></div>
                                    <div className="qtyNum">{product.quantity}</div>
                                    <div className="addition" onClick={() => this.props.editCart(product, '', 2)}>+</div>
                                </div>}
                                    <span className="cart-prod-prize">{cart.currencySymbol}{parseFloat(product.finalPrice).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    ) :
                    cart.products && cart.products.length > 1 ? cart.products.map((product, index) =>
                        <div key={'cartlist' + index} className="col-12 py-2 checkOutCart" style={{ background: '#fff', borderBottom: "1px solid #eee" }}>
                            <div className="row align-items-center">
                                <div className="col-8">
                                    <p style={{ fontSize: '11px' }} className="cart-product twoLineDisplay">{product.itemName}</p>
                                    <p className="cart-product-desc mt-1" style={{ fontSize: '10px', color: '#999' }}>{product.unitName}</p>
                                </div>
                                <div className="col-4 text-right">
                                    <div className="align-items-center calculator-market" style={{ marginLeft: "calc(100% - 70px )" }}>
                                        <div onClick={() => this.props.editCart(product, '', 1)} className="substract" ></div>
                                        <div className="qtyNum">{product.quantity}</div>
                                        <div className="addition" onClick={() => this.props.editCart(product, '', 2)}>+</div>
                                    </div>
                                    <p className="mt-1">
                                        <span className="cart-prod-prize">{cart.currencySymbol}{parseFloat(product.finalPrice).toFixed(2)}</span>
                                        {parseFloat(product.finalPrice).toFixed(2) < parseFloat(product.unitPrice).toFixed(2) ? <span className="product-price-before">{cart.currencySymbol} {parseFloat(product.unitPrice).toFixed(2)}</span> : ''}
                                    </p>
                                </div>
                            </div>
                        </div>)
                        : ''}
            </div>
        )
    }
// food cart product details
    getFoodCart = (cart) => {

        return (
            <div className={cart.products && cart.products.length == 1 ? "row w-100" : "row"}>
                {cart.products && cart.products.length == 1 ?
                    cart.products.map((product, index) =>
                        <div key={'cartlist' + index} className="col-12 py-2 pr-0 checkOutCart" style={{ background: '#fff', borderBottom: "1px solid #eee" }}>
                            <div className="row align-items-center">
                                <div className="col-8">
                                    <p style={{ fontSize: '11px' }} className="cart-product twoLineDisplay">{product.itemName}</p>
                                    {/* <p className="cart-product-desc" style={{ fontSize: '10px', color: '#999' }}>{product.unitName}</p> */}
                                    {product.addOnAvailable ==
                                        1 ? (
                                            <a onClick={() => this.openEditAddOnDialog(product)} className="cart-product-desc cartCutBtn d-block">
                                                <span className="mx-0">customize</span>
                                            </a>
                                        ) : (
                                            ""
                                        )}
                                </div>
                                <div className="col-4 px-0 text-right">
                                    <div className="align-items-center calculator-market" style={{ marginLeft: "calc(100% - 70px )" }}>
                                        <div onClick={() => this.props.editCart(product, '', 1)} className="substract" ></div>
                                        <div className="qtyNum">{product.quantity}</div>
                                        <div className="addition" onClick={() => this.openOptionsDialog(product, '', 2)}>+</div>
                                    </div>
                                    <span className="cart-prod-prize">{cart.currencySymbol}{parseFloat(product.unitPrice + product.addOnsPrice).toFixed(2)}</span>

                                </div>
                            </div>
                        </div>
                    ) :
                    cart.products && cart.products.length > 1 ? cart.products.map((product, index) =>
                        <div key={'cartlist' + index} className="col-12 py-2 checkOutCart" style={{ background: '#fff', borderBottom: "1px solid #eee" }}>
                            <div className="row align-items-center">
                                <div className="col-8">
                                    <p style={{ fontSize: '11px' }} className="cart-product twoLineDisplay">{product.itemName}</p>
                                    {/* <p className="cart-product-desc mt-1" style={{ fontSize: '10px', color: '#999' }}>{product.unitName}</p> */}
                                    {product.addOnAvailable ==
                                        1 ? (
                                            <a onClick={() => this.openEditAddOnDialog(product)} className="cart-product-desc cartCutBtn d-block">
                                                <span className="mx-0">customize</span>
                                            </a>
                                        ) : (
                                            ""
                                        )}
                                </div>
                                <div className="col-4 text-right">
                                    <div className="align-items-center calculator-market" style={{ marginLeft: "calc(100% - 70px )" }}>
                                        <div onClick={() => this.props.editCart(product, '', 1)} className="substract" ></div>
                                        <div className="qtyNum">{product.quantity}</div>
                                        <div className="addition" onClick={() => this.openOptionsDialog(product, '', 2)}>+</div>
                                    </div>
                                    <p className="mt-1">
                                        <span className="cart-prod-prize">{cart.currencySymbol}{parseFloat(product.finalPrice + product.addOnsPrice).toFixed(2)}</span>
                                    </p>
                                </div>
                            </div>
                        </div>)
                        : ''}
            </div>
        )
    }
// addons 
    openOptionsDialog(product, type, event) {
        product.addOnAvailable > 0 ?
            this.optionRef.openOptionsDialog(product) :
            this.props.editCart(product, '', type, event)
    }
// edit addons 
    openEditAddOnDialog(cartProduct) {
        this.editRef.openProductDialog(cartProduct);
    }

    openAddOnDialog(addons) {
        this.dialogRef.openProductDialog(addons);
    }

    preventAction = (event) => {
        event.stopPropagation();
    }

    render() {
        const { classes, myCart, selectedCoupon, deliveryFeesTotal, couponBenifit, currencySymbol } = this.props;
        const { expanded } = this.state;
        let deliveryType = parseFloat(getCookie("deliveryType"))
      
        return (
            myCart.cart ?
                <div className="row stickyCart" style={{ boxShadow: "0 2px 8px #d4d5d9" }}>

                    <div className="col-12 checkOutCartScrollBarSec">
                      {/* cart products details */}
                        {myCart.cart ? myCart.cart.map((cart, index) =>
                            <div key={'cartno-' + index} className={index == 0 ? "row borBtmCustomRow" : "row borBtmCustomRow mt-1"} style={{ overflowX: "hidden" }}>
                                <ExpansionPanel
                                    square
                                    expanded={expanded === cart.storeId || index == 0 && !this.state.isPanelClicked}
                                    onChange={this.handleChange(cart.storeId)}
                                >
                                    <ExpansionPanelSummary>
                                        <div className="row pl-4">
                                            <div className="col-12 py-2" style={{ background: '#fff' }}>
                                                <div className="row align-items-center">
                                                    <div className="col-2 pr-0">
                                                        <img className="absolute-center"
                                                            style={{ width: '50px', height: '50px', border: '1px solid #ddd' }} src={cart.storeLogo} />
                                                    </div>
                                                    <div className="col-6">
                                                        <h6 className="cart-title">{cart.storeName}</h6>
                                                        {/* <p className="cart-description">{cart.storeAddress.split(",")[0]}</p> */}
                                                        <p className="cart-description my-1">{cart.products.length} {this.props.locale.items}</p>
                                                    </div>
                                                    <div className="col-4 pr-0 text-right">
                                                        <h6 className="">{cart.currencySymbol}{parseFloat(cart.storeUnitPrice).toFixed(2)}</h6>
                                                        <p className="cart-description my-1">Details</p>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="col-12 mt-3 px-0">
                                                <div className="notesCont" onClick={this.preventAction}>
                                                    <input type="text" style={{ boxShadow: "none" }} placeholder={this.props.locale.Addextranotes} className="extraNotesBox" id={"cartSlider-" + cart.storeId} onChange={this.props.handleCartNotes} />
                                                </div>
                                            </div>
                                        </div>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        {/* <div className={cart.products && cart.products.length == 1 ? "row w-100" : "row"}>
                                            {cart.products && cart.products.length == 1 ?
                                                cart.products.map((product, index) =>
                                                    <div key={'cartlist' + index} className="col-12 py-2 pr-0 checkOutCart" style={{ background: '#fff', borderBottom: "1px solid #eee" }}>
                                                        <div className="row align-items-center">
                                                            <div className="col-8">
                                                                <p style={{ fontSize: '11px' }} className="cart-product twoLineDisplay">{product.itemName}</p>
                                                                <p className="cart-product-desc" style={{ fontSize: '10px', color: '#999' }}>{product.unitName}</p>
                                                            </div>
                                                            <div className="col-4 px-0 text-right">
                                                                <div className="align-items-center calculator-market" style={{ marginLeft: "calc(100% - 70px )" }}>
                                                                    <div onClick={() => this.props.editCart(product, '', 1)} className="substract" ></div>
                                                                    <div className="qtyNum">{product.quantity}</div>
                                                                    <div className="addition" onClick={() => this.props.editCart(product, '', 2)}>+</div>
                                                                </div>
                                                                <span className="cart-prod-prize">{cart.currencySymbol}{parseFloat(product.finalPrice).toFixed(2)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) :
                                                cart.products && cart.products.length > 1 ? cart.products.map((product, index) =>
                                                    <div key={'cartlist' + index} className="col-12 py-2 checkOutCart" style={{ background: '#fff', borderBottom: "1px solid #eee" }}>
                                                        <div className="row align-items-center">
                                                            <div className="col-8">
                                                                <p style={{ fontSize: '11px' }} className="cart-product twoLineDisplay">{product.itemName}</p>
                                                                <p className="cart-product-desc mt-1" style={{ fontSize: '10px', color: '#999' }}>{product.unitName}</p>
                                                            </div>
                                                            <div className="col-4 text-right">
                                                                <div className="align-items-center calculator-market" style={{ marginLeft: "calc(100% - 70px )" }}>
                                                                    <div onClick={() => this.props.editCart(product, '', 1)} className="substract" ></div>
                                                                    <div className="qtyNum">{product.quantity}</div>
                                                                    <div className="addition" onClick={() => this.props.editCart(product, '', 2)}>+</div>
                                                                </div>
                                                                <p className="mt-1">
                                                                    <span className="cart-prod-prize">{cart.currencySymbol}{parseFloat(product.finalPrice).toFixed(2)}</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>)
                                                    : ''}
                                        </div> */}
                                        {cart.storeType == 1 ? this.getFoodCart(cart) :
                                            this.getGeneralCart(cart)}
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            </div>
                        ) : ''
                        }
                    </div>
                 {/* apply coupon  */}
                    <div className="col-12 px-4 py-2 mt-1" style={{ background: '#fff', borderTop: "1px solid #eee" }}>
                        <div className="col p-0" >
                            <div className="row justify-content-center">
                                {selectedCoupon ?
                                    <div className="applyCpnNew">
                                        <div className="col-11 text-left pt-1">
                                            <p><b><span className="text-success">{" " + selectedCoupon.code + " "}</span>({myCart.cart[0].currencySymbol + "" + parseFloat(selectedCoupon.discount.value).toFixed(2) + "/-  off"})</b></p>
                                        </div>
                                        <div className="col-1 pt-1"><a onClick={this.props.clearCoupon} style={{ float: "right" }}><img src="https://d2qb2fbt5wuzik.cloudfront.net/iserve_goTasker/images/deleteIcon.svg" height="14" width="14" /></a> </div>
                                    </div> :
                                    <div className="applyCpnNew" onClick={() => this.props.handleCouponLeftSlider()}>
                                        <img src="/static/images/updated/percentage.svg" height="30px" />
                                        <span className="ml-1">{this.props.locale.applyCopun}</span>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    {/* tip function */}
                    {deliveryType==1 ?
                    <div className="tipFuction" style={{width:"100%",background:"white"}}>
                        
                        <div className="differentValue">
                            <div className="d-flex " style={{paddingLeft:"25px",justifyContent:"space-between",paddingRight:"30px"}}>
                              
                                 <p style={{fontWeight:"600",fontSize:"12px"}}> {this.props.locale.DriverTip}</p>
                                <div className="d-flex">
                                {this.props.tipValueDefault ? 
                                this.props.tipValueDefault &&this.props.tipValueDefault.data && this.props.tipValueDefault.data.map(data=>{
                                    return (
                                       <p style={{paddingRight:"20px",cursor:"pointer"}} onClick={()=>
                                    this.props.handleTipFun(data.tipValue)}>{data.tipValue} {myCart.cart[0].currencySymbol}</p>
                                    )
                                })
                                
                               
                                :""}
                                <p>{myCart.cart[0].currencySymbol}</p>
                                <input type="number" className="textTipfiled" style={{width: "70px",
    border: "none",
    borderBottom: "1px solid"}} onChange={this.props.handleTip} min="0" value={this.props.driverTip}/>
    </div>
                            </div>
                        </div>
                    </div>
:""}
                    <div className="col-12 pt-2 px-4" style={{ background: '#fff', fontSize: "13px", color: "#686b78" }}>
                        <p className="billDetCap">
                            {this.props.locale.BillDetails}
                        </p>
                    </div>

                    <div className="col py-2 px-4" style={{ background: '#fff', fontSize: "13px", color: "#686b78" }}>
                       {/* subTotal */}
                        {myCart.cartDiscount && myCart.cartDiscount > 0 ?
                            <div className="row my-1" >
                                <div className="col-6 text-left" >{this.props.locale.subTotal}</div>
                                <div className="col-6 text-right px-3"><span className='oneLineSetter'>{myCart.cart[0].currencySymbol} {parseFloat(myCart.cartTotal).toFixed(2)}</span>
                                </div>
                            </div>
                            : ''}
                 {/* service fees */}
<div className="checkoutTaxes  d-flex pb-2">
                        <div className="col-6 text-left p-0" >{this.props.locale.ServiceFee}</div>
                            {/* {this.props.fareDetails && this.props.fareDetails.length > 0 ? */}
                                    
                                   
                            <div className="col-6 text-right p-0"><span className='oneLineSetter'>+ {myCart.cart[0].currencySymbol}  {this.props.serviceFees}</span>
                                    </div>
            
                            
                        </div>
                        {/* driver tip */}
                        {this.props.driverTip && this.props.driverTip > 0 ?
                            <div className="col-12 py-1 px-0" style={{ background: '#fff', borderTop: "1px solid #eee" }}>
                                <div className="row my-1" >
                                    <div className="col-6 text-left">{this.props.locale.DriverTip} </div>
                                    <div className="col-6 text-right">+ {myCart.cart[0].currencySymbol} {parseFloat(this.props.driverTip).toFixed(2)}</div>
                                </div>
                            </div>
                            : ''}
                           {/* exclusive taxes  */}
                        <div className="checkoutTaxes pl-2">
                            {myCart.exclusiveTaxes && myCart.exclusiveTaxes.length > 0 ? myCart.exclusiveTaxes.map((tax, index) =>
                                <div className="row my-1" key={'carttax' + index}>
                                    {/* <div className="col-6 text-left"> */}
                                    <div className="col-6 text-left" >{tax.taxtName}</div>
                                    <div className="col-6 text-right px-3"><span className='oneLineSetter'>+ {myCart.cart[0].currencySymbol} {parseFloat(tax.price).toFixed(2)}</span>
                                    </div>
                                </div>)
                                : ''}
                        </div>
                           {/* delivery fees */}
                        {/* {deliveryFeesTotal && deliveryFeesTotal > 0 ? */}
                            <div className="col-12 py-1 px-0" style={{ background: '#fff', borderTop: "1px solid #eee" }}>
                                <div className="row my-1" >
                                    <div className="col-6 text-left">{this.props.locale.deliveryCharge}</div>
                                    <div className="col-6 text-right">+ {myCart.cart[0].currencySymbol} {deliveryFeesTotal}</div>
                                </div>
                            </div>
                            {/* // : ''} */}
                    </div>
                    {/* total */}
                    <div className="col-12 py-2 px-4" style={{ background: '#fff' }}>
                        <div className="row align-items-center">
                            <div className="col-6 text-left finalTotalIncludingTaxesTag">Total</div>
                            <div className="col-6 text-right"><strong className="finalTotalIncludingTaxesTag " >
                            {myCart.cart[0].currencySymbol} {couponBenifit ?
                                    parseFloat(parseFloat(this.props.driverTip||0) +parseFloat(this.props.serviceFees||0)+parseFloat(deliveryFeesTotal)+parseFloat(myCart.finalTotalIncludingTaxes) - parseFloat(couponBenifit.discountAmount)).toFixed(2) :
                                    parseFloat(parseFloat(this.props.driverTip||0) +parseFloat(this.props.serviceFees||0)+parseFloat(deliveryFeesTotal)+parseFloat(myCart.finalTotalIncludingTaxes)).toFixed(2)}</strong></div>
                        </div>
                    </div>
                     {/* your saving  */}
                    {myCart.cartDiscount && myCart.cartDiscount > 0 ?
                        <div className="col-12 px-4 py-2 mt-1" style={{ background: '#fff', borderTop: "1px solid #eee" }}>
                            <div className="row my-1">
                                <div className="col-6 text-left">{this.props.locale.yourSaving}</div>
                                <div className="col-6 text-right px-3"><span className='oneLineSetter'> {myCart.cart[0].currencySymbol} {couponBenifit ? this.props.getFloatSum(myCart.cartDiscount, couponBenifit.discountAmount) : parseFloat(myCart.cartDiscount).toFixed(2)}</span>
                                </div>
                            </div>
                        </div> : ''
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
                : <div>




                </div>
        )
    }
}

export default withStyles(styles)(CheckoutCart)