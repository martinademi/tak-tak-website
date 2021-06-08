import React from 'react';
import { connect } from 'react-redux'
import Link from "next/link";
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import Header from '../components/header/innerPageHeader'
import ProfileComponent from '../components/profile/myProfile';
import OrderSlider from '../components/profile/itemList';
import AddressSlider from '../components/profile/myAddress';
import FavouriteSlider from '../components/profile/myFavourites';
import OfferSlider from '../components/profile/myOffers';
import WishlistSlider from '../components/profile/wishlist';
import FaqSlider from '../components/profile/faqs';
import ReferSlider from '../components/profile/referFriend';
import HelpSlider from '../components/profile/help';
import LiveTrackSlider from '../components/profile/liveTrack';
import LanguageSlider from '../components/profile/language';
import Authmodals from '../components/authmodals/index'
import Footer from '../components/footer/Footer'
import * as actions from '../actions/index'
import * as $ from "jquery";
import { getCookie, getCookiees, setCookie } from '../lib/session'
import { getAddress, deleteAddress } from '../services/address'
import { getCustomerProfile, updateCustomerDetail, getWalletDetail, rechargeWallet, getWalletHistory, getTicketDetail,getOrderDetail } from '../services/profileApi'
import { getCustomerOrders } from '../services/profileApi'
import { sendOtp, verifyOtp } from '../services/otp'
import { editFavtService, getWishlist, getFavtProducts, getCards, deleteCard, cancelOrder, getCancelReasons } from '../services/cart'
import redirect from '../lib/redirect'
import { redirectIfNotAuthenticated, redirectIfNotAuthorized, getLocation } from "../lib/auth"
import NewAddressSlider from '../components/Adress/newAddress'
import EditAddressSlider from '../components/Adress/editAddress'
import CircularProgressLoader from '../components/ui/loaders/circularLoader'
import { checkEmailPhone, checkOldPassword } from '../services/auth';
import Wrapper from '../hoc/wrapperHoc';
import { getOffers } from '../services/filterApis';
import ActionResponse from '../components/dialogs/actionResponse';
import LabelBottomNavigation from '../components/footer/BottomNavigation'
import AddCardLeftSlider from '../components/checkout/addCard';
import WalletHistorySlider from '../components/checkout/walletHistory';
import WalletMobileSlider from '../components/checkout/walletMobile';
import AddCardLeftSliderMobile from '../components/checkout/addCardMobile';
import CardSlider from '../components/checkout/viewAllCards';
import ProductDialog from '../components/dialogs/productDialog';
import * as ENV_VAR from '../lib/envariables'
import Router from "next/router";
import RatingSlider from '../components/profile/rating';
import LogOutDialog from '../components/dialogs/logOut';
import "../assets/style.scss";
import "../assets/login.scss";
import Drawer from 'material-ui/Drawer/Drawer';

class Profile extends React.Component {
    lang= this.props.lang
    static async getInitialProps({ ctx }) {
        let token = getCookiees("token", ctx.req);
        let lat = getCookiees("lat", ctx.req);
        let lng = getCookiees("long", ctx.req);
        let zoneID = getCookiees("zoneid", ctx.req);
        const userName = await getCookiees("username", ctx.req)
        const isAuthorized = await getCookiees("authorized", ctx.req)
        let zoneDetails = await getCookiees("zoneDetails", ctx.req) || null;
        const queries = ctx.query
        // let lang = await (queries.lang || getCookiees("lang", ctx.req)) || "en";
        // ctx && ctx.store ? ctx.store.dispatch(actions.selectLocale(lang)) : ''
        if (redirectIfNotAuthenticated(ctx)) {
            return {};
        }

        // if (redirectIfNotAuthorized(ctx)) {
        //     return {};
        // }
        return { zoneID, isAuthorized, token, queries, zoneDetails }
    }


