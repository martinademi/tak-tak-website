import React from 'react'
import { Component } from 'react'
import Moment from 'react-moment';
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { withStyles } from '@material-ui/core/styles';
import Dialog from 'material-ui/Dialog';

import Router from 'next/router';
import * as moment from 'moment';

import Wrapper from '../../hoc/wrapperHoc'
import LeftSlider from '../ui/sliders/leftSlider'
import Intelinput from '../ui/intelinput'
import LinearProgressBar from '../ui/linearProgress'
import { reorderItem } from '../../services/profileApi';
import * as actions from '../../actions/index';
import CircularProgressLoader from '../ui/loaders/circularLoader'
import { getLocation } from '../../lib/auth';
import * as $ from 'jquery';
import * as ENV_VAR from '../../lib/envariables'
import { getWishlist, getCancelReasons, removeFromWishList } from '../../services/cart';
import { getCookie, setCookie } from '../../lib/session';
import ProductListMView from '../producthome/ProductList/ProductListMView';
import StoreRightSlider from '../store/StoreRightSlider';
import { SideBarTabs } from './ProfileTabs/SideBarTabs';
import SideBarTabContent from './ProfileTabs/TabContent';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import {getGeoInfo} from "../../lib/getip"
const styles = {
    root: {
        margin: "0px !important",
        marginTop: '0px',
        marginBottom: '0px',
        borderBottom: '1px solid white',
        padding: "0px 24px 0px",
        
    },
    content: {
        marginTop: '0px',
        marginBottom: '0px',
        borderBottom: '0px solid white',
       
    },
    expanded: {
        margin: "0px !important",
        marginTop: '0px',
        marginBottom: '0px',
        borderBottom: '0px solid white',
        
    },
    wrapperInner: {
        width: '100%',
    },
    heading: {
        color: "#fc7800",
        fontWeight: 500,
        '&:not(:last-child)': {
            borderBottomLeftRadius: "0px",
            borderBottomRightRadius: "0px"
          },
          '&:not(:frist-child)': {
            borderBottomLeftRadius: "0px",
            borderBottomRightRadius: "0px"
          }
    }
}

let isPhoneValid = false;


class ProfileComponent extends Component {
    state = {
        SliderWidth: 0,
        showPhoneUpdate: false,
        showOldPhoneOTPForm: false,
        showNewPhoneOTPForm: false,
        showEmailUpdate: false,
        showPasswordUpdate: false,
        phoneNumber: null,
        email: null,
        otpData: {
            otp: '',
            otpVerified: false,
            otpShow: false,
        },
        showExp: false,
        selectedCard: [],
        open: false,
        selectedOrder: null,
        wishCollapse: false,
        loading: false,
        listProducts: [],
        contryCode: ""
    }

    componentDidMount() {
        let data = getGeoInfo().then(data => {
          this.setState({
            ...this.state,
            contryCode: data.country_code
          });
          
        }).catch((e)=>{
          
        });
      }
    
    toggleLeftModalHandler = (screen) => {
        this.props.toggleLeftModalHandler(screen);
        this.child.handleLeftSliderToggle();
    }

