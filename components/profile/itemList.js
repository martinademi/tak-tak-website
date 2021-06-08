import React from 'react'
import { Component } from 'react'
import Moment from 'react-moment';
import $ from 'jquery'
import Wrapper from '../../hoc/wrapperHoc'
import CustomSlider from '../ui/sliders/customSlider'
import LanguageWrapper from "../../hoc/language"
 class OrderSlider extends Component {
     lang= this.props.lang
    state = {
        SliderWidth: 0,
        open: true,
        selectedOrder: null,
        helpArray: [
            {
                "que": this.lang.q1||"I haven't received this order"
            },
            {
                "que": this.lang.q2||"Items are missing from my orders"
            },
            {
                "que": this.lang.q3||"Items are different from what I ordered"
            },
            {
                "que": this.lang.q4||"I have packaging or spilling with this order"
            },
            {
                "que": this.lang.q5||"I have recieved bad quality item"
            }
        ]
    }
    constructor(props) {
        super(props);
        this.handleRightSliderOpen = this.handleRightSliderOpen.bind(this);
    }
// your saving calculation
    calculateSaving = () => {
        let sum = 0;
        this.props.orderData && this.props.orderData.items && this.props.orderData.items.map((product) =>
            sum = sum + Number(parseFloat(product.appliedDiscount).toFixed(2)))
        return sum;
    }

    handleRightSliderOpen = () => { this.OrderSliderRef.handleLeftSliderToggle(); this.setState({ selectedOrder: this.props.orderData }) }
    handleClose = () => this.OrderSliderRef.handleLeftSliderClose();
    closeSlider = () => { }
    componentDidMount = () => this.props.onRef(this)

    render() {
        let serviceFees =this.props.orderValue && this.props.orderValue.data && this.props.orderValue.data.convenienceFee
        let driverTip = this.props.orderValue && this.props.orderValue.data && this.props.orderValue.data.driverTip
        let currencySymbol = this.props.orderData ? this.props.orderData.currencySymbol : ''
        let totalSaving = this.calculateSaving();
        return (
            <Wrapper>
                <CustomSlider onRef={ref => (this.OrderSliderRef = ref)}
                    // width={this.state.loginSliderWidth}
                    width={this.props.state.RightSliderWidth}
                    handleClose={this.closeSlider}
                >
                    <div className="col-12 viewOrderItemsBtSec border" style={{ background: '#fafafa', minHeight: '100vh' }}>

                        <div className="row">
                            <div className="col-12 py-3 mb-3" style={{ background: '#fff', borderBottom: "1px solid #eee" }}>
                                <div className="cartHead position-relative">
                                    <h5>{this.lang.orderDetail||"Order Details"}</h5>
                                </div>
                                <div className="closeDrawer">
                                    <a onClick={this.props.handleRightSliderClose}><img src="static/images/cross.svg" height="15" width="20" /></a>
                                </div>
                            </div>
                        </div>

                        {this.props.orderData ?
                            <div className="">
                                <div className="row" style={{ background: "#fff" }}>
                                    <div className="col-12">
                                        <div className="row justify-content-center">
                                            <div className="col-11">

                                                {/* pickNDropBtSec */}
                                                <div className="row">
                                                    <div className="col-12 px-4 py-3 pickNDropBtSec">
                                                        <div className="pickUpPointBt">
                                                            <i class="fa fa-map-marker pickNDropMarkBtComm"></i>
                                                            <span>
                                                                <strong style={{ color: '#444' }}>
                                                                    {this.props.orderData ? this.props.orderData.storeName : ''}
                                                                </strong>
                                                            </span>
                                                            <p className="pickNDropMarkBtPTagComm">
                                                                {this.props.orderData ? this.props.orderData.storeAddress : ''}
                                                            </p>
                                                        </div>
                                                        <div className="dropPointBt">
                                                            <i class="fa fa-home pickNDropMarkBtComm"></i>
                                                            <p className="pickNDropMarkBtPTagComm">
                                                                {this.props.orderData ? this.props.orderData.serviceType !== 2 ? this.props.orderData.dropAddress : this.props.orderData.pickAddress : ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* pickNDropBtSec */}

                                                {/* nav-pills */}
                                                <div className="row">
                                                    <div className="col-12 px-0">
                                                        <ul className="nav nav-pills ordersContentLayoutOuterULClass py-2" id="ordersContentLayoutOuterULId" role="tablist">
                                                            <li className="nav-item itemDetailTabs">
                                                                <a className="nav-link active" id="pills-details-tab" data-toggle="pill" href="#pills-details" role="tab" aria-controls="pills-profile"
                                                                    aria-selected="false">{this.lang.itemDetail||"Item Details"}</a>
                                                            </li>
                                                            <li className="nav-item itemDetailTabs">
                                                                <a className="nav-link " id="pills-help-tab" data-toggle="pill" href="#pills-help" role="tab" aria-controls="pills-home"
                                                                    aria-selected="true">{this.lang.helps||"Help"}</a>
                                                            </li>
                                                        </ul>
                                                        <div className="tab-content" id="pills-tabContent">
                                                            <div className="tab-pane fade show active pt-3" id="pills-details" role="tabpanel" aria-labelledby="pills-details-tab">
                                                                {
                                                                    this.props.orderData && this.props.orderData.items.map((itemDetail, index) =>
                                                                        <div className="row pr-3" style={{ borderBottom: "1px solid #eee" }} key={index}>
                                                                            <div className="col-12 orderedProdListBtSec">
                                                                                <div className="row pt-2 justify-content-end  align-items-center">
                                                                                    <div className="col-auto">
                                                                                        <img src={itemDetail.itemImageURL} width="40" height="40" alt="" />
                                                                                    </div>
                                                                                    <div className="col-6 mb-0 prdListBtInnerComm">
                                                                                        <p className="cart-product oneLineSetter" title={itemDetail.itemName}>
                                                                                            <span>{itemDetail.itemName}</span>
                                                                                        </p>
                                                                                        <p className="oneLineDisplay" title={itemDetail.unitName}>{itemDetail.unitName}</p>
                                                                                        {/* {totalSaving += itemDetail.appliedDiscount} */}
                                                                                    </div>
                                                                                    <div className="col-1 text-center prdListBtInnerComm mb-0">
                                                                                        <p style={{ fontWeight: 400, color: '#444', margin: "30% 0" }}>{itemDetail.quantity}</p>
                                                                                    </div>
                                                                                    <div className="col px-2 text-right prdListBtInnerComm mb-0">
                                                                                        {/* <p style={{ fontWeight: 600 }}>&#36;{itemDetail.finalPrice}</p> */}
                                                                                        <p style={{ fontWeight: 500, margin: "13% 0", color: '#444' }}>
                                                                                            {currencySymbol}{parseFloat(itemDetail.finalPrice).toFixed(2)}
                                                                                            {parseFloat(itemDetail.finalPrice).toFixed(2) < parseFloat(itemDetail.unitPrice).toFixed(2) ? <span className="product-price-before">{currencySymbol}{parseFloat(itemDetail.unitPrice).toFixed(2)}</span> : ''}
                                                                                        </p>
                                                                                    </div>

                                                                                    {itemDetail.addOnAvailable > 0 ?
                                                                                        <div className="col-10 px-0 afterOrderAddons mb-3">
                                                                                            {itemDetail.addOnAvailable > 0 && itemDetail.addOns && itemDetail.addOns.map((addOn, index) =>
                                                                                                addOn.addOnGroup && addOn.addOnGroup.map((addOnItem, itemKey) =>
                                                                                                    <div className="row" key={itemKey + "ordData-addons-" + index}>

                                                                                                        <div className="col-9">
                                                                                                            <p className="addOnName">{addOnItem.name}</p>
                                                                                                        </div>
                                                                                                        <div className="col-3">
                                                                                                            <p className="addOnPrice">{currencySymbol}{parseFloat(addOnItem.price).toFixed(2)}</p>
                                                                                                        </div>
                                                                                                    </div>

                                                                                                ))}
                                                                                        </div>
                                                                                        : ''}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                                {/* Sub Total */}
                                                                <div className="row">
                                                                    <div className="col-12 mobileViewOrderTotal" style={{ paddingRight: "25px" }}>
                                                                        <div className="row py-2">
                                                                            <div className="col-6">
                                                                                <p><span className="totalCaption">{this.lang.subTotal||"Sub Total"}</span></p>
                                                                            </div>
                                                                            <div className="col-6">
                                                                                <p><span className="float-right totalCaption"> {currencySymbol}{this.props.orderData ? parseFloat(this.props.orderData.subTotalAmount).toFixed(2) : 0.00}</span></p>
                                                                            </div>
                                                                        </div>
                                                                        {/* exclusiveTaxes */}
                                                                        <div style={{ fontSize: "12px" }}>
                                                                            {this.props.orderData.exclusiveTaxes && this.props.orderData.exclusiveTaxes.length > 0 ? this.props.orderData.exclusiveTaxes.map((tax, index) =>
                                                                                <div className="row" key={'carttax-current' + index}>
                                                                                    {/* <div className="col-6 text-left"> */}
                                                                                    <div className="col-6 text-left" ><p>{tax.taxtName}</p></div>
                                                                                    <div className="col-6 text-right px-3">
                                                                                        <span className="currency">
                                                                                            {currencySymbol}
                                                                                        </span>
                                                                                        <span className=''>{parseFloat(tax.price).toFixed(2)}</span>
                                                                                    </div>
                                                                                </div>)
                                                                                : ''}
                                                                        </div>
                                                                        {/* delivery Charge */}
                                                                        {this.props.orderData.deliveryCharge > 0 ?
                                                                            <div className="row py-2">
                                                                                <div className="col-6">
                                                                                    <p><span className="totalCaption">{this.lang.deliveryCharge||"Delivery Charges"}</span></p>
                                                                                </div>
                                                                                <div className="col-6">
                                                                                    <p><span className="float-right totalCaption"> {currencySymbol}{parseFloat(this.props.orderData.deliveryCharge).toFixed(2)}</span></p>
                                                                                </div>
                                                                            </div> : ''}
                                                                            
                                                                            {/* driver Tip */}
                                                                            {driverTip > 0 ?
    <div className="row py-2">
        <div className="col-6">
            <p><span className="totalCaption">{this.lang.DriverTip||"Driver Tip"}</span></p>
        </div>
        <div className="col-6">
            <p><span className="float-right totalCaption"> {currencySymbol}{parseFloat(driverTip).toFixed(2)}</span></p>
        </div>
    </div> 
     : ''}
     {/* service Fees */}
      {serviceFees > 0 ?
    <div className="row py-2">
        <div className="col-6">
            <p><span className="totalCaption">{this.lang.ServiceFee||"Service Fees"}</span></p>
        </div>
        <div className="col-6">
            <p><span className="float-right totalCaption"> {currencySymbol}{parseFloat(serviceFees).toFixed(2)}</span></p>
        </div>
    </div> 
     : ''}
                                                                        <hr />
                                                                        {/* Bill Total */}
                                                                        <div className="row py-1">
                                                                            <div className="col-6">
                                                                                <p><span className="totalCaption">{this.lang.billTotal||"Bill Total"}</span></p>
                                                                            </div>
                                                                            <div className="col-6">
                                                                                <p><span className="float-right totalCaption"> {currencySymbol}{this.props.orderData ? parseFloat(this.props.orderData.totalAmount).toFixed(2) : 0.00}</span></p>
                                                                            </div>
                                                                        </div>

                                                                    {/* paid by  */}
                                                                        <div className="row">
                                                                            <div className="col-12 py-1">
                                                                                {this.props.orderData && this.props.orderData.paidBy && this.props.orderData.paidBy.wallet && this.props.orderData.paidBy.wallet > 0.0 ?
                                                                                    <div className="mobileViewPayment">
                                                                                        <img src="/static/icons/TabBar/ProfileTab/Payment/Wallet.imageset/wallet (1).png" width="25" height="16" />
                                                                                        <span className="paymentMethod">{this.lang.paidByWallet||"Paid By Wallet"}</span><span className="float-right">{currencySymbol}{this.props.orderData ? parseFloat(this.props.orderData.totalAmount).toFixed(2) : 0.00}</span>
                                                                                    </div> :
                                                                                    this.props.orderData && this.props.orderData.paidBy && this.props.orderData.paidBy.card && this.props.orderData.paidBy.card > 0.0 ?
                                                                                        <div className="mobileViewPayment">
                                                                                            <img src="/static/icons/TabBar/ProfileTab/Payment/Add_new.imageset/credit-card (1).png" width="25" height="16" />
                                                                                            <span className="paymentMethod">{this.lang.paidByCard||"Paid By Card"}</span><span className="float-right">{currencySymbol}{this.props.orderData ? parseFloat(this.props.orderData.totalAmount).toFixed(2) : 0.00}</span>
                                                                                        </div> :
                                                                                        <div className="mobileViewPayment">
                                                                                            <img src="/static/icons/TabBar/ProfileTab/Payment/Cash.imageset/money (1).png" width="25" height="16" />
                                                                                            <span className="paymentMethod">{this.lang.paidByCash||"Paid By Cash"}</span><span className="float-right">{currencySymbol}{this.props.orderData ? parseFloat(this.props.orderData.totalAmount).toFixed(2) : 0.00}</span>
                                                                                        </div>
                                                                                }
                                                                            </div>
                                                                        </div>

                                                                        {/* total Saving */}
                                                                        {totalSaving > 0 ?
                                                                            <div className="row py-1">
                                                                                <div className="col-6">
                                                                                    <p><span className="totalCaption">{this.lang.totalSaving||"Total Savings"}</span></p>
                                                                                </div>
                                                                                <div className="col-6">
                                                                                    <p><span className="float-right totalCaption"> {currencySymbol}{parseFloat(totalSaving).toFixed(2)}</span></p>
                                                                                </div>
                                                                            </div> : ''
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* help content */}
                                                            <div className="tab-pane fade" id="pills-help" role="tabpanel" aria-labelledby="pills-help-tab">
                                                                {
                                                                    this.state.helpArray && this.state.helpArray.map((helpData, index) =>
                                                                        <div key={"helpDataIndex" + index} className="col-12 mt-lg-4 mt-1 p-1" style={{ background: "white" }}>
                                                                            <div className="row">
                                                                                <div className="col-12">
                                                                                    <h6 className="checkOutFeat" style={{ color: "black", fontWeight: 400 }} onClick={() => this.props.handleOrderQuery(helpData)}>{helpData.que}</h6>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* nav-pills */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> : ''
                        }

                    </div>
                </CustomSlider>

            </Wrapper>
        )
    }
}

export default LanguageWrapper(OrderSlider);