    state = {
        stepIndex: 0,
        open: false,
        SliderWidth: 450,
        isAuthorized: this.props.isAuthorized,
        pastOrders: [],
        currentOrders: null,
        addressList: [],
        favtProducts: [],
        offerProducts: [],
        userProfileDetail: null,
        loader: false,
        SliderWidth: 0,
        showPhoneUpdate: false,
        showOldPhoneOTPForm: false,
        showNewPhoneOTPForm: false,
        showEmailUpdate: false,
        showPasswordUpdate: false,
        phoneNumber: '',
        email: '',
        otpData: {
            otp: '',
            otpVerified: false,
            otpShow: false,
        },
        orderData: null,
        selectedOrderForTrack: null,
        center: {
            lat: 0,
            lng: 0,
            place: ''
        },
        zoom: 11,
        flatNumber: '',
        taggedAs: '',
        landmark: '',
        home: true,
        office: false,
        orderPaging: {
            pageIndex: 0,
            type: 1
        },
        totalOrderCount: 0,
        viewType: "deskView",
        addressToEdit: null,
        showImageUploads: false,
        file: null,
        showPreview: false,
        showPreviewforID: false,
        showPreviewforMMJ: false,
        showPreviewforDP: false,
        idSuccess: false,
        dpSuccess: false,
        walletHistoryWidth: 450,
        selectedCard: [],
        listArray: [],
        selectedReason: "",
        ordercancelErr: null,
        countryIntl: "IN",
        loginPhone: '',
        notifications: {},
        selectedLiveTrackData: false
    }



    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.saveNewEmail = this.saveNewEmail.bind(this);
        this.opendrawer = this.opendrawer.bind(this);
        this.opendrawerForMobile = this.opendrawerForMobile.bind(this);
        this.openProductDialog = this.openProductDialog.bind(this);
    }

    componentWillReceiveProps(newProps, state) {


        // if (props.userProfileDetail != state.userProfileDetail) {
        if (getCookie("authorized") && !this.state.userProfileDetail) {
            this.setState({ userProfileDetail: newProps.userProfileDetail })
        }


        // check if the selected store already available in state or not
        if (newProps.selectedStore && newProps.selectedStore.businessName && newProps.selectedStore.businessName != this.state.selectedStore) {
            this.setState({ selectedStore: newProps.selectedStore.businessName }) // update selected store in local state
        }

        // check if the order id (bid) is available in new ( upcomming props ), if available fetch orders via api, so new order status can reflect in UI.      
        if (newProps.notifications && newProps.notifications.bid) {
            if (this.props.notifications && this.props.notifications.bid && newProps.notifications.action != 14 && this.props.notifications.bid === newProps.notifications.bid || !this.state.selectedLiveTrackData) {

                let orderData = {
                    pageIndex: 0,
                }
                //active orders
                orderData["type"] = 2;
                getCustomerOrders(orderData).then(({ data }) => {

                    data.error ? '' :
                        (this.setState({ currentOrders: data, selectedLiveTrackData: true }),
                            this.state.selectedOrderForTrack && data.data && data.data.ordersArray.findIndex((item) => item.orderId == this.state.selectedOrderForTrack.orderId) >= 0 ?
                                this.LiveTrackRef.updateData(data.data.ordersArray[data.data.ordersArray.findIndex((item) => item.orderId == this.state.selectedOrderForTrack.orderId)]) : ''
                            // this.LiveTrackRef.updateData(9090)
                        )


                })

                //past orders
                orderData["type"] = 1;
                getCustomerOrders(orderData).then(({ data }) => {
                    if (!data.error) {
                        if (this.state.selectedOrderForTrack && data.data && data.data.ordersArray && data.data.ordersArray.findIndex((item) => item.orderId == this.state.selectedOrderForTrack.orderId) >= 0) {
                            if (data.data.ordersArray[data.data.ordersArray.findIndex((item) => item.orderId == this.state.selectedOrderForTrack.orderId)].statusCode >= 13) {
                                this.LiveTrackRef.updateData(9090);
                            }
                        }
                    }
                    data.error ? '' : data.data ? this.setState({ pastOrders: data.data.ordersArray, totalOrderCount: data.data.ordersArray.length, selectedLiveTrackData: true }) : ''
                })
            }

            // check for the live track, update map driver position with latest lat long
            if (newProps.notifications.action == 14 && this.state.currentOrders && this.state.selectedOrderForTrack) {
                let orderData = this.state.selectedOrderForTrack;
                let indexOfOrder = this.state.currentOrders.data.ordersArray.findIndex((item) => item.orderId == this.state.selectedOrderForTrack.orderId);
                if (indexOfOrder > -1) {
                    orderData = { ...this.state.currentOrders.data.ordersArray[indexOfOrder], driverLatitude: newProps.notifications.latitude, driverLongitude: newProps.notifications.longitude }
                  
                    this.LiveTrackRef.updateData(orderData)

                }


            }
        }
    }
    // for the order details
    MoreDetails =(orderId)=>{
        getOrderDetail(orderId).then(data=>{
            data.error ? "" : this.setState({ selectedOrder123: data.data.data, loading: false })
        })
    }
    toggleLeftModalHandler = (screen) => {
        this.setState({ SliderWidth: screen == "isMobile" ? "100%" : 450 })
    }
    toggleRightModalHandler = () => {
        this.setState({ RightSliderWidth: 450 })
    }
    showLoginHandler = (isMobile) => { this.handleRequestClose(); this.child.showLoginHandler(isMobile) }
    showLocationHandler = () => { this.child.showLocationHandler() }
    showLocationMobileHandler = () => { this.child.showLocationMobileHandler() }
    showCart = () => { this.child.showCart() }
    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };
    // list.sort((a, b) => (a.color > b.color) ? 1 : -1)
    deleteAddress = (event, addressToDelete) => {
        this.setState({ loader: true })
        let ind = this.state.addressList.findIndex((item) => item._id == addressToDelete._id);
        ind >= 0 ?
            (
                deleteAddress(addressToDelete["_id"])
                    .then(() => {

                        let addressList = this.state.addressList

                        addressList.splice(ind, 1);

                        this.setState({ addressList: addressList, loader: false })
                    })
            ) : ''
    }
    addToCart = (data, event) => {
        event.stopPropagation();
        let cartData;
        this.state.isAuthorized ?
            (cartData = {
                childProductId: data.childProductId,
                unitId: data.unitId,
                quantity: parseFloat(1).toFixed(1),
                storeType: getCookie("storeType"),
                addOns: []
            },
              
                this.props.dispatch(actions.initAddCart(cartData))
            ) : this.showLoginHandler();
    }
    // cart
    editCart = (cartDetail, product, type, event) => {
        event.stopPropagation();

        let editCartData = {
            cartId: this.props.reduxState.cartList.cartId,
            childProductId: cartDetail.childProductId,
            unitId: cartDetail.unitId,
        }

        type == 1 ? editCartData['quantity'] = cartDetail.quantity - 1 : editCartData['quantity'] = cartDetail.quantity + 1

        this.props.dispatch(actions.editCard(editCartData))
    }
    // remove from the fav 
    removeFromFavt = (product) => {
        let data = {
            childProductId: product.childProductId,
            parentProductId: product.parentProductId
        }
        editFavtService(data)
            .then(({ data }) => {
                toastr.success(data.message)

                let favtdata = {
                    storeID: getCookie("storeId"),
                    zoneID: getCookie("zoneid"),
                    type: 0
                }
                getOffers(favtdata).then(({ data }) => {
                    data.error ? '' : (this.setState({ favtProducts: data.data }))
                })
            })
    }
    handleClose = () => {
        this.setState({ SliderWidth: 0, showPhoneUpdate: false, showNewPhoneOTPForm: false, showOldPhoneOTPForm: false, showEmailUpdate: false, showPasswordUpdate: false })
    }

    callingApiTip=(orderId)=>{
        getOrderDetail(this.state.orderData && this.state.orderData.orderId ||orderId).then(data=>{
          
            this.setState({orderValue : data.data})
        })
    }
    handleRightSliderClose = () => {
        this.setState({ RightSliderWidth: 0 });
        this.OrderRef.handleClose();
    }
    // Mobile Updation  Functions
    updatePhone = (e) => { this.setState({ phoneNumber: e.target.value }) }
    updateLoginPhone = (phone) => {
        const phoneNumber = phone ? parsePhoneNumberFromString(phone.toString()) : ''
        const countryIntl = phoneNumber ? phoneNumber.country : "IN"
        const re = /[0-9]+/g;
        // if ((e.target.value === '' || re.test(e.target.value)) && e.target.value.length <= 10) {
        this.setState({ loginPhone: phone, cc: phoneNumber ? "+" + phoneNumber.countryCallingCode : "+91", lgPhone: phoneNumber ? phoneNumber.nationalNumber : '', countryIntl: countryIntl })
        // }
    }
    updateOtp = (e) => {
        this.setState({ otpData: { ...this.state.otpData, otp: e.target.value } })
    }
    sendOtp = () => {

        this.setState({ showPhoneUpdate: true, showEmailUpdate: false, showPasswordUpdate: false })
        // sendOtp(this.state.userProfileDetail.mobile).then((otpRes) => {
        //     !otpRes.error ?
        //         this.setState({ otpData: { ...this.state.otpData, otpShow: true, otp: '' }, showOldPhoneOTPForm: true }) : this.updateCallError(otpRes.data.message)
        // })
    }
    verifyOtp = () => {
        let data;
        let cc = this.state.cc || $(".loginProfileUpdateForm .selected-dial-code").text();
       
        data = {
            mobile: this.state.lgPhone,
            // mobile: this.state.userProfileDetail.mobile,
            countryCode: cc,
            code: this.state.otpData.otp
        }
        verifyOtp(data).then((res) => {
            !res.error ? this.setState({ showPhoneUpdate: true }) : (this.updateCallError(res.data.message))
        }).catch((error) => { })
    }
    updatePhoneState = () => {
        this.checkPhone()
            .then(() => {
                let cc = this.state.cc || $(".loginProfileUpdateForm .selected-dial-code").text();
                sendOtp(this.state.lgPhone, cc).then((otpRes) => {
                    !otpRes.error ?
                        this.setState({ showNewPhoneOTPForm: true, showPhoneUpdate: false, showOldPhoneOTPForm: false, otpData: { ...this.state.otpData, otp: '' }, cc: cc }) : this.updateCallError(otpRes.data.message)
                })
            })
            .catch(() => {
                this.updateCallError(this.lang.alreadyExist||"Mobile Number already exists. Try different number");

            })
    }
    // for change the phone number
    checkPhone = (event) => {

        let data = {
            countryCode: this.state.cc,
            mobile: this.state.lgPhone,
            verifyType: 1
        }
        return new Promise((resolve, reject) => {
            checkEmailPhone(data)
                .then((res) => {
                    if (res.error) {
                       
                        // this.setState({ phoneNotAvailable: false }, () => {
                        //     // this.setControlFocus("loginPassword");
                        // })
                        return reject(res);
                    } else {
                      
                        this.setState({ phoneNotAvailable: true })
                        // , signup: { ...this.state.signup, phone: this.state.lgPhone }
                        // this.showSignupHandler();
                        return resolve(1);
                    }
                })
        })

    }
    // save new phone number
    saveNewPhone = () => {

        // this.ActionRes.openDialog();

        let data;
        // let cc = $(".loginProfileUpdateForm .selected-dial-code").text();
        let cc = this.state.cc;
        data = {
            mobile: this.state.lgPhone,
            countryCode: this.state.cc,
            code: this.state.otpData.otp
        }
        this.setState({ loader: true })
        // this.setState({ loadingMsg: "Please Wait...", successMsg: null, actionErrMsg: null })
        verifyOtp(data).then((res) => {
            // let cc = $(".loginProfileUpdateForm .selected-dial-code").text();
            res.error ? (this.updateCallError(this.lang.invalidOtp||"Invalid OTP"), this.setState({ loader: false, actionErrMsg: res.data.message, loadingMsg: null, successMsg: null })) :
                updateCustomerDetail({
                    countryCode: cc,
                    mobile: this.state.lgPhone
                }).then((res) => {
                    res.error ? (this.updateCallError(res.data.message), this.setState({ loader: false, actionErrMsg: res.data.message, loadingMsg: null, successMsg: null })) :
                        (

                            this.setState({ loader: false, phoneSuccess: true, showNewPhoneOTPForm: false, userProfileDetail: { ...this.state.userProfileDetail, mobile: this.state.lgPhone } }),
                            this.updateCallSuccess()
                            // this.ActionRes.openDialog(),
                            // this.profileRef.handleLeftSliderClose()
                            // this.setState({ actionErrMsg: null, loadingMsg: null, successMsg: "Mobile Updated Successfully", userProfileDetail: { ...this.state.userProfileDetail, mobile: this.state.phoneNumber } })
                        )
                })
        });
    }

    // Email Updation Function
    updateEmail = (e) => this.setState({ email: e.target.value })
    updateEmailState = () => {
        this.setState({ showPhoneUpdate: false, showEmailUpdate: true, showPasswordUpdate: false })
    }
    saveNewEmail = () => {
        let checkEmail = null;
        this.state.email ? (

            // this.ActionRes.openDialog(),
            checkEmail = { verifyType: 2, email: this.state.email },
            this.setState({ loader: true }),
            // this.setState({ loadingMsg: "Please Wait...", successMsg: null, actionErrMsg: null }),
            checkEmailPhone(checkEmail)
                .then((res) => {
                    res.error ? (this.updateCallError(this.lang.emailError||"This email address is already registered with us, please try a different email address."), this.setState({ loader: false, actionErrMsg: this.lang.emailError||"This email address is already registered with us, please try a different email address.", loadingMsg: null, successMsg: null })) :
                        updateCustomerDetail({
                            email: this.state.email
                        }).then((res) => {
                            res.error ? (this.updateCallError(res.data.message), this.setState({ loader: false, actionErrMsg: res.data.message, loadingMsg: null, successMsg: null })) :
                                (
                                    this.setState({ loader: false, emailSuccess: true, userProfileDetail: { ...this.state.userProfileDetail, email: this.state.email }, showEmailUpdate: false }),
                                    this.updateCallSuccess()
                                    // this.profileRef.handleLeftSliderClose()
                                    // this.setState({ loader: false, actionErrMsg: null, loadingMsg: null, successMsg: "Email Updated Successfully" })
                                    // this.ActionRes.openDialog()
                                )
                        })
                })
        ) : ''
    }
    handleResponseActions = () => { }
    handleErrResponseActions = () => { }
    // Password Updation  Function
    actualOldPassHandler = (e) => this.setState({ actualOldPass: e.target.value })
    oldPassHandler = (e) => this.setState({ oldPass: e.target.value })
    newPassHandler = (e) => this.setState({ newPass: e.target.value })
