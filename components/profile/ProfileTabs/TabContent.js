import React,{useContext} from 'react';
import Link from 'next/link'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import RaisedButton from 'material-ui/RaisedButton';
import * as moment from 'moment';

import ProductListMView from "../../producthome/ProductList/ProductListMView";
import Wrapper from '../../../hoc/wrapperHoc';
import * as ENV_VAR from '../../../lib/envariables'
import AddressList from '../../Adress/addressList';

import LanguageContext from "../../../context/languageContext"
const buttonStyleOutline = {
    width: '130px',
    color: ENV_VAR.BASE_COLOR + " !important",
    border: '1px solid ' + ENV_VAR.BASE_COLOR,
    background: '#fff'
}

const lableOutline = {
    fontSize: '13px',
    fontWeight: '700',
    color: ENV_VAR.BASE_COLOR,
    letterSpacing: '0.6px'
}

const SideBarTabContent =   (props) => {
    const { pastOrders, currentOrders, userAddress, favtProducts, offerProducts, listArray, city, currentLongAddress,currencySymbol } = props;
    const { classes } = props;

    const {lang} = useContext(LanguageContext)
    return (
        <Wrapper>
            <div className="col-12 col-md col-lg" id="ordersContentLayout">
                <div className="tab-content">
                    {/* orders  */}
                    <div className="tab-pane fade in show active" id="orders" role="tabpanel">
                        <div className="col-12 totLayoutResCom">
                            <ul className="nav nav-pills my-3 ordersContentLayoutOuterULClass" id="ordersContentLayoutOuterULId" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link active" id="pills-profile-tab" data-toggle="pill" href="#pills-profile" role="tab" aria-controls="pills-profile"
                                        aria-selected="false">{lang.activeOrder||"active orders"}</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link " id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab" aria-controls="pills-home"
                                        aria-selected="true">{lang.pastOrder||"past orders"}</a>
                                </li>
                            </ul>

                            <div className="tab-content" id="pills-tabContent">
                                {/* Past Orders Tab */}
                                <div className="tab-pane fade " id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                    <div className="pastOrdersLayout">
                                        <div className="accordion" id="accordionEx" role="tablist" aria-multiselectable="true">
                                            {props.pastOrders.length > 0 ? props.pastOrders.map((orderDetail, key) => {
                                                return (
                                                    <div key={"orderDetail" + key} className="card mb-lg-4 mb-2">
                                                        <div className="firstView" id="firstViewId">
                                                            <div className="card-header border pastOrdersHeaderLayout noPaddMobResCom" role="tab" id="headingOne">
                                                                <a data-toggle="collapse" href={"#moreDetailCollpase" + key} aria-expanded="true" aria-controls="collapseOne">
                                                                    <div className="col-12 py-2 pastOrdersHeaderLayoutFirstSection">
                                                                        <div className="row align-items-center">
                                                                            <div className="col-7 orderTimeAndItemIdLayout">
                                                                                <h6 className="orderTimeAndItemId">
                                                                                    {lang.placed||"Placed"} &nbsp;  {props.getFormatedDate(orderDetail.bookingDate)}
                                                                                </h6>
                                                                            </div>
                                                                            <div className="col-5 reorderAndDetailsButtonLayout">
                                                                                <div className="row justify-content-end">
                                                                                    <div className="col-auto">
                                                                                        <button className="form-control reOrd" onClick={(event) => props.handleReorder(event, orderDetail.orderId)}>
                                                                                            {lang.reorder||"REORDER"}
                                                                                                                                </button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                                <div className="col-12 py-lg-3 py-2 py-2 pastOrdersHeaderLayoutSecondSection">
                                                                    <div className="row align-items-center">
                                                                        <div className="col-3 cancelAndViewOrderedItemLayout">
                                                                            <span className="cancelAndViewOrderedItem">{orderDetail.statusMessage}</span>
                                                                        </div>
                                                                        <div className="col-sm-5 col-8">
                                                                            <div className="orderTitleLayout">
                                                                                <span className="">{orderDetail.storeName}</span>
                                                                                <span className="dotStatic">.</span>
                                                                                <span className="ml-2">
                                                                                    <span className="currency">
                                                                                        {orderDetail.currencySymbol}
                                                                                    </span>
                                                                                    <span className="">
                                                                                        {parseFloat(orderDetail.totalAmount).toFixed(2)}
                                                                                    </span>
                                                                                </span>
                                                                            </div>
                                                                            <h6 className="orderTimeAndItemId">
                                                                                <span className="orderIdStatic">{lang.orderId||"Order ID"}: </span>
                                                                                <span className="orderIdDyna">{orderDetail.orderId}</span>
                                                                            </h6>
                                                                        </div>
                                                                        <div className="col-sm-4 col-1 text-right cancelAndViewOrderedItem">
                                                                            <a className="viewOrderedItemsAnchor" id="viewOrderedItemsId" onClick={() => props.setOrderDetail(orderDetail)}>{lang.View||"View"} {orderDetail.items.length} {lang.itemOrder||"item ordered"}</a>
                                                                            <i className="fa fa-angle-right"></i>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div id={"moreDetailCollpase" + key} className="collapse border" role="tabpanel" aria-labelledby="headingOne" data-parent="#accordionEx">
                                                                <div className="card-body">
                                                                    <div className="col-12 ordersCardBodyLayout">
                                                                        <div className="row">
                                                                            <div className="col-12">
                                                                                {orderDetail.serviceType == 1 ?
                                                                                    <div className="row py-lg-3 py-2 border-bottom">
                                                                                        <div className="col-3">
                                                                                            <h6>{lang.deliveryAddress||"delivery address"}
                                                                                                                                    </h6>
                                                                                        </div>
                                                                                        <div className="col-9">
                                                                                            <p>
                                                                                                {orderDetail.dropAddress}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div> :
                                                                                    <div className="row py-lg-3 py-2 border-bottom">
                                                                                        <div className="col-3">
                                                                                            <h6>{lang.pickupAddress||"pickup address"}
                                                                                                                                    </h6>
                                                                                        </div>
                                                                                        <div className="col-9">
                                                                                            <p>
                                                                                                {orderDetail.pickAddress}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                }
                                                                                <div className="row py-lg-3 py-2 border-bottom">
                                                                                    <div className="col-3">
                                                                                        <h6>{lang.paymentt||"Payment"}</h6>
                                                                                    </div>
                                                                                    <div className="col-9">
                                                                                        <div className="row py-lg-2 py-1">
                                                                                            <div className="col-8">
                                                                                                <p>{lang.subTotal||"Subtotal"}</p>
                                                                                            </div>
                                                                                            <div className="col-4 text-right">
                                                                                                <div className="subTotalPriceLayout">
                                                                                                    <span className="currency">
                                                                                                        {orderDetail.currencySymbol}
                                                                                                    </span>
                                                                                                    <span className="">
                                                                                                        {parseFloat(orderDetail.subTotalAmount).toFixed(2)}
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        {orderDetail.serviceType == 1 ?
                                                                                            <div className="row py-lg-2 py-1 border-bottom">
                                                                                                <div className="col-8">
                                                                                                    <p>{lang.deliveryCharge||"Delivery Charges"}</p>
                                                                                                </div>
                                                                                                <div className="col-4 text-right">
                                                                                                    <div className="deliveryChargesPriceLayout">
                                                                                                        <span className="freeStatic">
                                                                                                            {orderDetail.deliveryCharge > 0 ? orderDetail.currencySymbol + parseFloat(orderDetail.deliveryCharge).toFixed(2) : lang.free||"Free"}
                                                                                                        </span>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div> : ''
                                                                                        }
        <div className="tushar">                                                              {props.selectedOrder&&props.selectedOrder.driverTip && props.selectedOrder.driverTip > 0 ? 
                                                                                <div className="d-flex justify-content-between">
                                                                                    <p className="totalCaption" >{"Driver Tips"}</p>
                                                                                    <p
                                                                                    className="totalCaption">{props.currencySymbol}{parseFloat(props.selectedOrder.driverTip).toFixed(2)}</p>
                                                                                </div>
                                                                            
                                                                                : ''}             </div>
                                                                                        <div className="tushar">                                                              {props.selectedOrder&&props.selectedOrder.convenienceFee && props.selectedOrder.convenienceFee > 0 ? 
                                                                                <div className="d-flex justify-content-between">
                                                                                    <p className="totalCaption" >{lang.ServiceFee||"Service fees"}</p>
                                                                                    <p
                                                                                    className="totalCaption">{props.currencySymbol}{parseFloat(props.selectedOrder.convenienceFee).toFixed(2)}</p>
                                                                                </div>
                                                                            
                                                                                : ''}             </div>                                                                                    {orderDetail.exclusiveTaxes && orderDetail.exclusiveTaxes.length > 0 ? orderDetail.exclusiveTaxes.map((tax, index) =>
                                                                                            <div className="row py-lg-2 py-1" key={'carttax-current' + index}>
                                                                                                {/* <div className="col-6 text-left"> */}
                                                                                                <div className="col-6 text-left" ><p>{tax.taxtName}</p></div>
                                                                                                <div className="col-6 text-right px-3 subTotalPriceLayout">
                                                                                                    <span className="currency">
                                                                                                        {orderDetail.currencySymbol}
                                                                                                    </span>
                                                                                                    <span className=''>{parseFloat(tax.price).toFixed(2)}</span>
                                                                                                </div>
                                                                                            </div>)
                                                                                            : ''}
                                                                                        <div className="row py-lg-2 py-1">
                                                                                            <div className="col-8">
                                                                                                <span className="payAmountDelivery">{lang.paidAmount||"paid amount"}
                                                                                                                                    </span>
                                                                                                <span className="inclusiveAllTaxes">({lang.allText||"incl. of all taxes"})
                                                                                                                                    </span>
                                                                                            </div>
                                                                                            <div className="col-4 text-right">
                                                                                                <div className="payableAmountPriceLayout">
                                                                                                    <span className="currency">
                                                                                                        {orderDetail.currencySymbol}
                                                                                                    </span>
                                                                                                    <span className="">
                                                                                                        {parseFloat(orderDetail.totalAmount).toFixed(2)}
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="row py-lg-3 py-2">
                                                                                    <div className="col-3">
                                                                                        <h6>{lang.bookingType||"Booking Type"}</h6>
                                                                                    </div>
                                                                                    <div className="col-9">
                                                                                        {/* <span className="payAmountDelivery">{orderDetail.bookingType == 1 ? 'Delivery' : 'Pick up from store'}</span> */}
                                                                                        {orderDetail.bookingType == 1 ?
                                                                                            <p style={{ fontWeight: 400, fontSize: "12px" }}>
                                                                                                <span>{lang.asapOrder||"ASAP Order"}</span>
                                                                                            </p> :
                                                                                            <p style={{ color: "#101010", fontSize: "12px", fontWeight: 400 }} className="">
                                                                                                <span>Scheduled on &nbsp;{props.getFormatedDate(orderDetail.dueDatetime)}</span>
                                                                                            </p>
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <a className="col-12 py-3 border text-center viewDynaUpNDownLayout" data-toggle="collapse" href={"#moreDetailCollpase" + key} aria-expanded="true"
                                                                aria-controls="collapseOne" onClick={()=>props.MoreDetails(orderDetail.orderId)}>
                                                                <h6 className="viewDynaUpNDown1 show">
                                                                    {lang.viewAddress||"view address and billing details"}
                                                                                                        <i className="fa fa-angle-down"></i>
                                                                </h6>
                                                                <h6 className="viewDynaUpNDown2">
                                                                    {lang.hideAddress||"Hide address and billing details"}
                                                                                                        <i className="fa fa-angle-up"></i>
                                                                </h6>
                                                            </a>
                                                        </div>
                                                    </div>
                                                )
                                            }) : <div className="row  text-center align-items-center " style={{ height: "78vh", overflowY: "auto" }}>
                                                    <div className="col-12 py-5 text-center">
                                                        <img src="/static/icons/EmptyScreens/EmptySearch.imageset/empty_products.png" width="150" height="120" className="img-fluid" alt="search" />
                                                        <p className="">{lang.noPastOrder||"No Past Orders Found!"}</p>
                                                    </div>
                                                </div>
                                            }
                                            {
                                                props.totalOrderCount == 10 ?
                                                    <div style={{ width: "100%", color: ENV_VAR.BASE_COLOR, cursor: "pointer" }} className="text-center">
                                                        <span className="viewOrderedItemsAnchor" onClick={() => props.handleOrderPaging()}>view more<i className="fa fa-angle-down"></i></span>
                                                    </div> : ''
                                            }
                                        </div>
                                    </div>
                                </div>

                                {/* Active Orders Tab    */}
                                <div className="tab-pane fade show active" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                                    <div className="pastOrdersLayout">
                                        <div className="accordion" id="accordionEx1" role="tablist" aria-multiselectable="true">
                                            {props.currentOrders && props.currentOrders.data && props.currentOrders.data.ordersArray ? props.currentOrders.data.ordersArray.map((orderDetail, key) => {
                                                return (
                                                    <div className="card mb-lg-4 mb-2" key={"activeOrderCard" + key}>
                                                        <div className="firstView" id="firstViewId">
                                                            <div className="card-header border pastOrdersHeaderLayout" role="tab" id="headingOne">

                                                                <div className="col-12 py-2 pastOrdersHeaderLayoutFirstSection">
                                                                    <div className="row align-items-center">
                                                                        <div className="col-7  col-md-6 col-lg-6 orderTimeAndItemIdLayout">
                                                                            <a data-toggle="collapse" href={"#moreDetailActive" + key} aria-expanded="true" aria-controls="collapseOne">
                                                                                <h6 className="orderTimeAndItemId">
                                                                                    Placed &nbsp;  {props.getFormatedDate(orderDetail.bookingDate)}
                                                                                    {/* <Moment format="ddd, D MMM, h:m A">
                                                                                                                                {orderDetail.bookingDate}
                                                                                                                            </Moment> */}
                                                                                </h6>
                                                                            </a>
                                                                        </div>
                                                                        <div className="col-5 col-md-6 col-lg-6 reorderAndDetailsButtonLayout">
                                                                            <div className="row justify-content-end">
                                                                                <div className="col-sm-auto px-sm-1">
                                                                                    <button className="form-control" onClick={() => props.handleTrackSliderOpen(orderDetail)}>
                                                                                        {lang.trackOrder||"TRACK ORDER"}
                                                                                                                            </button>
                                                                                </div>
                                                                                <div className="col-sm-auto px-sm-1">
                                                                                    {orderDetail.statusCode < 4 || orderDetail.statusCode >= 40 ?
                                                                                        <button className="form-control" onClick={() => props.handleReasonDialogOpen(orderDetail)}>
                                                                                            {lang.cancelOrderC||"CANCEL ORDER"}
                                                                                    </button> : ''
                                                                                    }
                                                                                </div>
                                                                                <div className="col-sm-auto px-sm-1">
                                                                                    <button className="form-control" onClick={() => props.handleHelpSliderOpen("DeskView")}>
                                                                                        {lang.help||"HELP"}
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div key={"pastOrdersHeaderLayoutSecondSectionactiveOrderCard" + key} className="col-12 py-lg-3 py-2 py-2 pastOrdersHeaderLayoutSecondSection">
                                                                    <div className="row align-items-center">
                                                                        <div className="col-3 cancelAndViewOrderedItemLayout">
                                                                            {/* statusMessage */}
                                                                            {props.notifications && props.notifications.bid == orderDetail.orderId ? <span className="cancelAndViewOrderedItem">{props.notifications.statusMessage ? props.notifications.statusMessage : orderDetail.statusMessage}</span> :
                                                                                <span className="cancelAndViewOrderedItem">{orderDetail.statusMessage}</span>
                                                                            }

                                                                        </div>
                                                                        <div className="col-sm-5 col-8">
                                                                            <div className="orderTitleLayout">
                                                                                <span className="">{orderDetail.storeName}</span>
                                                                                <span className="dotStatic">.</span>
                                                                                <span className="ml-2">
                                                                                    <span className="currency">
                                                                                        {orderDetail.currencySymbol}
                                                                                    </span>
                                                                                    <span className="">
                                                                                        {parseFloat(orderDetail.totalAmount).toFixed(2)}
                                                                                    </span>
                                                                                </span>
                                                                            </div>
                                                                            <h6 className="orderTimeAndItemId">
                                                                                <span className="orderIdStatic">{lang.orderId||"Order ID"}: </span>
                                                                                <span className="orderIdDyna">{orderDetail.orderId}</span>
                                                                            </h6>
                                                                        </div>
                                                                        <div className="col-sm-4 col-1 text-right cancelAndViewOrderedItem">
                                                                            <a className="viewOrderedItemsAnchor d-none d-lg-inline-block" id="viewOrderedItemsId" onClick={() => props.setOrderDetail(orderDetail)}>View {orderDetail.items.length} {lang.itemOrder||"item ordered"}</a>
                                                                            <i className="fa fa-angle-right"></i>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div id={"moreDetailActive" + key} className="collapse border" role="tabpanel" aria-labelledby="collpaseOne" data-parent="#accordionEx1">
                                                                <div className="card-body">
                                                                    <div className="col-12 ordersCardBodyLayout">
                                                                        <div className="row">
                                                                            <div className="col-12">
                                                                                {orderDetail.serviceType == 1 ?
                                                                                    <div className="row py-lg-3 py-2 border-bottom">
                                                                                        <div className="col-3">
                                                                                            <h6>{lang.deliveryAddress||"delivery address"}</h6>
                                                                                        </div>
                                                                                        <div className="col-9">
                                                                                            <p>
                                                                                                {orderDetail.dropAddress}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div> :
                                                                                    <div className="row py-lg-3 py-2 border-bottom">
                                                                                        <div className="col-3">
                                                                                            <h6>{lang.pickupAddress||"pickup address"}</h6>
                                                                                        </div>
                                                                                        <div className="col-9">
                                                                                            <p>
                                                                                                {orderDetail.pickAddress}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                }
                                                                                <div className="row py-lg-3 py-2 border-bottom">
                                                                                    <div className="col-3">
                                                                                        <h6>{lang.paymentt||"Payment"}</h6>
                                                                                    </div>
                                                                                    <div className="col-9">
                                                                                        <div className="row py-lg-2 py-1">
                                                                                            <div className="col-8">
                                                                                                <p>{lang.subTotal||"Subtotal"}</p>
                                                                                            </div>
                                                                                            <div className="col-4 text-right">
                                                                                                <div className="subTotalPriceLayout">
                                                                                                    <span className="currency">
                                                                                                        {orderDetail.currencySymbol}
                                                                                                    </span>
                                                                                                    <span className="">
                                                                                                        {parseFloat(orderDetail.subTotalAmount).toFixed(2)}
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="tushar">                                                              {props.selectedOrder&&props.selectedOrder.driverTip && props.selectedOrder.driverTip > 0 ? 
                                                                                <div className="d-flex justify-content-between">
                                                                                    <p className="totalCaption" >{"Driver Tips"}</p>
                                                                                    <p
                                                                                    className="totalCaption">{props.currencySymbol}{parseFloat(props.selectedOrder.driverTip).toFixed(2)}</p>
                                                                                </div>
                                                                            
                                                                                : ''}             </div>
                                                                                        <div className="tushar">                                                              {props.selectedOrder&&props.selectedOrder.convenienceFee && props.selectedOrder.convenienceFee > 0 ? 
                                                                                <div className="d-flex justify-content-between">
                                                                                    <p className="totalCaption" >{lang.ServiceFee||"Service fees"}</p>
                                                                                    <p
                                                                                    className="totalCaption">{props.currencySymbol}{parseFloat(props.selectedOrder.convenienceFee).toFixed(2)}</p>
                                                                                </div>
                                                                            
                                                                                : ''}             </div>                                                                                 {orderDetail.serviceType == 1 ?
                                                                                            <div className="row py-lg-2 py-1 border-bottom">
                                                                                                <div className="col-8">
                                                                                                    <p>{lang.deliveryCharge||"Delivery Charges"}
                                                                                                                                    </p>
                                                                                                </div>
                                                                                                <div className="col-4 text-right">
                                                                                                    <div className="deliveryChargesPriceLayout">
                                                                                                        <span className="freeStatic">
                                                                                                            {orderDetail.deliveryCharge > 0 ? orderDetail.currencySymbol + parseFloat(orderDetail.deliveryCharge).toFixed(2) : lang.free||"Free"}
                                                                                                        </span>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div> : ''
                                                                                        }
                                                                                        {/* <div className="row py-lg-2 py-1 border-bottom"> */}
                                                                                        {orderDetail.exclusiveTaxes && orderDetail.exclusiveTaxes.length > 0 ? orderDetail.exclusiveTaxes.map((tax, index) =>
                                                                                            <div className="row py-lg-2 py-1" key={'carttax-current' + index}>
                                                                                                {/* <div className="col-6 text-left"> */}
                                                                                                <div className="col-6 text-left" ><p>{tax.taxtName}</p></div>
                                                                                                <div className="col-6 text-right px-3 subTotalPriceLayout">
                                                                                                    <span className="currency">
                                                                                                        {orderDetail.currencySymbol}
                                                                                                    </span>
                                                                                                    <span className=''>{parseFloat(tax.price).toFixed(2)}</span>
                                                                                                </div>
                                                                                            </div>)
                                                                                            : ''}
                                                                                        {/* </div> */}
                                                                                        <div className="row py-lg-2 py-1">
                                                                                            <div className="col-8">
                                                                                                <span className="payAmountDelivery">{lang.payableAmount||"payable amount"}
                                                                                                                                 </span>
                                                                                                <span className="inclusiveAllTaxes">({lang.allText||"incl. of all taxes"})
                                                                                                                                         </span>
                                                                                            </div>
                                                                                            <div className="col-4 text-right">
                                                                                                <div className="payableAmountPriceLayout">
                                                                                                    <span className="currency">
                                                                                                        {orderDetail.currencySymbol}
                                                                                                    </span>
                                                                                                    <span className="">
                                                                                                        {parseFloat(orderDetail.totalAmount).toFixed(2)}
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="row py-lg-3 py-2">
                                                                                    <div className="col-3">
                                                                                        <h6>{lang.bookingType||"Booking Type"}
                                                                                                                             </h6>
                                                                                    </div>
                                                                                    <div className="col-9">
                                                                                        {/* <span className="payAmountDelivery">
                                                                                                                                    {orderDetail.bookingType == 1 ? 'Delivery' : 'Pick up from store'}
                                                                                                                                </span> */}
                                                                                        {orderDetail.bookingType == 1 ?
                                                                                            <p style={{ fontWeight: 400, fontSize: "12px" }} >
                                                                                                <span>ASAP Order</span>
                                                                                            </p> :
                                                                                            <p style={{ color: "#101010", fontSize: "12px", fontWeight: 400 }}>
                                                                                                <span>Scheduled on&nbsp; {props.getFormatedDate(orderDetail.dueDatetime)}</span>
                                                                                            </p>
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <a className="col-12 py-3 border text-center viewDynaUpNDownLayout" data-toggle="collapse" href={"#moreDetailActive" + key} aria-expanded="true"
                                                                aria-controls="collapseOne" onClick={()=>props.MoreDetails(orderDetail.orderId)}>
                                                                <h6 className="viewDynaUpNDown1 show">
                                                                    {lang.viewAddress||"view address and billing details"}
                                                                                                        <i className="fa fa-angle-down"></i>
                                                                </h6>
                                                                <h6 className="viewDynaUpNDown2">
                                                                    {lang.hideAddress||"Hide address and billing details"}
                                                                                                        <i className="fa fa-angle-up"></i>
                                                                </h6>
                                                            </a>
                                                        </div>
                                                    </div>
                                                )
                                            }) : <div className="row  text-center align-items-center " style={{ height: "78vh", overflowY: "auto" }}>
                                                    <div className="col-12 py-5 text-center">
                                                        <img src="/static/icons/EmptyScreens/EmptySearch.imageset/empty_products.png" width="150" height="120" className="img-fluid" alt="search" />
                                                        <p className="">{lang.noActive||"No Active Orders Found!"}</p>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>

                    {/* manage address */}
                    <div className="tab-pane fade" id="manageAddresses" role="tabpanel">
                        <div className="col-12 mt-lg-4 manageAddressLayout checkoutPaymentDetailsSec">
                            <h4 className="mb-lg-4 mb-3 manageAddressHeader">{lang.manageAddress||"Manage Addresses"}</h4>
                            <div className="col-12">
                                <div className="row justify-content-between">
                                    <div className="col-6">
                                        <div className="addNewnDeliverInner p-xl-3 p-lg-3 border">
                                            <div className="row">
                                                <div className="col-auto pr-0 homeAddressIconLayout">
                                                    <img src="/static/images/new_imgs/pin.svg" style={{ height: "20px", marginTop: "6px" }} />
                                                    {/* <img src="/static/images/grocer/addLoc.PNG" style={{ height: "20px", marginTop: "6px" }} /> */}
                                                </div>
                                                <div className="col pt-1 homeAddressInitialLayout">
                                                    <div style={{ fontSize: '15px', fontWeight: '500', textAlign: 'left', textTransform: 'capitalize', letterSpacing: '0.3px', marginBottom: '10px' }}>{lang.addNewAddress||"Add new Address"}</div>
                                                    <p className="addressBox" style={{ marginBottom: "1px" }}>{currentLongAddress}</p>
                                                    {/* <p className="addressBox" style={{ marginBottom: "1px" }}>{props.currentAddress}</p> */}
                                                    <RaisedButton
                                                        label={lang.addNew||"ADD NEW"}
                                                        disableTouchRipple={true}
                                                        disableFocusRipple={true}
                                                        primary={true}
                                                        onClick={props.opendrawer}
                                                        style={{ marginRight: 12, marginTop: 0, float: 'left' }}
                                                        buttonStyle={buttonStyleOutline}
                                                        labelStyle={lableOutline}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <AddressList addressList={props.userAddress} selectAddress={props.selectAddress}
                                        handleEditAdrSliderOpen={props.handleEditAdrSliderOpen} deleteAddress={props.deleteAddress} />
                                  
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* payments */}
                    <div className="tab-pane fade" id="payments" role="tabpanel">
                        <div className="col-12 mt-lg-4 paymentsProfileSec">
                            <div className="row align-items-center">
                                <div className="col">
                                    <h4 className="mb-lg-4 manageAddressHeader">{lang.payment||"Payments"}</h4>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 text-center mb-4 pb-4 border-bottom">
                                    <p className="priceCardTitle">{lang.currentCredit||"CURRENT CREDIT"}</p>
                                    <h1 className="priceCardBold">{currencySymbol} {props.walletDetail ? parseFloat(props.walletDetail.walletBalance).toFixed(2) : 0.00} </h1>
                                    <div className="">
                                        <span className="limitHolder">{lang.softLimit||"Soft limit"} :
                                                                                    <span className="limitTitle">{currencySymbol} {props.walletDetail ? parseFloat(props.walletDetail.walletSoftLimit).toFixed(2) : 0.00}</span>
                                        </span>
                                        <span className="limitHolder">{lang.hardLimit||"Hard limit"} :
                                                                                    <span className="limitTitle hardLimit">{currencySymbol} {props.walletDetail ? parseFloat(props.walletDetail.walletHardLimit).toFixed(2) : 0.00}</span>
                                        </span>
                                    </div>
                                    <button type="button" onClick={() => props.handleWalletHistorySlider(450)} className="btn btn-md btn-primary recTransBtnBt">{lang.recentTrasaction||"Recent Transactions "}</button>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-lg-6 col-sm-12 mb-sm-2">
                                            <div className="border p-4" style={{ height: "100%" }}>
                                                <div className="col-12">
                                                    <h5 className="payCardBtTitle">{lang.payUsingCard||"Pay using card"}</h5>
                                                </div>

                                                <form role="form" className="paymentsCardForm scroller paymentsCardFormScroller">


                                                    {props.customerCards ? props.customerCards.map((card, index) =>
                                                        <div className="col-12 cardPaymentsBt" key={"customdateRadio" + index}>
                                                            <input id={"profile-desk" + card.id} name="card_radio" onClick={() => props.setDefaultCard(card.id, card)} className="customradioMedium" type="radio" style={{ cursor: 'pointer' }} />

                                                            <label className="col-12" style={{ cursor: 'pointer' }} htmlFor={"profile-desk" + card.id}>
                                                                <div className="row align-items-center">
                                                                    <div className="col-2 p-0">
                                                                        <img width="30" src={props.determineCardTypeImage(card.brand)}></img>
                                                                    </div>

                                                                    <div className="col">
                                                                        <div className="row align-items-center">
                                                                            <div className="col-12">
                                                                                <div className="row align-items-center">
                                                                                    <div className="col-6 text-left">
                                                                                        <span className="cardNumbersComm">
                                                                                            {"**** " + card.last4}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="col-6 text-right">
                                                                                        <span style={{ fontSize: '10px', fontWeight: '400' }}>
                                                                                            {card.expMonth + "/" + card.expYear}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-2 p-0 delete" data-toggle="modal" data-target="#deleteCard">
                                                                        <i className="fa fa-trash-o text-danger" aria-hidden="true"></i>
                                                                    </div>
                                                                </div>

                                                            </label>

                                                        </div>) : ''
                                                    }
                                                </form>
                                                <div className="col-12">
                                                    <button type="button" onClick={() => props.handleAddCardSlider()} className="btn btn-block btn-default btnClsComm btnAddNewCardPayments">
                                                        {lang.AddNewCard||"Add New Card"}
                                                 </button>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-sm-12 mb-sm-2">
                                            <div className="border p-4">
                                                <h5 className="payCardBtTitle">
                                                    {lang.payAmount||"Pay amount"}
					                                                                    </h5>
                                                <form role="form" onSubmit={(event) => event.preventDefault()} className="paymentsCardForm">
                                                    <div className="form-group">
                                                        <span style={{ position: "absolute", top: "10px" }}>{currencySymbol}</span> <input type="text" placeholder={lang.enterAmount||"Enter Amount"} className="form-control rechargeWalletInput" onKeyDown={props.allowOnlyNumber} value={props.walletRechargeAmount} onChange={props.setRechargeAmt} id="walletAmount" />
                                                    </div>
                                                    {props.defaultCard ?
                                                        <button type="button" className="btn btn-block btn-default btnClsComm btnConfirmPayPayments"
                                                            data-toggle="modal" data-target="#confirmPayModal" title={props.walletRechargeAmount ? "" : "Amount should be greater than 0"} disabled={props.walletRechargeAmount ? false : true}>
                                                            {lang.confirmPay||"Confirm and Pay"}
					                                    </button> :
                                                        <button type="button" className="btn btn-block btn-default btnClsComm btnConfirmPayPayments customDisable"
                                                            title="Please select the card to recharge the wallet" disabled>
                                                            {lang.confirmPay||"Confirm and Pay"}
					                                    </button>
                                                    }
                                                </form>
                                            </div>
                                        </div>
                                        {/* Modal */}
                                        <div className="modal fade" id="confirmPayModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered" role="document">
                                                <div className="modal-content p-3">
                                                    <div className="modal-header py-0">
                                                        <h6 className="modal-title" id="exampleModalCenterTitle">{ENV_VAR.APP_NAME}</h6>
                                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <p className="paraText">{lang.clickOn||`Click on "Ok" to authorize`} {ENV_VAR.APP_NAME} {lang.rechargeWallate||"to recharge your wallet with"} {currencySymbol}{props.walletRechargeAmount}</p>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-default" data-dismiss="modal">{lang.cancell||"CANCEL"}</button>
                                                        <button type="button" data-dismiss="modal" className="btn btn-default okBtnConfirmPayment" onClick={props.rechargeWallet}>{lang.ok||"OK"}</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Modal */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* favourites */}
                    <div className="tab-pane fade" id="favourites" role="tabpanel">
                        <div className="col-12 mt-lg-4">
                            <div className="row align-items-center">
                                <div className="col">
                                    <h4 className="mb-lg-4 manageAddressHeader">{lang.fav||"Favourites"}</h4>
                                </div>
                            </div>
                            <div className="row align-items-center pb-4">
                                <div className="col-auto pt-1 pb-2 selected-store" style={{ cursor: 'pointer' }} onClick={props.LeftSliderMobileHandler}>
                                    <span style={{ color: ENV_VAR.BASE_COLOR }}>{lang.changeStore||"Change Store"}</span>
                                    <p style={{ marginTop: '-2px' }} className="mt-0">{props.selectedStore}</p>
                                </div>
                            </div>

                            {props.favtProducts && props.favtProducts.length > 0 ?
                                <div className="row px-3">
                                    {
                                        props.favtProducts.map((post, index) =>
                                            <ProductListMView
                                                className={"col-md-2 col-lg-4 col-xl-4"}
                                                post={post}
                                                currency={post.currencySymbol || props.currencySymbol}
                                                openProductDialog={props.openProductDialog}
                                                addToCart={props.addToCart}
                                                handleDetailToggle={
                                                    props.handleDetailToggle
                                                }
                                                editCart={props.editCart}
                                                index={index}
                                                total={props.favtProducts.length}
                                                cartProducts={props.cartProducts}
                                                cardStyle={{ padding: "10px 0px" }}
                                            />
                                        )}
                                </div>
                                :
                                <div className="row">
                                    <div className="col-12 py-4 text-center">
                                        <img src="/static/icons/EmptyScreens/EmptyFavourite.imageset/favourite@3x.png" width="150" height="100" />
                                        <p className="mt-2" style={{ fontWeight: 700 }}>{lang.noFav||"No favourite products found!"}</p>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>

                    {/* offers */}
                    <div className="tab-pane fade" id="offers" role="tabpanel">
                        <div className="col-12 mt-lg-4">

                            <div className="row align-items-center">
                                <div className="col">
                                    <h4 className="mb-lg-4 manageAddressHeader">{lang.offers||"Offers"}</h4>
                                </div>
                            </div>
                            <div className="row align-items-center pb-4">
                                <div className="col-auto pt-1 pb-2 selected-store" style={{ cursor: 'pointer' }} onClick={props.LeftSliderMobileHandler}>
                                    <span style={{ color: ENV_VAR.BASE_COLOR }}>{lang.changeStore||"Change Store"}</span>
                                    <p style={{ marginTop: '-2px' }} className="mt-0">{props.selectedStore}</p>
                                </div>
                            </div>
                            {props.offerProducts && props.offerProducts.length > 0 ?
                                <div className="row">
                                    {props.offerProducts.map((post, index) =>
                                        <Link href={`/offers?offerId=${post.offerId}&store=${props.selectedStoreId}&type=2`} as={`/offers/${post.name.replace(/%/g, 'percentage').replace(/,/g, '').replace(/& /g, '').replace(/ /g, '-')}`}>
                                            <div key={'product-container-' + index} className="col-12 col-xl-4 col-lg-4 col-md-6 col-sm-12 mx-sm-3 mx-md-0 mx-lg-0 mx-xl-0">
                                                <div className="card product-container p-1">

                                                    <div className="view offerlistview zoom mobile-hide">
                                                        <div className="animated-fast" key={index}>
                                                            <img src={post.images.image} height='250' className="img-fluid shine" alt={post.description} title={post.description} />
                                                        </div>
                                                    </div>

                                                    <div className="view zoom mobile-show" onClick={() => props.handleDetailToggle(post)}>
                                                        {parseInt(post.appliedDiscount) > 0 ?
                                                            <div className="promo-discount">{parseFloat(parseInt(post.appliedDiscount) * 100 / (post.priceValue)).toFixed(1)}%</div> :
                                                            ''
                                                        }
                                                        <a >
                                                            <div className="mask rgba-white-slight"></div>
                                                        </a>
                                                    </div>

                                                </div>
                                            </div>
                                        </Link>
                                    )}
                                </div>
                                :
                                <div className="row">
                                    <div className="col-12 py-4 text-center">
                                        <img src="/static/icons/EmptyScreens/EmptyOffer.imageset/offers@3x.png" width="150" height="100" />
                                        <p className="mt-2" style={{ fontWeight: 700 }}>{lang.noOffer||"No offers found."}</p>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>

                    {/* help center */}
                    <div className="tab-pane fade" id="helpSupport" role="tabpanel">
                        <div className="col-12 mt-lg-4">
                            <div className="row align-items-center pb-4">
                                <div className="col">
                                    <h4 className="manageAddressHeader">{lang.Tickets||"Tickets"}</h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-12" style={{ marginTop: "5%" }}>
                            {
                                props.ticketHistory && props.ticketHistory.data && props.ticketHistory.data.open && props.ticketHistory.data.open.length > 0 ?
                                    props.ticketHistory.data.open.map((ticket, index) =>
                                        <div className="card ticketCard" key={index}>
                                            <div className="card-body">
                                                <p className="ticketTitle"><i className="fa fa-ticket mx-3" aria-hidden="true"></i>{ticket.subject} - <span className={"ticketBadge mx-2" + " badge-danger"}>{lang.high||"High"}</span>   <span className="float-right" style={{ color: "#807e7e" }}>[{moment.unix(ticket.timeStamp).format("DD-MM-YYYY HH:mm a")}]</span></p>
                                                <div className="col-12 px-5">
                                                    <p className="ticketDesc">{ticket.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) :
                                    <div className="row">
                                        <div className="col-12 py-4 text-center">
                                            <img src={ENV_VAR.EMPTY_TICKETS} width="120" />
                                            <p className="mt-2" style={{ fontWeight: 700 }}>{lang.noTickitFound||"No Tickets found"}.</p>
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>

                    {/* wishlist */}
                    <div className="tab-pane fade" id="wishlist" role="tabpanel">
                        {/* test Wishlist */}
                        <div className="col-12 mt-lg-4">
                            <div className="row align-items-center pb-4">
                                <div className="col">
                                    <h4 className="manageAddressHeader">{lang.wishlist||"Wishlist"}</h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-12" style={{ marginTop: "5%" }}>
                            {
                                props.listArray && props.listArray.length > 0 ?
                                    props.listArray.map((listData, index) =>
                                        <ExpansionPanel expanded={props.selectedListIndex == index} onChange={() => props.handleListProducts(listData.listId, index)}>
                                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography className={classes.heading}>
                                                    {/* <i className="fa fa-list mx-3" aria-hidden="true"></i> */}
                                                    <img src="/static/images/wishlist-img.png" className="mx-3" height="20px" />
                                                    {listData.listName}
                                                </Typography>
                                            </ExpansionPanelSummary>
                                            <ExpansionPanelDetails>
                                                {
                                                    props.listProducts && props.listProducts.length > 0 ?
                                                        props.listProducts.map((post, index) =>
                                                            <ProductListMView post={post} className="col-lg-4 col-xl-4 px-1" currency={post.currencySymbol || props.currencySymbol} openProductDialog={props.openProductDialog} handleDetailToggle={props.handleDetailToggle} cartProducts={props.cartProducts}
                                                                editCart={props.editCart} addToCart={props.addToCart} index={index} removeWishlist={props.removeWishlist} delProduct={true} cardStyle={{ padding: "10px 0px" }} />

                                                        ) : ''}

                                            </ExpansionPanelDetails>
                                        </ExpansionPanel>
                                    ) : ''
                            }


                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}

export default SideBarTabContent;