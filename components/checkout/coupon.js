import React from 'react'
import Moment from 'react-moment';
import BottomSlider from '../ui/sliders/bottomSlider';
import { getCoupons, validateCoupon } from '../../services/cart';
import { getCookie } from '../../lib/session';
import Wrapper from "../../hoc/wrapperHoc";
import { IconButton } from 'material-ui';
import LanguageWrapper from "../../hoc/language"
class CouponSlider extends React.Component {
    lang = this.props.lang;
    state = {
        SliderWidth: "100%",
        couponData: null,
        selectedCoupon: null,
        promo: null
    }
    constructor(props) {
        super(props)
    }
    handleBottomSliderOpen = () => this.CouponRef.clickToggle();
    handleClose = () => this.CouponRef.closeDrawer();
    handleCustomClose = () => this.CouponInfoRef.closeDrawer();
    handleCloseSlider = () => { }

    updatePromo = (e) => this.setState({ promo: e.target.value })

    openCouponDetail = (index) => { this.CouponInfoRef.clickCustomHeightToggle("70vh"); this.setState({ selectedCoupon: this.state.couponData[index] }) }

    verifyCoupon = (couponData, isManual) => {

        let manualIndex;
        this.state.couponData.map((couponData, index) => {
            if (couponData.code === this.state.promo) {
                manualIndex = index;
            }
        })

        let data = {
            userId: getCookie("sid"),
            couponCode: isManual ? this.state.promo : couponData.code,
            cityId: getCookie("cityid"),
            zoneId: getCookie("zoneid"),
            storeIds: getCookie("storeId"),
            paymentMethod: 4,
            // vehicleType: 4,
            deliveryFee: 0,
            cartValue: this.props.myCart.totalPrice,
            finalPayableAmount: this.props.myCart.totalPrice
        }

        validateCoupon(data).then((res) => {
            res.error && res.status === 405 ? (toastr.error(res.data.message)) :
                (
                    couponData = isManual ? couponData[manualIndex] : couponData,
                    this.props.setCoupon(couponData, res.data.data),
                    this.handleClose(),
                    this.handleCustomClose()
                )
        }) 
    }

    componentDidMount() {
        // passing ref to parent to call children
        this.props.onRef(this);
        getCoupons(getCookie("cityid")).then(({ data }) => data.error ? '' : this.setState({ couponData: data.data }))
    }

    render() {
       
        const { classes } = this.props;
        return (
            <Wrapper>
                <BottomSlider onRef={ref => (this.CouponRef = ref)} width={this.state.SliderWidth} handleClose={this.handleCloseSlider}
                    drawerTitle={this.lang.applyCopun||"Apply Coupon"}>
                    <div style={{ background: "#f5f5f5", height: "100%" }}>
                        <div className="col-12 py-2 px-1" style={{ position: 'fixed', zIndex: '9', top: '0px', background: '#fff', borderBottom: "1px solid #eee" }}>
                            <div className="col-12">
                                <div className="row align-items-center">
                                    <div className="col-2 pl-0">
                                        <IconButton onClick={this.handleClose} style={{ height: '30px', padding: '0px 12px' }}>
                                            <img src='/static/icons/Common/BackIcon.imageset/back_btn@2x.png' width="24" />
                                        </IconButton>
                                    </div>
                                    <div className="col-8 px-0 text-center">
                                        <h6 className="innerPage-heading lineSetter">{this.lang.applyCopun||"Apply Coupon"}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col" style={{ marginTop: '50px' }}>
                            <div className="col-12 px-2 py-2 mt-4">
                                <input type="text" placeholder="Enter coupon code" onChange={this.updatePromo} style={{ height: "45px", width: "100%", padding: "10px", paddingRight: "75px", border: "none" }} />
                                <a className="submit-button" onClick={() => this.verifyCoupon(this.state.couponData, true)}>{this.lang.applyT||"Apply"}</a>
                            </div>
                        </div>
                        <div className="col-12" style={{ position: "fixed", height: "100vh", paddingBottom: "125px", overflowY: "scroll" }}>
                            {
                                this.state.couponData && this.state.couponData.map((couponData, index) =>
                                    <div className="row px-4" key={"Coupon" + index} style={{ background: '#fff', borderBottom: '1px solid #e5e5e5' }}>
                                        <div className="col-12 pt-4 px-3">
                                            <div className="row mb-3">
                                                <div className="col-auto border py-1">
                                                    <img width="20" height="20" src="../static/images/about-mobile-icons.png" className="" />
                                                </div>
                                                <div className="col-auto align-middle py-1 border">
                                                    <span className="pt-1 showCouponInfoBt">{couponData.code}</span>
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-12 px-0">
                                                    <h6 className="showCouponInfoBtH6">Get {this.props.myCart && this.props.myCart.cartTotal ? this.props.myCart.cart[0].currencySymbol : ''}{couponData.discount.value} {this.lang.caseBackUsingCode||"cashback using code"} {couponData.code}</h6>
                                                    <p className="showCouponInfoBtP">{couponData.title}</p>
                                                    <p className="showCouponInfoBtP">Minimum Purchase Value {(this.props.myCart && this.props.myCart.cartTotal ? this.props.myCart.cart[0].currencySymbol : '') + couponData.minimumPurchaseValue}</p>

                                                    <p className="showCouponInfoBtAnchLink">{this.lang.validTill||"Valid till"}   {" "}
                                                        <Moment format="ddd, D MMM YYYY, hh:mm A">
                                                            {" " + couponData.endTime}
                                                        </Moment>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="row mb-4 showCouponInfoBtBtnRow">
                                                <div className="col-6 px-0">
                                                    {
                                                        <button className="w-100 btn-default showCouponInfoBtBtn" onClick={() => this.verifyCoupon(couponData)}>{this.lang.applyC||"APPLY"}</button>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </BottomSlider>

                <BottomSlider onRef={ref => (this.CouponInfoRef = ref)} width={this.state.SliderWidth} handleClose={this.handleCloseSlider}
                    drawerTitle="">
                    <div>
                        <p className="my-3 p-2 px-3"><span className="cpnCode">{this.state.selectedCoupon ? this.state.selectedCoupon.code : ''}</span></p>
                        <p className="cpnTitleText my-3 px-3">{this.state.selectedCoupon ? this.state.selectedCoupon.title : ''}</p>
                        <p className="my-3 px-3">
                            <span className="cpnValidity">{this.lang.validTill||"Valid Till"}</span>
                            <span className="float-right cpnValidDate">
                                <Moment format="ddd, D MMM YYYY, h:m A">
                                    {this.state.selectedCoupon ? this.state.selectedCoupon.endTime : ''}
                                </Moment>
                            </span>
                        </p>
                        <p className="my-3 px-3 cpnHowITWorks">{this.lang.howItWork||"How It Works ?"}</p>
                        <p className="my-3 px-3">
                            {this.state.selectedCoupon ? this.state.selectedCoupon.howItWorks : ''}
                        </p>
                        <div className="cpnDetailCloser">
                            <button className="cpnDetailCloseBtn" onClick={this.handleCustomClose}>{this.lang.okGot||"Ok, Got It"}</button>
                        </div>
                    </div>
                </BottomSlider >
            </Wrapper >
        )
    }
}
export default LanguageWrapper(CouponSlider)