//update password 
    updatePasswordState = () => {
        this.setState({ showPhoneUpdate: false, showEmailUpdate: false, showPasswordUpdate: true })
    }
    // save new password 
    saveNewPassword = () => {

        // this.setState({ errLoading: true })
        this.setState({ loadingMsg: this.lang.wait||"Please Wait...", successMsg: null, actionErrMsg: null })
        let pwdCheckData = {}

        this.state.actualOldPass && this.state.oldPass && this.state.newPass ? (
            // this.profileRef.handleLeftSliderClose(),
            // this.ActionRes.openDialog(),
            this.setState({ loader: true }),
            pwdCheckData["Mobile"] = this.state.userProfileDetail.mobile,
            pwdCheckData["countryCode"] = this.state.userProfileDetail.countryCode,
            pwdCheckData["password"] = this.state.actualOldPass,

            checkOldPassword(pwdCheckData) // verify old password
                .then((data) => {
                    data.error && data.status == 401 ?
                        (this.setState({ loader: false, actionErrMsg: this.lang.oldPassword||"Old password is not correct !", loadingMsg: null, successMsg: null, passError: this.lang.oldPassword||"Old password is not correct !", errLoading: false }),
                            this.updateCallError(this.lang.oldPassword||"Old password is not correct")) :
                        (
                            this.state.oldPass && this.state.newPass && this.verifyPassword() === 0 ?
                                (
                                    // this.setState({ loader: true }),
                                    this.state.newPass != this.state.actualOldPass ?
                                        updateCustomerDetail({
                                            password: this.state.newPass
                                        }).then((res) => {
                                            res.error ? (this.updateCallError(res.data.err), this.setState({ actionErrMsg: res.data.message, loadingMsg: null, successMsg: null })) :
                                                (
                                                    this.setState({ actionErrMsg: null, loadingMsg: null, passwordSuccess: true, successMsg: "Password Updated Successfully", loader: false, newPass: '', oldPass: '', errLoading: false, showPasswordUpdate: false }),
                                                    this.updateCallSuccess()

                                                    // toastr.success('Password Updated Successfully')
                                                )
                                        }) : (this.updateCallError(this.lang.newPasswordError||"New password can't be same as old"), this.setState({ loader: false }))
                                ) : (this.updateCallError(this.lang.passwordNotMatch||"Password Must Match"), this.setState({ passError: this.lang.passwordNotMatch||"Password Must Match", errLoading: false, loader: false, actionErrMsg: this.lang.passwordNotMatch||"Password Must Match", loadingMsg: null, successMsg: null, }))
                        )
                })
        ) : ''

    }
    // verify the old password
    verifyPassword = () => {
        this.setState({ errLoading: true })
        let oldPass = this.state.oldPass; let newPass = this.state.newPass;
        return oldPass.localeCompare(newPass);
    }
    clearAll = () => { this.setState({ showPhoneUpdate: false, showEmailUpdate: false, showPasswordUpdate: false }) }
    updateCallError(res) {
        this.setState({ error: res, loading: false });
        setTimeout(() => {
            this.setState({ error: null })
        }, 3500)
    }
    updateCallSuccess(res) {
        // this.setState({ loading: false });
        setTimeout(() => {
            this.setState({ error: null, phoneSuccess: false, emailSuccess: false, passwordSuccess: false })
        }, 3500)
    }
    setOrderDetail = async (orderData) => {
        await this.setState({ orderData: orderData })
        this.toggleRightModalHandler();
        this.OrderRef.handleRightSliderOpen();
         this.callingApiTip();

    }
