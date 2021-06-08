import React from 'react';
// import FontIcon from 'material-ui/FontIcon';
// import Link from 'next/link';
import { connect } from 'react-redux'
import BottomSlider from '../ui/sliders/bottomSlider';
import { getCustomerOrders, reorderItem, getOrderDetail } from '../../services/profileApi';
import Moment from 'react-moment';
import Wrapper from '../../hoc/wrapperHoc';
import HelpSlider from "../profile/help";
import * as actions from '../../actions/index'
import CircularProgressLoader from '../ui/loaders/circularLoader';
import LiveTrackSlider from "./liveTrack";
import $ from 'jquery'
import { BASE_COLOR } from '../../lib/envariables';

class OrderHistory extends React.Component {

    state = {
        pastOrders: [],
        currentOrders: [],
        totalOrderCount: '',
        SliderWidth: "100%",
        selectedOrder: null,
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
        selectedHelpQue: null
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
        this.child.closeDrawer()
    }
    handleHelpSlider = () => { this.closeDrawer(); this.HelpRef.handleLeftSliderOpen() }
    handleOrderDetail = (orderDetail) => {
        this.setState({ loading: true })
        this.OrderDetailRef.clickToggle();
        getOrderDetail(orderDetail.orderId)
            .then(({ data }) => {
                data.error ? "" : this.setState({ selectedOrder: data.data, loading: false })
            })
    }
    handleOrderDetailClose = () => this.OrderDetailRef.closeDrawer();
    handleReorder = (orderId) => {
        let orderDetail = {
            orderId: orderId
        }
        reorderItem(orderDetail)
            .then(({ data }) => {
                data.error ? "" : (this.props.dispatch(actions.getCart()), this.child.closeDrawer(), this.props.showCart())
            })
    }
    handleOrderQuery = (helpQuestion) => {
        this.HelpRef.handleTicketDrawer(helpQuestion.que);
    }
    handleTrackOrder = (orderDetail) => {
        this.LiveTrackRef.handleLeftSliderOpen(orderDetail);
    }

    getOrders = () => {
        let orderData = {
            pageIndex: 0,
            type: 1
        }

        getCustomerOrders(orderData).then(({ data }) => {
            data.error ? '' : this.setState({ pastOrders: data.data.ordersArray })
        })

        orderData["type"] = 2; // changing order type from past order to active orders

        getCustomerOrders(orderData).then(({ data }) => {
            data.error ? '' : this.setState({ currentOrders: data })
        })
    }
    componentDidMount() {
        this.props.onRef(this)
        this.getOrders();

    }


    showPastOrders() {
        $('.orderStatusButton').removeClass('active');
        $('.orderTab').removeClass('show active');

        $('.orderStatusPastButton').addClass('active');
        $('.orderTabPastJob').addClass('show active');
    }

    showActiveOrders() {
        $('.orderStatusButton').removeClass('active');
        $('.orderTab').removeClass('show active')


        $('.orderStatusActiveButton').addClass('active');
        $('.orderTabActiveJob').addClass('show active')
    }

