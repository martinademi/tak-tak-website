import React, { Component } from 'react';
import Link from 'next/link';
import { connect } from 'react-redux'

import Wrapper from '../../hoc/wrapperHoc';
import { IconButton, FlatButton, FontIcon, Dialog } from 'material-ui';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { setCookie, getCookie, getCookiees, removeCookie } from '../../lib/session';
import Slider from 'react-slick';
import LeftSlider from '../ui/sliders/leftSlider'
import Moment from 'react-moment';
import moment from 'moment';

import SearchBar from '../search/seachBar';
import StoreDetail from '../dialogs/storeDetail';
import * as actions from '../../actions/index';
import { getLocation } from '../../lib/auth';
import * as enVariables from '../../lib/envariables';
import redirect from '../../lib/redirect';
import Router from "next/router";
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ContentFilter from 'material-ui/svg-icons/content/filter-list';
import FileFileDownload from 'material-ui/svg-icons/file/file-download';
import LogOutDialog from '../dialogs/logOut';
import { CSSTransition } from 'react-transition-group';
import StoreRightSlider from '../store/StoreRightSlider';
import "../../assets/about.scss";
import Popover from '../ui/popover/popover';
import ProfileMenu from './profile/profileMenu';
import CartContent from './cart/cart';

class StoreHeader extends React.Component {
    lang = this.props.lang
    state = {
        valueSingle: '4',
        active: false,
        open: false,
        anchorOrigin: {
            horizontal: 'left',
            vertical: 'bottom',
        },
        targetOrigin: {
            horizontal: 'left',
            vertical: 'top',
        },
        SliderWidth: 450,
        address: '',
        currentAddress: ''
    }

