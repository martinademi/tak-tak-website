import React from 'react';
import { Step, Stepper, StepButton, StepContent } from 'material-ui/Stepper'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField'
import { getTipValue } from "../services/getIpInfo";
import GoogleMapReact from 'google-map-react'
import MapMarker from 'google-map-react'
import { FontIcon } from 'material-ui'
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import * as moment from 'moment';
import Router from "next/router";
import { IconButton } from 'material-ui';
import { withStyles } from '@material-ui/core/styles';

import Link from "next/link"

import Wrapper from '../hoc/wrapperHoc'
import Header from '../components/header/innerPageHeader'
import Authmodals from '../components/authmodals/index'
import * as actions from '../actions/index'
import * as $ from "jquery";
import { getCookiees, getCookie } from '../lib/session'
import { getAddress, deleteAddress } from '../services/address'
import { checkOutCart, getFareApi, getCoupons, validateCoupon, getCards, deleteCard } from '../services/cart'
import { redirectIfNotAuthenticated, redirectIfNotAuthorized, getLocation } from "../lib/auth"

import CircularProgressLoader from '../components/ui/loaders/circularLoader'
import NewAddressSlider from '../components/Adress/newAddress'
import SelectAddressSlider from '../components/Adress/selectAddress';
import SelectPaymentSlider from '../components/checkout/selectPayment';
import CouponSlider from '../components/checkout/coupon';
import redirect from '../lib/redirect';
import CouponLeftSlider from '../components/checkout/couponLeftSlider';
import AddCardLeftSlider from '../components/checkout/addCard';
import ActionResponse from '../components/dialogs/actionResponse';
import { getWalletDetail, rechargeWallet, getWalletHistory } from '../services/profileApi';
import WalletMobileSlider from '../components/checkout/walletMobile';
import * as ENV_VAR from '../lib/envariables'
import EditAddressSlider from '../components/Adress/editAddress';
import LogOutDialog from '../components/dialogs/logOut';
import Switch from '@material-ui/core/Switch';
import orange from '@material-ui/core/colors/orange';
import CheckoutStepper from '../components/checkout/stepper';
import TopLoader from '../components/ui/loaders/TopBarLoader/TopBarLoader';
import WalletHistorySlider from '../components/checkout/walletHistory';
import AddCardLeftSliderMobile from '../components/checkout/addCardMobile';
import CardSlider from '../components/checkout/viewAllCards';
import CartContent from '../components/cart/cartContent';
import CheckoutCartSection from '../components/checkout/checkoutCartSection';
import "../assets/style.scss";
import "../assets/login.scss";
import "../assets/about.scss";
import CustomHead from '../components/html/head';
import Loader from '../components/ui/loaders/lottieLoader';
import CustomizedSnackbar from "../components/ui/snackbars/Snackbar";
import Footer from '../components/footer/Footer';
// import PopUp from "../components/popup/popup"
const icon1 = <FontIcon className="material-icons"> <i className="fa fa-map-marker activeCustomFaComm checkoutcustomFaComm" ></i></FontIcon>;
// const icon2 = <FontIcon className="material-icons"> <i className="fa fa-map-marker checkoutcustomFaComm" ></i></FontIcon>;
const icon3 = <FontIcon className="material-icons"> <i className="fa fa-credit-card activeCustomFaComm checkoutcustomFaComm" ></i></FontIcon>;
const icon4 = <FontIcon className="material-icons"> <i className="fa fa-credit-card checkoutcustomFaComm" ></i></FontIcon>;
const icon5 = <FontIcon className="material-icons"> <i className="fa fa-calendar-o activeCustomFaComm checkoutcustomFaComm" ></i></FontIcon>;
const icon6 = <FontIcon className="material-icons"> <i className="fa fa-calendar-o checkoutcustomFaComm" ></i></FontIcon>;


const buttonStyle = {
    width: '160px',
    backgroundColor: ENV_VAR.BASE_COLOR
}

const buttonStyleOutline = {
    width: '150px',
    color: ENV_VAR.BASE_COLOR + " !important",
    border: '1px solid ' + ENV_VAR.BASE_COLOR,
    background: '#fff'
}

const buttonStyleFill = {
    width: '150px',
    color: "#fff !important",
    border: '1px solid ' + ENV_VAR.BASE_COLOR,
    background: ENV_VAR.BASE_COLOR,

}

const fullWidthButtonStyleFill = {
    color: "#fff !important",
    border: '1px solid ' + ENV_VAR.BASE_COLOR,
    background: ENV_VAR.BASE_COLOR,

}

const stepButtonStyle = {
    padding: '15px 0px 0px',
    backgroundColor: '#fff'
}

const stepButtonStyle2 = {
    padding: '0px 0px 0px',
    backgroundColor: '#fff'
}

const iconBoxStyle = {
    position: 'absolute',
    left: '-20px'
}
const dividerSmall = { height: '30px', marginLeft: '-9px', marginTop: '0px', borderLeft: ' 1px dashed rgb(189, 189, 189)' }
const dividerLarge = { height: '40px', marginLeft: '-9px', marginTop: '-10px', borderLeft: ' 1px dashed rgb(189, 189, 189)' }
const dividerMedium = { height: '65px', marginLeft: '-9px', marginTop: '-35px', borderLeft: ' 1px dashed rgb(189, 189, 189)' }

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

const button = {
    root: {
        color: "#fff !important",
        border: '1px solid #999',
        background: '#fff',
        height: '46px',
        width: '178px'
    },
    label: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#333',
        margin: '0px 18px'
    },
    overlayStyle: {
        height: '46px',
        padding: '5px'
    }
}


const buttonActive = {
    root: {
        color: "#fff !important",
        border: '1px solid #444',
        background: '#444',
        height: '46px',
        width: '178px'
    },
    label: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#fff',
        margin: '0px 18px'
    },
    overlayStyle: {
        height: '46px',
        padding: '5px'
    },

}

const lableOutline = {
    fontSize: '13px',
    fontWeight: '700',
    color: ENV_VAR.BASE_COLOR,
    letterSpacing: '0.6px'
}

const lableFill = {
    fontSize: '13px',
    fontWeight: '700',
    color: '#fff',
    letterSpacing: '0.6px'
}


class SecureCheckOut extends React.Component {
    lang = this.props.lang
    static async getInitialProps({ ctx }) {

        let getCategoryList = [];

        let token = getCookiees("token", ctx.req);
        let deliveryType = getCookiees('deliveryType', ctx.req)
        let lat = getCookiees("lat", ctx.req);
        let lng = getCookiees("long", ctx.req);
        let zoneID = getCookiees("zoneid", ctx.req);
        const userName = await getCookiees("username", ctx.req)
        const isAuthorized = await getCookiees("authorized", ctx.req)
        let zoneDetails = await getCookiees("zoneDetails", ctx.req) || null;
        const queries = ctx.query
        // const jwt = getJwt(ctx);
        // let lang = await (queries.lang || getCookiees("lang", ctx.req)) || "en";
        // ctx && ctx.store ? ctx.store.dispatch(actions.selectLocale(lang)) : ''

        if (redirectIfNotAuthenticated(ctx)) {
            return {};
        }

        if (redirectIfNotAuthorized(ctx)) {
            return {};
        }

        return { isAuthorized, token, queries, zoneDetails, deliveryType }
        // return { zoneID, lat, lng, getCategoryList, token }
    }


    state = {
        stepIndex: 0,
        pickupStepIndex: 0,
        open: false,
        SliderWidth: 450,
        center: {
            lat: 0,
            lng: 0,
            place: ''
        },
        hideAddress: false,
        zoom: 15,
        flatNumber: '',
        taggedAs: '',
        landmark: '',
        home: true,
        office: false,
        others: false,
        addressList: [],
        isAuthorized: this.props.isAuthorized,
        showIframe: false,
        selectedAddress: null,
        fareDetails: null,
        deliveryFeesTotal: 0,
        loading: false,
        showStripe: false,
        selectedMyAddress: null,
        fullAddressDetail: null,
        selectedPayment: null,
        selectedCoupon: null,
        couponBenifit: null,
        discount: null,
        couponData: null,
        showCouponInfo: null,
        promo: '',
        currentAddress: '',
        bookingDate: '',
        bookingTime: '',
        timeSelectionValue: null,
        bookingType: 1,
        DatePickervalue: 'dd/mm',
        customerCards: null,
        defualtCardId: null,
        selectedCard: null,
        readyToRenderPage: false,
        includeWallet: false,
        showEmpty: false,
        extraNote: {}
    };

    constructor(props) {
        super(props)
        this.showLoginHandler = this.showLoginHandler.bind(this)
        this.opendrawer = this.opendrawer.bind(this)
        this.showIframe = this.showIframe.bind(this)
        this.selectAddress = this.selectAddress.bind(this)
        this.calculateFare = this.calculateFare.bind(this)
        this.checkOut = this.checkOut.bind(this)
        this.updateAdress = this.updateAdress.bind(this)
        this.getGeoLocation = this.getGeoLocation.bind(this)
        this.clearAddressForm = this.clearAddressForm.bind(this)
        this.opendrawerForMobile = this.opendrawerForMobile.bind(this);
        this.handleAddressSlider = this.handleAddressSlider.bind(this);
        this.handleWalletHistorySlider = this.handleWalletHistorySlider.bind(this);
    }


