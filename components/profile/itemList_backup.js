import React from 'react'
import { Component } from 'react'
import Moment from 'react-moment';
import $ from 'jquery'
import Wrapper from '../../hoc/wrapperHoc'
import CustomSlider from '../ui/sliders/customSlider'

export default class OrderSlider extends Component {
    state = {
        SliderWidth: 0,
        open: true,
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
        ]
    }
    constructor(props) {
        super(props);
        this.handleRightSliderOpen = this.handleRightSliderOpen.bind(this);
    }

    handleRightSliderOpen = () => { this.OrderSliderRef.handleLeftSliderToggle(); this.setState({ selectedOrder: orderData }) }
    handleClose = () => this.OrderSliderRef.handleLeftSliderClose();
    closeSlider = () => { }
    componentDidMount = () => this.props.onRef(this)

    render() {
      
        return (
            <Wrapper>
                <CustomSlider onRef={ref => (this.OrderSliderRef = ref)}
                    // width={this.state.loginSliderWidth}
                    width={this.props.state.RightSliderWidth}
                    handleClose={this.closeSlider}
                >
                    <div className="col-12 p-0" style={{ background: '#f3f3f3' }}>
                        <div className="col-12 px-4 py-3" style={{ background: '#fff', borderBottom: "1px solid #eee" }}>
                            <div className="row">
                                <div className="col cartHead" style={{ paddingTop: '4px' }}>
                                    <h5>Item Details</h5>
                                </div>
                                <div className="closeDrawer">
                                    <a onClick={this.props.handleRightSliderClose}><img src="static/images/cross.svg" height="15" width="20" /></a>
                                </div>
                            </div>
                        </div>
                        {this.props.orderData ?
                            <div className="col-12">
                                <div className="col-12">
                                    <div className="container timeline">
                                        <div className="row">
                                            <div className="pickUpPoint">
                                                <span><strong>{this.props.orderData ? this.props.orderData.storeName : ''}</strong></span>
                                                <p>{this.props.orderData ? this.props.orderData.storeAddress : ''}</p>
                                            </div>
                                            <div className="dropPoint">
                                                {this.props.orderData ? this.props.orderData.serviceType !== 2 ? this.props.orderData.dropAddress : this.props.orderData.pickAddress : ''}
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
                                                this.props.orderData && this.props.orderData.items.map((itemDetail, index) =>
                                                    <div className="row px-3 itemDetailsMobileView">
                                                        <div className="col-2 px-0 py-1">
                                                            <img src={itemDetail.itemImageURL} width="60" height="" alt="" />
                                                        </div>
                                                        <div className="col-7 py-1 itemInfo">
                                                            <p><span style={{ fontWeight: 600 }}>{itemDetail.itemName}</span></p>
                                                            <p>{itemDetail.unitName}</p>
                                                        </div>
                                                        <div className="col-2 py-1 px-0 itemInfo">
                                                            <p style={{ fontWeight: 400 }}>{itemDetail.quantity} * {itemDetail.unitPrice}</p>
                                                        </div>
                                                        <div className="col-1 py-1 px-0 itemInfo">
                                                            <p style={{ fontWeight: 600 }}>&#36;{itemDetail.finalPrice}</p>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            <div className="col-12 mt-3 mobileViewOrderTotal">
                                                <p><span className="totalCaption">Sub Total</span><span className="float-right totalCaption"> &#36;{this.props.orderData ? this.props.orderData.subTotalAmount : 0}</span></p>
                                                {this.props.deliveryCharge > 0 ? <p><span className="totalCaption">Sub Total</span><span className="float-right totalCaption"> &#36;{this.props.deliveryCharge}</span></p> : ''}
                                                <p><span className="totalCaption">Total</span><span className="float-right totalCaption"> &#36;{this.props.orderData ? this.props.orderData.totalAmount : 0}</span></p>

                                                <div className="col-12 py-2 px-0 mt-3">
                                                    {this.props.orderData && this.props.orderData.paidBy.card === 0 ?
                                                        <div className="mobileViewPayment">
                                                            <img src="/static/icons/TabBar/ProfileTab/Payment/Cash.imageset/money (1).png" width="25" height="20" />
                                                            <span className="paymentMethod">Cash</span><span className="float-right">&#36;{this.props.orderData ? this.props.orderData.totalAmount : 0}</span>
                                                        </div> :
                                                        <div className="mobileViewPayment">
                                                            <img src="/static/icons/TabBar/ProfileTab/Payment/Wallet.imageset/wallet (1).png" width="25" height="20" />
                                                            <span className="paymentMethod">Wallet</span><span className="float-right">&#36;{this.props.orderData ? this.props.orderData.totalAmount : 0}</span>
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
                                                                <h6 className="checkOutFeat" style={{ color: "black" }} onClick={() => this.props.handleOrderQuery(helpData)}>{helpData.que}</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div> : ''
                        }



                        {/*    {
                            this.props.orderData && this.props.orderData.items.map((orderItem, index) => {
                                return (
                                    <div key={'orderItemcartlist' + index} className="col-12 px-2 py-1" style={{ background: '#fff', borderBottom: "1px solid #eee" }}>
                                        <div className="row px-2">
                                            <div className="col-2">
                                                <img className="absolute-center"
                                                    style={{ width: '40px', height: '40px' }}
                                                    src={orderItem.itemImageURL} />
                                            </div>
                                            <div className="col-7 p-1">
                                                <p className="cart-product">{orderItem.itemName}</p>
                                                <p style={{ fontSize: '11px', color: '#999' }}>{orderItem.unitName}</p>
                                            </div>
                                            <div className="col-1 p-1 pt-2">
                                                <div className="text-center p-1">
                                                    <span className="prod-qnty">{orderItem.quantity}</span>
                                                </div>
                                            </div>
                                            <div className="col-2 text-center p-1">
                                                <span className="cart-prod-prize">$ {orderItem.unitPrice}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        } */}
                    </div>
                </CustomSlider>

            </Wrapper>
        )
    }
}