    constructor(props) {
        super(props);
        this.setDeliveryType = this.setDeliveryType.bind(this);
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleChangeSingle = (event, value) => {
        // this.setState({
        //     valueSingle: value,
        // }); 
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    toggleSideMenu = () => {
        !this.state.active ? this.props.showSideMenu() : this.props.hideSideMenu()
        this.setState({ active: !this.state.active })
    }

    LeftSliderHandler = () => {
        this.setState({ SliderWidth: 450 })
        this.StoreSlider.handleLeftSliderToggle()
    }

    componentWillMount() {
        // this.props.dispatch(actions.selectLocale("en"))
    }

    changeLanguage = (lan) => {
        setCookie("lang", lan)
        // this.props.dispatch(actions.selectLocale(lan)); 


        let storeName = getCookie('storeName', '')
        let lang = getCookie("lang", '')

        redirect(`/stores/${storeName.replace(/%20/g, '-').replace(/,/g, '').replace(/& /g, '').replace(/ /g, '-')}?lang=${lan}`);

    }

    openStoreDetail = () => {
        this.storeRef.openProductDialog();
    }


    getStartDate = start => moment(start, 'YYYY-MM-DD HH:mm:ss').format("h:mm A")
    getEndDate = end => moment(end, 'YYYY-MM-DD HH:mm:ss').format("h:mm A")



    handleClose = () => {
        this.setState({ SliderWidth: 0 })
    }

    closeSlider() {
        this.StoreSlider.handleLeftClose()
    }

    LeftSliderMobileHandler = () => {
        this.setState({ SliderWidth: "100%" })
        this.StoreSlider.handleLeftSliderToggle()
    }

    setDeliveryType(type, event) {
        event.stopPropagation();
        this.props.dispatch(actions.deliveryType(type));
        // Router.push('/checkout').then(() => window.scrollTo(0, 0));
        // this.TopLoader.startLoader();
        this.verifyMinimuOrderCheck();
    }
    verifyMinimuOrderCheck = () => {
        let cartStoresData = this.props.myCart ? this.props.myCart.cart : [];
        let invalidStoreOrders = [];
        cartStoresData &&
          cartStoresData.map((item, storeIndex) => {
            let minAmount = item.minimumOrder;
            let storeCurrentTotal = item.storeTotalPrice;
    
            if (!item.minimumOrderSatisfied && minAmount - storeCurrentTotal > 0) {
              invalidStoreOrders.push(item);
            }
          });
    
        if (invalidStoreOrders && invalidStoreOrders.length > 0) {
         
          let minAmount = invalidStoreOrders[0].minimumOrder;
          let storeName = invalidStoreOrders[0].storeName;
          let storeCurrentTotal = invalidStoreOrders[0].storeTotalPrice;
          toastr.error(
            `${
              "The minimum order value is $"} ${minAmount} ${
              "for"} ${storeName}. ${ "Add $"} ${minAmount -
              storeCurrentTotal} ${ "to be able to order"}.`
          );
          return;
        }
    
        Router.push("/checkout").then(() => window.scrollTo(0, 0));
      };
    

    componentDidMount = async () => {
        // this.props.onRef(this)
        let placeName = getCookie("place", '')
        let lat = await getCookie("lat", '');
        let lng = await getCookie("long", '');
        await this.getAddress(lat, lng)
        await this.setState({ address: placeName })

        this.props.isAuthorized ?
            (
                this.props.dispatch(actions.getProfile(),
                    this.props.dispatch(actions.getCart()))
            ) : ''

    }
    changeStore = (store) => {

        this.setState({ storeId: store.storeId })
        setCookie('storeName', store.storeName)
        setCookie('storeId', store.storeId)

        let lang = getCookie("lang", '') || "en"

        redirect(`/stores/${store.storeName.replace(/%20/g, '-').replace(/,/g, '').replace(/& /g, '').replace(/ /g, '-')}?lang=${lang}`);
        this.StoreSlider.handleLeftClose();
    }

    showUserMenu = () => {
        this.setState({
            showUserMenu: true
        })
    }
    hideUserMenu = () => {
        this.setState({
            showUserMenu: false
        })
    }
    showUserCart = () => {
        if (this.props.myCart && this.props.myCart.cart) {
            this.setState({
                showUserCart: true
            })
        }
    }
    hideUserCart = () => {
        this.setState({
            showUserCart: false
        })
    }


    componentWillReceiveProps(newProps) {
        if (newProps.lat && newProps.lng) {
            ((this.props.lat === newProps.lat) && (this.props.lng === newProps.lng)) ? '' : this.getAddress(newProps.lat, newProps.lng);
        }

        this.checkForSession(newProps);  // calling a function to check the user session
    }

    checkForSession = (newProps) => {
        if (getCookie("authorized") && newProps.sessionExpired && !this.state.sessionVerified) {
            this.logOutRef.openOptionsDialog(1);
            this.setState({ sessionVerified: true });
        }
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

    scrollTo = (id) => {
        let headerNavigationHeight = $('.headerNavDeskView').outerHeight();
        $('html, body').animate({
            'scrollTop': $('#' + id).offset().top - headerNavigationHeight
        }, 500);
    }
    getLangName = (lang) => {
        switch (lang) {
            case "en": return "English";
            case "ar": return "Arabic";
        }
    }
    logOut = () => {
        this.logOutRef.openOptionsDialog(2)
    }

    render() {
        const settings = {
            arrows: false,
            infinite: true,
            dots: true,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 3,
        };
        let buttonClass;
        this.state.active ? buttonClass = "hamburger-button active" : buttonClass = "hamburger-button";
        let headerClasss;
        this.props.stickyHeader ? headerClasss = "header" : headerClasss = "header-with-background";

        let address; let location;
        this.state.address ? (
            address = this.state.address.split(','),
            location = address[address.length - 4]
        ) : location = '';

        let addrParts = this.state.currentLongAddress ? this.state.currentLongAddress.split(",") : '';
        addrParts = addrParts && addrParts.length > 4 ? addrParts[addrParts.length - 4] : ''

        let RTL;
        this.props.selectedLang == 'ar' ? RTL = "rtl" : RTL = 'ltr';
        const { hideSearch, showLocation, showCheckout, hideCategory } = this.props;

        return (
            <Wrapper>
                {/* stickey header without store banner */}

                <header className={headerClasss + " mobile-hide " + RTL} style={{ direction: RTL }}>
                    <div
                        className={"col-12 headerWrap " + this.props.className}
                        id={this.props.id}
                        style={{ height: hideCategory ? "75px" : "auto" }}
                    >

                        {/* main header section */}
                        <div className="row restHeadCont">
                            <div className="col-xl-12 position-relative">
                                <div className="row justify-content-center">
                                    <div className="col-12">
                                        <nav className="navbar navbar-expand-md navbar-light">
                                            <div className="row align-items-center">
                                                {this.props.hammburger ? (
                                                    <div className="col-auto">
                                                        <div
                                                            className="hamIcon d-none d-lg-block"
                                                            onClick={this.toggleMenu}
                                                        >
                                                            <div className="ham" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                        ""
                                                    )}

                                                <div className="col-auto logoCont">
                                                    <a
                                                        //   className="navbar-brand"
                                                        onClick={this.startTopLoader}
                                                        href="/"
                                                    >
                                                        <img
                                                            src={enVariables.DESK_LOGO}
                                                            width="30"
                                                            height=""
                                                            className="d-none d-sm-block logoImg"
                                                            alt="logoName"
                                                        />
                                                        <img
                                                            src={enVariables.DESK_LOGO}
                                                            width="28"
                                                            height=""
                                                            className="d-inline-block d-sm-none logoImg"
                                                            alt="logoName"
                                                        />

                                                        {showCheckout ?
                                                            <p className="secureLable">{this.lang.secureCheckout||"Secure Checkout"}</p> : ''
                                                        }
                                                    </a>
                                                </div>
                                                {showLocation ?
                                                    <div
                                                        style={{ cursor: "pointer" }}
                                                        onClick={this.props.showLocationHandler}
                                                        className="col pl-0 px-sm-0 position-relative">
                                                        <span className="currentLocationType">
                                                            <span>
                                                                {addrParts || ''}
                                                            </span>
                                                        </span>
                                                        <span
                                                            title={this.state.currentLongAddress}
                                                            className="currentLocationSelected"
                                                        >
                                                            {this.state.currentLongAddress}
                                                        </span>
                                                        {this.props.componentMounted ? (
                                                            <span className="currentLocationIcon" />
                                                        ) : (
                                                                ""
                                                            )}
                                                    </div> : ''
                                                }
                                            </div>
                                            <button
                                                className="navbar-toggler"
                                                type="button"
                                                data-toggle="collapse"
                                                data-target="#navbarSupportedContent"
                                                aria-controls="navbarSupportedContent"
                                                aria-expanded="false"
                                                aria-label="Toggle navigation"
                                            >
                                                <span className="navbar-toggler-icon" />
                                            </button>

                                            <div className="collapse navbar-collapse" id="navbarSupportedContent">

                                                {/* search bar */}
                                                <div className='col-8 col-md-7 col-lg-7 col-xl-8'>
                                                    {!hideSearch ?
                                                        <SearchBar selectedStore={this.props.selectedStore} locale={this.props.locale} /> : ''
                                                    }
                                                </div>

                                                <ul className="navbar-nav ml-auto headerNavUL">

                                                    {this.props.isAuthorized ? (
                                                        this.props.userProfileDetail ? (
                                                            <li className="nav-item">
                                                                <a className="navTextWrapper"
                                                                    onMouseLeave={this.hideUserMenu}
                                                                    onMouseMove={this.showUserMenu}
                                                                    onClick={this.showUserMenu}
                                                                // onMouseOver={this.showUserMenu}
                                                                >
                                                                    <i className="fa fa-user mr-2" />
                                                                    {this.props.userProfileDetail.name}

                                                                    <CSSTransition
                                                                        in={this.state.showUserMenu}
                                                                        timeout={100}
                                                                        classNames="userMenuAnim"
                                                                        unmountOnExit>
                                                                        <ProfileMenu logOut={this.logOut} />
                                                                    </CSSTransition>
                                                                </a>
                                                            </li>
                                                        ) : (
                                                                <li className="nav-item">
                                                                    <a className="nav-link">
                                                                    
                                                                        <span
                                                                            className="shine"
                                                                            style={{ height: "25px", width: "100%" }}
                                                                        />s
                                                                    </a>
                                                                </li>
                                                            )
                                                    ) : (
                                                            <li className="nav-item">
                                                                <i className="fa fa-user" />
                                                                <a
                                                                    className="nav-link"
                                                                    onClick={this.props.showLoginHandler}
                                                                >
                                                                    {this.lang.logIn||"Sign in"}
                                                                    </a>
                                                            </li>
                                                        )}

                                                    {!showCheckout ?
                                                        <li className="nav-item">
                                                            {enVariables.CART_ICON}
                                                            <a
                                                                className="nav-link foodCart" style={{ position: "relative" }}
                                                                onClick={this.props.showCart}
                                                                onMouseLeave={this.hideUserCart}
                                                                onMouseOver={this.showUserCart}

                                                            >
                                                                {this.lang.cart||"Cart"}
                                                                 {this.props.mycartProducts &&
                                                                    this.props.mycartProducts.length > 0 ? (
                                                                        <div className="customBadge">
                                                                            {" "}
                                                                            <span>
                                                                                {this.props.mycartProducts.length}
                                                                            </span>{" "}
                                                                        </div>
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                <CSSTransition
                                                                    in={this.state.showUserCart}
                                                                    timeout={100}
                                                                    classNames="userMenuAnim"
                                                                    unmountOnExit>
                                                                    <CartContent cart={this.props.myCart} setDeliveryType={this.setDeliveryType} />
                                                                </CSSTransition>
                                                            </a>

                                                        </li> : ''
                                                    }
                                                </ul>
                                            </div>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* selected store and category tabs section */}
                        {hideCategory ? '' :
                            <div className="row align-items-center padLeftNRightMulti py-2">
                                <div className="col-lg-2 col-md-3 col-6">
                                    <a onClick={this.LeftSliderHandler}>
                                        {this.props.selectedStore ?
                                            <div className="row align-items-center">

                                                <div className="col-auto pl-0 pr-md-0 pr-lg-2">
                                                    <img className="shine" src={this.props.selectedStore.businessImage || this.props.selectedStore.bannerImage} height="28" width="28" style={{ borderRadius: '50%', marginRight: '3px' }} />
                                                </div>
                                                {/* <div className="col p-0 floatClass selected-store" onClick={this.LeftSliderHandler}> */}
                                                <div className="col p-0 floatClass selected-store">
                                                    <a style={{ textDecoration: "none" }}>
                                                        <p style={{ fontSize: "15px", margin: 0 }}>  {this.props.selectedStore.businessName || this.props.selectedStore.storeName}</p>
                                                    </a>
                                                </div>
                                                {/* </div> */}
                                            </div> : ''
                                        }
                                    </a>
                                </div>

                                <div className="col px-md-0 order-md-2 order-lg-1 lg-pt-2 pt-lg-0 d-none d-md-block">

                                    <ul className="nav homeNavUL ml-4">
                                        {this.props.nav1 ?
                                            <li className="nav-item">
                                                <a className="nav-link" onClick={() => this.scrollTo('tredingList')}>{this.props.locale.nav1}</a>
                                            </li>
                                            : ''}
                                        {this.props.nav2 ?
                                            <li className="nav-item">
                                                <a className="nav-link" onClick={() => this.scrollTo('offerList')} >{this.props.locale.nav2}</a>
                                            </li> : ''}
                                        {this.props.nav3 ?
                                            <li className="nav-item">
                                                <a className="nav-link" onClick={() => this.scrollTo('brandList')}>{this.props.locale.nav3}</a>
                                            </li> : ''}
                                        {this.props.nav4 ?
                                            <li className="nav-item">
                                                <a className="nav-link" onClick={() => this.scrollTo('categoryList')}>{this.props.locale.nav4}</a>
                                            </li>
                                            : ''}
                                    </ul>

                                </div>
                                {this.props.selectedStore && this.props.selectedStore.length > 0 && this.props.selectedStore.storeAvailability && this.props.selectedStore.availableSlots && this.props.selectedStore.availableSlots[0].startTime && this.props.selectedStore.availableSlots[0].endTime ?
                                    <div className="col-xl-4 col-lg-3 col-6 order-md-1 order-lg-2 floatReverseClass time-zone tzNoPaddTabView">
                                        <FontIcon className="material-icons" style={{ fontSize: "15px", marginRight: '0px', padding: '3px 2px 0px' }}> <i className="fa fa-clock-o"></i></FontIcon> {this.lang.avalibale||"Available"}
                                                    <a onClick={() => this.openStoreDetail()}> <span style={{ cursor: 'pointer', marginLeft: '10px' }}>

                                            {this.props.selectedStore.availableSlots[0].startTime ? this.getStartDate(this.props.selectedStore.availableSlots[0].startTime) : ''}

                                            {"  TO  "}

                                            {this.props.selectedStore.availableSlots[0].endTime ? this.getEndDate(this.props.selectedStore.availableSlots[0].endTime) : ''}
                                            {/* <Moment format="hh:mm A">
                                                        {this.props.selectedStore.availableSlots[0].endTime}
                                                    </Moment> */}
                                            <FontIcon className="material-icons" style={{ color: "#ffab84", fontSize: "15px", marginRight: '0px', padding: '3px 2px 0px' }}> <i className="fa fa-angle-right"></i></FontIcon>
                                        </span>
                                        </a>
                                    </div>
                                    : ''}
                            </div>
                        }

                    </div>

                </header>


                <header className={this.props.showStickyHeader ? "header mobile-show" : 'mobile-show'} id="storeHeaderMV">
                    {/* <div className="col-12 py-2 px-3"> */}
                    {/* <div className="col-12 py-2">
                        <div className="row align-items-center">
                            <div className="col-2 text-center">
                                <a href="/">
                                    <img src={enVariables.MOB_LOGO} alt={enVariables.APP_NAME} title={enVariables.APP_NAME} className="img-fluid logoImg" />
                                </a>
                            </div>
                            {
                                this.state.currentAddress ?
                                    RTL == "ltr" ?
                                        <div className="col-9 pp delivery-location text-left px-0 selected-store hide-overflow" style={{ cursor: 'pointer' }} onClick={this.props.showLocationMobileHandler} >
                                            <span> {this.props.locale.deliveryLocation} <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', padding: '2px 0px' }}> <i className="fa fa-angle-down"></i></FontIcon></span>
                                            <div style={{ marginTop: '-2px' }} className="hide-overflow-text ">  {this.state.currentAddress} </div>
                                        </div> :
                                        <div className="col-9 pp delivery-location text-right px-0 selected-store hide-overflow" style={{ cursor: 'pointer' }} onClick={this.props.showLocationMobileHandler} >
                                            <span> {this.props.locale.deliveryLocation} <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', padding: '2px 0px' }}> <i className="fa fa-angle-down"></i></FontIcon></span>
                                            <div style={{ marginTop: '-2px' }} className="hide-overflow-text ">  {this.state.currentAddress} </div>
                                        </div>
                                    : ''
                            }
                        </div>

                        <div className="row align-items-center">
                            <div className="col-2 text-center" style={{ cursor: 'pointer' }} onClick={this.LeftSliderMobileHandler}>
                                <img className="shine" src={this.props.selectedStore.businessImage} height="25" width="25" style={{ borderRadius: '50%' }} />
                            </div>
                            <div className="col-10 floatClass px-0 selected-store" onClick={this.LeftSliderMobileHandler}>
                                <span> {this.props.locale.selectStores} </span>
                                <p>  {this.props.selectedStore.businessName} <FontIcon className="material-icons" style={{ fontSize: "15px", marginRight: '0px', padding: '3px 2px 0px' }}> <i className="fa fa-angle-down"></i></FontIcon></p>
                            </div>
                        </div>
                    </div> */}

                    <div className="col-12 py-2 white-bg">
                        {this.props.showChildren ? this.props.children :
                            <div className="row py-1 align-items-center">
                                <div className="col-2 pl-0">
                                    <IconButton onClick={() => Router.back()} style={{ height: '30px', padding: '6px' }}>
                                        <img src='/static/icons/Common/BackIcon.imageset/back_btn@2x.png' width="24" />
                                    </IconButton>
                                </div>
                                <div className="col-8 text-center">
                                    {this.props.selectedStore ?
                                        <h6 className="innerPage-heading lineSetter">{this.props.selectedStore.storeTypeMsg}</h6> : ''
                                    }
                                </div>

                                <div className="col-2 pr-0 text-center">
                                    {/* <IconButton onClick={() => this.opendrawer()} style={{ height: '30px', padding: '6px' }}>
                                    <i className="fa fa-search mt-2" style={{ fontSize: "18px" }} aria-hidden="true"></i>
                                    </IconButton> */}
                                    
                                </div>
                            </div>
                        }
                    </div>

                    <div className="col-12 py-2 mobile-hide">
                        <div className="row align-items-center">
                            <div className="col-3 pr-0">
                                {this.props.selectedStore ?
                                    <img src={this.props.selectedStore.bannerImage} height="60px" width="90%" alt={this.props.selectedStore.storeName} /> : ''
                                }
                            </div>
                            <div className="col-9 pl-2">
                                {this.props.selectedStore ?
                                    <p className="storeName">{this.props.selectedStore.businessName}</p> : ''
                                }
                            </div>
                        </div>
                    </div>
                </header>

                <StoreRightSlider onRef={ref => (this.StoreSlider = ref)} stores={this.props.stores} width={this.state.SliderWidth} changeStore={this.changeStore} />

                <LogOutDialog onRef={ref => (this.logOutRef = ref)} />

                <StoreDetail onRef={ref => (this.storeRef = ref)} storeInfo={this.props.selectedStore} stores={this.props.stores} > </StoreDetail>
            </Wrapper>
        )
    }
}



const mapStateToProps = state => {
    return {
        reduxState: state,
        userProfileDetail: state.userProfile,
        myCart: state.cartList,
        mycartProducts: state.cartProducts,
        locale: state.locale,
        selectedLang: state.selectedLang,
        sessionExpired: state.sessionExpired,
        lang:state.locale
    };
};

export default connect(mapStateToProps)(StoreHeader);