    handleWallet = (event) => {
        this.setState({ includeWallet: event.target.checked });
    };

//for stepper go next
    handleNext = () => {
        const { stepIndex, pickupStepIndex } = this.state;
        if (stepIndex < 3) {
            this.setState({ stepIndex: stepIndex + 1 });
        }
        if (stepIndex < 2) {
            this.setState({ pickupStepIndex: pickupStepIndex + 1 });
        }
    };
// for stepper go prev
    handlePrev = () => {
        const { stepIndex, pickupStepIndex } = this.state;
        if (stepIndex > 0) {
            this.setState({ stepIndex: stepIndex - 1 });
        }
        if (stepIndex < 2) {
            this.setState({ pickupStepIndex: pickupStepIndex - 1 });
        }
    };

    setStepIndex = (index) => {
        this.setState({ stepIndex: index });
    }
    setPickupStepIndex = (index) => {
        this.setState({ pickupStepIndex: index });
    }
    showIframe() {
        this.setState({ showIframe: true })
    }

    showSideMenu() {
        
        this.setState({ width: '80%' })
    }


    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    hideSideMenu() {
       
        this.setState({ width: '100%' })
    }
// selected address if location available otherwise give toaster error 
    selectAddress = (address, event) => {

        
        event.stopPropagation();

        // getFareApi
        
        this.setState({ selectedAddress: address, isLoading: true },()=>{
           
        });

        // this.handleNext();


        let getFareData = {
            status: 1,
            type: 2,
            latitude: address.latitude,
            longitude: address.longitude
        }
            // this.setState({ showToastErr: "Please select the Unit", toastType: "info" })
            ;

        getFareApi(getFareData).then((data) => {
         
            data.error ?
                (
                    //  alert(this.lang.deliveryError||"We don't deliver to the selected location."),
                    // toastr.error("We don't deliver to the selected location."),
                  
                //  this.SnackbarRef.showToast(),
                    this.setState({ stepIndex: 0, selectedAddress: null, isLoading: false, deliveryFeesTotal: 0.00, stopCheckout: true, showToastErr: this.lang.deliveryError||"We don't deliver to the selected location", toastType: "warning" },()=>this.SnackbarRef.showToast())
                )
                :
                (
                   
                    this.setState({ fareDetails: data.data.data, isLoading: false }),
                    this.handleNext(),
                    this.calculateFare(data.data.data)
                )
        })
            .catch(() => {
                toastr.error(this.lang.deliveryError||this.lang.deliveryError||"We don't deliver to the selected location")
                
            })
    }

    inputForm(data) {
        return (
            <TextField
                type='text'
                floatingLabelText={data.label}
                floatingLabelFocusStyle={{ color: ENV_VAR.BASE_COLOR, transform: 'scale(0.75) translate(0px, -20px)' }}
                floatingLabelShrinkStyle={{ transform: 'scale(0.75) translate(0px, -20px)' }}
                floatingLabelStyle={{ top: "20px", transition: "all 750ms cubic-bezier(0.23, 1, 0.32, 1) 0ms" }}
                inputStyle={{ marginTop: "3px", marginLeft: "5px" }}
                style={{ height: "60px" }}
                underlineShow={false}
                margin="normal"
                value={data.value}
                onChange={data.onChange}
                autoComplete="off"
            />
        )
    }
// google map
    printMap(center) {
        return (
            <GoogleMapReact
                panControl={false}
                streetViewControl={false}
                fullscreenControl={false}
                bootstrapURLKeys={{ key: 'AIzaSyBJ2LWIMnZNdsoYmUREgbN_4VEksPnoW8w' }}
                defaultCenter={center}
                defaultZoom={this.state.zoom}
                center={this.state.center} zoom={this.state.zoom}
            >
                <MapMarker lat={this.state.center.lat} lng={this.state.center.lng} text={'Me'} />
            </GoogleMapReact>
        )
    }


    renderStepActions(step) {
        return (
            <Wrapper>
                <div style={{ margin: '12px 0' }}>
                    <RaisedButton
                        label="Next"
                        disableTouchRipple={true}
                        disableFocusRipple={true}
                        primary={true}
                        onClick={this.handleNext}
                        style={{ marginRight: 12, background: ENV_VAR.BASE_COLOR }}
                        buttonStyle={buttonStyle}
                    />
                    {step > 0 && (
                        <FlatButton
                            label="Back"
                            disableTouchRipple={true}
                            disableFocusRipple={true}
                            onClick={this.handlePrev}
                        />
                    )}
                </div>
            </Wrapper>
        );
    }

    getGeoLocation = async () => {
        let lat = await getCookie("lat", '');
        let lng = await getCookie("long", '');
        await this.getAddress(lat, lng)
        this.setState({ center: { ...this.state.center, lat: lat, lng: lng } })
    }
// through latitude and logitude converting in address formate 
    getAddress(lat, lng) {
        let geocoder = new google.maps.Geocoder();
        let latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({ 'latLng': latlng }, (results, status) => {
            

            if (status == google.maps.GeocoderStatus.OK) {

                let splitAdd = results[0].formatted_address.split(",");
      
            let country = splitAdd[splitAdd.length - 1];
            let state = splitAdd[splitAdd.length - 2];
      
            let city = splitAdd[splitAdd.length - 3];
            let addresh = splitAdd[1]
           let value =  addresh.concat(" ","#" ,splitAdd[0] ,",")
            var ret = results[0].formatted_address.replace(splitAdd[0] ,'');
            let value1 =ret.replace(splitAdd[1], "" ).replace(",,","").replace(country,",").replace(",,","")
           
            let finalData =value.concat(value1)
           
                this.setState({ currentAddress: finalData })
            }
        })
    }

    showLoginHandler = () => { this.handleRequestClose(); this.child.showLoginHandler() }
    showLocationHandler = () => { this.child.showLocationHandler() }
    showLocationMobileHandler = () => { this.child.showLocationMobileHandler() }
    showCart = () => { this.child.showCart() }

    opendrawer = async () => {
        await this.getGeoLocation();
        await this.NewaddressRef.handleLeftSliderToggle()
    }
    handleOrderType = (event) => {
       
        this.setState({ orderType: event.target.value, bookingType: parseInt(event.target.value) })
        event.target.value == 1 ? $(".scheduledOrder").hide() : $(".scheduledOrder").slideDown("fast")
    };

    updateLocation = (data) => {
        this.setState({ center: { ...this.state.center, lat: data.lat, lng: data.lng, place: data.address }, zoom: 13 })
    }

    updateCoords = (data) => {
        this.setState({ center: { ...this.state.center, lat: data.lat, lng: data.lng }, zoom: 13 })
    }

    updateTaggedAs = async (type) => {
        await this.setState({
            home: false,
            office: false,
            others: false,
            taggedAs: type,
            [type]: true
        })
    }

    clearAddressForm() {
        this.setState({
            home: true,
            office: false,
            others: false,
            taggedAs: '',
            center: { ...this.state.center, lat: 0, lng: 0, place: '' },
        })
    }

    updateAdress(data) {
        this.setState({
            addressList: this.state.addressList.concat([data])
        })
    }
   // edit address
    updateOldAddress = (data) => {
        this.state.addressList.map((addr, index) => {
            addr._id === data._id ? this.state.addressList[index] = data : ''
        })
       
    }
    // delete address
    deleteAddress = (event, addressToDelete) => {
        event.stopPropagation();
        this.setState({ loading: true })
        let ind = this.state.addressList.findIndex((item) => item._id == addressToDelete._id);
        ind >= 0 ?
            (
                deleteAddress(addressToDelete["_id"])
                    .then((data) => {
                        this.setState({ loading: false })
                        let addressList = this.state.addressList;
                        let index = -1;
                        data.error ?
                            this.checkForError(data) : (
                                addressList.splice(ind, 1),
                                this.state.fullAddressDetail ?
                                    (index = addressList.findIndex((address) => address._id === this.state.fullAddressDetail._id),
                                        this.setState({ addressList: addressList, selectedMyAddress: index >= 0 ? this.state.selectedMyAddress : null })) :
                                    this.setState({ addressList: addressList })
                            )
                    })
            ) : ''
    }
   //set address
    setAddress = (address) => {
        let getFareData = {
            status: 1,
            type: 2,
            latitude: address.latitude,
            longitude: address.longitude
        }
            // this.setState({ showToastErr: "Please select the Unit", toastType: "info" })
            ;

        getFareApi(getFareData).then((data) => {
            data.error ?
                (
                    // toastr.error(this.lang.deliveryError||"We don't deliver to the selected location.",
                    // this.SnackbarRef.showToast(),
                    this.setState({ stepIndex: 0, selectedAddress: null, isLoading: false, stopCheckout: true, showToastErr: this.lang.deliveryError||"We don't deliver to the selected location", toastType: "warning" })
                )
                :
                (
                    
                    this.setState({ fareDetails: data.data.data, isLoading: false, fullAddressDetail: address, selectedMyAddress: address.addLine1 + address.addLine2, }),
                    // this.handleNext(),
                    this.calculateFare(data.data.data)
                )
        })
            .catch(() => {
                toastr.error(this.lang.deliveryError||"We don't deliver to the selected location")
            })

        // this.setState({ selectedMyAddress: newAddress.addLine1 + newAddress.addLine2, fullAddressDetail: newAddress })
    }
    setPayment = (payType) => {
        this.setState({ selectedPayment: payType })
    }