// to open the track order slider 
    handleTrackSliderOpen = (orderData) => {
        this.toggleRightModalHandler();
        this.setState({ selectedOrderForTrack: orderData })
        this.LiveTrackRef.handleLeftSliderOpen(orderData);
    }
// to get the location
    getGeoLocation = async () => {
        let lat = await getCookie("lat", '');
        let lng = await getCookie("long", '');
        await this.getAddress(lat, lng)
        await this.setState({ center: { ...this.state.center, lat: lat, lng: lng } })
    }
// get save address
    getAddress(lat, lng) {
        let geocoder = new google.maps.Geocoder();
        let latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({ 'latLng': latlng }, (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
                this.setState({ currentAddress: results[0].formatted_address })
            }
        })
    }

    opendrawer() { this.setState({ center: { ...this.state.center, lat: getCookie("lat"), lng: getCookie("long") } }); this.NewaddressRef.handleLeftSliderToggle() }
    opendrawerForMobile = async () => {
        await this.getGeoLocation();
        await this.NewaddressRef.handleLeftSliderToggleForMobile()
    }
    // update new address 
    updateLocation = (data) => {
        this.setState({ center: { ...this.state.center, lat: data.lat, lng: data.lng, place: data.address }, zoom: 13 })
    }
// update tags 
    updateTaggedAs = async (type) => {
        await this.setState({
            home: false,
            office: false,
            others: false,
            taggedAs: type,
            [type]: true
        })
    }
    updateCoords = (data) => {
        this.setState({ center: { ...this.state.center, lat: data.lat, lng: data.lng }, zoom: 13 })
    }
    clearAddressForm = () => {
        this.setState({
            home: false,
            office: false,
            others: false,
            taggedAs: '',
            center: { ...this.state.center, lat: 0, lng: 0, place: '' },
        })
    }

    updateAdress = (data) => {
        this.setState({
            addressList: this.state.addressList.concat(data)
        })
    }
    updateOldAddress = (data) => {
        this.state.addressList.map((addr, index) => {
            addr._id === data._id ? this.state.addressList[index] = data : ''
        })
    }
    handleOrderPaging = () => {
        this.setState({ orderPaging: { ...this.state.orderPaging, pageIndex: ++this.state.orderPaging.pageIndex } })
        let orderPageData = this.state.orderPaging;
        getCustomerOrders(this.state.orderPaging).then((data) => {
            !data.error ? this.setState({ pastOrders: this.state.pastOrders.concat(data.data.data.ordersArray), totalOrderCount: data.data.data.ordersArray.length }) : data.error.status == 404 ? this.setState({ totalOrderCount: 0 }) : ''
        })
    }
    handleAddressSliderOpen = async () => {
        // this.setState({ center: { ...this.state.center, lat: res.coords.latitude, lng: res.coords.longitude } })
        if (this.state.userProfileDetail) {
            await this.setState({ SliderWidth: "100%" });
            this.AddressRef.handleLeftSliderOpen();
        } else {
            this.child.showLoginHandler(window.outerWidth < 580);
        }
    }
    handleEditAdrSliderOpen = async (event, adrToEdit) => {
        this.clearAddressForm();
      
        let isMobile = window.outerWidth <= 580;
        // await this.getGeoLocation();
        await this.setState({ addressToEdit: adrToEdit, center: { ...this.state.center, lat: adrToEdit.latitude, lng: adrToEdit.longitude } });
        this.EditaddressRef.handleLeftSliderToggle(this.state.addressToEdit, isMobile);
    }
    handleFavouriteSliderOpen = () => {
        if (this.state.userProfileDetail) {
            this.setState({ SliderWidth: "100%" });
            this.FavouriteRef.handleLeftSliderOpen();
        } else {
            this.child.showLoginHandler(window.outerWidth < 580);
        }
    }
    handleOffersSliderOpen = () => {
        this.setState({ SliderWidth: "100%" })
        this.OffersRef.handleLeftSliderOpen();
    }
    handleWishlistSliderOpen = () => {
        if (this.state.userProfileDetail) {
            this.setState({ SliderWidth: "100%" })
            this.WishlistRef.handleLeftSliderOpen();
        } else {
            this.child.showLoginHandler(window.outerWidth < 580);
        }
    }
    handleFaqSliderOpen = () => {
        this.setState({ SliderWidth: "100%" })
        this.FaqRef.handleLeftSliderOpen();
    }
    handleReferFrndSliderOpen = () => {
        this.setState({ SliderWidth: "100%" })
        this.ReferFrndRef.handleLeftSliderOpen();
    }
    handleHelpSliderOpen = (viewType) => {
        viewType == "mobileView" ? this.setState({ SliderWidth: "100%", viewType: viewType }) : this.setState({ SliderWidth: 450, viewType: viewType })
        this.HelpRef.handleLeftSliderOpen();
    }

    handleLanguageSliderOpen = () => {
        this.setState({ SliderWidth: "100%" })
        this.LanguageRef.handleLeftSliderOpen();
    }
    handleFileUpload = (event) => {
        this.setState({ file: event.target.files, showPreviewforMMJ: true });
        var reader = new FileReader();

        reader.onload = function (e) {
            var flInput = document.getElementById("mmjFile").value;
            var filename = flInput.replace(/^.*[\\\/]/, '')
            document.getElementById("mmjName").innerHTML = filename;
        };
        reader.readAsDataURL(event.target.files[0]);
    }
    handleRating = (orderData) => {
        this.OrderRatingRef.handleOpen(orderData);
    }
    setOrderRatings = (value) => {

    }
    setCancelData = (reason) => { this.setState({ selectedReason: reason.reasons }) }
    callCancelOrder = (id) => {

        this.setState({ loader: true })
        let dataReq = {
            orderId: id,
            latitude: Number(getCookie("lat", '')),
            longitude: Number(getCookie("long", '')),
            ipAddress: '54.183.192.28',
            reason: this.state.selectedReason
        }

        // this.handleReasonDialogOpen();
// cancel order
        cancelOrder(dataReq)
            .then((data) => {

                data.error ? (this.setState({ ordercancelErr: true, loader: false }), (setTimeout(() => {
                    this.profileRef.handleReasonDialogClose()
                    this.setState({ ordercancelErr: null })
                }, 4000)))
                    :
                    (
                        // this.props.dispatch(actions.getCart())
                        this.setState({ loader: false }),
                        this.getCustomerOrders(),
                        this.profileRef.handleReasonDialogClose()
                    )
            })
    }
    componentWillUpdate = (newProps) => {
        if (this.props.userProfileDetail && newProps.userProfileDetail && newProps.userProfileDetail.email != this.props.userProfileDetail.email || !this.state.ticketHistory) {
           
            // this.getTickets();
        }
    }


    componentDidUpdate = (newProps) => {
      
        if (window && window.outerWidth > 580 && !getCookie("authorized")) {
           
            window.location.href = "/";
        }

      
    }

