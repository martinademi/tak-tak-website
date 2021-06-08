import React from 'react';
// import FontIcon from 'material-ui/FontIcon';
// import Link from 'next/link';
import { connect } from 'react-redux'
import { redirectIfNotAuthenticated, deleteAllCookies } from "../lib/auth"
import BottomSlider from '../components/ui/sliders/bottomSlider';
import { getCustomerOrders, reorderItem, getOrderDetail } from '../services/profileApi';
import { getCancelReasons } from "../services/cart";
import { cancelOrder } from '../services/cart';
import { setCookie, getCookiees, getCookie } from '../lib/session'
import Moment from 'react-moment';
import * as moment from 'moment';
import Router from "next/router";
import Dialog from 'material-ui/Dialog';
import Wrapper from '../hoc/wrapperHoc';
import HelpSlider from "../components/profile/help";
import * as actions from '../actions/index'
import CircularProgressLoader from '../components/ui/loaders/circularLoader';
import LiveTrackSlider from "../components/mobileViews/liveTrack";
import $ from 'jquery'
import LabelBottomNavigation from '../components/footer/BottomNavigation'
import redirect from '../lib/redirect';
import Authmodals from '../components/authmodals';
import RatingSlider from '../components/profile/rating';
import { IconButton } from 'material-ui';
import { BASE_COLOR } from '../lib/envariables';

// this component for the mobile view 
class OrderHistory extends React.Component {


    static async getInitialProps({ ctx }) {

        let authorized = await getCookiees("authorized", ctx.req);
        if (redirectIfNotAuthenticated(ctx)) {
            return {};
        }
        return { authorized }
    }

    state = {
        pastOrders: [],
        currentOrders: [],
        totalOrderCount: '',
        SliderWidth: "100%",
        selectedOrder: null,
        selectedOrderForTrack: null,
        helpArray: [
            {
                "que": "I haven't received this order"
            },
            {
                "que": "Items are missing from my orders"
            },
            {
                "que": "Items are different from what I ordered"
            },
            {
                "que": "I have packaging or spilling with this order"
            },
            {
                "que": "I have recieved bad quality item"
            }
        ],
        selectedHelpQue: null,
        open: false,
        reasonArray: null,
        selectedReason: "",
        ordercancelErr: null
    }
    constructor(props) {
        super(props);
        this.closeDrawer = this.closeDrawer.bind(this)
        this.showPastOrders = this.showPastOrders.bind(this)
        this.showActiveOrders = this.showActiveOrders.bind(this)
    }

    opendrawer() {
        this.getOrders();
        this.child.clickToggle()
    }
    closeDrawer() {
        // Router.back();
        Router.push("/");
    }
    handleHelpSlider = () => {
        // this.closeDrawer();
        this.HelpRef.handleLeftSliderOpen()
    }
    // to get order details 
    handleOrderDetail = (orderDetail) => {
       
        this.setState({ loading: false, selectedOrder: orderDetail })
        this.OrderDetailRef.clickToggle();
        getOrderDetail(orderDetail.orderId)
            .then(({ data }) => {
               
                data.error ? "" : this.setState({ selectedOrder123: data.data, loading: false })
            })
    }
    handleOrderDetailClose = () => this.OrderDetailRef.closeDrawer();
   // reorder
    handleReorder = (orderId) => {
        let orderDetail = {
            orderId: orderId
        }
        reorderItem(orderDetail)
            .then(({ data }) => {
                data.error ? "" :
                    (
                        this.props.dispatch(actions.getCart()),
                        redirect("/cart")
                        // this.props.showCart()
                    )
            })
    }
// cancel order function
    callCancelOrder = (id) => {

        this.setState({ loading: true })
        let dataReq = {
            orderId: id,
            latitude: Number(getCookie("lat", '')),
            longitude: Number(getCookie("long", '')),
            ipAddress: '54.183.192.28',
            reason: this.state.selectedReason.toString()
        }

        // this.handleReasonDialogOpen();

        cancelOrder(dataReq)
            .then((data) => {
               
                data.error ? (this.setState({ ordercancelErr: true, loading: false }), (setTimeout(() => {
                    // this.handleReasonDialogClose()
                }, 4000))) :
                    (
                        // this.props.dispatch(actions.getCart())
                        this.setState({ loading: false }),
                        this.getOrders(), this.handleReasonDialogClose(), this.handleOrderDetailClose()
                    )
            })

    }
// cancel reason dialog
    handleReasonDialogOpen = () => this.setState({ open: true, ordercancelErr: null, selectedReason: null })
    handleReasonDialogClose = () => this.setState({ open: false })