    setCoupon = (coupon, cpnBenifit) => {
        this.setState({ selectedCoupon: coupon, couponBenifit: cpnBenifit })
    }
    removePromo = () => this.setState({ selectedCoupon: null, couponBenifit: null })
    placeOrderHandler = () => {
        redirect("/")
    }
    componentWillMount() {
        // this.props.deliveryType == 2 ? this.setState({ hideAddress: true }) : this.setState({ hideAddress: false })
    }
    componentWillReceiveProps = (newProps) => {
        
        this.setState({ discount: this.props.myCart.cartDiscount, hideAddress: newProps.deliveryType == 1 ? true : false })
    }
    // edit addresh slider 
    handleEditAdrSliderOpen = async (event, adrToEdit, isMobile) => {
        event.stopPropagation();
        await this.setState({ addressToEdit: adrToEdit, center: { ...this.state.center, lat: adrToEdit.latitude, lng: adrToEdit.longitude } })
        this.EditaddressRef.handleLeftSliderToggle(this.state.addressToEdit, isMobile);
    }
    opendrawerForMobile() {
       
        this.NewaddressRef.handleLeftSliderToggleForMobile()
    }
    handleTipFun =(value)=>{
        this.setState({ driverTip: Number(value) },()=>{
         
        });
      }
      // to get the tip values
      handleTip = (e) => {
        
        const value = e.target.value.replace(/[^\d]/,'');
        if(parseInt(value) !== 0) {
          this.setState({ driverTip:value },()=>{
           
            
          });
      }
        // this.setState({ driverTip: Number(e.target.value) },()=>{
        //   setCookie("driverTip",this.state.driverTip)
        // });
      };
    componentDidMount() {

        setTimeout(() => {
            this.startTopLoader();

        }, 1000);
        setTimeout(() => {
            this.setState({ showEmpty: true, extraNote: JSON.parse(localStorage.getItem(ENV_VAR.NOTES_VAR)) });
            // $("#dbCardRadio").prop("checked", true);
            this.setState({ orderType: 1, bookingType: 1 }, () => {
                document.getElementById("orderNowMobi").checked = true;
            })
        }, 3000);

        this.getGeoLocation();
        // to get the tips values 
        getTipValue().then(data=>{
           
            this.setState({tipValueDefault:data.data})
        })
        this.props.dispatch(actions.getAppConfig())

        let todayDate = moment().format('dddd, D MMM Y');
        let todayTime = moment().format('hh:mm a');

        this.setState({ bookingDate: todayDate, bookingTime: todayTime, readyToRenderPage: true })
// get the save address
        getAddress().then((data) => {
            data.error ? this.checkForError(data) : this.setState({ addressList: data.data.data })
        })
// get the coupons codes 
        getCoupons(getCookie("cityid")).then((res) => {
           
            this.setState({ couponData: res.data.data })})
        // this.props.deliveryType == 2 ? this.setState({ hideAddress: true }) : ''

        this.props.dispatch(actions.getCart())
         // user saved cards
        this.getCustomerCards();
        // user wallet details 
        this.getWalletDetail();

        toastr.options.preventDuplicates = true;
    }


    getCustomerCards = () => {
        getCards().then(async (data) => {
            data.error ?
                this.checkForError(data) :
                (
                    await this.setState({ customerCards: data.data.data }),
                    data.data.data.map((cardDetail) => cardDetail.isDefault ? this.setState({ defaultCard: cardDetail.id }) : '')
                )
        })
    }



    handleCardSelection = (event, card) => {
        document.getElementById(event.target.id).checked = true;
        this.setState({ selectedCard: card })
    }
    setDefaultCard = (cardId, card) => {
        this.setState({ selectedCard: card })
    }
    getWalletDetail = () => {
        getWalletDetail().then((data) => {
           
            this.setState({ walletDetail: data.data.data })
        })
    }
// wallet slider ui
    rechargeWallet = () => {
        if (!this.state.defaultCard) {
            toastr.error(this.lang.selectCardc||"Please add or select the card to add money");
            return;
        }
        this.setState({ loading: true })
        let walletData = {
            cardId: this.state.defaultCard,
            amount: parseInt(this.state.walletRechargeAmount)
        }
        rechargeWallet(walletData).then((data) => {
            data.error ? data.status == 410 ? (toastr.error(this.lang.selectCardc||"Please add or select the card to add money"), this.setState({ loading: false })) :
                this.checkForError(data)
                : (
                    this.getWalletDetail(),
                    this.setState({ loading: false, walletRechargeAmount: '' }),
                    this.WalletMobileSliderRef.handleClose(),
                    toastr.success(this.lang.wallateRecharge||"Wallet recharged successfully")
                )
        })
    }
    // add card for the mobile view 
    handleAddCardMobileSlider = () => { this.AddCardLeftSliderMobileRef.handleLeftSliderOpen(); this.CardSliderMobileRef.handleClose(); }

    setRechargeAmt = (e) => { this.allowOnlyNumber(e); this.setState({ walletRechargeAmount: e.target.value }) }
   //  wallet slider for the web
     handleWalletSlider = (width = 450) => {
       
        this.setState({ walletWidth: width })
        // width == "100%" ? this.setState({ showOnlyAdddUI: false }) : this.setState({ showOnlyAdddUI: true })
        this.WalletMobileSliderRef.handleLeftSliderOpen();
    }
  // only allow the numbers 
    allowOnlyNumber(e) {
        let char = e.which || e.keyCode
        if ((char >= 37 && char <= 40) || (char >= 48 && char <= 57) || (char >= 96 && char <= 105) || (char == 8) || (char == 9) || (char == 13)) {

        } else {
            e.preventDefault();
        }
    }

    updatePromo = (e) => this.setState({ promo: e.target.value })
  // verify the coupon
    verifyCoupon = (couponData, isManual) => {

        let manualIndex;
        this.state.couponData.map((couponData, index) => {
            if (couponData.code === this.state.promo) {
                manualIndex = index;
            }
        })

        this.setState({ loading: true })

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
            this.setState({ loading: false })
           
            res.error && res.status === 405 ? (toastr.error(this.lang.promoCodeError||"Promocode is Invalid or Expired.")) :
                (
                    res.data.code  == 405 ? (toastr.error(this.lang.promoCodeError||"Promocode is Invalid or Expired."),
                   this.setState({stepIndex: 0, selectedAddress: null, isLoading: false, deliveryFeesTotal: 0.00, stopCheckout: true, showToastErr: this.lang.promoCodeError||"Promocode is Invalid or Expired.", toastType: "warning"},()=>this.SnackbarRef.showToast()) )
                    // this.setState({ stepIndex: 0, selectedAddress: null, isLoading: false, deliveryFeesTotal: 0.00, stopCheckout: true, showToastErr: this.lang.deliveryError||"We don't deliver to the selected location", toastType: "warning" },()=>this.SnackbarRef.showToast())
                
                    :
                        (couponData = isManual ? couponData[manualIndex] : couponData,
                            this.setCoupon(couponData, res.data.data),
                            this.CouponLeftSliderRef.handleClose())
                )
        })
    }
 
    handleCouponDetail = (index) => this.setState({ showCouponInfo: this.state.couponData[index] });