    handleLeftSliderClose = () => {
        this.child.handleLeftSliderClose()
    }
  // handle reorder
    handleReorder = (event, orderId) => {
        event.stopPropagation();
        let orderDetail = {
            orderId: orderId
        }
        reorderItem(orderDetail)
            .then(({ data }) => {
                data.error ? '' : (this.props.dispatch(actions.getCart()), this.props.showCart())
            })
    }
    getCurrentLocation = async () => {
        // const location = await getLocation();

        // let geocoder = new google.maps.Geocoder();
        // let latlng = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
        // geocoder.geocode({ 'latLng': latlng }, (results, status) => {
        //     if (status == google.maps.GeocoderStatus.OK) {
        //         let addr = results[results.length - 6].formatted_address;
        //         this.setState({ currentAddress: addr })
        //     }
        // })
    }
// remove from the wish list
    removeWishlist = (event, listId, post) => {
        event.stopPropagation();

        let data = {
            listId: this.state.listId,
            product: [{
                childProductId: post.childProductId,
                parentProductId: post.parentProductId,
            }]
        }

        removeFromWishList(data).then((res) => {
            res.error ? '' : this.getWishList(this.state.listId);
        })
    }

// products list
    handleListProducts = (listId, index) => {

        this.setState({ wishCollapse: !this.state.wishCollapse, selectedListIndex: index })
this.setState({listId:listId})
        this.getWishList(listId)

        this.state.selectedListIndex == index ?
            (this.setState({ selectedListIndex: null })) : '';
    }
// get the wishlist
    getWishList = (listId) => {
        let wishlistData = {
            listId: listId,  // send 0 for all list, and send listId for products inside the list
            storeId: getCookie("storeId")||0,
            zoneId:getCookie("zoneid")
        }

        getWishlist( wishlistData.listId, wishlistData.storeId).then((data) => {
            data.error ? this.setState({ loading: false, listProducts: [], wishCollapse: !this.state.wishCollapse }) : this.setState({ listProducts: data.data.data, loading: false })
        })
    }

// for the cancel the order reason
    getCancelReasons = () => {
        getCancelReasons().then((data) => {
            data.error ? '' : this.setState({ reasonArray: data.data.data })
        })
    }
    componentDidMount() {
        // passing ref to parent to call children functions
        this.props.onRef(this)
        this.setState({ showExp: true })
        this.getCurrentLocation();
        this.getCancelReasons();

    }

// allow only number
    allowOnlyNumber(e) {
        let char = e.which || e.keyCode
        if ((char >= 37 && char <= 40) || (char >= 48 && char <= 57) || (char >= 96 && char <= 105) || (char == 8) || (char == 9) || (char == 13)) {

        } else {
            e.preventDefault();
        }
    }
// get number into dddd, MMMM Do YYYY, h:mm A formate date
    getFormatedDate = (date) => {
        // let UTCTime = moment().format("Z")
        
        return moment.unix(date).format("dddd, MMMM Do YYYY, h:mm A")
    }
    handleReasonDialogOpen = (order) => this.setState({ open: true, selectedOrder: order })
    handleReasonDialogClose = () => this.setState({ open: false })

    handleOrderCancel = (id) => {
        this.props.callCancelOrder(id)
    }

    inputForm(data) {
        return (
            <TextField
                type={data.type}
                floatingLabelText={data.label}
                floatingLabelFocusStyle={{ color: ENV_VAR.BASE_COLOR, transform: 'scale(0.75) translate(0px, -20px)' }}
                floatingLabelShrinkStyle={{ transform: 'scale(0.75) translate(0px, -20px)' }}
                floatingLabelStyle={{ top: "20px", transition: "all 750ms cubic-bezier(0.23, 1, 0.32, 1) 0ms" }}
                inputStyle={{ marginTop: "3px", marginLeft: "5px" }}
                style={{ height: "60px", width: '100%', borderBottom: "1px solid #999" }}
                underlineShow={false}
                margin="normal"
                value={data.value}
                onChange={data.onChange}
                autoComplete="off"
                disabled={data.isDisabled}
                id={data.id}
            // placeholder={data.placeholder ? data.placeholder : ''}
            />
        )
    }
// phone input 
    inputPhone(data) {
        return (
            <TextField
                type={data.type}
                floatingLabelText={data.label}
                floatingLabelFocusStyle={{ color: ENV_VAR.BASE_COLOR, transform: 'scale(0.75) translate(0px, -20px)' }}
                floatingLabelShrinkStyle={{ transform: 'scale(0.75) translate(0px, -20px)' }}
                floatingLabelStyle={{ top: "20px", transition: "all 750ms cubic-bezier(0.23, 1, 0.32, 1) 0ms" }}
                inputStyle={{ marginTop: "3px", marginLeft: "5px" }}
                style={{ height: "60px", width: '100%' }}
                underlineShow={false}
                margin="normal"
                value={data.value}
                onChange={data.onChange}
                autoComplete="off"
                disabled={data.isDisabled}
            />
        )
    }
// otp input 
    inputOTP(data) {
        return (
            <TextField
                type={data.type}
                floatingLabelText={data.label}
                floatingLabelFocusStyle={{ color: ENV_VAR.BASE_COLOR, transform: 'scale(0.75) translate(0px, -20px)' }}
                floatingLabelShrinkStyle={{ transform: 'scale(0.75) translate(0px, -20px)' }}
                floatingLabelStyle={{ top: "20px", transition: "all 750ms cubic-bezier(0.23, 1, 0.32, 1) 0ms" }}
                inputStyle={{ marginTop: "5px", marginLeft: "5px", fontSize: '18px', letterSpacing: '10px' }}
                style={{ height: "60px", width: '100%', borderBottom: "1px solid #999" }}
                underlineShow={false}
                margin="normal"
                value={data.value}
                onChange={data.onChange}
                autoComplete="off"
                disabled={data.isDisabled}
                maxLength="6"
            />
        )
    }
//  to change the store 
    handleChangeStore = (store) => {
        setCookie("storeId", store.businessId)
        this.props.changeStore(store);
        this.closeSlider();
    }
    