    handleOrderQuery = (helpQuestion) => {
        this.HelpRef.handleTicketDrawer(helpQuestion.que);
    }
    // track order
    handleTrackOrder = (orderDetail) => {
        this.setState({ selectedOrderForTrack: orderDetail })
        this.LiveTrackRef.handleLeftSliderOpen(orderDetail);
    }

    // number to ddd, D MMM, h:m A formate
    getFormatedDate = (date) => {
        // let UTCTime = moment().format("Z")
        return moment(date).add(moment().utcOffset(), 'm').format('ddd, D MMM, h:m A').toString()
    }
    // number to h:mm A formate
    getFormatedTime = (date) => {
        // let UTCTime = moment().format("Z")
        return moment(date).add(moment().utcOffset(), 'm').format('h:mm A').toString()
    }
 // inatail get order
    getOrders = () => {
        this.setState({ loading: true })

        let orderData = {
            pageIndex: 0,
            type: 1
        }

        getCustomerOrders(orderData).then((data) => {
            
            data.error ? this.setState({ showPastEmpty: true, loading: false, pastOrders: [] }) : this.setState({ pastOrders: data.data.data.ordersArray, loading: false })
        })

        orderData["type"] = 2; // changing order type from past order to active orders

        getCustomerOrders(orderData).then((data) => {
          
            data.error ? this.setState({ showCurrentEmpty: true, loading: false, currentOrders: [] }) : this.setState({ currentOrders: data.data, loading: false })
        })
    }
    getCancelReasons = () => {
        getCancelReasons().then((data) => {
            
            data.error ? '' : this.setState({ reasonArray: data.data.data })
        })
    }
    setCancelData = (reason) => this.setState({ selectedReason: reason.reasons })
    componentDidMount() {
        this.getOrders();
        this.getCancelReasons();
        this.props.dispatch(actions.getCart());
        this.props.dispatch(actions.getProfile());

        let sid = getCookie('sid');
        let mqttTopic = localStorage.getItem('dlvMqtCh');
        this.child.mqttConnector(sid, mqttTopic);
    }

    componentWillReceiveProps(newProps) {
        
        this.setState({ orderMqttData: newProps.notifications })
        if (this.props.notifications && (this.props.notifications.bid == newProps.notifications.bid)) {
            let orderData = {
                pageIndex: 0,
            }
            orderData["type"] = 2;
            getCustomerOrders(orderData).then(({ data }) => {
             
                data.error ? '' :
                    (this.setState({ currentOrders: data }),
                        this.state.selectedOrderForTrack && data.data && data.data.ordersArray.findIndex((item) => item.orderId == this.state.selectedOrderForTrack.orderId) >= 0 ?
                            this.LiveTrackRef.updateData(data.data.ordersArray[data.data.ordersArray.findIndex((item) => item.orderId == this.state.selectedOrderForTrack.orderId)]) : ''
                    )
            })

            orderData["type"] = 1;
            getCustomerOrders(orderData).then(({ data }) => {
           
                data.error ? '' : data.data ? this.setState({ pastOrders: data.data.ordersArray, totalOrderCount: data.data.ordersArray.length }) : ''
            })


        }
    }
    handleRating = (orderData, screen) => {
        this.OrderRatingRef.handleOpen(orderData, screen);
    }

    handleRightSliderClose = () => {
        this.setState({ RightSliderWidth: 0 });
        this.OrderRatingRef.handleClose();
    }
    // past order
    showPastOrders() {
        $('.orderStatusButton').removeClass('active');
        $('.orderTab').removeClass('show active');

        $('.orderStatusPastButton').addClass('active');
        $('.orderTabPastJob').addClass('show active');
    }
// active order
    showActiveOrders() {
        $('.orderStatusButton').removeClass('active');
        $('.orderTab').removeClass('show active')


        $('.orderStatusActiveButton').addClass('active');
        $('.orderTabActiveJob').addClass('show active')
    }