// for the multiple store in cart 
    calculateFare = (fare) => {
        let fareValue = 0;
        fare ? fare.map((deliveryFare) => {
            fareValue = fareValue + deliveryFare.storeDeliveryFee;
            // fareValue = parseFloat(fareValue).toFixed(2);
           
        }) : ''
       
        this.setState({ deliveryFeesTotal: parseFloat(fareValue).toFixed(2) })
    }


    onFocusChange(focusStatue) {
        // do something
    }
    handleFocusedChange = () => { }
  // to place the order
    checkOut = (type) => {
        this.ActionRes.openDialog();
        let currentTimeZone = new Date().getTimezoneOffset();
        this.setState({ loadingMsg: this.lang.wait||"Please Wait...", redirectionFlag: 0, successMsg: null, actionErrMsg: null })
        let delType = Number(getCookie("deliveryType")) || 1;
        let bdate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        let dueDate = this.state.dueDate && this.state.dueTime ? moment(this.state.dueDate + ' ' + this.state.dueTime).format('YYYY-MM-DD HH:mm:ss') : bdate
        let checkOutData = {
            address1: delType == 1 ? this.state.selectedAddress["addLine1"] + this.state.selectedAddress["addLine2"] : '',
            addressId:this.state.selectedAddress ?this.state.selectedAddress["_id"] : "",
            paymentType: type == 3 ? 1 : type,
            payByWallet: (type == 3 || this.state.includeWallet) ? 1 : 0,
            discount: 0,
            cartId: this.props.myCart.cartId,
            latitude: delType == 1 ? this.state.selectedAddress.latitude : 0,
            longitude: delType == 1 ? this.state.selectedAddress.longitude : 0,
            bookingDate: bdate,
            dueDatetime: dueDate,
            serviceType: delType,
            bookingType: this.state.bookingType,
            deviceTime: bdate,
            extraNote: this.state.extraNote ? this.state.extraNote : {}
        }
        this.state.selectedCard ? checkOutData["cardId"] = this.state.selectedCard.id : '';
        this.state.driverTip
        ? (checkOutData["driverTip"] = this.state.driverTip)
        : 0;
        this.state.couponBenifit ?
            (
                checkOutData["couponCode"] = this.state.selectedCoupon.code,
                checkOutData["discount"] = this.state.couponBenifit.discountAmount
            ) : ''
       
        // this.setState({ loading: true })
        checkOutCart(checkOutData).then((res) => {
            this.setState({ loading: false })
            res.error == true ? (
                this.setState({ actionErrMsg: res.data.message, loadingMsg: null, successMsg: null }),
                this.checkForError(res)
            )
                :
                (
                    this.props.dispatch(actions.getCart()),
                    this.setState({ actionErrMsg: null, loadingMsg: null, successMsg: this.lang.orderPlaced||"Thank you , your order is placed successfully . Waiting for the approval of store ." }),
                    localStorage.removeItem(ENV_VAR.NOTES_VAR),
                    setTimeout(() => {
                        window.location.href = "/profile"
                    }, 500)
                )
            res.error == true ? toastr.error(res.data.message) : (this.props.dispatch(actions.getCart()))
        })

    }
// place order for the mobile view 
    mobileCheckOut = (type) => {
        this.ActionRes.openDialog();

        this.setState({ loadingMsg: "Please Wait...", redirectionFlag: 1, successMsg: null, actionErrMsg: null })

        let delType = Number(getCookie("deliveryType"));
        // let bdate = moment(this.state.bookingDate + ' ' + this.state.bookingTime).format('YYYY-MM-DD HH:mm:ss')
        let bdate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        let dueDate = this.state.dueDate && this.state.dueTime ? moment(this.state.dueDate + ' ' + this.state.dueTime).format('YYYY-MM-DD HH:mm:ss') : bdate
        let checkOutData = {
            address1: delType == 1 ? this.state.selectedMyAddress : '',
            addressId:this.state.selectedAddress ?this.state.selectedAddress["_id"] : "",
            paymentType: this.state.selectedPayment == "Cash" ? 2 : this.state.selectedPayment == "Card" ? 1 : 1,
            payByWallet: (this.state.selectedPayment == "Wallet" || this.state.includeWallet) ? 1 : 0,
            discount: 0,
            cartId: this.props.myCart.cartId,
            latitude: delType == 1 ? this.state.fullAddressDetail.latitude : 0,
            longitude: delType == 1 ? this.state.fullAddressDetail.longitude : 0,
            bookingDate: bdate,
            dueDatetime: dueDate,
            serviceType: delType,
            bookingType: this.state.bookingType,
            deviceTime: bdate
        }
        this.state.selectedPayment == "Card" && this.state.selectedCard ? checkOutData["cardId"] = this.state.selectedCard.id : ''
        this.state.couponBenifit ?
            (
                checkOutData["couponCode"] = this.state.selectedCoupon.code,
                checkOutData["discount"] = this.state.couponBenifit.discountAmount
            ) : ''
            this.state.driverTip
            ? (checkOutData["driverTip"] = this.state.driverTip)
            : 0;
       
        // this.setState({ loading: true })
        checkOutCart(checkOutData).then((res) => {
            res.error == true ?
                (
                    this.setState({ actionErrMsg: res.data.message, loadingMsg: null, successMsg: null }),
                    this.checkForError(res)
                )
                :
                (
                    this.props.dispatch(actions.getCart()),
                    this.setState({ actionErrMsg: null, loadingMsg: null, successMsg: this.lang.orderPlaced||"Thank you , your order is placed successfully . Waiting for the approval of store ." }),
                    setTimeout(() => {
                        window.location.href = "/history"
                    }, 500)
                  
                )
        })

    }
     // navigation if web view then navigate to the profile page for mobile navigate to the history page 
    handleResponseActions = () => {
        window.location.href = this.state.redirectionFlag == 1 ? '/history' : '/profile'
    }
    // if somthing goes wrong redirect to the home page
    handleErrResponseActions = () => redirect('/')
    editCart = (cartDetail, products, type) => {

        let editCartData = {
            cartId: this.props.reduxState.cartList.cartId,
            childProductId: cartDetail.childProductId,
            unitId: cartDetail.unitId,
        }

        type == 1 ? editCartData['quantity'] = cartDetail.quantity - 1 : editCartData['quantity'] = cartDetail.quantity + 1

        this.props.dispatch(actions.editCard(editCartData))
    }
// to open address slider
    handleAddressSlider = () => {

        // this.props.deliveryType == 1 ?
        this.myAddRef.handleLeftSliderOpen()
        // : ''
    }
    // to open payment slider
    handlePaymentSlider = () => {
        this.SelectPayRef.handleLeftSliderOpen();
    }
   
    handleCouponSlider = () => {
        this.SelectCouponRef.handleBottomSliderOpen();
    }
     // to open coupon slider
    handleCouponLeftSlider = () => {
   
        this.startTopLoader.couponData ?this.CouponLeftSliderRef.handleLeftSliderOpen(): toastr.info(this.lang.noCopun||"Currently No Coupons Available") 
            
    }
 // to open add to cart slider 
    handleAddCardSlider = () => {
        this.AddCardLeftSliderRef.handleLeftSliderOpen();
    }

    handleAddCardByClose = () => {
        this.WalletMobileSliderRef.handleClose();
        this.AddCardLeftSliderRef.handleLeftSliderOpen();
    }
// to delete the card
    handleDeleteCard = (card) => {
        // this.setState({ loading: true })
        deleteCard(card.id).then((data) => {
            data.error ?
                (
                    this.setState({ loading: false }),
                    this.checkForError(data)
                )
                : (this.setState({ loading: false, selectedCard: null }), this.getCustomerCards());
        })
    }


    getFloatSum = (a, b) => parseFloat(Number(a.valueOf()) + Number(b.valueOf())).toFixed(2);

    deleteCard = () => {
        this.handleDeleteCard(this.state.selectedCard)
    }
