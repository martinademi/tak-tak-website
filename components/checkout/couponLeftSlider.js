import React from 'react'
import { Component } from 'react'
import Link from 'next/link';
import Moment from 'react-moment';
import $ from 'jquery'
import Wrapper from '../../hoc/wrapperHoc'
import LeftSlider from '../ui/sliders/leftSlider'
import { getCoupons, validateCoupon } from '../../services/cart';
import { getCookie } from '../../lib/session';
import LanguageWrapper from "../../hoc/language"
class CouponLeftSlider extends Component {

    lang = this.props.lang
    state = {
        SliderWidth: 0,
        open: true
    }
    constructor(props) {
        super(props);
        this.handleLeftSliderOpen = this.handleLeftSliderOpen.bind(this);
    }

    handleLeftSliderOpen = () => this.CouponLeftSliderRef.handleLeftSliderToggle();
    handleClose = () => this.CouponLeftSliderRef.handleLeftSliderClose();
    closeSlider = () => { }
    componentDidMount = () => this.props.onRef(this)

    render() {
        return (
            <Wrapper>
                <LeftSlider onRef={ref => (this.CouponLeftSliderRef = ref)}
                    width={450}
                    handleClose={this.closeSlider}
                    drawerTitle={this.lang.applyCopun||"Apply Coupon"}
                >
                 {/* input coupon filled  */}
                    <div className="col">
                        <div className="col-12 px-2 py-2 ">
                            <input type="text" placeholder="Enter coupon code" value={this.props.promo} onChange={this.props.updatePromo} style={{ height: "45px", width: "100%", padding: "10px", paddingRight: "75px", border: "none" }} />
                            <a className="submit-button" onClick={() => this.props.verifyCoupon(this.state.promo, true)}>{this.lang.applyn||"Apply"}</a>
                        </div>
                    </div>
                 {/* available coupon */}
                    {
                        this.props.state.couponData ? this.props.state.couponData.map((couponData, index) =>
                            <div className="row px-4" key={"Coupon" + index} style={{ background: '#fff', borderBottom: '1px solid #e5e5e5' }}>
                                <div className="col-12 pt-4 px-5">
                                    <div className="row mb-3">
                                        <div className="col-auto border py-1">
                                            <img width="20" height="20" src="../static/images/about-mobile-icons.png" className="" />
                                        </div>
                                        <div className="col-3 align-middle py-1 border">
                                            <span className="pt-1 showCouponInfoBt">{couponData.code}</span>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-12 px-0">
                                            <h6 className="showCouponInfoBtH6">{this.lang.get||"Get"} {this.props.myCart && this.props.myCart.cartTotal ? this.props.myCart.cart[0].currencySymbol : ''}{couponData.discount.value} {this.lang.caseBack||"cashback using code "}{couponData.code}</h6>
                                            <p className="showCouponInfoBtP">{couponData.title}</p>
                                            <p className="showCouponInfoBtP">{this.lang.minPurchase||"Minimum Purchase Value"} {(this.props.myCart && this.props.myCart.cartTotal ? this.props.myCart.cart[0].currencySymbol : '') + couponData.minimumPurchaseValue}</p>

                                            <p className="showCouponInfoBtAnchLink">{this.lang.validTill||"Valid till"}   {" "}
                                                <Moment format="ddd, D MMM YYYY, hh:mm A">
                                                    {" " + couponData.endTime}
                                                </Moment>
                                            </p>

                                            {/* <a className="showCouponInfoBtAnchLink">KNOW MORE</a> */}
                                        </div>
                                    </div>
                                    <div className="row mb-4 showCouponInfoBtBtnRow">


                                        <div className="col-6 px-0">
                                            {
                                                this.props.state.selectedCoupon && this.props.state.selectedCoupon._id == couponData._id ? '' :
                                                    <button className="w-100 btn-default showCouponInfoBtBtn" onClick={() => this.props.verifyCoupon(couponData,false)}>APPLY</button>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <hr />
                            </div>
                        ) : ''}

                </LeftSlider>
            </Wrapper>
        )
    }
}
export default LanguageWrapper(CouponLeftSlider)