    render() {
        return (
            <Wrapper>

                <BottomSlider onRef={ref => (this.child = ref)}>
                    <div className="col-12 px-4 py-3" style={{ position: 'fixed', zIndex: '9', top: '0px', background: '#fff', borderBottom: "1px solid #eee" }}>
                        <div className="row">
                            <div className="col cartHead" style={{ paddingTop: '4px' }}>
                                <h5>My Orders</h5>
                            </div>
                            <div className="closeDrawer">
                                <a onClick={this.closeDrawer}><img src="/static/images/cross.svg" height="15" width="20" /></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 totLayoutResCom" style={{ marginTop: '72px' }}>
                        <ul className="nav nav-pills mt-3 ordersContentLayoutOuterULClass" id="ordersContentLayoutOuterULId" role="tablist">
                            <li className="nav-item">
                                <a className="nav-link orderStatusButton orderStatusActiveButton py-2 active" onClick={this.showActiveOrders} id="pills-profile-tab">active orders</a>
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
                                                                    <div className="col-5 col-12 orderTimeAndItemIdLayout">
                                                                        <h6 className="orderTimeAndItemId">
                                                                            Placed on &nbsp;
                                                                            <Moment format="ddd, D MMM, h:m A">
                                                                                {orderDetail.bookingDate}
                                                                            </Moment>
                                                                        </h6>
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
                                                                                &#36;
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
                                                                            <span style={{}} className="float-right">{orderDetail.deliveryCharge}</span>
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
                                                            <span style={{ fontWeight: 600 }} className="float-right">&#36; {parseFloat(orderDetail.totalAmount).toFixed(2)}</span>
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
                                        ) : <div className="row  text-center align-items-center " style={{ height: "78vh", overflowY: "scroll" }}>
                                                <div className="col-12 py-5 text-center">
                                                    <img src="/static/icons/EmptyScreens/EmptySearch.imageset/empty_products.png" width="150" height="120" className="img-fluid" alt="search" />
                                                    <p className="text-danger">No Past Orders Found!</p>
                                                </div>
                                            </div>
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
                                                                        <div className="col-5 col-12 orderTimeAndItemIdLayout">
                                                                            <h6 className="orderTimeAndItemId">
                                                                                Placed on &nbsp;
                                                                                <Moment format="ddd, D MMM, h:m A">
                                                                                    {orderDetail.bookingDate}
                                                                                </Moment>
                                                                            </h6>
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
                                                                                    &#36;
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
                                                                                    <span style={{}} className="float-right">{orderDetail.deliveryCharge}</span>
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
                                                                        <div className="col-3 p-0">
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
                                                                <span style={{ fontWeight: 600 }} className="float-right">&#36;{parseFloat(orderDetail.totalAmount).toFixed(2)}</span>
                                                            </div>
                                                            <div className="col-12 py-1 px-0">
                                                                <button href="#" className="mvOrdDetailBtn" onClick={() => this.handleOrderDetail(orderDetail)}>
                                                                    DETAILS
                                                                </button>
                                                                {/* <button href="#" className="mvOrdDetailBtn" onClick={() => this.handleTrackOrder(orderDetail)}>
                                                                    Track Order
                                                                </button> */}
                                                                <button href="#" className="mvOrdHelpBtn float-right" onClick={() => this.handleHelpSlider()}>
                                                                    HELP
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }) :

                                            <div className="row  text-center align-items-center " style={{ height: "78vh", overflowY: "scroll" }}>
                                                <div className="col-12 py-5 text-center">
                                                    <img src="/static/icons/EmptyScreens/EmptySearch.imageset/empty_products.png" width="150" height="120" className="img-fluid" alt="search" />
                                                    <p className="text-danger">No Active Orders Found!</p>
                                                </div>
                                            </div>

                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </BottomSlider>

                <BottomSlider onRef={ref => (this.OrderDetailRef = ref)}>
                    {this.state.loading ? <CircularProgressLoader /> : ''}

                    <div className="col-12 cartHead" style={{ paddingTop: '15px' }}>
                        <h5 className="text-left">
                            <a onClick={this.handleOrderDetailClose} style={{ float: "left" }}><img src='/static/icons/Common/BackIcon.imageset/back_btn@2x.png' width="18" /></a>
                            {this.state.selectedOrder ?
                                <span className="ml-2"><strong>{this.state.selectedOrder.orderId}</strong></span> : ''
                            }
                        </h5>
                        <Moment format="h:m A" style={{ marginLeft: "30px" }}>
                            {this.state.selectedOrder ? this.state.selectedOrder.bookingDate : ''}
                        </Moment>
                        <span> | {this.state.selectedOrder ? this.state.selectedOrder.items.length : 0} item</span>
                        <span> &#36;{this.state.selectedOrder ? parseFloat(this.state.selectedOrder.totalAmount).toFixed(2) : 0}</span>
                    </div>
                    <div className="col-12">
                        <div className="container timeline">
                            <div className="row">
                                <div className="pickUpPoint">
                                    <span><strong>{this.state.selectedOrder ? this.state.selectedOrder.storeName : ''}</strong></span>
                                    <p>{this.state.selectedOrder ? this.state.selectedOrder.storeAddress : ''}</p>
                                </div>
                                <div className="dropPoint">
                                    {this.state.selectedOrder ? this.state.selectedOrder.serviceType !== 2 ? this.state.selectedOrder.dropAddress : this.state.selectedOrder.pickAddress : ''}
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
                                            <div className="col-2 px-0 py-1">
                                                <img src={itemDetail.itemImageURL} width="60" height="" alt="" />
                                            </div>
                                            <div className="col-8 py-1 itemInfo">
                                                <p><span style={{ fontWeight: 600 }}>{itemDetail.itemName}</span></p>
                                                <p>{itemDetail.unitName}</p>
                                            </div>
                                            <div className="col-2 py-1 itemInfo">
                                                <p style={{ fontWeight: 600 }}>&#36;{itemDetail.finalPrice}</p>
                                            </div>
                                        </div>
                                    )
                                }
                                <div className="col-12 mt-3 mobileViewOrderTotal">
                                    <p><span className="totalCaption">Sub Total</span><span className="float-right totalCaption"> &#36;{this.state.selectedOrder ? parseFloat(this.state.selectedOrder.subTotalAmount).toFixed(2) : 0}</span></p>
                                    <p><span className="totalCaption">Total</span><span className="float-right totalCaption"> &#36;{this.state.selectedOrder ? parseFloat(this.state.selectedOrder.totalAmount).toFixed(2) : 0}</span></p>

                                    <div className="col-12 py-2 px-0 mt-3">
                                        {this.state.selectedOrder && this.state.selectedOrder.paidBy.card === 0 ?
                                            <div className="mobileViewPayment">
                                                <img src="/static/icons/TabBar/ProfileTab/Payment/Cash.imageset/money (1).png" width="25" height="20" />
                                                <span className="paymentMethod">Cash</span><span className="float-right">&#36;{this.state.selectedOrder ? parseFloat(this.state.selectedOrder.totalAmount).toFixed(2) : 0}</span>
                                            </div> :
                                            <div className="mobileViewPayment">
                                                <img src="/static/icons/TabBar/ProfileTab/Payment/Wallet.imageset/wallet (1).png" width="25" height="20" />
                                                <span className="paymentMethod">Wallet</span><span className="float-right">&#36;{this.state.selectedOrder ? parseFloat(this.state.selectedOrder.totalAmount).toFixed(2) : 0}</span>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane fade " id="pills-help" role="tabpanel" aria-labelledby="pills-help-tab">
                                {
                                    this.state.helpArray && this.state.helpArray.map((helpData, index) =>
                                        <div key={"helpDataIndex" + index} className="col-12 mt-lg-4 px-4 mt-1 p-1" style={{ background: "white" }}>
                                            <div className="row">
                                                <div className="col-12">
                                                    <h6 className="checkOutFeat" style={{ color: "black" }} onClick={() => this.handleOrderQuery(helpData)}>{helpData.que}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>

                </BottomSlider>

                <LiveTrackSlider onRef={ref => (this.LiveTrackRef = ref)} />

                <HelpSlider onRef={ref => (this.HelpRef = ref)} state={this.state} userProfileDetail={this.props.userProfileDetail} isFromOrderHistory={true} />
            </Wrapper>
        )
    }
}

export default connect()(OrderHistory)