    LeftSliderMobileHandler = () => {
        this.setState({ SliderWidth: 450 })
        this.StoreSlider.handleLeftSliderToggle()
    }

    closeSlider() {
        this.StoreSlider.handleLeftClose()
    }
// navigate to the history page for the mobile view 
    goToOrders = () => {
        if (this.props.userProfileDetail) {
            Router.push("/history");
        } else {
            this.props.showLoginHandler(window.outerWidth <= 580);
        }
    }


    render() {
        const {lang} = this.props
        const { classes } = this.props;

        return (
            <Wrapper>
                <div className="row mobile-hide">
                    <div className="col-12  myOrdersPage" style={{ 'marginTop': '59.3229px' }}>
                        <div className="row justify-content-center">
                            <div className="col-xl-10 col-lg-11 col-12">
                                <div className="row">
                                    <div className="col-12 px-lg-5 px-4 my-lg-5 py-3 py-lg-0 accountDetailsTitleLayout">
                                        <div className="row">
                                            <div className="col-lg-6 col-8 accountDetailsTitle">
                                                {this.props.state.userProfileDetail ?
                                                    <div>
                                                        <h3 className="accountDetailsTitleName">
                                                            {this.props.state.userProfileDetail.name}
                                                        </h3>
                                                        <span className="accountDetailsTitleNumber"> {this.props.state.userProfileDetail.mobile}</span>
                                                        <span className="accountDetailsTitleDot">.</span>
                                                        <span className="accountDetailsTitleEmail">{this.props.state.userProfileDetail.email}</span>
                                                    </div> : ''
                                                }
                                            </div>
                                            <div className="col-lg-6 col-4 accountDetailsTitleButton text-lg-right text-center align-self-center">
                                                <button type="button" className="btn btn-primary d-none d-lg-block float-right" data-toggle="modal" data-target="#profileEditModal" onClick={() => this.toggleLeftModalHandler()}>{lang.editProfile||"Edit profile"}</button>
                                                <button type="button" className="btn btn-primary d-block d-lg-none float-right" data-toggle="modal" data-target="#profileEditModal" onClick={() => this.toggleLeftModalHandler()}>{lang.edit||"edit"}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-5" id="pillsLayoutId">
                                    <div className="col-12 bgWhite">
                                        <div className="row justify-content-center">
                                            <div className="col-12 py-lg-5 py-2">
                                                <div className="row">
                                                    {/* <div className="col-auto pr-0 pt-3 d-none d-lg-block" id="ordersSideMenuLayout"> */}
                                                    {/* left side content */}
                                                    <SideBarTabs deleteAllCookies={this.props.deleteAllCookies} />
                                                    {/* <div className="col-12 col-md-auto col-lg-auto pr-0 pt-3 mb-4 mb-lg-0" id="ordersSideMenuLayout">
                                                        <ul className="nav nav-pills flex-column" role="tablist" id="ordersSideMenuLayoutULId">
                                                            <li className="nav-item">
                                                                <a className="nav-link active" id="ordersid" data-toggle="pill" href="#orders">orders</a>
                                                            </li>
                                                            <li className="nav-item">
                                                                <a className="nav-link" id="addressesid" data-toggle="pill" href="#manageAddresses">manage addresses</a>
                                                            </li>
                                                            <li className="nav-item">
                                                                <a className="nav-link" id="paymentsid" data-toggle="pill" href="#payments">payments</a>
                                                            </li>
                                                            <li className="nav-item">
                                                                <a className="nav-link" id="favouritesid" data-toggle="pill" href="#favourites">favorites</a>
                                                            </li>
                                                            <li className="nav-item">
                                                                <a className="nav-link" id="wishListid" data-toggle="pill" href="#wishlist">Wishlist</a>
                                                            </li>
                                                            <li className="nav-item">
                                                                <a className="nav-link" id="Offersid" data-toggle="pill" href="#offers">Offers</a>
                                                            </li>
                                                            <li className="nav-item">
                                                                <a className="nav-link" id="profile_logOutid" onClick={this.props.deleteAllCookies}>Log out</a>
                                                            </li>
                                                        </ul>

                                                    </div> */}
                                                    {/* right side content  */}
                                                    <SideBarTabContent  {...this.props}
                            {...this.state}
                            {...this}
                            MoreDetails={this.props.MoreDetails}
                            selectedOrder={this.props.selectedOrder} />
                                                    {/* <div className="col-auto ml-lg-auto" id="ordersContentLayout"> */}

                                                </div>
                                            </div>
                                        </div>
                                    </div >
                                </div >
                            </div>
                        </div >
                    </div >
                </div>

                <div className="mobile-show">
                    <div className="col-12 profilePageMobView">
                        <div className="row">
                            <div className="col-12 px-0" style={{ marginTop: '130px',background:"white" }}>
                            <div className="divition_text">
                                        <p className="text_divition">{lang.helpCenter}</p>
                                    </div>
                                <ul className="nav flex-column userProfileLULMobView" style={{ paddingBottom: '15px' }}>
                                  {/* my orders */}
                                    <li className="nav-item">
                                        <img src="static/icons/drawable-xxxhdpi/orders.png" width="20" height="20" alt="my orders" />
                                        <a className="nav-link" onClick={() => this.goToOrders("/history")}>{lang.myOrder||"my orders"}</a>
                                    </li>
                                    {/* faq */}
                                    <li className="nav-item">
                                        <img src="static/icons/drawable-xxxhdpi/help_center.png" width="20" height="20" alt="help_center" />
                                        <a className="nav-link" onClick={this.props.handleFaqSliderOpen}>{lang.faqs||"faqs"}</a>
                                    </li>
                                    {/* <li className="nav-item">
                                        <img src="static/icons/drawable-xxxhdpi/refer_your_friends.png" width="20" height="20" alt="refer_your_friends" />
                                        <a className="nav-link" onClick={this.props.handleReferFrndSliderOpen}>refer your friends</a>
                                    </li> */}
                                    {/* help center */}
                                    <li className="nav-item">
                                        <img src="static/icons/drawable-xxxhdpi/account_settings.png" width="20" height="20" alt="account_settings" />
                                        <a className="nav-link" onClick={() => this.props.handleHelpSliderOpen("mobileView")}>{lang.helpCenter||"help center"}</a>
                                    </li>
                                    
                                  
                                </ul>
                                <div className="divition_text">
                                        <p className="text_divition">{lang.myaccount}</p>
                                    </div>
                                <ul className="nav flex-column userProfileLULMobView" style={{ paddingBottom: '15px' }}>
                                {/* manage addresses */}
                                <li className="nav-item">
                                        <img src="static/icons/drawable-xxxhdpi/manage_ddress.png" width="20" height="20" alt="manage_address" />
                                        <a className="nav-link" onClick={() => this.props.handleAddressSliderOpen()}>{lang.manageAddress||"manage addresses"}</a>
                                    </li>
                                    {/* payments */}
                                    <li className="nav-item">

                                        {this.state.showExp ?
                                            <ExpansionPanel>
                                                <ExpansionPanelSummary classes={{
                                                    root: classes.root,
                                                    content: classes.content,
                                                    expanded: classes.expanded
                                                }}>
                                                    <img src="static/icons/drawable-xxxhdpi/payment.png" width="20" height="20" alt="payment" />
                                                    <a style={{ paddingLeft: '22px', borderBottom: '0px' }} >{lang.payment||"payments"}</a>
                                                </ExpansionPanelSummary>
                                                <ExpansionPanelDetails classes={{ root: classes.root }} >
                                                    <div className="col-12">
                                                        <p className="my-3"><a onClick={this.props.handleWalletMobile} style={{ padding: "10px", borderBottom: '0px' }}>Wallet ({this.props.walletDetail ? parseFloat(this.props.walletDetail.walletBalance).toFixed(2) : 0.00})</a></p>
                                                        <p className="my-3"><a onClick={this.props.handleAddCardMobileSlider} style={{ padding: "10px", borderBottom: '0px' }}>Debit/Credit Card</a></p>
                                                    </div>
                                                </ExpansionPanelDetails>
                                            </ExpansionPanel>
                                            :
                                            <div>
                                                <img src="static/icons/drawable-xxxhdpi/payment.png" width="20" height="20" alt="payment" />
                                                <a className="nav-link" >{lang.payment||"payments"}</a>
                                            </div>
                                        }


                                    </li>
                                    {/* favorites */}
                                    <li className="nav-item">
                                        <img src="static/icons/drawable-xxxhdpi/favourites.png" width="20" height="20" alt="favourites" />
                                        <a className="nav-link" onClick={this.props.handleFavouriteSliderOpen}>{lang.favorites||"favorites"}</a>
                                    </li>
                                    {/* wish list */}
                                    <li className="nav-item">
                                        <img src="static/icons/drawable-xxxhdpi/wish_list.png" width="20" height="20" alt="wish_list" />
                                        <a className="nav-link" onClick={this.props.handleWishlistSliderOpen}>{lang.wishlist||"wish list"}</a>
                                    </li>
                                    {/* offers */}
                                    <li className="nav-item">
                                        <img src="static/icons/drawable-xxxhdpi/offers.png" width="20" height="20" alt="offers" />
                                        <a className="nav-link" onClick={this.props.handleOffersSliderOpen}>{lang.offers||"offers"}</a>
                                    </li>
                                    {/* language */}
                                    <li className="nav-item">
                                        <img src="static/icons/drawable-xxxhdpi/language.png" width="20" height="20" alt="language" />
                                        <a className="nav-link" onClick={this.props.handleLanguageSliderOpen}>{lang.language||"language"}</a>
                                    </li>
                                    {/* logout */}
                                    {this.props.userProfileDetail ?
                                        <li className="nav-item">
                                            <a className="nav-link" id="userLogout" onClick={this.props.deleteAllCookies}>{lang.logout||"logout"}
                                        <img id="userLogoutImg" src="static/icons/drawable-xxxhdpi/logout.png" width="20" height="20" alt="logout" /></a>
                                        </li> : ''
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <LeftSlider onRef={ref => (this.child = ref)}
                    width={this.props.state.SliderWidth}
                    handleClose={this.props.handleClose}
                >

                    <div className="" style={{ background: '#fff' }}>

                        <div className="col-12 modal-body cardUploadBtSec">
                            <div className="row justify-content-center">
                                <div className="col-11 cardUploadBtSec">
                                    <div className="row">
                                        <div className="col-12 mb-3">
                                            <h5 className="cardUploadBtH5">{lang.profileImage||"Profile Image"}</h5>

                                            {this.props.idSuccess ?
                                                <span className="cardUploadBtDeclined" style={{ background: "green" }}>{lang.uploaded||"UPLOADED"}</span> : ''
                                            }

                                            {/* <div className="row cardUploadBtButtonLayout"> */}
                                            <div className="form-row cardUploadBtButtonLayout">
                                                <div className="col-12  pr-0">
                                                    <div className="row justify-content-center">

                                                        <div className="col-8 px-0">
                                                            <div className="input-file-container">
                                                                <label htmlFor="dpFile" style={{ float: 'left', width: '100%' }}>
                                                                    <input className="input-file mt-2" name="dpFile" id="dpFile" type='file' onChange={this.props.handleFileUploadDP} />
                                                                    {/* <label tabIndex="0" htmlFor="my-file" style={{ width: "100%" }} className="input-file-trigger">Select File</label> */}
                                                                    <img src={
                                                                        this.props.userProfileDetail && this.props.userProfileDetail.profilePic && !this.state.showPreviewforDP ?
                                                                            this.props.userProfileDetail.profilePic :
                                                                            "static/icons/Common/UserDefault.imageset/signup_profile_defalut_image@3x.png"} id="dpImg" className="editProfDP" alt="signup_profile" />
                                                                    {/* <br /> */}
                                                                    {this.props.showPreviewforDP ? '' :
                                                                        <a style={{ marginLeft: "12px" }} onClick={() => this.props.submitFileDP()}>{lang.uploadNewImage||"Upload new image"}</a>
                                                                    }
                                                                    {/* <a style={{ color: ENV_VAR.BASE_COLOR, cursor: 'pointer' }}> {this.props.showPreviewforDP ? "Change" : "Select From Folder"}</a> */}
                                                                </label>

                                                            </div>
                                                        </div>
                                                        <div className="col-3">
                                                            {this.props.showPreviewforDP ?
                                                                <a id="changeProfileEmail" style={{ right: "12px" }} className="changeProfileAnch" onClick={() => this.props.submitFileDP()}>{lang.upload||"UPLOAD"}</a> : ''
                                                            }
                                                        </div>
                                                    </div>


                                                </div>

                                                <div className="col-12">
                                                    {this.props.showPreviewforID ? <p><span style={{ fontWeight: 500 }}>{lang.selectedFile||"Selected File"}: </span><span id="idPicName"></span><span className="float-right crossButton" style={{ fontSize: "20px", fontWeight: 450 }} onClick={() => this.props.resetFileControl(1)}>&times;</span></p> : ''}
                                                </div>
                                            </div>
                                            <LinearProgressBar loading={this.props.dpLoading} />
                                        </div>

                                    </div>

                                </div>
                            </div>

                            <div className="row justify-content-center">
                                <div className="col-11">
                                    <form className="loginProfileUpdateForm">
                                        {
                                            this.props.state.showPhoneUpdate ?
                                                <div>
                                                    <div className="form-row border">
                                                        <div className="col-12">
                                                            <PhoneInput
                                                                country={this.state.contryCode}
                                                                placeholder={lang.entPhoneNumber||"Enter phone number"}
                                                                value={this.props.state.loginPhone}
                                                                onChange={this.props.updateLoginPhone}
                                                                id="loginPhone"
                                                            // onBlur={props.checkPhone}
                                                            // error={
                                                            //     this.props.state.loginPhone && this.props.state.loginPhone.length > 0 ?
                                                            //         (isValidPhoneNumber(this.props.state.loginPhone) ? (isPhoneValid = true, undefined) : (isPhoneValid = false, 'Invalid phone number')) : ''}
                                                            />
                                                        </div>
                                                        {/* <div className="form-group col-3">
                                                            <Intelinput id="login-intel-input" />
                                                        </div>
                                                        <div className="form-group col-9">
                                                            {this.inputPhone({ label: 'New Phone Number', type: "text", value: this.props.state.phoneNumber, onChange: this.props.updatePhone })}
                                                        </div> */}
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="form-group col-6">
                                                            <button type="button" className="btn btn-primary form-control loginAndSignUpButton waves-effect waves-light" onClick={() => this.props.updatePhoneState()}>{lang.updatePhone||"UPDATE PHONE"}</button>
                                                        </div>
                                                        <div className="form-group col-6">
                                                            <button type="button" className="btn btn-default form-control loginProfileUpdateCancelBtn" onClick={this.props.clearAll}>{lang.cancel||"Cancel"}</button>
                                                        </div>
                                                    </div>

                                                </div>
                                                :
                                                this.props.state.showOldPhoneOTPForm ?

                                                    <div className="form-group mb-4">
                                                        <p style={{ fontSize: "1rem" }}> {lang.mobileNumber||`We have sent the 6 digit verification code on "Mobile Number"`} </p>
                                                        {this.inputOTP({ label: lang.oneTimePassword||'One time password', type: "text", value: this.props.state.otpData.otp, onChange: this.props.updateOtp })}
                                                        <button type="button" className="btn btn-primary form-control loginAndSignUpButton waves-effect waves-light" onClick={() => this.props.verifyOtp()}>{lang.verifyC||"VERIFY"}</button>
                                                    </div> :
                                                    this.props.state.showNewPhoneOTPForm ?
                                                        <div className="form-group mb-4">
                                                            <p style={{ fontSize: "1rem" }}> {lang.mobileNumber||`We have sent the 6 digit verification code on "Mobile Number"`} </p>
                                                            {this.inputOTP({ label: 'One time password', type: "text", value: this.props.state.otpData.otp, onChange: this.props.updateOtp })}
                                                            <button type="button" className="btn btn-primary form-control loginAndSignUpButton waves-effect waves-light" onClick={() => this.props.saveNewPhone()}>{lang.verifyC||"VERIFY"}</button>
                                                        </div>
                                                        :
                                                        <div className="form-group mb-4 initialInput" id="numberPhoneOld">
                                                            {this.inputForm({ label: 'Phone Number', type: "text", value: this.props.state.userProfileDetail ? this.props.state.userProfileDetail.mobile : "", isDisabled: false })}
                                                            <a id="changeProfileNumber" className="changeProfileAnch" onClick={() => this.props.sendOtp()}>{lang.change||"CHANGE"}</a>
                                                        </div>
                                        }

                                        {
                                            this.props.state.showEmailUpdate ?

                                                <div>
                                                    <div className="form-row">
                                                        <div className="form-group col-12">
                                                            {this.inputForm({ label: 'New Email', type: "text", value: this.props.state.email, onChange: this.props.updateEmail })}
                                                        </div>
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="form-group col-6">
                                                            <button type="button" className="btn btn-primary form-control loginAndSignUpButton" onClick={() => this.props.saveNewEmail()}>{lang.updateEmail||"UPDATE EMAIL"}</button>
                                                        </div>
                                                        <div className="form-group col-6">
                                                            <button type="button" className="btn btn-default form-control loginProfileUpdateCancelBtn" onClick={this.props.clearAll}>{lang.cancel||"Cancel"}</button>
                                                        </div>
                                                    </div>

                                                </div>
                                                :
                                                <div className="form-group mb-4 initialInput" id="emailOld">
                                                    {this.inputForm({ label: 'Email', type: "text", value: this.props.userProfileDetail ? this.props.userProfileDetail.email : "", isDisabled: false })}
                                                    <a id="changeProfileEmail" className="changeProfileAnch" onClick={() => this.props.updateEmailState()}>{lang.change||"CHANGE"}</a>
                                                </div>
                                        }
                                        {
                                            this.props.state.showPasswordUpdate ?
                                                <div>
                                                    <div className="form-row">
                                                        <div className="form-group col-12">
                                                            {this.inputForm({ label: lang.oldPass||'Old Password', type: "password", value: this.props.state.actualOldPass, onChange: this.props.actualOldPassHandler })}
                                                        </div>
                                                        <div className="form-group col-12">
                                                            {this.inputForm({ label: lang.newPass||'New Password', type: "password", value: this.props.state.oldPass, onChange: this.props.oldPassHandler })}
                                                        </div>
                                                        <div className="form-group col-12">
                                                            {this.inputForm({ label: lang.reEnter||'Re-Enter New Password', type: "password", value: this.props.state.newPass, onChange: this.props.newPassHandler })}
                                                        </div>
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="form-group col-6">
                                                            <button type="button" className="btn btn-primary form-control loginAndSignUpButton" onClick={() => this.props.saveNewPassword()}>{lang.updatePass||"UPDATE PASSWORD"}</button>
                                                        </div>
                                                        <div className="form-group col-6">
                                                            <button type="button" className="btn btn-default form-control loginProfileUpdateCancelBtn" onClick={this.props.clearAll}>{lang.cancel||"Cancel"}</button>
                                                        </div>
                                                    </div>
                                                </div>

                                                :
                                                <div className="form-group mb-4 initialInput">
                                                    {this.inputForm({ label: 'Password', type: "password", isDisabled: true, id: "editPwd", value: "*****" })}
                                                    <a id="changeProfileEmail" className="changeProfileAnch" onClick={() => this.props.updatePasswordState()}>{lang.change||"CHANGE"}</a>
                                                </div>
                                        }

                                        <LinearProgressBar error={this.props.state.error} />
                                        {this.props.emailSuccess ? <LinearProgressBar successMsg={lang.emailSucces||"Email Updated Successfully"} success={true} loading={this.props.loading} /> : ''}
                                        {this.props.passwordSuccess ? <LinearProgressBar successMsg={lang.passwordUpdate||"Password Updated Successfully"} success={true} loading={this.props.loading} /> : ''}
                                        {this.props.phoneSuccess ? <LinearProgressBar successMsg={lang.phoneUpdate||"Phone Updated Successfully"} success={true} loading={this.props.loading} /> : ''}

                                        {this.props.state.loading ? <CircularProgressLoader /> : ''}

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </LeftSlider>

                <StoreRightSlider onRef={ref => (this.StoreSlider = ref)} stores={this.props.stores && this.props.stores.data ? this.props.stores.data : []} width={this.state.SliderWidth} changeStore={this.props.changeStore} />

                <Dialog
                    title={lang.cancelOrder||"Are you sure, you want to cancel the order?"}
                    modal={false}
                    open={this.state.open}
                    titleStyle={{ fontSize: "19px" }}
                    onRequestClose={this.handleReasonDialogClose}
                >
                    {
                        this.state.reasonArray && this.state.reasonArray.length > 0 ?
                            this.state.reasonArray.map((reason, key) =>
                                <label key={"reason" + reason.reasons} className="ordBtnContainer">
                                    <p className="mb-2" style={{ color: '#444', fontSize: "15px", fontWeight: 400 }}>{reason.reasons}</p>
                                    <input type="radio" name="radio" value="1" onClick={() => this.props.setCancelData(reason)} />
                                    <span className="ordBtnContainerMark"></span>
                                </label>
                            ) : ''
                    }

                    <div className="col-12 mt-4 text-left">
                        <button style={{ background: ENV_VAR.BASE_COLOR }} disabled={!this.props.selectedReason} title={lang.cancelOrderres||"Please select the reason to cancel the order"} className="btn mr-2 reasonCnfBtn" onClick={() => this.handleOrderCancel(this.state.selectedOrder.orderId)}>{lang.confirm||"Confirm"}</button>
                        <button className="btn mr-2 reasonCnfBtn" onClick={this.handleReasonDialogClose}>{lang.cancel||"Cancel"}</button>
                        {/* <p className="mt-1" style={{ fontSize: '11px' }} > <a  className="text-danger">cancle</a>  </p> */}

                        {this.props.ordercancelErr ?
                            <p className="text-danger py-2">{lang.cancelOrderError||"Sorry! we couldn't cancel your order. Please try after some time"}</p>
                            : ''}
                    </div>
                </Dialog>


            </Wrapper>
        )
    }
}

const mapStateToProps = state => {
    return {
        reduxState: state,
        stores: state.stores,
        myCart: state.cartList,
        appConfig: state.appConfig,
        lang:state.locale
    };
};

export default withStyles(styles)(connect(mapStateToProps)(ProfileComponent))