// shedule time day from now to 7 days  
    printTime = () => {
        let daysRequired = 7; let sendDate = [];
        for (let i = 0; i <= daysRequired; i++) {
           
            let date_array = {
                "date": "",
                "day": "",
                "active": false,
                "unformat": "",
            };
            i == 1 ? date_array.day = "Tomorrow" : i == 0 ? date_array.day = "Today" : date_array.day = moment().add(i, 'days').format('dddd');

            date_array.date = moment().add(i, 'days').format('D');

            date_array.unformat = moment().add(i, 'days').format('YYYY-MM-DD HH:mm:ss');

            sendDate.push(date_array);
            sendDate[0].active = true;
            // this.bookDate = moment(date).format('dddd,D MMM Y');
        }




       
        return (

            sendDate.map((date, index) =>
                <div key={"customdateRadio" + index}>
                    <div className="float-left">
                        <input id={date.date} name="date_radio" className="customradioBig" type="radio" onChange={() => this.selectTime(date.unformat)} style={{ cursor: 'pointer' }} />
                        <label style={{ cursor: 'pointer' }} htmlFor={date.date}>
                            <span >{date.day}</span><br />
                            <span style={{ fontWeight: '700', fontSize: '20px' }}>
                                {/* <Moment format="D"> */}
                                {date.date}
                                {/* </Moment> */}
                            </span>
                        </label>
                    </div>
                </div>
            )
        )
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
//cards ui
    printCards = () => {
        return (
            <div className="px-3 py-3 paymentsProfileSec">
                <h5 className="mb-3 addPaymentCard">{this.lang.selectCard||"Select Card"}</h5>
                {/* <div className="row srlHidClsBt" style={{ maxHeight: "300px", overflow: "auto" }}> */}
                <div className="row paymentsCardForm  scroller paymentsCardFormScroller">
                    {this.state.customerCards && this.state.customerCards.length > 0 ?
                        <Wrapper>
                            {this.state.customerCards.map((card, index) =>
                                <div className="col-12 cardPaymentsBt" key={"customdateRadio" + index}>
                                    <input id={"checkout-desk" + card.id} onClick={(event) => this.handleCardSelection(event, card)} name="card_radio" className="customradioMedium" type="radio" style={{ cursor: 'pointer' }} />

                                    <label className="col-12" style={{ cursor: 'pointer' }} htmlFor={"checkout-desk" + card.id}>
                                        <div className="row">
                                            <div className="col">
                                                <div className="row align-items-center">
                                                    <div className="col-2 p-0">
                                                        <img width="30" src={this.determineCardTypeImage(card.brand)}></img>
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

                                                    <div className="col-2 p-0 delete" data-toggle="modal" data-target="#deleteCard" style={{ fontSize: '15px' }} >
                                                        <i className="fa fa-trash-o text-danger" aria-hidden="true"></i>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                    </label>

                                </div>
                            )
                            }

                        </Wrapper> :
                        <div className="col-12">
                            <button className="noCardsBtn" onClick={() => this.handleAddCardSlider()}>{this.lang.addNewC||"Add a New Card"}</button>
                        </div>
                    }
                </div>
                {this.state.customerCards && this.state.customerCards.length > 0 ?
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 my-2 text-center cardPaymentsBt">
                                <input id={"addNewCard"} onClick={() => this.handleAddCardSlider()} name="card_radio" className="customradioMedium" type="radio" style={{ cursor: 'pointer' }} />
                                <label className="" style={{ cursor: 'pointer', width: "50%", background: ENV_VAR.BASE_COLOR, color: '#fff', paddingTop: '10px', paddingBottom: '10px', margin: 0, border: 'none' }} htmlFor={"addNewCard"}>
                                    <span className="cardBrandBt">{this.lang.addNewC||"Add a New Card"}</span><br />
                                    {/* <span style={{ fontWeight: '500', fontSize: '12px', float: 'left' }}>
                                                {"*** ****"}
                                            </span> */}
                                    {/* <span style={{ fontWeight: '500', fontSize: '12px', float: 'right' }}>
                                                {"XX / XXXX"}
                                            </span> */}
                                </label>
                            </div>
                        </div>
                    </div> : ''
                }
            </div>
        )
    }

 
    selectTime = (time) => {
      
        let todayDate = moment(time).format('dddd,D MMM Y');
        let todayTime = moment(time).format('hh:mm a');
        $('.orderNowTimeBtnComm').removeClass('active')
        $("#orderLater").addClass('active')
        // bookingTime
        this.setState({ bookingDate: todayDate, bookingTime: todayTime, DatePickervalue: '', dueDate: todayDate, dueTime: todayTime })
    }
// shedule date 
    onChangeDatePicker = (e, date) => {
       
        let todayDate = moment(date).format('dddd,D MMM Y');
        let todayTime = moment(date).format('hh:mm a');
        $("input:radio[name='date_radio']").each(function (i) {
            this.checked = false;
        })

        $('.orderNowTimeBtnComm').removeClass('active')
        $("#orderLater").addClass('active')

        // bookingTime
        this.setState({ bookingDate: todayDate, bookingTime: todayTime, DatePickervalue: date, dueDate: todayDate })
    }
    handleWalletHistorySlider = (width) => {
        width === "100%" ? this.WalletMobileSliderRef.handleClose() : ''
        this.setState({ walletHistoryWidth: width }, () => {
            this.WalletHistorySliderRef.handleLeftSliderOpen();
        })
        this.getWalletHistory();
    }
    // wallet history
    getWalletHistory = () => {
        let pageIndex = 1;
        getWalletHistory(pageIndex).then((data) => {
            data.error ? '' : this.setState({ walletHistory: data.data.data })
        })
    }
    // shedule order time
    onTimeChange = (event, date) => {
       
        this.setState({ timeSelectionValue: date });
        let todayTime = moment(date, 'HH:mm').format("hh:mm a");
        
        this.setState({ bookingTime: todayTime, dueTime: todayTime });
        this.state.bookingDate && this.state.bookingTime ? this.handleNext() : ''
    }
    // after select go next step
    onDateChange = () => {
        this.state.bookingDate && this.state.bookingTime ? this.handleNext() : ''
    }
    selectBookingType = (type) => {
        let todayDate; let todayTime;
        this.setState({ bookingType: type })
        type == 1 ? this.handleNext() : ''
        $('.orderNowTimeBtnComm').removeClass('active')

        type = 1 ? (
            todayDate = moment().format('dddd, D MMM Y'),
            todayTime = moment().format('hh:mm a'),

            $("#orderNow").addClass('active'),
            this.setState({ bookingDate: todayDate, bookingTime: todayTime, DatePickervalue: '' }),
            $("input:radio[name='date_radio']").each(function (i) {
                this.checked = false;
            })
        ) : ''
    }
    // if the user want to logout 
    deleteAllCookies() {
        document.cookie.split(';').forEach((c) => {
            document.cookie = c.trim().split('=')[0] + '=;' + 'expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        });
        redirect('/')
    }
    // empty cart 
    printEmptyCart = () => {
        return (
            <div className="mobile-hide add-margin" style={{ background: '#e9ecee' }}>
                <div className="row justify-content-center">
                    <div className="col-12 py-lg-5 py-2 emptyScreenCheckout text-center" style={{ height: "80vh", marginTop: "20vh" }}>
                        <h4 className="emptyMsg">{this.lang.cartEmptyC||"Your cart is empty"}</h4>
                        <p className="mb-3 mt-1 emptySubMsg">{this.lang.viewMore||"You can go to Home Page to View More Products"}</p>
                        <Link href="/"><button onClick={() => this.showLoader()} className="mainPageBtn">{this.lang.goToHome||"Go To Home Page"}</button></Link>
                    </div>
                </div>
            </div>
        )
    }
    clearCoupon = () => {
        this.setState({ selectedCoupon: null, couponBenifit: null })
    }
    showLoader = () => this.setState({ loading: true })
    checkForError = (error) => {
        this.setState({ loading: false })
        switch (error.status) {
            case 498:
                this.logOutRef.openOptionsDialog(1)
                break;
            case 410:

            case 502:
                console.log("API CATCH error 502")
                break;
        }
    }
// add cart notes 
    handleCartNotes = (event) => {
        let tempNotes = this.state.extraNote;
        let storeIdKey = event.target.id.split("-")[1];
        tempNotes[storeIdKey] = event.target.value;
        this.setState({ extraNote: tempNotes });
    }

    startTopLoader = () => this.TopLoader.startLoader();

    render() {
        const { classes } = this.props;

        let firstIcon; let secondIcon; let thirdIcon; let fifthIcon = icon5; let fourthIcon; let divider = dividerMedium;

        let NowButton; let NowLabel; let LaterButton; let LaterLabel;

        this.state.bookingType == 1 ? (NowButton = buttonStyleFill, NowLabel = lableFill, LaterButton = buttonStyleOutline, LaterLabel = lableOutline) : (NowButton = buttonStyleOutline, NowLabel = lableOutline, LaterButton = buttonStyleFill, LaterLabel = lableFill);

        const { stepIndex, pickupStepIndex } = this.state;

        stepIndex == 0 ? firstIcon = icon1 : firstIcon = icon1;

        // stepIndex == 1 ? secondIcon = icon5 : secondIcon = icon6;
        stepIndex >= 1 ? (secondIcon = icon5, fourthIcon = icon3) : (secondIcon = icon6, fourthIcon = icon4);

        stepIndex == 2 ? (thirdIcon = icon3) : (thirdIcon = icon4);

        let discount = this.props.myCart ? this.props.myCart.cartDiscount : 0.00
        discount = this.state.couponBenifit ? (discount + this.state.couponBenifit.discountAmount.toFixed(2)) : 0.00

        let walletBalance = this.state.walletDetail ? parseFloat(this.state.walletDetail.walletBalance).toFixed(2) : 0.00
        let ifScheduleSelected = this.state.bookingType == 2 ? this.state.dueDate && this.state.dueTime ? true : false : true
        let deliveryCard = this.props.myCart && this.props.myCart.cart && this.props.myCart.cart.length > 0 ? this.props.myCart.cart[0].deliveryCard : ""
        let deliveryCash = this.props.myCart && this.props.myCart.cart && this.props.myCart.cart.length > 0 ? this.props.myCart.cart[0].deliveryCash : ""
        let currencySymbol = this.props.myCart && this.props.myCart.cart && this.props.myCart.cart.length > 0 ? this.props.myCart.cart[0].currencySymbol : ''
        let serviceFees= this.state.fareDetails &&this.state.fareDetails[0]&& this.state.fareDetails[0].convenienceFeeType ==1 ?    this.state.fareDetails &&  this.state.fareDetails[0] &&this.state.fareDetails[0].convenienceFee > 0 ?this.state.fareDetails[0].convenienceFee:0
        : parseFloat(((this.props.myCart.cartTotal) * ( this.state.fareDetails &&  this.state.fareDetails.length > 0 ?   this.state.fareDetails[0].convenienceFee:0)) / 100).toFixed(2)
   

        return (
            this.state.readyToRenderPage ?
                <Wrapper>
                    {/* setting up custom head tag for SEO html */}
                    <CustomHead title={ENV_VAR.APP_NAME + " - " + this.lang.secureCheckout||"Secure Checkout"} />
                    {/* header */}
                    <Header stickyHeader={this.state.stickyHeader} showLoginHandler={this.showLoginHandler} isAuthorized={this.state.isAuthorized} selectedLang={this.props.selectedLang} isCheckout={true}
                        showLocationHandler={this.showLocationHandler} showLocationMobileHandler={this.showLocationMobileHandler} hidecart={true} stores={this.props.stores.data}
                        hideSideMenu={() => this.hideSideMenu()} startTopLoader={this.startTopLoader} showSideMenu={() => this.showSideMenu()} showCart={this.showCart} hideBottom={true} deleteAllCookies={this.deleteAllCookies}
                        hideSearch={true} showLocation={false} showCheckout={true} hideCategory={true} showChildren={true}
                    >
                        <div className="col-12">
                            <div className="row align-items-center">
                                <div className="col-2 pl-0">
                                    <IconButton onClick={() => Router.back()} style={{ height: '30px', padding: '0px 12px' }}>
                                        <img src='/static/icons/Common/BackIcon.imageset/back_btn@2x.png' width="24" />
                                    </IconButton>
                                </div>
                                <div className="col-8 px-0 text-center">
                                    <h6 className="innerPage-heading lineSetter">{this.lang.confirmOrder||"Confirm Order"}</h6>
                                </div>
                            </div>
                        </div>
                    </Header>

                    {/* mobile-hide */}
                    {this.props.myCart && this.props.myCart.cart && this.props.myCart.cart.length > 0 ?
                        <div className="mobile-hide add-margin" style={{ background: '#e9ecee' }}>
                            <div className="col-12 py-lg-5 py-2" style={{}}>
                                <div className="row px-4 justify-content-center">
                                    <div className="col-xl-11 col-lg-12" style={{ maxWidth: "1080px" }}>
                                        <div className="row" style={{ minHeight: '100vh', height: '100%', background: '#e9ecee' }}>
                                            <div className="col-12">
                                                <div className="row">
                                                   {/* right side stepper */}
                                                    <div className="col-xl-8 col-lg-8 px-3 px-md-5 px-lg-3 checkoutPaymentDetailsSec">
                                                        <CheckoutStepper stepIndex={stepIndex} pickupStepIndex={pickupStepIndex} divider={divider} firstIcon={firstIcon} secondIcon={secondIcon} thirdIcon={thirdIcon} printTime={this.printTime} printCards={this.printCards} NowButton={NowButton} NowLabel={NowLabel}
                                                            LaterButton={LaterButton} LaterLabel={LaterLabel} walletBalance={walletBalance} {...this.state} myCart={this.props.myCart} selectAddress={this.selectAddress} opendrawer={this.opendrawer} getFloatSum={this.getFloatSum} onTimeChange={this.onTimeChange}
                                                            selectBookingType={this.selectBookingType} handleWalletSlider={this.handleWalletSlider} setStepIndex={this.setStepIndex} setPickupStepIndex={this.setPickupStepIndex} includeWallet={this.state.includeWallet} handleWallet={this.handleWallet}
                                                            handleEditAdrSliderOpen={this.handleEditAdrSliderOpen} deleteAddress={this.deleteAddress} isDeliveryType={this.state.hideAddress} checkOut={this.checkOut} onChangeDatePicker={this.onChangeDatePicker} selectedCard={this.state.selectedCard} deliveryCash={deliveryCash} deliveryCard={deliveryCard}
                                                            serviceFees={serviceFees}
                                                            locale={this.props.lang}/>
                                                    </div>
                                                    {/* checkoutLeft___Part */}
                                                    <div className="col-xl-4 col-lg-4 d-none d-lg-block checkOutCartSection">
                                                        {/* <CartContent /> */}
                                                        <CheckoutCartSection myCart={this.props.myCart} selectedCoupon={this.state.selectedCoupon} couponBenifit={this.state.couponBenifit} deliveryFeesTotal={this.state.deliveryFeesTotal} getFloatSum={this.getFloatSum}
                                                            editCart={this.editCart} handleCouponLeftSlider={this.handleCouponLeftSlider} clearCoupon={this.clearCoupon} handleCartNotes={this.handleCartNotes} fareDetails ={this.state.fareDetails} serviceFees={serviceFees}
                                                            locale={this.props.lang}
                                                            driverTip={this.state.driverTip}
                                                            handleTip={this.handleTip}
                                                            
                                                            tipValueDefault={this.state.tipValueDefault}
                                                            handleTipFun={this.handleTipFun}/>

                                                        {/* {this.state.selectedCard ?
                                                            <div className="row">
                                                                <div className="col-12 px-0">
                                                                    <RaisedButton
                                                                        label={"Checkout"}
                                                                        disableTouchRipple={true}
                                                                        disableFocusRipple={true}
                                                                        primary={true}
                                                                        style={{ marginTop: 0, width: "100%" }}
                                                                        buttonStyle={fullWidthButtonStyleFill}
                                                                        labelStyle={lableFill}
                                                                        onClick={() => this.checkOut(1)}
                                                                    />
                                                                </div>
                                                            </div> : ''
                                                        } */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> : this.state.showEmpty && this.props.myCart ? this.printEmptyCart() : ''
                    }
                    {/* mobile-hide */}

                    {/* mobile-show */}
                    <div className="mobile-show checkOutMobView" style={{ marginTop: "55px", overflowY: "auto", height: "78vh" }}>
                        <div className="col pb-4 checkoutMobViewSection">
                            <div className="row align-items-center">
                                <div className="col-12 border-bottom mobilePad pb-1">
                                    <h6 className="checkOutHeaderQues">{this.lang.schedule||"When do you want to get your order?"}</h6>
                                </div>
                            </div>
                            <div className="col-12 px-0">
                                <FormControl component="fieldset">
                                    {/* <FormLabel component="legend">labelPlacement</FormLabel> */}
                                    <RadioGroup
                                        aria-label="position"
                                        name="position"
                                        value={this.state.orderType}
                                        onChange={this.handleOrderType}
                                        row
                                    >
                                        <label class="ordBtnContainer">
                                            <p className="mb-2" style={{ color: '#444', fontSize: "15px", fontWeight: 600 }}>{this.props.lang.Now||"Now"}</p>
                                            {this.props.deliveryType == 2 ? <p>{this.lang.placeOrderD||"Now orders are meant to place orders where you can pick up your order ASAP."}</p> :
                                                <p>{this.lang.placeOrder||"Now orders are meant to place orders the"} {ENV_VAR.APP_NAME} {this.lang.partnerDeliver||"partner delivers your order ASAP."}</p>
                                            }
                                            <input type="radio" name="radio" value="1" id="orderNowMobi" onClick={this.handleOrderType} />
                                            <span class="ordBtnContainerMark"></span>
                                        </label>
                                        <label class="ordBtnContainer">
                                            <p className="mb-2" style={{ color: '#444', fontSize: "15px", fontWeight: 600 }}>{this.props.lang.Schedule||"Schedule"}</p>
                                            {this.props.deliveryType == 2 ? <p>{this.lang.scheduleOrder||"cheduled orders are meant to place orders where you can pick up your order at the selected time slot."}</p> :
                                                <p>{this.lang.Scplaced||"Scheduled orders are meant to place orders where the"} {ENV_VAR.APP_NAME} {this.lang.selectedTime||"partner delivers your order at the selected time slot."}</p>
                                            }
                                            <input type="radio" name="radio" value="2" id="orderLaterMobi" onClick={this.handleOrderType} />
                                            <span class="ordBtnContainerMark"></span>
                                        </label>
                                        {/* <FormControlLabel
                                            value="1"
                                            className="mb-3"
                                            control={<Radio color="red" style={{ color: "rgb(81, 170, 27)" }} />}
                                            label={<div className="col-12 py-2">
                                                <p className="mb-2" style={{ color: '#444', fontSize: "15px", fontWeight: 600 }}>Now</p>
                                                <p>Scheduled orders are meant to place orders where the courier delivers your order at the selected delivery slot</p>
                                            </div>
                                            }
                                            labelPlacement="right"
                                        />

                                        <FormControlLabel
                                            value="2"
                                            className="mb-3"
                                            control={<Radio style={{ color: "rgb(81, 170, 27)" }} />}
                                            label={<div className="col-12  py-2">
                                                <p className="mb-2" style={{ color: '#444', fontSize: "15px", fontWeight: 600 }}>Schedule</p>
                                                <p>Scheduled orders are meant to place orders where the courier delivers your order at the selected delivery slot</p>
                                            </div>
                                            }
                                            labelPlacement="right"
                                        >
                                            <p>Scheduled orders are meant to place orders where the courier delivers your order at the selected delivery slot</p>
                                        </FormControlLabel> */}
                                    </RadioGroup>
                                </FormControl>
                            </div>
                            <div className="col-12 py-3 scheduledOrder" style={{ display: "none" }}>
                                <div className="col ml-2 ">
                                    <p className="m-2" style={{ color: '#444', fontSize: "15px", fontWeight: 600 }}>
                                        {this.lang.selectedDate||"Select Date "}  <i className="fa fa-calendar float-right mt-1" style={{ fontStyle: "normal", fontSize: "15px" }}></i>
                                        <DatePicker
                                            minDate={new Date()}
                                            placeholder="yyyy/mm/dd"
                                            value={this.state.DatePickervalue} onChange={this.onChangeDatePicker} autoOk={true}
                                            floatingLabelFixed={true}
                                        />
                                    </p>

                                    <p className="m-2" style={{ color: '#444', fontSize: "15px", fontWeight: 600 }}>
                                    {this.lang.selectedDate||"Select Date "}   <i className="fa fa-clock-o float-right mt-1" style={{ fontStyle: "normal", fontSize: "15px" }}></i>
                                        <TimePicker value={this.state.timeSelectionValue} autoOk={true} onChange={this.onTimeChange} hintText="hh:mm" />
                                    </p>
                                </div>
                            </div>

                            {this.props.deliveryType == 2 ? '' :
                                <div className="row">
                                    <div className="col-12">
                                        <div className="row">
                                            <h6 className="col-12 checkOutHeader mobilePad">{this.lang.deliveryLocation||"Delivery Location"}</h6>
                                        </div>
                                        <div className="row" style={{ padding: '10px 0px' }}>
                                            {
                                                this.state.selectedMyAddress ?
                                                    <Wrapper>
                                                        <div className="col">
                                                            <div className="row align-items-center" onClick={() => this.handleAddressSlider()}>
                                                                <div className="col-auto checkOutFeatImgLayout">
                                                                    <img src="static/icons/drawable-xxxhdpi/coLocate.svg" width="13" alt="coLocate" />
                                                                </div>
                                                                <div className="col pl-4">
                                                                    <h6 className="checkOutFeat" onClick={() => this.handleAddressSlider()}> {this.state.fullAddressDetail ? this.state.fullAddressDetail.taggedAs : ''}</h6>
                                                                    {this.state.selectedMyAddress}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Wrapper>
                                                    :
                                                    <Wrapper>
                                                        <div className="col">
                                                            <div className="row align-items-center" onClick={() => this.handleAddressSlider()}>
                                                                <div className="col-auto checkOutFeatImgLayout">
                                                                    <img src="static/icons/drawable-xxxhdpi/coLocate.svg" width="13" alt="coLocate" />
                                                                </div>
                                                                <div className="col pl-4">
                                                                        <h6 className="checkOutFeat" style={this.props.deliveryType == 2 ? { color: '#444' } : { color: "black" }} onClick={() => this.handleAddressSlider()}>{this.lang.selectAdd||"select address"}</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Wrapper>
                                            }
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className="row">
                                <div className="col-12">
                                    <div className="row">
                                        <h6 className="col-12 checkOutHeader mobilePad">{this.lang.payMent||"Payment Method"}</h6>
                                    </div>
                                    <div className="row align-items-center" style={{ padding: '10px 0px' }}>
                                        {
                                            this.state.selectedPayment ?
                                                <Wrapper>
                                                    <div className="col-auto checkOutFeatImgLayout">
                                                        <img src="static/icons/drawable-xxxhdpi/credit-card.svg" width="20" alt="credit-card" />
                                                    </div>
                                                    <div className="col">
                                                        <h6 className="checkOutFeat" onClick={() => this.handlePaymentSlider()}>{this.state.selectedPayment}</h6>
                                                        {this.state.selectedPayment == "Wallet" ? `Wallet Payment ${walletBalance}` : ''}
                                                        {this.state.selectedPayment == "Cash" ?
                                                            this.state.includeWallet ? "Wallet + Cash" :
                                                                'Please keep exact change handy to help us serve you better.'
                                                            : ''}
                                                        {this.state.selectedPayment == "Card" ?
                                                            this.state.includeWallet ? "Wallet + card" :
                                                                <p> <img width="30" src={this.determineCardTypeImage(this.state.selectedCard.brand)} /> ( **** **** **** {this.state.selectedCard.last4} ) </p> : ''}
                                                    </div>
                                                </Wrapper>
                                                :
                                                <Wrapper>
                                                    <div className="col-auto checkOutFeatImgLayout">
                                                        <img src="static/icons/drawable-xxxhdpi/credit-card.svg" width="20" alt="credit-card" />
                                                    </div>
                                                    <div className="col">
                                                        <h6 className="checkOutFeat" onClick={() => this.handlePaymentSlider()}>{this.lang.selectPayment||"select payment"}</h6>
                                                    </div>
                                                </Wrapper>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="row">
                                        <h6 className="col-12 checkOutHeader mobilePad">{"leave tip for the driver"}</h6>
                                    </div>
                                   
                                    <div className="tipFuction" style={{width:"100%",background:"white"}}>
                        
                        <div className="differentValue">
                            <div className="d-flex " style={{justifyContent:"space-between",paddingRight:"30px"}}>
                              
                              
                                <div className="d-flex" style={{padding:"20px 0px"}}>
                                <p>{this.props.myCart && this.props.myCart.cart && this.props.myCart.cart.length > 0 ? currencySymbol : ''}</p>
                                <input type="number" className="textTipfiled" style={{width: "70px",
    border: "none",
    borderBottom: "1px solid"}} onChange={this.handleTip}/>
    </div>
                            </div>
                        </div>
                    </div> 
                                  
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="row">
                                        <h6 className="col-12 checkOutHeader mobilePad">{this.lang.promotocode||"Promocode"}</h6>
                                    </div>

                                    <div className="row align-items-center" style={{ padding: '10px 0px' }}>
                                        <div className="col-auto checkOutFeatImgLayout">
                                            <img src="static/icons/drawable-xxxhdpi/coupon.svg" width="20" alt="coupon" />
                                        </div>
                                        {
                                            this.state.selectedMyAddress || this.props.deliveryType == 2 ?
                                                this.state.couponBenifit ?
                                                    <div className="col">
                                                        <h6 className="py-2" onClick={() => this.handleCouponSlider()}>{this.state.selectedCoupon.code}
                                                        </h6>
                                                        <img src="static/images/cross.svg" style={{ position: "absolute", top: "12px", right: "12px" }} onClick={() => this.removePromo()} className="float-right" height="15" width="20" />
                                                        <span onClick={() => this.handleCouponSlider()}>Promocode {this.state.selectedCoupon.code} {this.lang.apply||"has been applied to your cart"}</span>
                                                    </div> :
                                                    <div className="col">
                                                        <h6 className="checkOutFeat" onClick={() => this.handleCouponSlider()}>{this.lang.applyCopun||"apply coupon"}</h6>
                                                    </div>
                                                :
                                                <div className="col">
                                                    <h6 className="checkOutFeat" onClick={() => {
                                                        toastr.clear();
                                                        toastr.options = {
                                                            "positionClass": "toast-bottom-center",
                                                        };
                                                        toastr.warning(this.lang.selectAdd||"Select Address")
                                                    }
                                                    }>{this.lang.applyCopun||"apply coupon"}</h6>
                                                </div>
                                        }
                                    </div>
                                </div>
                            </div>

                            <hr className="mt-0" />

                            <div className="row px-md-3" style={{ marginBottom: "55px" }}>
                                <div className="col py-2 px-3"
                                    style={{ background: this.props.myCart.cartDiscount && this.props.myCart.cartDiscount > 0 || this.props.myCart.exclusiveTaxes && this.props.myCart.exclusiveTaxes.length > 0 ? '#fff' : 'transparent' }}>
                                    {this.props.myCart.cartDiscount && this.props.myCart.cartDiscount > 0 ?
                                        <div className="row" >
                                            <div className="col-6 text-left" >{this.lang.subTotal||"Sub Total"}</div>
                                            <div className="col-6 text-right pr-2"><span className='oneLineSetter'>{this.props.myCart && this.props.myCart.cart ? this.props.myCart.cart[0].currencySymbol : ''}{parseFloat(this.props.myCart.cartTotal).toFixed(2)}</span>
                                            </div>
                                        </div>
                                        : ''}
                                    {this.state.deliveryFeesTotal ?
                                       
                                        <div className="row" >
                                            <div className="col-6 text-left">{this.lang.deliveryFee||"Delivery Fees"}</div>
                                            <div className="col-6 text-right pr-2"> {this.props.myCart && this.props.myCart.cart ? this.props.myCart.cart[0].currencySymbol : ''} {parseFloat(this.state.deliveryFeesTotal).toFixed(2)}</div>
                                        </div>
                                        // </div>
                                        : ''}
                                  {serviceFees > 0 ?
                                       
                                       <div className="row" >
                                           <div className="col-6 text-left">{"Service Fees"}</div>
                                           <div className="col-6 text-right pr-2"> {this.props.myCart && this.props.myCart.cart ? this.props.myCart.cart[0].currencySymbol : ''} {parseFloat(serviceFees).toFixed(2)}</div>
                                       </div>
                                       // </div>
                                       : ''}
                                  
                                    {this.props.myCart.exclusiveTaxes && this.props.myCart.exclusiveTaxes.length > 0 ? this.props.myCart.exclusiveTaxes.map((tax, index) =>
                                        <div className="row" key={'carttax' + index}>
                                            {/* <div className="col-6 text-left"> */}
                                            <div className="col-6 text-left" >{tax.taxtName}</div>
                                            <div className="col-6 text-right pr-2"><span className='oneLineSetter'>{this.props.myCart.cart[0].currencySymbol}{parseFloat(tax.price).toFixed(2)}</span>
                                            </div>
                                        </div>)
                                        : ''}


                                    {this.props.myCart.cartDiscount && this.props.myCart.cartDiscount > 0 ?
                                        <div className="row">
                                            <div className="col-6 text-left">{this.lang.yourSaving||"Your Savings"}</div>
                                            <div className="col-6 text-right pr-2"><span className='oneLineSetter'>- {this.props.myCart.cart[0].currencySymbol}{parseFloat(this.props.myCart.cartDiscount).toFixed(2)}</span>
                                            </div>
                                        </div>
                                        : ''}
                                </div>
                            </div>

                            <div className="checkoutToPayLayout border">
                                <div className="col py-3">
                                    <div className="row" style={{ padding: '10px 0px' }}>
                                        <div className="col-6">
                                            <h6 className="checkOutTotPay">{this.lang.toPay||"To pay"}</h6>
                                        </div>
                                        <div className="col-6 text-right">
                                            <h6 className="checkOutTotPay">
                                                <span className="">
                                                    {this.props.myCart && this.props.myCart.finalTotalIncludingTaxes ?
                                                        this.props.myCart.cart[0].currencySymbol : ''}
                                                </span>
                                                {this.props.myCart && this.props.myCart.finalTotalIncludingTaxes ?
                                                    this.state.couponBenifit && this.state.couponBenifit.discountAmount > 0 ?
                                                        parseFloat(this.state.deliveryFeesTotal||0+serviceFees||0+this.props.myCart.finalTotalIncludingTaxes - this.state.couponBenifit.discountAmount).toFixed(2)
                                                        : parseFloat(parseFloat(this.state.deliveryFeesTotal||0)+parseFloat(serviceFees||0)+this.props.myCart.finalTotalIncludingTaxes).toFixed(2)
                                                    : '0.00'}
                                            </h6>
                                        </div>
                                    </div>
                                    <div className="checkoutPayBtnLayout">
                                        {
                                            ifScheduleSelected && this.state.orderType && this.props.deliveryType == 1 && this.state.selectedMyAddress && this.state.selectedPayment || this.props.deliveryType == 2 && this.state.selectedPayment ?
                                                <button className="w-100 checkoutPayBtn" style={{ backgroundColor: ENV_VAR.BASE_COLOR }} onClick={() => this.mobileCheckOut()} >{this.lang.placeOrders||"PLACE THE ORDER"}</button> :
                                                <button className="w-100 checkoutPayBtn" >{this.lang.placeOrders||"PLACE THE ORDER"}</button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* mobile-show */}

                    <Authmodals onRef={ref => (this.child = ref)} editCart={this.editCart} />

                    <LogOutDialog onRef={ref => (this.logOutRef = ref)} />

                    <SelectAddressSlider onRef={ref => (this.myAddRef = ref)} userAddress={this.state.addressList} setAddress={this.setAddress} handleEditAdrSliderOpen={this.handleEditAdrSliderOpen} opendrawerForMobile={this.opendrawerForMobile} deleteAddress={this.deleteAddress} />

                    <SelectPaymentSlider onRef={ref => (this.SelectPayRef = ref)} walletDetail={this.state.walletDetail} setPayment={this.setPayment} cartTotal={this.props.myCart.finalTotalIncludingTaxes} customerCards={this.state.customerCards} handleCardSelection={this.handleCardSelection}
                    locale={this.props.lang}
                        userProfile={this.props.userProfile} getCustomerCards={this.getCustomerCards} handleWalletSlider={this.handleWalletSlider} handleDeleteCard={this.handleDeleteCard} determineCardTypeImage={this.determineCardTypeImage}
                        includeWallet={this.state.includeWallet} handleWallet={this.handleWallet} myCart={this.props.myCart} handleWalletHistorySlider={this.handleWalletHistorySlider}
                    />
                    <WalletHistorySlider onRef={ref => (this.WalletHistorySliderRef = ref)} width={this.state.walletHistoryWidth} walletHistory={this.state.walletHistory} />
                    <CouponSlider onRef={ref => (this.SelectCouponRef = ref)} setCoupon={this.setCoupon} myCart={this.props.myCart} />

                    <NewAddressSlider onRef={ref => (this.NewaddressRef = ref)} updateCoords={this.updateCoords}
                        updateLocation={this.updateLocation} home={this.state.home} office={this.state.office} others={this.state.others}
                        center={this.state.center} zoom={this.state.zoom} updateTaggedAs={this.updateTaggedAs}
                        taggedAs={this.state.taggedAs} clearAddressForm={this.clearAddressForm}
                        updateAdress={this.updateAdress} getGeoLocation={this.getGeoLocation}
                    />
                    {this.state.couponData ?
                        <CouponLeftSlider onRef={ref => (this.CouponLeftSliderRef = ref)} state={this.state} setCoupon={this.setCoupon} myCart={this.props.myCart} verifyCoupon={this.verifyCoupon} updatePromo={this.updatePromo} promo={this.state.promo} />
                        : ''}
                    {this.state.loading ? <CircularProgressLoader /> : ''}
                    <TopLoader onRef={ref => (this.TopLoader = ref)} />
                    <AddCardLeftSliderMobile width="100%" onRef={ref => (this.AddCardLeftSliderMobileRef = ref)} userProfile={this.props.userProfileDetail} getCustomerCards={this.getCustomerCards} />

                    <EditAddressSlider onRef={ref => (this.EditaddressRef = ref)} updateCoords={this.updateCoords}
                        updateLocation={this.updateLocation} home={this.state.home} office={this.state.office} others={this.state.others}
                        center={this.state.center} zoom={this.state.zoom} updateTaggedAs={this.updateTaggedAs}
                        taggedAs={this.state.taggedAs} clearAddressForm={this.clearAddressForm}
                        updateAdress={this.updateOldAddress} getGeoLocation={this.getGeoLocation} addressDetail={this.state.addressToEdit}
                    />

                    <AddCardLeftSlider onRef={ref => (this.AddCardLeftSliderRef = ref)} width={450} getCustomerCards={this.getCustomerCards} userProfile={this.props.userProfile} ></AddCardLeftSlider>

                    <WalletMobileSlider onRef={ref => (this.WalletMobileSliderRef = ref)} width={this.state.walletWidth} showOnlyAdddUI={this.state.showOnlyAdddUI} allowOnlyNumber={this.allowOnlyNumber} selectedCard={this.state.selectedCard}
                        walletDetail={this.state.walletDetail} walletRechargeAmount={this.state.walletRechargeAmount} customerCards={this.state.customerCards} setRechargeAmt={this.setRechargeAmt} defaultCard={this.state.defaultCard}
                        rechargeWallet={this.rechargeWallet} handleWalletHistorySlider={this.handleWalletHistorySlider} determineCardTypeImage={this.determineCardTypeImage} handleDeleteCard={this.handleDeleteCard}
                        setDefaultCard={this.setDefaultCard} handleAddCardMobileSlider={this.handleAddCardMobileSlider} currencySymbol={currencySymbol} handleAddCardSlider={this.handleAddCardByClose}
                    />
                    <CardSlider onRef={ref => (this.CardSliderMobileRef = ref)} setDefaultCard={this.setDefaultCard} width={"100%"} customerCards={this.state.customerCards} handleAddCardMobileSlider={this.handleAddCardMobileSlider} getCustomerCards={this.getCustomerCards} />


                    <ActionResponse onRef={ref => (this.ActionRes = ref)} handleResponseActions={this.handleResponseActions} handleErrResponseActions={this.handleErrResponseActions}
                        loadingMsg={this.state.loadingMsg} actionErrMsg={this.state.actionErrMsg}
                        successMsg={this.state.successMsg} />

                    <CustomizedSnackbar onRef={ref => (this.SnackbarRef = ref)} type={this.state.toastType} message={this.state.showToastErr} />
                    

                    <Footer lang={this.props.lang} locale={this.props.lang} />


                    <Loader isLoading={this.state.isLoading} />

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
                                    <p className="paraText">{this.lang.removeCard||"Do you want to remove your card from"} {ENV_VAR.APP_NAME} ?</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal">{this.lang.cancell||"CANCEL"}</button>
                                    <button type="button" data-dismiss="modal" onClick={this.deleteCard} className="btn btn-default okBtnConfirmPayment">{this.lang.removeC||"REMOVE"}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Wrapper > : ''
        );
    }
}


const mapStateToProps = state => {
    return {
        reduxState: state,
        stores: state.stores,
        myCart: state.cartList,
        appConfig: state.appConfig,
        userProfile: state.userProfile,
        lang:state.locale,
        selectedLang: state.selectedLang
    };
};

export default connect(mapStateToProps)(withStyles(styles)(SecureCheckOut));