    render() {
        return (
            <Wrapper>

                <div className="col-12 py-2 px-1" style={{ position: 'fixed', zIndex: '9', top: '0px', background: '#fff', borderBottom: "1px solid #eee" }}>
                    {/* mobile header */}
                    <div className="col-12">
                        <div className="row align-items-center">
                            <div className="col-2 pl-0">
                                <IconButton onClick={this.closeDrawer} style={{ height: '30px', padding: '0px 12px' }}>
                                    <img src='/static/icons/Common/BackIcon.imageset/back_btn@2x.png' width="24" />
                                </IconButton>
                            </div>
                            <div className="col-8 px-0 text-center">
                                <h6 className="innerPage-heading lineSetter">My Orders</h6>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="col-12 totLayoutResCom" style={{ marginTop: '50px' }}>
                    <ul className="nav nav-pills mt-3 ordersContentLayoutOuterULClass" id="ordersContentLayoutOuterULId" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link orderStatusButton orde rStatusActiveButton py-2 active" onClick={this.showActiveOrders} id="pills-profile-tab">active orders</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link orderStatusButton orderStatusPastButton py-2" onClick={this.showPastOrders} id="pills-home-tab">past orders</a>
                        </li>
                    </ul>

                    <div className="tab-content ordersTab" id="pills-tabContent">
                        {/* Past Orders Tab */}
                        <div className="tab-pane fade orderTab orderTabPastJob" id="pastJobs" role="tabpanel" aria-labelledby="pills-home-tab">
                            <div className="pastOrdersLayout">
                                <div className="accordion" id="accordionEx" role="tablist" aria-multiselectable="true">
                                    {this.state.pastOrders && this.state.pastOrders.length > 0 ? this.state.pastOrders.map((orderDetail, key) =>
                                        <div className="card mb-lg-4 mb-2" key={"orderCard" + key} >
                                            <div className="firstView" id="firstViewId">
                                                <div className="card-header border pastOrdersHeaderLayout noPaddMobResCom p-2 px-3" role="tab" id="headingOne">
                                                    <a data-toggle="collapse" href={"#moreDetailCollpase" + key} aria-expanded="true" aria-controls="collapseOne">
                                                        <div className="col-12 py-2 pastOrdersHeaderLayoutFirstSection" >
                                                            <div className="row align-items-center">
                                                                <div className="col-5 col-12 orderTimeAndItemIdLayout px-0">
                                                                    <h6 className="orderTimeAndItemId">
                                                                        Placed on &nbsp; {this.getFormatedDate(orderDetail.bookingDate)}
                                                                        {/* <Moment format="ddd, D MMM, h:m A">
                                                                            {orderDetail.bookingDate}
                                                                        </Moment> */}
                                                                    </h6>
                                                                    {orderDetail.serviceType == 1 ?
                                                                        <p style={{ fontWeight: 400, fontSize: "11px" }} className="pt-2">
                                                                            <span>ASAP Delivery</span>
                                                                        </p> :
                                                                        <p style={{ color: "#101010", fontSize: "11px", fontWeight: 400 }} className="pt-2">
                                                                            <span>Scheduled on &nbsp; {this.getFormatedDate(orderDetail.dueDatetime)} Pickup</span>
                                                                        </p>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </a>

                                                    <div className="col-12 py-lg-3 py-2 py-2 pastOrdersHeaderLayoutSecondSection" onClick={() => this.handleOrderDetail(orderDetail)} style={{ boxShadow: "0px 0px 1px 0px rgba(0,0,0,0.3)" }}>
                                                        <div className="row align-items-center">
                                                            <div className="col-sm-5 col-12">
                                                                <div className="orderTitleLayout">
                                                                    <span className="">{orderDetail.storeName}</span>
                                                                    <span className="dotStatic">.</span>
                                                                    <span className="ml-2 float-right">
                                                                        <span className="currency">
                                                                            {orderDetail.currencySymbol}
                                                                        </span>
                                                                        <span className="">
                                                                            {parseFloat(orderDetail.totalAmount).toFixed(2)}
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                                <div className="col-12 p-0 mb-1">
                                                                    <span style={{ fontSize: "11px", color: "#999" }}>Delivery Charge</span>
                                                                    {orderDetail.deliveryCharge === 0 ?
                                                                        <span style={{ fontSize: "11px", color: BASE_COLOR }} className="float-right">Free</span>
                                                                        :
                                                                        <span style={{}} className="float-right">{orderDetail.currencySymbol + parseFloat(orderDetail.deliveryCharge).toFixed(2)}</span>
                                                                    }
                                                                </div>
                                                                <h6 className="orderTimeAndItemId mb-1" style={{ color: "#999" }}>
                                                                    <span className="orderIdStatic">Order ID: </span>
                                                                    <span className="orderIdDyna">{orderDetail.orderId}</span>
                                                                    {/* <span className="dotStatic">.</span>
                                                                            <span className="itemDyna">1</span>
                                                                            <span className="itemStatic">item</span> */}
                                                                </h6>
                                                                <div className="col-12 p-0">
                                                                    <span className="cancelAndViewOrderedItem" style={{ color: BASE_COLOR }}>{orderDetail.statusMessage}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 py-1">
                                                        <span style={{ fontWeight: 600 }}>Final amount paid</span>
                                                        <span style={{ fontWeight: 600 }} className="float-right">{orderDetail.currencySymbol} {parseFloat(orderDetail.totalAmount).toFixed(2)}</span>
                                                    </div>
                                                    <div className="col-12 py-1 px-0">
                                                        <button href="#" className="mvOrdDetailBtn" onClick={() => this.handleOrderDetail(orderDetail)}>
                                                            DETAILS
                                                        </button>
                                                        <button href="#" className="mvOrdHelpBtn float-right" onClick={() => this.handleReorder(orderDetail.orderId)}>
                                                            REORDER
                                                        </button>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    ) : this.state.showPastEmpty ? <div className="row  text-center align-items-center " style={{ height: "78vh", float: 'left', width: '100%' }}>
                                        <div className="col-12 py-5 text-center">
                                            <img src="/static/icons/EmptyScreens/EmptySearch.imageset/empty_products.png" width="150" height="120" className="img-fluid" alt="search" />
                                            <p className="text-danger">No Past Orders Found!</p>
                                        </div>
                                    </div> : ''
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Active Orders Tab */}
                        <div className="tab-pane fade orderTab orderTabActiveJob show active" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                            <div className="pastOrdersLayout">
                                <div className="accordion" id="accordionEx1" role="tablist" aria-multiselectable="true">
                                    {this.state.currentOrders && this.state.currentOrders.data && this.state.currentOrders.data.ordersArray ? this.state.currentOrders.data.ordersArray.map((orderDetail, key) => {
                                        return (
                                            <div className="card mb-lg-4 mb-2" key={"activeOrderCard" + key}>
                                                <div className="firstView" id="firstViewId">
                                                    <div className="card-header pastOrdersHeaderLayout p-2 px-3" style={{ border: "none" }} role="tab" id="headingOne">
                                                        <a data-toggle="collapse" href={"#moreDetailActive" + key} aria-expanded="true" aria-controls="collapseOne">
                                                            <div className="col-12 py-2 pastOrdersHeaderLayoutFirstSection" >
                                                                <div className="row align-items-center">
                                                                    <div className="col-5 col-12 orderTimeAndItemIdLayout px-0">
                                                                        <h6 className="orderTimeAndItemId">
                                                                            Placed on &nbsp; {this.getFormatedDate(orderDetail.bookingDate)}
                                                                            {/* <Moment format="ddd, D MMM, h:m A">
                                                                                {orderDetail.bookingDate}
                                                                            </Moment> */}
                                                                        </h6>
                                                                        {orderDetail.serviceType == 1 ?
                                                                            <p style={{ fontWeight: 400, fontSize: "11px" }} className="pt-2">
                                                                                <span>ASAP Delivery</span>
                                                                            </p> :
                                                                            <p style={{ color: "#101010", fontSize: "11px", fontWeight: 400 }} className="pt-2">
                                                                                <span>Scheduled on &nbsp; {this.getFormatedDate(orderDetail.dueDatetime)} Pickup</span>
                                                                            </p>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </a>
                                                        <div className="col-12 py-lg-3 py-2 py-2 pastOrdersHeaderLayoutSecondSection" onClick={() => this.handleOrderDetail(orderDetail)} style={{ boxShadow: "0px 0px 1px 0px rgba(0,0,0,0.3)" }}>
                                                            <div className="row align-items-center">
                                                                {/* <div className="col-3 cancelAndViewOrderedItemLayout">
                                                                        <span className="cancelAndViewOrderedItem">{orderDetail.statusMessage}</span>
                                                                    </div> */}
                                                                <div className="col-sm-5 col-12">
                                                                    <div className="orderTitleLayout">
                                                                        <span className="">{orderDetail.storeName}</span>
                                                                        <span className="dotStatic">.</span>
                                                                        <span className="ml-2 float-right">
                                                                            <span className="currency">
                                                                                {orderDetail.currencySymbol}
                                                                            </span>
                                                                            <span className="">
                                                                                {parseFloat(orderDetail.totalAmount).toFixed(2)}
                                                                            </span>
                                                                        </span>
                                                                    </div>
                                                                    {orderDetail.serviceType == 1 ?
                                                                        <div className="col-12 p-0 mb-1">
                                                                            <span style={{ fontSize: "11px", color: "#999" }}>Delivery Charge</span>
                                                                            {orderDetail.deliveryCharge === 0 ?
                                                                                <span style={{ fontSize: "11px", color: BASE_COLOR }} className="float-right">Free</span>
                                                                                :
                                                                                <span style={{}} className="float-right">{orderDetail.currencySymbol + parseFloat(orderDetail.deliveryCharge).toFixed(2)}</span>
                                                                            }
                                                                        </div> : ''
                                                                    }
                                                                    <h6 className="orderTimeAndItemId mb-1" style={{ color: "#999" }}>
                                                                        <span className="orderIdStatic">Order ID: </span>
                                                                        <span className="orderIdDyna">{orderDetail.orderId}</span>
                                                                        {/* <span className="dotStatic">.</span>
                                                                            <span className="itemDyna">1</span>
                                                                            <span className="itemStatic">item</span> */}
                                                                    </h6>
                                                                    <div className="col-12 p-0">
                                                                        <span className="cancelAndViewOrderedItem" style={{ color: BASE_COLOR }}>{orderDetail.statusMessage}</span>
                                                                    </div>
                                                                </div>

                                                                {/* <div className="col-sm-4 col-2 text-center cancelAndViewOrderedItem">
                                                                        <a href="#" className="viewOrderedItemsAnchor d-none d-lg-inline-block" id="viewOrderedItemsId" onClick={() => this.props.setOrderDetail(orderDetail.items)}>View {orderDetail.items.length} item ordered</a>
                                                                        <i className="fa fa-angle-right fa-2x"></i>
                                                                    </div> */}
                                                            </div>
                                                        </div>
                                                        <div className="col-12 py-1">
                                                            <span style={{ fontWeight: 600 }}>Final amount to pay</span>
                                                            <span style={{ fontWeight: 600 }} className="float-right">{orderDetail.currencySymbol}{parseFloat(orderDetail.totalAmount).toFixed(2)}</span>
                                                        </div>
                                                        <div className="col-12 py-1 px-0">
                                                            <button href="#" className="mvOrdDetailBtn" onClick={() => this.handleOrderDetail(orderDetail)}>
                                                                DETAILS
                                                            </button>
                                                            {
                                                                (this.state.orderMqttData && this.state.orderMqttData.bid && this.state.orderMqttData.bid == orderDetail.orderId) || orderDetail.statusCode >= 10 ?
                                                                    <button href="#" className="mvOrdHelpBtn float-right" onClick={() => this.handleTrackOrder(orderDetail)}>
                                                                        Track Order
                                                                    </button> :
                                                                    <button href="#" className="mvOrdHelpBtn float-right" onClick={() => this.handleHelpSlider()}>
                                                                        HELP
                                                                    </button>
                                                            }
                                                            {/* <button href="#" className="mvOrdDetailBtn" onClick={() => this.handleTrackOrder(orderDetail)}>
                                                                    Track Order
                                                                </button> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }) :
                                        this.state.showCurrentEmpty ?
                                            <div className="row  text-center align-items-center " style={{ height: "78vh", float: 'left', width: '100%' }}>
                                                <div className="col-12 py-5 text-center">
                                                    <img src="/static/icons/EmptyScreens/EmptySearch.imageset/empty_products.png" width="150" height="120" className="img-fluid" alt="search" />
                                                    <p className="text-danger">No Active Orders Found!</p>
                                                </div>
                                            </div> : ''
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                 {/* mobile footer  */}
                <BottomSlider onRef={ref => (this.OrderDetailRef = ref)}>
                    {this.state.loading ? <CircularProgressLoader /> : ''}


                    {/* order details slider */}
                    {this.state.selectedOrder ?
                        <div className="col-12 py-2 px-1" style={{ position: 'fixed', zIndex: '9', top: '0px', background: '#fff', borderBottom: "1px solid #eee" }}>
                            <div className="col-12">
                                <div className="row align-items-center">
                                    <div className="col-2 pl-0">
                                        <IconButton onClick={this.handleOrderDetailClose} style={{ height: '30px', padding: '0px 12px' }}>
                                            <img src='/static/icons/Common/BackIcon.imageset/back_btn@2x.png' width="24" />
                                        </IconButton>
                                    </div>
                                    <div className="col-8 px-0 text-left">
                                        <h6 className="innerPage-heading lineSetter text-left" style={{ letterSpacing: "0px" }}>Order N. {this.state.selectedOrder.orderId}</h6>
                                        <span>{this.getFormatedTime(this.state.selectedOrder.bookingDate)}</span>
                                        <span> | {this.state.selectedOrder.items.length} item</span>
                                        <span> | {this.state.selectedOrder.currencySymbol + parseFloat(this.state.selectedOrder.totalAmount).toFixed(2)}</span>

                                    </div>
                                    {this.state.selectedOrder.statusCode < 12 || this.props.notifications && this.props.notifications.bid === this.state.selectedOrder.orderId && this.props.notifications.status < 12 ?
                                        <div className="col-2 p-0">
                                            <a onClick={() => this.handleReasonDialogOpen()} style={{ color: '#d80d0d' }}> Cancel </a>
                                        </div>
                                        : ''}
                                </div>
                            </div>
                        </div>
                        : ''}
                    <div className="col-12 px-3" style={{ marginTop: '60px' }}>
                        <div className="container timeline">
                            <div className="row">
                                <div className="pickUpPoint">
                                    <span><strong>{this.state.selectedOrder ? this.state.selectedOrder.storeName : ''}</strong></span>
                                    <p>{this.state.selectedOrder ? this.state.selectedOrder.storeAddress : ''}</p>
                                </div>
                                <div className="dropPoint" style={{ fontWeight: 300 }}>

                                    <p>{this.state.selectedOrder ? this.state.selectedOrder.serviceType !== 2 ? this.state.selectedOrder.dropAddress : this.state.selectedOrder.pickAddress : ''}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <ul className="nav nav-pills ordersContentLayoutOuterULClass" id="ordersContentLayoutOuterULId" role="tablist">
                            <li className="nav-item">
                                <a className="nav-link active" id="pills-details-tab" data-toggle="pill" href="#pills-details" role="tab" aria-controls="pills-profile"
                                    aria-selected="false">Details</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link " id="pills-help-tab" data-toggle="pill" href="#pills-help" role="tab" aria-controls="pills-home"
                                    aria-selected="true">Help</a>
                            </li>
                        </ul>
                        <div className="tab-content" id="pills-tabContent">
                            {/* Past Orders Tab */}
                            <div className="tab-pane fade show active pt-3" id="pills-details" role="tabpanel" aria-labelledby="pills-details-tab">
                                {
                                    this.state.selectedOrder && this.state.selectedOrder.items.map((itemDetail, index) =>
                                        <div className="row px-3 itemDetailsMobileView" key={"itemDetailsMobileView" + index}>
                                            <div className="col-2 px-0 py-1 text-center">
                                                <img src={itemDetail.itemImageURL} width="50" height="" alt="" />
                                            </div>
                                            <div className="col-7 py-1 itemInfo">
                                                <p className="cart-product oneLineSetter" title={itemDetail.itemName}>
                                                    <span>{itemDetail.itemName}</span>
                                                </p>
                                                <p className="oneLineDisplay mb-0" title={itemDetail.unitName}>{itemDetail.unitName}</p>
                                                <p className="oneLineDisplay" title={itemDetail.unitName}>{itemDetail.quantity} * {this.state.selectedOrder.currencySymbol}{itemDetail.finalPrice}</p>
                                            </div>
                                            <div className="col-3 py-1 itemInfo">
                                                <p style={{ fontWeight: 500, margin: "50% 0" }}>{this.state.selectedOrder.currencySymbol}{parseFloat(itemDetail.finalPrice).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    )
                                }
                                <div className="col-12 mt-3 mobileViewOrderTotal">
                                    
                                    {/* sub total */}
                                    <p><span className="totalCaption">Sub Total</span><span className="float-right totalCaption"> {this.state.selectedOrder ? this.state.selectedOrder.currencySymbol + parseFloat(this.state.selectedOrder.subTotalAmount).toFixed(2) : 0.00}</span></p>
                                    {/* Delivery Charge */}
                                    <p><span className="totalCaption">Delivery Charge</span><span className="float-right totalCaption"> {this.state.selectedOrder ? this.state.selectedOrder.deliveryCharge > 0 ? this.state.selectedOrder.currencySymbol + parseFloat(this.state.selectedOrder.deliveryCharge).toFixed(2) : this.state.selectedOrder.currencySymbol + parseFloat(0).toFixed(2) : ''}</span></p>
                                    {/* Service Fees */}
                                    {this.state.selectedOrder123 && this.state.selectedOrder123.convenienceFee > 0 ? 
                                    <p><span className="totalCaption">Service Fees</span><span className="float-right totalCaption"> {this.state.selectedOrder123 ? this.state.selectedOrder123.convenienceFee > 0 ? this.state.selectedOrder.currencySymbol + parseFloat(this.state.selectedOrder123.convenienceFee).toFixed(2) : this.state.selectedOrder.currencySymbol + parseFloat(0).toFixed(2) : ''}</span></p>
                                    :""}
                                    {/* Driver Tip */}
{this.state.selectedOrder123 && this.state.selectedOrder123.driverTip > 0 ? 
                                    <p><span className="totalCaption">Driver Tip</span><span className="float-right totalCaption"> {this.state.selectedOrder123 ? this.state.selectedOrder123.driverTip > 0 ? this.state.selectedOrder.currencySymbol + parseFloat(this.state.selectedOrder123.driverTip).toFixed(2) : this.state.selectedOrder.currencySymbol + parseFloat(0).toFixed(2) : ''}</span></p>
                                    :""}
                                    {/* exclusive Taxes */}
                                    {this.state.selectedOrder && this.state.selectedOrder.exclusiveTaxes && this.state.selectedOrder.exclusiveTaxes.length > 0 ? this.state.selectedOrder.exclusiveTaxes.map((tax, index) =>
                                        <div className="row py-lg-1" key={'carttax-current' + index}>
                                            {/* <div className="col-6 text-left"> */}
                                            <div className="col-6 text-left" ><p style={{ fontSize: "13px", fontWeight: 400 }}>{tax.taxtName}</p></div>
                                            <div className="col-6 text-right px-3 subTotalPriceLayout">
                                                <span className="currency">
                                                    {this.state.selectedOrder.currencySymbol}
                                                </span>
                                                <span className=''>{parseFloat(tax.price).toFixed(2)}</span>
                                            </div>
                                        </div>)
                                        : ''}
                                        {/* Total */}
                                    <p><span className="totalCaption">Total</span><span className="float-right totalCaption"> {this.state.selectedOrder ? this.state.selectedOrder.currencySymbol + parseFloat(this.state.selectedOrder.totalAmount).toFixed(2) : 0.00}</span></p>

                                    <div className="col-12 py-2 px-0 mt-3">
                                        {this.state.selectedOrder && this.state.selectedOrder.paidBy && this.state.selectedOrder.paidBy.wallet && this.state.selectedOrder.paidBy.wallet > 0.0 ?
                                            <div className="mobileViewPayment">
                                                <img src="/static/icons/TabBar/ProfileTab/Payment/Wallet.imageset/wallet (1).png" width="25" height="20" />
                                                <span className="paymentMethod">Wallet</span><span className="float-right">{this.state.selectedOrder ? this.state.selectedOrder.currencySymbol + parseFloat(this.state.selectedOrder.totalAmount).toFixed(2) : 0.00}</span>
                                            </div> :
                                            this.state.selectedOrder && this.state.selectedOrder.paidBy && this.state.selectedOrder.paidBy.card && this.state.selectedOrder.paidBy.card > 0.0 ?
                                                <div className="mobileViewPayment">
                                                    <img src="/static/icons/TabBar/ProfileTab/Payment/Add_new.imageset/credit-card (1).png" width="25" height="20" />
                                                    <span className="paymentMethod">Card</span><span className="float-right">{this.state.selectedOrder ? this.state.selectedOrder.currencySymbol + parseFloat(this.state.selectedOrder.totalAmount).toFixed(2) : 0.00}</span>
                                                </div> :
                                                <div className="mobileViewPayment">
                                                    <img src="/static/icons/TabBar/ProfileTab/Payment/Cash.imageset/money (1).png" width="25" height="20" />
                                                    <span className="paymentMethod">Cash</span><span className="float-right">{this.state.selectedOrder ? this.state.selectedOrder.currencySymbol + parseFloat(this.state.selectedOrder.totalAmount).toFixed(2) : 0.00}</span>
                                                </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane fade " id="pills-help" role="tabpanel" aria-labelledby="pills-help-tab">
                                {
                                    this.state.helpArray && this.state.helpArray.map((helpData, index) =>
                                        <div key={"helpDataIndex" + index} className="col-12 mt-lg-4 mt-1 p-1" style={{ background: "white" }}>
                                            <div className="row">
                                                <div className="col-12">
                                                    <h6 className="checkOutFeat" style={{ color: "black", fontWeight: 300 }} onClick={() => this.handleOrderQuery(helpData)}>{helpData.que}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </BottomSlider>


                <div className="row fixed-bottom mobile-show z-top">
                    <LabelBottomNavigation index={4} count={this.props.cartProducts ? this.props.cartProducts.length : 0} isAuthorized={true} selectedStore={this.props.selectedStore} />
                </div>

                <LiveTrackSlider onRef={ref => (this.LiveTrackRef = ref)} handleRating={this.handleRating} />

                <RatingSlider onRef={ref => (this.OrderRatingRef = ref)} RightSliderWidth={"100%"} handleRightSliderClose={this.handleRightSliderClose} setOrderRatings={this.setOrderRatings} />

                <HelpSlider onRef={ref => (this.HelpRef = ref)} state={this.state} userProfileDetail={this.props.userProfileDetail} isFromOrderHistory={true} />

                <Authmodals onRef={ref => (this.child = ref)} />

                {this.state.loading ? <CircularProgressLoader /> : ''}

                {/* <div className="modal fade" id="cancelReasonModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                ...
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary">Confirm</button>
                            </div>
                        </div>
                    </div>
                </div> */}
                <Dialog
                    title="Select Reason For Cancel"
                    modal={false}
                    open={this.state.open}
                    titleStyle={{ fontSize: "19px" }}
                    onRequestClose={this.handleReasonDialogClose}
                >
                    {
                        this.state.reasonArray && this.state.reasonArray.length > 0 ?
                            this.state.reasonArray.map((reason, key) =>
                                <label class="ordBtnContainer">
                                    <p className="mb-2" style={{ color: '#444', fontSize: "15px", fontWeight: 400 }}>{reason.reasons}</p>
                                    <input type="radio" name="radio" value="1" onClick={() => this.setCancelData(reason)} />
                                    <span class="ordBtnContainerMark"></span>
                                </label>
                            ) : ''
                    }

                    <div className="col-12 mt-4 px-0 text-center">
                        <button className="btn reasonCnfBtn" disabled={!this.state.selectedReason} onClick={() => this.callCancelOrder(this.state.selectedOrder.orderId)}>Confirm</button>
                        {this.state.ordercancelErr ?
                            <p className="text-danger py-2">Sorry! we couldn't cancel your order. Please try after some time</p>
                            : ''}
                    </div>
                </Dialog>
            </Wrapper>
        )
    }
}

const mapStateToProps = state => {
    return {
        myCart: state.cartList,
        cartProducts: state.cartProducts,
        userProfileDetail: state.userProfile,
        notifications: state.notifications,
    };
};


export default connect(mapStateToProps)(OrderHistory)