// file upload 
    submitFile = (e) => {
        AWS.config.update({
            "accessKeyId": "AKIAIUEEKTGNKHAC6NYQ",
            "secretAccessKey": "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",
            "region": "us-east-1"
        });

        var s3 = new AWS.S3();
        let tStamp = +new Date();
        var params = {
            Bucket: 'loopzadmin',
            Key: 'Customers/MMJPic/' + "MMJPic_" + getCookie("sid"),
            ContentType: this.state.file[0].type,
            Body: this.state.file[0],
            ACL: 'public-read'
        };
        this.setState({ loading: true, mmjLoading: true })
        s3.putObject(params, (err, res) => {
            if (err) {

                this.setState({ mmjLoading: false })
            } else {
                this.setState({ mmjSuccess: true, showPreviewforMMJ: false, mmjLoading: false })
                let data = {
                    mmjCard: "https://s3.amazonaws.com/loopzadmin/" + params.Key
                }
                updateCustomerDetail(data)
                    .then(({ data }) => { data.error ? '' : '' })
                this.setState({ loading: false })
            }
        });
    }
    handleFileUploadID = (event) => {
        this.setState({ idPicFile: event.target.files, showPreviewforID: true });
        let reader = new FileReader();

        reader.onload = function (e) {
            let flInput = document.getElementById("idPicFile").value;
            let filename = flInput.replace(/^.*[\\\/]/, '')
            document.getElementById("idPicName").innerHTML = filename;
        };
        reader.readAsDataURL(event.target.files[0]);
    }
    submitFileID = (e) => {
        AWS.config.update({
            "accessKeyId": "AKIAIUEEKTGNKHAC6NYQ",
            "secretAccessKey": "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",
            "region": "us-east-1"
        });

        var s3 = new AWS.S3();
        let tStamp = +new Date();
        var params = {
            Bucket: 'loopzadmin',
            Key: 'Customers/IDPic/' + "IDPic_" + getCookie("sid"),
            ContentType: this.state.idPicFile[0].type,
            Body: this.state.idPicFile[0],
            ACL: 'public-read'
        };
        this.setState({ loading: true, idLoading: true })
        s3.putObject(params, (err, res) => {
            if (err) {

                this.setState({ idLoading: false })
            } else {
                this.setState({ idSuccess: true, showPreviewforID: false, idLoading: false })
                let data = {
                    identityCard: "https://s3.amazonaws.com/loopzadmin/" + params.Key
                }
                updateCustomerDetail(data)
                    .then(({ data }) => { data.error ? '' : '' })
                this.setState({ loading: false })
            }
        });
    }
    handleFileUploadDP = (event) => {
        this.setState({ dpFile: event.target.files, showPreviewforDP: true });
        let reader = new FileReader();

        reader.onload = function (e) {
            let flInput = document.getElementById("dpFile").value;
            let filename = flInput.replace(/^.*[\\\/]/, '')
            // document.getElementById("idPicName").innerHTML = filename;
            document.getElementById("dpImg").src = e.target.result
        };
        reader.readAsDataURL(event.target.files[0]);
    }
    submitFileDP = (e) => {
        AWS.config.update({
            "accessKeyId": "AKIAIUEEKTGNKHAC6NYQ",
            "secretAccessKey": "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",
            "region": "us-east-1"
        });

        var s3 = new AWS.S3();
        let tStamp = +new Date();
        var params = {
            Bucket: 'loopzadmin',
            Key: 'Customers/Profile_Pic/' + "Profile_Pic_" + getCookie("sid"),
            ContentType: this.state.dpFile[0].type,
            Body: this.state.dpFile[0],
            ACL: 'public-read'
        };
        this.setState({ loading: true, dpLoading: true })
        s3.putObject(params, (err, res) => {
            if (err) {

                this.setState({ dpLoading: false })
            } else {
                this.setState({ dpSuccess: true, showPreviewforDP: false, dpLoading: false })
                let data = {
                    profilePic: "https://s3.amazonaws.com/loopzadmin/" + params.Key
                };

                this.props.dispatch(actions.getProfile());

                updateCustomerDetail(data)
                    .then(({ data }) => {
                        data.error ? toastr.error(this.lang.errorProfile||"Something went wrong while changing Picture") : (
                            this.props.dispatch(actions.getProfile()), this.setState({})),
                            toastr.success(this.lang.changSuccess||"Profile Picture Changed Successfully")
                    }
                    )

                this.setState({ loading: false })
            }
        });
    }
    resetFileControl = (type) => {
        // 1 - for ID reset, 2 - for MMJ card reset
        type == 1 ?
            (
                document.getElementById("idPicFile").value = '', this.setState({ showPreviewforID: false })
            ) :
            (
                document.getElementById("mmjFile").value = '', this.setState({ showPreviewforMMJ: false })
            )
    }
    editProfileMobile = () => {
        if (!getCookie("authorized")) {
            // show the login Drawer, if user has not logged in, pass the boolean if based on the screen size
            this.child.showLoginHandler(window.outerWidth < 580);
            return;
        }
        this.profileRef.toggleLeftModalHandler("isMobile");
    }
// change the store
    changeStore = (store) => {
        this.setState({ storeId: store.storeId, selectedStore: store.storeName, selectedStoreId: store.storeId }, () => {
            this.profileRef.closeSlider();
        })
        let zoneID = this.props.zoneID;
        setCookie("storeId", store.storeId)||0
        this.getOffersData(store.storeId ||0)
        this.getFavData(store.storeId)
    }
// get offer data
    getOffersData = (offerdata) => {

        getOffers(offerdata).then(({ data }) => {
            data.error ? '' : this.setState({ offerProducts: data.data })
        }).catch((err) => this.setState({ offerProducts: [] }))
    }
// get favrite products 
    getFavData = (favtData) => {
       
        getFavtProducts(getCookie("storeId") || getCookie("stroeCategoryId")||0, getCookie("zoneid")).then(({ data }) => {
            data.error ? '' : this.setState({ favtProducts: data.data })
        })
    }

    handleOrderQuery = (helpQuestion, viewType) => {
        viewType ?
            this.HelpRef.handleTicketDrawer(helpQuestion.que) : (this.HelpRef.addHandler(helpQuestion.que), this.setState({ SliderWidth: 450 }))
    }
    // get wallet details 
    getWalletDetail = () => {
        getWalletDetail().then((data) => {
            this.setState({ walletDetail: data.data.data })
        })
    }
    // get wallet history
    getWalletHistory = () => {
        let pageIndex = 1;
        getWalletHistory(pageIndex).then((data) => {
            data.error ? '' : this.setState({ walletHistory: data.data.data })
        })
    }
    // to recharge wallet
    rechargeWallet = () => {
        this.setState({ loader: true })
        let walletData = {
            cardId: this.state.defaultCard,
            amount: parseInt(this.state.walletRechargeAmount)
        }
        rechargeWallet(walletData).then((data) => {
            this.getWalletDetail()
            this.setState({ loader: false, walletRechargeAmount: '' }),
                toastr.success(this.lang.wallateRecharge||"Wallet recharged successfully")
        })
    }
    // to get the cards 
    getCustomerCards = () => {
        getCards().then(async ({ data }) => {
            await this.setState({ customerCards: data.data });
        })
    }
    handleAddCardSlider = () => {
        this.AddCardLeftSliderRef.handleLeftSliderOpen();
    }
