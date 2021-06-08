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
import { handleScrollAnimation } from '../../lib/scroll/scroll';

class StoreHeader extends React.Component {

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

    componentDidMount = async () => {
        this.props.onRef(this)
        let placeName = getCookie("place", '')
        let lat = await getCookie("lat", '');
        let lng = await getCookie("long", '');
        await this.getAddress(lat, lng)
        await this.setState({ address: placeName })

        this.props.isAuthorized ? this.props.dispatch(actions.getProfile()) : ''

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
    openSearchBar() {
        Router.push('/searchPage').then(() => window.scrollTo(0, 0))
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
        let targetSection = document.getElementById(id);
        // calling a function to scroll to the section with animation
        handleScrollAnimation(document.scrollingElement || document.documentElement, "scrollTop", "", 0, targetSection.offsetTop + 100, 10, true);
    }
    getLangName = (lang) => {
        switch (lang) {
            case "en": return "English";
            case "ar": return "Arabic";
        }
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

        return (
            <Wrapper>
                {/* stickey header without store banner */}
                <CSSTransition
                    in={this.props.stickyHeader}
                    timeout={2000}
                    classNames="stickeyHeader"
                    unmountOnExit>
                    <header className={headerClasss + " mobile-hide " + RTL} style={{ direction: RTL }}>
                        <div
                            className={"col-12 headerWrap headerNavDeskView " + this.props.className}
                            id={this.props.id}
                            style={{ height: "auto" }}
                        >

                            {/* main header section */}
                            <div className="row restHeadCont ">
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
                                                        </a>
                                                    </div>
                                                    <div
                                                        style={{ cursor: "pointer" }}
                                                        onClick={this.props.showLocationHandler}
                                                        className="col pl-0 px-sm-0 position-relative">
                                                        <span className="currentLocationType">
                                                            <span>
                                                                {addrParts || ''}
                                                            </span>
                                                        </span>
                                                        <span title={this.state.currentAddress} className="currentLocationSelected">
                                                            {this.props.componentMounted
                                                                ? this.state.currentLongAddress
                                                                : ""}
                                                        </span>
                                                        {this.props.componentMounted ? (
                                                            <span className="currentLocationIcon" />
                                                        ) : (
                                                                ""
                                                            )}
                                                    </div>
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
                                                    <div className='col-8 col-lg-7 col-xl-8 pr-0'>
                                                        <SearchBar selectedStore={this.props.selectedStore} locale={this.props.locale} />
                                                    </div>

                                                    <ul className="navbar-nav headerNavULStore">

                                                        {this.props.isAuthorized ? (
                                                            this.props.userProfileDetail ? (
                                                                <li className="nav-item">

                                                                    <a className="navTextWrapper"
                                                                        onMouseLeave={this.hideUserMenu}
                                                                        onMouseMove={this.showUserMenu}
                                                                        onClick={this.showUserMenu}
                                                                    // onClick={this.props.showLoginHandler}
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
                                                                            {" "}
                                                                            <span
                                                                                className="shine"
                                                                                style={{ height: "25px", width: "100%" }}
                                                                            />{" "}
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
                                                                        {this.props.locale.logIn}
                                                                    </a>
                                                                </li>
                                                            )}

                                                        <li className="nav-item">
                                                            {enVariables.CART_ICON}
                                                            <a
                                                                className="nav-link foodCart" style={{ position: "relative" }}
                                                                onClick={this.props.showCart}
                                                                onMouseLeave={this.hideUserCart}
                                                                onMouseOver={this.showUserCart}

                                                            >
                                                               {this.props.locale.cart}
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

                                                        </li>
                                                    </ul>
                                                </div>
                                            </nav>
                                        </div>
                                        {this.props.children ? (
                                            <div className="col-12">{this.props.children}</div>
                                        ) : (
                                                ""
                                            )}
                                    </div>
                                </div>
                            </div>

                            {/* selected store and category tabs section */}
                            <div className="row align-items-center padLeftNRightMulti py-2">
                                <div className="col-lg-2 col-md-3 col-6">
                                    <a onClick={this.LeftSliderHandler}>
                                        <div className="row align-items-center">
                                            <div className="col-auto pl-0 pr-md-0 pr-lg-2">
                                                <img className="shine" src={this.props.selectedStore.businessImage} height="28" width="28" style={{ borderRadius: '50%', marginRight: '3px' }} />
                                            </div>
                                            {/* <div className="col p-0 floatClass selected-store" onClick={this.LeftSliderHandler}> */}
                                            <div className="col p-0 floatClass selected-store">
                                                <a style={{ textDecoration: "none" }}>
                                                    <p style={{ fontSize: "15px", margin: 0 }}>  {this.props.selectedStore.businessName}</p>
                                                </a>
                                            </div>
                                            {/* </div> */}
                                        </div>
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
                                        <FontIcon className="material-icons" style={{ fontSize: "15px", marginRight: '0px', padding: '3px 2px 0px' }}> <i className="fa fa-clock-o"></i></FontIcon> Available
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

                        </div>

                    </header>
                </CSSTransition>

                {/* normal header with store banner */}
                <CSSTransition
                    in={!this.props.stickyHeader}
                    timeout={2000}
                    classNames="bigHeader"
                    unmountOnExit>
                    {/* {!this.props.stickyHeader ? */}
                    <header className={"header-with-background" + " mobile-hide " + RTL} style={{ direction: RTL }}>
                        <div className={this.props.stickyHeader ? "col-12 p-0" : "col-12 p-0 add-overlay"}>
                            <div className="justify-content-center">
                                <div className="headerNavDeskView col-xl-12 col-sm-12 py-2 py-md-2  mobile-hide">
                                    <div className="row pt-1 padLeftNRightMulti align-items-center">
                                        <div className="col-auto col-xl-1 col-lg-2 col-sm-2">
                                            {
                                                <div className="row">
                                                    <div className="col-8 py-2 px-3 text-left">
                                                        <a href="/">
                                                            {this.props.stickyHeader ?
                                                                <img src={enVariables.MOB_LOGO} alt={enVariables.APP_NAME} title={enVariables.APP_NAME} width="30" className="logoImg" />
                                                                : <img src={enVariables.DESK_LOGO} alt={enVariables.APP_NAME} title={enVariables.APP_NAME} width="30" className="logoImg" />}
                                                        </a>
                                                    </div>

                                                </div>
                                            }
                                        </div>

                                        <div
                                            style={{ cursor: "pointer" }}
                                            onClick={this.props.showLocationHandler}
                                            className="col col-lg-3 col-xl-auto position-relative d-flex align-items-center">
                                            <span className="currentLocationType color-white">
                                                <span>
                                                    {addrParts || ''}
                                                </span>
                                            </span>
                                            <span title={this.state.currentAddress} className="currentLocationSelected color-white">
                                                {this.props.componentMounted
                                                    ? this.state.currentLongAddress
                                                    : ""}
                                            </span>
                                            {this.props.componentMounted ? (
                                                <span className="currentLocationIcon" />
                                            ) : (
                                                    ""
                                                )}
                                        </div>

                                        <div className="col px-md-0 mobile-hide">
                                            {this.props.stickyHeader ?
                                                <SearchBar selectedStore={this.props.selectedStore} locale={this.props.locale} />
                                                : ''
                                            }
                                        </div>
                                        <div className="col-xl-5 col-lg-5 col-sm-6 text-right rapLogInLayout mobile-hide">
                                            <div className="row align-items-center justify-content-end stickyRight">

                                                {this.props.isAuthorized ?
                                                    this.props.userProfileDetail ?

                                                        <div className="col col-md-auto text-center">
                                                            {/* <Link href='/profile'> */}
                                                            <div className="tab-hide">
                                                                <a className="navTextWrapper color-white userProfLink"
                                                                    onMouseLeave={this.hideUserMenu}
                                                                    onMouseMove={this.showUserMenu}
                                                                    onClick={this.showUserMenu}
                                                                // onClick={this.props.showLoginHandler}
                                                                // onMouseOver={this.showUserMenu}
                                                                >
                                                                    <i className="fa fa-user mr-2" />
                                                                    {this.props.userProfileDetail.name}

                                                                    <CSSTransition
                                                                        in={this.state.showUserMenu}
                                                                        timeout={100}
                                                                        classNames="userMenuAnim"
                                                                        unmountOnExit>
                                                                        <ProfileMenu right={0} logOut={this.logOut} />
                                                                    </CSSTransition>
                                                                </a>
                                                            </div>
                                                            <div className="tab-show">
                                                                <IconMenu
                                                                    iconButtonElement={
                                                                        <a className='profile-tag hide-overflow-text text-center'>
                                                                            <span className={this.props.stickyHeader ? "color-black" : "color-white"}>Account  <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', padding: '2px 0px', color: this.props.stickyHeader ? "#444" : "#fff" }}> <i className="fa fa-angle-down"></i></FontIcon></span>
                                                                        </a>
                                                                    }
                                                                    onChange={this.handleChangeSingle}
                                                                    value={this.state.valueSingle}
                                                                >
                                                                    <MenuItem value="1" onClick={() => Router.push('/profile')} primaryText="Profile" />
                                                                    <MenuItem value="2" onClick={() => Router.push('/profile')} primaryText="My Orders" />
                                                                    <MenuItem value="3" onClick={this.logOut} primaryText="Logout" />
                                                                </IconMenu>

                                                            </div>
                                                            {/* </Link> */}
                                                        </div> :
                                                        <div className="col-3 hide-overflow text-center">

                                                            <i className="fa fa-user" />
                                                            <a
                                                                className="nav-link"
                                                                onClick={this.props.showLoginHandler}
                                                            >
                                                                {this.props.locale.logIn}
                                                                    </a>
                                                        </div>
                                                    :
                                                    <div className="col-auto normalLoginLnk" onClick={this.props.showLoginHandler}  >
                                                        {/* <a className="rapLogIn tab-hide color-white">{this.props.locale.logIn}<FontIcon className="material-icons" style={{ fontSize: "11px", marginLeft: '3px', padding: '2px 0px', color: this.props.stickyHeader ? "#444" : "#fff" }}> <i className="fa fa-angle-down"></i></FontIcon></a> */}

                                                        <i className="fa fa-user" />
                                                        <a
                                                            className="nav-link color-white"
                                                            onClick={this.props.showLoginHandler}
                                                        >
                                                            {this.props.locale.logIn}
                                                                    </a>
                                                        <div className="tab-show">
                                                            <FontIcon onClick={this.props.showLoginHandler} className="material-icons" style={{ fontSize: "18px", marginRight: '0px', color: this.props.stickyHeader ? "#444" : "#fff" }}> <i className="fa fa-sign-in"></i></FontIcon>
                                                        </div>
                                                    </div>
                                                }

                                                <div className="col-auto"
                                                //  id="cartModalTrigger"
                                                >
                                                    <a
                                                        className="nav-link color-white foodCart" style={{ position: "relative" }}
                                                        onClick={this.props.showCart}
                                                        onMouseLeave={this.hideUserCart}
                                                        onMouseOver={this.showUserCart}

                                                    >
                                                        {enVariables.CART_ICON}

                                                        <span className="ml-2">{this.props.locale.cart}</span>
                                                        {this.props.mycartProducts &&
                                                            this.props.mycartProducts.length > 0 ? (
                                                                <div className="customBadge" style={{ right: "52px" }}>
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

                                                    {/* <a className="cartIconComm white-color cartIconCommWhite" onClick={this.props.isAuthorized ? this.props.showCart : this.props.showLoginHandler} >{enVariables.CART_ICON}  Cart</a>
                                                    {this.props.mycartProducts && this.props.mycartProducts.length > 0 ? <div className="cartCount"> <span>{this.props.mycartProducts.length}</span> </div> : ''} */}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col col-xl-6 col-lg-6 col-sm-10 pt-2 text-right rapLogInLayout  mobile-show">
                                            <div className="row align-items-center justify-content-end">
                                                <div className="col-auto">
                                                    <FontIcon className="material-icons" style={{ fontSize: "18px", marginRight: '0px' }}> <i className="fa fa-globe" aria-hidden="true"></i></FontIcon>
                                                </div>

                                                <div className="col-auto">
                                                    <FontIcon className="material-icons" style={{ fontSize: "18px", marginRight: '0px' }}> <i className="fa fa-home"></i></FontIcon>
                                                </div>
                                                {this.props.isAuthorized ?
                                                    <div className="col-auto">
                                                        <Link href='/profile'>
                                                            <img src="/static/images/account-outline.svg" width="14" height="15" className="img-fluid" alt="cart" />
                                                        </Link>
                                                    </div>
                                                    :
                                                    <div className="col-auto">
                                                        <FontIcon onClick={this.props.showLoginHandler} className="material-icons" style={{ fontSize: "18px", marginRight: '0px' }}> <i className="fa fa-sign-in"></i></FontIcon>
                                                    </div>

                                                }
                                                <div className="col-auto" id="cartModalTrigger">
                                                    <img src="/static/images/cart-outline.svg" width="14" height="15" className="img-fluid" alt="cart" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {this.props.stickyHeader ?
                                        <div className="row align-items-center padLeftNRightMulti py-2">
                                            <div className="col-lg-2 col-md-3 col-6">
                                                <div className="row align-items-center">
                                                    <div className="col-auto pr-md-0  pr-lg-2">
                                                        <img className="shine" src={this.props.selectedStore.businessImage} height="28" width="28" style={{ borderRadius: '50%', marginRight: '3px' }} />
                                                    </div>
                                                    {/* <div className="col p-0 floatClass selected-store" onClick={this.LeftSliderHandler}> */}
                                                    <div className="col p-0 floatClass selected-store">
                                                        <a style={{ textDecoration: "none" }}>
                                                            {/* <span style={{ display: 'block', marginBottom: '2px' }}> {this.props.locale.selectStores} </span> */}
                                                            {/* <p>  {this.props.selectedStore.businessName} <FontIcon className="material-icons" style={{ fontSize: "15px", marginRight: '0px', padding: '3px 2px 0px' }}> <i className="fa fa-angle-down"></i></FontIcon></p> */}
                                                            <p style={{ fontSize: "15px", margin: 0 }}>  {this.props.selectedStore.businessName}</p>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col px-md-0 order-md-2 order-lg-1 lg-pt-2 pt-lg-0 d-none d-md-block">

                                                <ul className="nav homeNavUL ml-3">
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
                                                    <FontIcon className="material-icons" style={{ fontSize: "15px", marginRight: '0px', padding: '3px 2px 0px' }}> <i className="fa fa-clock-o"></i></FontIcon> Available
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
                                        :
                                        <SearchBar selectedStore={this.props.selectedStore} view="normal" LeftSliderHandler={this.LeftSliderHandler} openStoreDetail={this.openStoreDetail} locale={this.props.locale} />
                                    }
                                </div>
                            </div>
                        </div>
                    </header>
                    {/* : '' */}
                    {/* } */}
                </CSSTransition>

                <header className="header mobile-show" style={{ boxShadow: 'none' }}>
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

                    <div className="col-12 py-2 d-none">
                        <div className="row py-1 align-items-center">
                            <div className="col-2 pl-0">
                                <IconButton onClick={() => Router.back()} style={{ height: '30px', padding: '6px' }}>
                                    <img src='/static/icons/Common/BackIcon.imageset/back_btn@2x.png' width="24" />
                                </IconButton>
                            </div>
                            <div className="col-8 text-center">
                                <h6 className="innerPage-heading lineSetter">
                                    {this.props.stickyHeader ? this.props.selectedStore.storeName || this.props.selectedStore.businessName : ''}</h6>
                            </div>

                            <div className="col-2 pr-0 text-center">
                                <IconButton onClick={() => this.openSearchBar()} style={{ height: '30px', padding: '6px' }}>
                                    {/* <i className="fa fa-search" style={{ fontSize: "18px", marginTop: "1px" }} aria-hidden="true"></i> */}
                                    <img src='/static/img/svg/searchIcon.svg' className="mobiHeaderSearchIcon" width="20" />
                                </IconButton>
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="row align-items-center">
                            <div className="col-auto pr-0">
                                <IconButton onClick={() => Router.back()}>
                                    <img src='/static/icons/Common/BackIcon.imageset/back_btn@2x.png' width="24" />
                                </IconButton>
                            </div>
                            <div className="col text-center">
                                <h6 className="innerPage-heading lineSetter">
                                    {this.props.stickyHeader ? this.props.selectedStore.storeName || this.props.selectedStore.businessName : ''}
                                </h6>
                            </div>
                            <div className="col-auto px-0">
                                {/* <IconButton onClick={() => this.openSearchBar()}> */}
                                {/* <i className="fa fa-heart" style={{color: "#f8ba1a !important"}}></i> */}
                                {/* </IconButton> */}
                            </div>
                            <div className="col-auto">
                                <IconButton onClick={() => this.openSearchBar()}>
                                    <img src={enVariables.SEARCH_ICON} className="" width="20" />
                                </IconButton>
                            </div>
                        </div>
                    </div>



                </header>
                

                <StoreRightSlider onRef={ref => (this.StoreSlider = ref)} stores={this.props.stores} width={this.state.SliderWidth} changeStore={this.props.changeStore} />

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
        sessionExpired: state.sessionExpired
    };
};

export default connect(mapStateToProps)(StoreHeader);