// to delete thr card 
    deleteCard = () => {
        this.handleDeleteCard(this.state.selectedCard)
    }

    handleDeleteCard = (card) => {
        this.setState({ loader: true })
        deleteCard(card.id).then((data) => {
            data.error ? (this.setState({ loader: false, ApiMsg: this.lang.deleteCardError||"Something went wrong while deleting the Card. Please try again later" }), $("#infoModal").modal("show")) : (this.setState({ loader: false, ApiMsg: data.data.message }), this.getCustomerCards());
        })
    }
    determineCardTypeImage = (value) => {
        switch (value) {
            case 'MasterCard':
                return "/static/images/master-card.png";
                break;
            case 'Visa':
                return "/static/images/visa.png";
                break;
            case 'Discover':
                return "/static/images/discover.png";
                break;
            case 'American Express':
                return "/static/images/ae.png";
                break;
            default:
                return "/static/images/cc-icon.png";
                break;
        }
    };
    handleViewCardMobileSlider = () => {
        if (this.state.userProfileDetail) {
            this.CardSliderMobileRef.handleLeftSliderOpen();
        } else {
            this.child.showLoginHandler(window.outerWidth <= 580);
        }
    }
    handleAddCardMobileSlider = () => {
        if (this.state.userProfileDetail) {
           
            this.AddCardLeftSliderMobileRef.handleLeftSliderOpen();
            this.CardSliderMobileRef.handleClose();
        } else {
            this.child.showLoginHandler(window.outerWidth <= 580);
        }
    }

    handleWalletHistorySlider = (width) => {
        width === "100%" ? this.WalletMobileSliderRef.handleClose() : ''
        this.setState({ walletHistoryWidth: width })
        this.getWalletHistory();
        this.WalletHistorySliderRef.handleLeftSliderOpen();
    }

    setDefaultCard = (cardId, card) => {
        this.setState({ defaultCard: cardId, selectedCard: card })
    }

    setRechargeAmt = (e) => { this.allowOnlyNumber(e); this.setState({ walletRechargeAmount: e.target.value }) }

    handleWalletMobile = () => {
        if (this.state.userProfileDetail) {
            this.WalletMobileSliderRef.handleLeftSliderOpen();
        } else {
            this.child.showLoginHandler(window.outerWidth <= 580);
        }
    }
    // allow only the numbers
    allowOnlyNumber(e) {
        let char = e.which || e.keyCode
        if ((char >= 37 && char <= 40) || (char >= 48 && char <= 57) || (char >= 96 && char <= 105) || (char == 8) || (char == 9) || (char == 13)) {

        } else {
            e.preventDefault();
        }
    }
    openProductDialog(product) {
        // this.dialogRef.openProductDialog(product)
        this.handleDetailToggle(product);
    }
   // to redirect the products details page 
    handleDetailToggle = (post) => {
        Router.push(`/details?id=${post.childProductId}`).then(() => window.scrollTo(0, 0))
    }
    // toget the wishlist
    getWishlist = (data) => {
        getWishlist(data.listId, data.storeId).then((data) => {
            data.error ? '' : (this.setState({ listArray: data.data.data }))
        })
    }
// to get the active orders
    getCustomerOrders = () => {
        let orderData = {
            pageIndex: 0,
            type: 1
        }

        getCustomerOrders(orderData).then(({ data }) => {
            data.error ? '' : this.setState({ pastOrders: data.data.ordersArray, totalOrderCount: data.data.ordersArray.length })
        })
        orderData["type"] = 2;
        getCustomerOrders(orderData).then(({ data }) => {
            data.error ? '' : this.setState({ currentOrders: data })
        })
    }

    getFavtData = () => {
        let storeID = getCookie("storeId", '')
        this.getFavData(storeID);
    }
// to get the tickit 
    getTickets = () => {
     
        this.props.userProfileDetail ?
            getTicketDetail(this.props.userProfileDetail.email)
                .then(({ data }) => {
                    this.setState({ ticketHistory: data })
                }) : ''
    }

    componentDidMount() {

        let storeID = getCookie("storeId", '') || getCookie("stroeCategoryId")
        this.props.dispatch(actions.getCart())

        this.setState({ selectedStore: getCookie("storeName"), selectedStoreId: getCookie("storeId"), loader: true })

        let lat = getCookie("lat", '');
        let lng = getCookie("long", '');

        setTimeout(() => {
            this.props.dispatch(actions.getZones(lat, lng)) // dispatching actions to get currecy symbol based on zone      
        }, 200);

        let getStoresPayload = {
            lat: lat,
            long: lng,
            token: getCookie("token"),
            zoneId: getCookie("zoneid"),
            offset: 0,
            limit: 40,
            type: getCookie("categoryType"),
            categoryId: getCookie("categoryId")
        }

        setTimeout(() => {
            this.props.dispatch(actions.getStoresByType(getStoresPayload))
          
        }, 300);
        setTimeout(() => { this.props.dispatch(actions.getProfile()); }, 1000);
        setTimeout(() => { this.props.dispatch(actions.selectedStore(storeID)); }, 5000);

        storeID ? storeID = storeID.toString() : ''
        let zoneID = this.props.zoneID;

        let offerdata = {
            storeID: storeID,
            zoneID: zoneID,
            type: 2
        }

        let favtdata = {
            storeID: storeID,
            zoneID: zoneID,
            type: 0
        }
        let orderData = {
            pageIndex: 0,
            type: 1
        }
        let wishlistData = {
            listId: "0",  // send 0 for all list, and send listId for products inside the list
            storeId: storeID
        }

        getCustomerProfile().then((data) => {
            data.error ? this.checkForError(data) : this.setState({ userProfileDetail: data.data.data, loader: false });

            this.getTickets(); // get help and support tickets

        })

        this.getFavData(favtdata.storeID);
        this.getOffersData(offerdata.storeID);
        this.getWishlist(wishlistData);


        getCustomerOrders(orderData).then((data) => {

            data.error ? this.checkForError(data) : this.setState({ pastOrders: data.data.data.ordersArray, totalOrderCount: data.data.data.ordersArray.length })
        })
        orderData["type"] = 2;
        getCustomerOrders(orderData).then(({ data }) => {

            data.error ? '' : this.setState({ currentOrders: data })
        })
        getAddress().then(({ data }) => {

            data.error ? '' : this.setState({ addressList: data.data })
        })

        this.getWalletDetail();
        this.getCustomerCards();

        let sid = getCookie('sid');
        let mqttTopic = localStorage.getItem('dlvMqtCh');
        this.child.mqttConnector(sid, mqttTopic);

        this.getAddress(lat, lng);

    }

    getAddress(lat, lng) {
        let geocoder = new google.maps.Geocoder();
        let latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({ 'latLng': latlng }, (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
                let addr = results[results.length - 6].formatted_address.split(',')
                let curAddr = addr[0];

                this.setState({
                    city: addr[1],
                    currentLongAddress: results[0].formatted_address, currentAddress: curAddr
                });
                // this.setState({ currentAddress: curAddr })
            }
        })
    }

    checkForError = (error) => {
        this.setState({ loader: false })
        if (getCookie("authorized")) {
            switch (error.status) {
                case 498:
                    this.logOutRef.openOptionsDialog(1)
                    break;
            }
        }
    }


    deleteAllCookies = () => {
        this.logOutRef.openOptionsDialog(2)
    }


    goBack() {
        Router.back();
    }

    render() {
        let storename = getCookie("storeName");
        let selectedStore = this.state.selectedStore && this.state.selectedStore.length > 0 ? this.state.selectedStore : this.props.selectedStore && this.props.selectedStore.length > 0 ? this.props.selectedStore.businessName : 'ST NAME'

        return (
            <Wrapper>
                {/* Header */}
                <Header onRef={ref => this.InnerHeader = ref} stickyHeader={this.state.stickyHeader} showLoginHandler={this.showLoginHandler} isAuthorized={this.props.isAuthorized} showLocation={true} hideSearch={true} hideCategory={true}
                    showLocationHandler={this.showLocationHandler} showLocationMobileHandler={this.showLocationMobileHandler} hideBottom={true} stores={this.props.stores.data}
                    hideSideMenu={() => this.hideSideMenu()} showSideMenu={() => this.showSideMenu()} showCart={this.showCart} deleteAllCookies={this.deleteAllCookies}
                    showChildren={true}
                >
                    <div className="row">
                        <div className={this.state.userProfileDetail ? "col-12 bg-white py-3" : 'col-12 bg-white py-3'}>
                            <div className="row align-items-center">
                                <div className="col-auto text-center">
                                    <img className="userAvatar" src={this.props.userProfileDetail && this.props.userProfileDetail.profilePic ? this.props.userProfileDetail.profilePic : "static/icons/Common/UserDefault.imageset/signup_profile_defalut_image@3x.png"} alt="signup_profile" />
                                </div>
                                <div className="col">
                                    {/* <a className="oneLineSetter" href="#" style={{ position: "absolute", color: "black", right: '20px', marginTop: '-18px' }} onClick={() => this.editProfileMobile()}>{this.state.userProfileDetail ? "edit" : ""}</a> */}
                                    <a className="oneLineSetter" href="#" style={{ position: "absolute", color: "black", right: '20px', marginTop: '-18px', fontSize: "32px" }} onClick={() => Router.push("/")}>&times;</a>
                                    <a onClick={() => this.editProfileMobile()}>
                                        <h5 className="userName oneLineSetter" style={{ marginBottom: "6px" }}>  {this.state.userProfileDetail ? 'Hi ' + this.state.userProfileDetail.name : "Login"}</h5>
                                        <h6 className="userDetails oneLineSetter">{this.state.userProfileDetail ? this.state.userProfileDetail.mobile : ""}</h6>
                                        <h6 className="userDetails oneLineSetter">{this.state.userProfileDetail ? this.state.userProfileDetail.email : ""}</h6>
                                    </a>
                                </div>
                                <div className="text-center" style={{ position: 'absolute', right: '15px' }} >

                                    {/* <a onClick={this.goBack}><img src="static/images/cross.svg" height="15" width="20" /></a> */}

                                </div>
                            </div>
                        </div>
                    </div>
                </Header>
             {/* main profile content */}
                <ProfileComponent onRef={ref => (this.profileRef = ref)} deleteAddress={this.deleteAddress} favtProducts={this.state.favtProducts} offerProducts={this.state.offerProducts} pastOrders={this.state.pastOrders} currentOrders={this.state.currentOrders}
                    userAddress={this.state.addressList} addToCart={this.addToCart} cartProducts={this.props.cartProducts} userProfileDetail={this.state.userProfileDetail}
                    editCart={this.editCart} state={this.state} handleClose={this.handleClose} toggleLeftModalHandler={this.toggleLeftModalHandler} toggleRightModalHandler={this.toggleRightModalHandler}
                    sendOtp={this.sendOtp} verifyOtp={this.verifyOtp} updateOtp={this.updateOtp} saveNewPhone={this.saveNewPhone} updatePhone={this.updatePhone} updatePhoneState={this.updatePhoneState}
                    updateEmail={this.updateEmail} saveNewEmail={this.saveNewEmail} updateEmailState={this.updateEmailState} showLoginHandler={this.showLoginHandler}
                    actualOldPassHandler={this.actualOldPassHandler} oldPassHandler={this.oldPassHandler} newPassHandler={this.newPassHandler} saveNewPassword={this.saveNewPassword} verifyPassword={this.state.verifyPassword} updatePasswordState={this.updatePasswordState} clearAll={this.clearAll}
                    setOrderDetail={this.setOrderDetail} showCart={this.showCart} opendrawer={this.opendrawer} handleOrderPaging={this.handleOrderPaging}
                    handleAddressSliderOpen={this.handleAddressSliderOpen} handleEditAdrSliderOpen={this.handleEditAdrSliderOpen} handleFavouriteSliderOpen={this.handleFavouriteSliderOpen} handleOffersSliderOpen={this.handleOffersSliderOpen}
                    handleWishlistSliderOpen={this.handleWishlistSliderOpen} handleFaqSliderOpen={this.handleFaqSliderOpen} handleReferFrndSliderOpen={this.handleReferFrndSliderOpen}
                    handleHelpSliderOpen={this.handleHelpSliderOpen} handleTrackSliderOpen={this.handleTrackSliderOpen} handleLanguageSliderOpen={this.handleLanguageSliderOpen} showImageUploads={this.state.showImageUploads}
                    handleFileUpload={this.handleFileUpload} handleFileUploadID={this.handleFileUploadID} handleFileUploadDP={this.handleFileUploadDP} submitFile={this.submitFile} submitFileID={this.submitFileID} submitFileDP={this.submitFileDP} showPreviewforMMJ={this.state.showPreviewforMMJ}
                    showPreviewforID={this.state.showPreviewforID} showPreviewforDP={this.state.showPreviewforDP} mmjSuccess={this.state.mmjSuccess} idSuccess={this.state.idSuccess} dpSuccess={this.state.dpSuccess} deleteAllCookies={this.deleteAllCookies} notifications={this.props.notifications} mmjLoading={this.state.mmjLoading} idLoading={this.state.idLoading}
                    resetFileControl={this.resetFileControl} removeFromFavt={this.removeFromFavt} selectedStore={this.state.selectedStore} stores={this.props.stores.data} changeStore={this.changeStore} selectedStoreId={this.state.selectedStoreId}
                    emailSuccess={this.state.emailSuccess} passwordSuccess={this.state.passwordSuccess} phoneSuccess={this.state.phoneSuccess}
                    walletDetail={this.state.walletDetail} customerCards={this.state.customerCards} handleAddCardSlider={this.handleAddCardSlider} handleAddCardMobileSlider={this.handleViewCardMobileSlider} walletRechargeAmount={this.state.walletRechargeAmount} setRechargeAmt={this.setRechargeAmt} defaultCard={this.state.defaultCard}
                    setDefaultCard={this.setDefaultCard} rechargeWallet={this.rechargeWallet} handleWalletHistorySlider={this.handleWalletHistorySlider}
                    handleWalletMobile={this.handleWalletMobile} allowOnlyNumber={this.allowOnlyNumber} determineCardTypeImage={this.determineCardTypeImage} handleDeleteCard={this.handleDeleteCard}
                    ApiSuccessMsg={this.state.ApiMsg} openProductDialog={this.openProductDialog} listArray={this.state.listArray} callCancelOrder={this.callCancelOrder} setCancelData={this.setCancelData} currentLongAddress={this.state.currentLongAddress}
                    ordercancelErr={this.state.ordercancelErr} selectedReason={this.state.selectedReason} currencySymbol={this.props.currencySymbol} updateLoginPhone={this.updateLoginPhone} ticketHistory={this.state.ticketHistory}
                    MoreDetails={this.MoreDetails} selectedOrder={this.state.selectedOrder123}
                />

                <OrderSlider onRef={ref => (this.OrderRef = ref)} state={this.state} orderData={this.state.orderData} handleRightSliderClose={this.handleRightSliderClose}
                    userProfileDetail={this.state.userProfileDetail} handleOrderQuery={this.handleOrderQuery}  orderValue={this.state.orderValue} />

                <AddressSlider onRef={ref => (this.AddressRef = ref)} state={this.state} userAddress={this.state.addressList} handleEditAdrSliderOpen={this.handleEditAdrSliderOpen} opendrawerForMobile={this.opendrawerForMobile} deleteAddress={this.deleteAddress} />

                <FavouriteSlider onRef={ref => (this.FavouriteRef = ref)} addToCart={this.addToCart} state={this.state} favtProducts={this.state.favtProducts} cartProducts={this.props.cartProducts}
                    editCart={this.editCart} selectedStore={this.state.selectedStore} currencySymbol={this.props.currencySymbol} stores={this.props.stores.data} changeStore={this.changeStore} />

                <WishlistSlider onRef={ref => (this.WishlistRef = ref)} addToCart={this.addToCart} editCart={this.editCart} getWishlist={this.getWishlist} cartProducts={this.props.cartProducts} state={this.state} />

                <OfferSlider onRef={ref => (this.OffersRef = ref)} offerProducts={this.state.offerProducts} selectedStoreId={this.state.selectedStoreId} SliderWidth={this.state.SliderWidth}
                    selectedStore={this.state.selectedStore} stores={this.props.stores.data} changeStore={this.changeStore} />

                <FaqSlider onRef={ref => (this.FaqRef = ref)} state={this.state} />

                <ReferSlider onRef={ref => (this.ReferFrndRef = ref)} state={this.state} />

                <HelpSlider onRef={ref => (this.HelpRef = ref)} state={this.state} userProfileDetail={this.state.userProfileDetail} viewType={this.state.viewType} getTickets={this.getTickets}
                    ticketHistory={this.state.ticketHistory} />

                <LiveTrackSlider onRef={ref => (this.LiveTrackRef = ref)} RightSliderWidth={this.state.RightSliderWidth} handleRightSliderClose={this.handleRightSliderClose} handleRating={this.handleRating} orderValue={this.state.selectedOrderForTrack}/>

                <RatingSlider onRef={ref => (this.OrderRatingRef = ref)} RightSliderWidth={450} handleRightSliderClose={this.handleRightSliderClose} setOrderRatings={this.setOrderRatings} />

                <LanguageSlider onRef={ref => (this.LanguageRef = ref)} state={this.state} />

                <NewAddressSlider onRef={ref => (this.NewaddressRef = ref)} updateCoords={this.updateCoords}
                    updateLocation={this.updateLocation} home={this.state.home} office={this.state.office} others={this.state.others}
                    center={this.state.center} zoom={this.state.zoom} updateTaggedAs={this.updateTaggedAs}
                    taggedAs={this.state.taggedAs} clearAddressForm={this.clearAddressForm}
                    updateAdress={this.updateAdress} getGeoLocation={this.getGeoLocation}
                />
                <EditAddressSlider onRef={ref => (this.EditaddressRef = ref)}
                    updateLocation={this.updateLocation} home={this.state.home} office={this.state.office} others={this.state.others}
                    center={this.state.center} zoom={this.state.zoom} updateTaggedAs={this.updateTaggedAs}
                    taggedAs={this.state.taggedAs} clearAddressForm={this.clearAddressForm}
                    updateAdress={this.updateOldAddress} getGeoLocation={this.getGeoLocation} addressDetail={this.state.addressToEdit}
                />

                <Authmodals onRef={ref => (this.child = ref)} editCart={this.editCart} />

                <Footer lang={this.props.lang} />
                {/* 
                <div className="row fixed-bottom mobile-show z-top">
                    <LabelBottomNavigation index={5} count={this.props.cartProducts ? this.props.cartProducts.length : 0} showCart={this.props.showCart} userProfileDetail={this.props.userProfileDetail} isAuthorized={true} selectedStore={this.props.selectedStore} />
                </div> */}
                <AddCardLeftSlider onRef={ref => (this.AddCardLeftSliderRef = ref)} width={450} getCustomerCards={this.getCustomerCards} userProfile={this.props.userProfile} ></AddCardLeftSlider>

                <AddCardLeftSliderMobile width="100%" onRef={ref => (this.AddCardLeftSliderMobileRef = ref)} userProfile={this.props.userProfileDetail} getCustomerCards={this.getCustomerCards} />

                <WalletHistorySlider onRef={ref => (this.WalletHistorySliderRef = ref)} width={this.state.walletHistoryWidth} walletHistory={this.state.walletHistory} />

                <CardSlider onRef={ref => (this.CardSliderMobileRef = ref)} setDefaultCard={this.setDefaultCard} width={"100%"} customerCards={this.state.customerCards} handleAddCardMobileSlider={this.handleAddCardMobileSlider} getCustomerCards={this.getCustomerCards} />

                <WalletMobileSlider onRef={ref => (this.WalletMobileSliderRef = ref)} width={"100%"} allowOnlyNumber={this.allowOnlyNumber}
                    walletDetail={this.state.walletDetail} customerCards={this.state.customerCards} handleAddCardSlider={this.handleAddCardSlider} walletRechargeAmount={this.state.walletRechargeAmount} setRechargeAmt={this.setRechargeAmt} defaultCard={this.state.defaultCard}
                    setDefaultCard={this.setDefaultCard} rechargeWallet={this.rechargeWallet} handleWalletHistorySlider={this.handleWalletHistorySlider}
                    handleAddCardMobileSlider={this.handleAddCardMobileSlider} handleDeleteCard={this.handleDeleteCard} determineCardTypeImage={this.determineCardTypeImage}
                />

                <ActionResponse onRef={ref => (this.ActionRes = ref)} handleResponseActions={this.handleResponseActions} handleErrResponseActions={this.handleErrResponseActions}
                    loadingMsg={this.state.loadingMsg} actionErrMsg={this.state.actionErrMsg}
                    successMsg={this.state.successMsg} />

                <ProductDialog onRef={ref => (this.dialogRef = ref)} showLoginHandler={this.showLoginHandler} getFavtData={this.getFavtData} />

                <LogOutDialog onRef={ref => (this.logOutRef = ref)} />

                {this.state.loader ? <CircularProgressLoader /> : ''}

                <div className="modal fade" id="deleteCard" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content p-3">
                            <div className="modal-header py-0">
                                <h6 className="modal-title" id="exampleModalCenterTitle">{ENV_VAR.APP_NAME}</h6>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p className="paraText">{this.lang.removeCard||"Do you want to remove your card from "}{ENV_VAR.APP_NAME} ?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">{this.lang.cancell||"CANCEL"}</button>
                                <button type="button" data-dismiss="modal" onClick={this.deleteCard} className="btn btn-default okBtnConfirmPayment">REMOVE</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Wrapper>
        )
    }
}



const mapStateToProps = state => {
    return {
        reduxState: state,
        stores: state.stores,
        myCart: state.cartList,
        cartProducts: state.cartProducts,
        notifications: state.notifications,
        userProfileDetail: state.userProfile,
        selectedStore: state.selectedStore,
        selectedLang: state.selectedLang,
        currencySymbol: state.currencySymbol,
        lang:state.locale
    };
};

export default connect(mapStateToProps)(Profile);