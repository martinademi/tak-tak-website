import React, { Component } from 'react';
import Link from 'next/link';
import { connect } from 'react-redux'
import Router from "next/router";
import Wrapper from '../../hoc/wrapperHoc';
import { IconButton, FlatButton, FontIcon, Dialog } from 'material-ui';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Slider from 'react-slick';
import LeftSlider from '../ui/sliders/leftSlider'
import { setCookie, getCookie, getCookiees, removeCookie } from '../../lib/session'
import SearchBar from '../search/seachBar';
import * as actions from '../../actions/index';
import Moment from 'react-moment';
import { getLocation } from '../../lib/auth';
import redirect from '../../lib/redirect';
import * as enVariables from '../../lib/envariables';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import LogOutDialog from '../dialogs/logOut';
import StoreRightSlider from '../store/StoreRightSlider';
import "../../assets/about.scss";

class Header extends React.Component {

    state = {
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
        place: ''
    }

    handleOpen = () => {
        this.setState({ open: true });
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
    getLangName = (lang) => {
        switch (lang) {
            case "en": return "English";
        }
    }
    handleClose = () => {
        this.setState({ SliderWidth: 0 })
    }

    closeSlider() {
        this.child.handleLeftSliderClose()
    }

    LeftSliderMobileHandler = () => {
        this.setState({ SliderWidth: "100%" })
        this.child.handleLeftSliderToggle()
    }
    deleteAllCookies = () => {
        // this.logOutRef.openOptionsDialog(2)
    }
    logOut = () => {
        // this.logOutRef.openOptionsDialog(2)
    }

    changeStore = (store) => {

        this.setState({ storeId: store.storeId })
        setCookie('storeName', store.storeName)
        setCookie('storeId', store.storeId)

        let lang = getCookie("lang", '') || "en"

        redirect(`/stores/${store.storeName.replace(/%20/g, '-').replace(/,/g, '').replace(/& /g, '').replace(/ /g, '-')}?lang=${lang}`);
        this.StoreSlider.handleLeftClose();
    }
    changeLanguage = (lan) => {
        setCookie("lang", lan)
        // this.props.dispatch(actions.selectLocale(lan)); 


        let storeName = getCookie('storeName', '')
        let lang = getCookie("lang", '')

        redirect(`/stores/${storeName.replace(/%20/g, '-').replace(/,/g, '').replace(/& /g, '').replace(/ /g, '-')}?lang=${lan}`);

    }
    componentDidMount = async () => {
        let place = getCookie('place', '')
        place ? place = place.split(',') : ''
        place ? this.setState({ place: place[place.length - 4] }) : ''

        let lat = await getCookie("lat", '');
        let lng = await getCookie("long", '');
        await this.getAddress(lat, lng);

        this.props.isAuthorized ? this.props.dispatch(actions.getProfile()) : ''
    }

    componentWillReceiveProps(newProps) {
        if (newProps.lat && newProps.lng) {
            ((this.props.lat === newProps.lat) && (this.props.lng === newProps.lng)) ? '' : this.getAddress(newProps.lat, newProps.lng);
        }
    }


    getAddress(lat, lng) {
        let geocoder = new google.maps.Geocoder();
        let latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({ 'latLng': latlng }, (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
                let addr = results[results.length - 6].formatted_address.split(',')
                let curAddr = addr[0];
                this.setState({ currentAddress: curAddr })
            }
        })
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

        let addrParts = this.state.currentAddress ? this.state.currentAddress.split(",") : '';
        addrParts = addrParts && addrParts.length > 4 ? addrParts[addrParts.length - 4] : ''

        return (
            <Wrapper>
                {/* className={"col-12 headerWrap " + this.props.className} */}
                <header className={"mobile-hide headerNav " + this.props.className} id={this.props.id}>
                    <div className="col-12 innerPageHeaderNav">
                        <div className="row justify-content-center">
                            <div className="innerPageHeaderNavMobHide col-xl-12 col-sm-12 py-2 py-md-3 mobile-hide">
                                <div className="row align-items-center padLeftNRightMulti">
                                    <div className="col-auto col-sm-3 col-md-auto pl-1">
                                        <a href="/" onClick={this.props.startTopLoader}>
                                            <img src={enVariables.DESK_LOGO} alt={enVariables.APP_NAME} title={enVariables.APP_NAME}
                                                //  width="30" 
                                                width="120"
                                                className="logoImg" />
                                            {this.props.isCheckout ?
                                                <p className="secureLable">Secure Checkout</p> : ''
                                            }
                                            {/* <img src={enVariables.DESK_LOGO} alt={enVariables.APP_NAME} title={enVariables.APP_NAME} width="90" className="logoImg" /> */}
                                        </a>
                                        {/* <span>Secure Checkout</span> */}
                                    </div>

                                    <div
                                        style={{ cursor: "pointer" }}
                                        onClick={this.showLocationHandler}
                                        className="col pl-0 px-sm-0 position-relative"
                                    >
                                        <span className="currentLocationType">
                                            <span>
                                                {/* {this.state.city} */}
                                                {addrParts || ''}
                                            </span>
                                        </span>
                                        <span
                                            title={this.state.currentAddress}
                                            className="currentLocationSelected"
                                        >
                                            {this.props.componentMounted
                                                ? this.state.currentAddress
                                                : ""}
                                        </span>
                                        {this.props.componentMounted ? (
                                            <span className="currentLocationIcon" />
                                        ) : (
                                                ""
                                            )}
                                    </div>

                                    {this.props.selectedStore && !this.props.hideStoreSelection ?
                                        // <div className="col-2 col-xl-2 col-lg-2 col-sm-2 text-center">
                                        <div className="col-md-2 col-sm-3 tab-hide" onClick={this.LeftSliderHandler}>

                                            <div className="row align-items-center" >
                                                <div className="col-auto pr-0">
                                                    <img className="shine" src={this.props.selectedStore.businessImage} height="28" width="28" style={{ borderRadius: '50%', marginRight: '5px' }} />
                                                </div>
                                                <div className="col p-0 selected-store">
                                                    {/* <span className="">Selected Store</span> */}
                                                    <p className="">{this.props.selectedStore.businessName} <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', padding: '2px 0px', margin: 0, lineHeight: "1px", color: "#444" }}> <i className="fa fa-angle-down"></i></FontIcon></p>
                                                </div>
                                            </div>
                                        </div> : ''}

                                    {this.props.selectedStore ?
                                        // <div className="col-2 col-xl-2 col-lg-2 col-sm-2 text-center">
                                        <div className="col-auto tab-show">

                                            <div className="row align-items-center" onClick={this.LeftSliderHandler}>
                                                <div className="col-auto pr-1 pt-2">
                                                    <img className="shine rounded-circle" src={this.props.selectedStore.businessImage} height="24" width="24" />
                                                </div>
                                                <div className="col p-0 selected-store">
                                                    {/* <span className="">Selected Store</span> */}
                                                    <h6 style={{ fontSize: '12px' }}>{this.props.selectedStore.businessName}<FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', padding: '2px 0px', margin: 0, lineHeight: "1px", color: "#444" }}> <i className="fa fa-angle-down"></i></FontIcon></h6>
                                                </div>
                                            </div>
                                        </div> : ''}



                                    {/* <div className="col px-1 mobile-hide"> */}
                                    {/* <div className="col mobile-hide order-md-1 order-sm-2 py-0 py-sm-2 py-md-0"> */}
                                    <div className="col mobile-hide py-0 py-sm-2 py-md-0 d-none d-md-block">
                                        <div className="row">
                                            <div className="col-12">
                                                {this.props.hideBottom ? '' :
                                                    <div className="row">
                                                        <div className="input-group product-search">
                                                            {/* <SearchBar selectedStore={this.props.selectedStore} innerPage={true} /> */}
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ml-auto col-xl-4 col-lg-5 col-md-4 col-sm-6 rapLogInLayout text-center  mobile-hide">
                                        <div className="row align-items-center justify-content-start justify-content-md-end text-left">
                                            {this.state.currentAddress && !(this.props.staticPage) ?
                                                <div className="col selected-store text-center tab-hide hide-overflow pt-1 pr-0 same-line-center" style={{ cursor: 'pointer' }} onClick={this.props.showLocationHandler} >
                                                    {/* <span> Delivery Location <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', padding: '2px 0px' }}> <i className="fa fa-angle-down"></i></FontIcon></span> */}
                                                    {/* <div style={{ marginTop: '-6px' }} className="hide-overflow-text current-address">  {this.state.currentAddress} </div> */}
                                                    {/* <span className={"color-black"} style={{ borderBottom: "0.7px dotted #a8a2a2" }}> <i className="fa fa-map-marker" aria-hidden="true"></i> {this.state.currentAddress} <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', padding: '2px 0px', color: "#444" }}> <i className="fa fa-angle-down"></i></FontIcon></span> */}
                                                    {/* <img src={enVariables.LOC_ICON_BLACK} className="locNewImg" />
                                                    <span className={"color-black oneLineSetter ml-1"} style={{ borderBottom: "0.7px dotted #a8a2a2" }}> {this.state.currentAddress} <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', padding: '2px 0px', color: "#444" }}> <i className="fa fa-angle-down"></i></FontIcon></span> */}
                                                </div>
                                                : ''}

                                            <div className="col-auto px-md-0 px-lg-2" style={{ background: 'transparent' }}>

                                                {/* {!this.props.staticPage ?
                                                    <div className="text-center langMenu color-black">
                                                        <IconMenu
                                                            iconButtonElement={
                                                                <a className='profile-tag langSelection hide-overflow-text text-center'>
                                                                    
                                                                    {this.getLangName(this.props.selectedLang)} <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', padding: '2px 0px', margin: 0, lineHeight: "1px", color: "#444" }}> <i className="fa fa-angle-down"></i></FontIcon>
                                                                </a>
                                                            }
                                                            onChange={this.handleChangeSingle}
                                                            value={this.state.valueSingle}
                                                        >
                                                            <MenuItem value="1" onClick={() => this.changeLanguage('en')} primaryText="en" />
                                                            <MenuItem value="2" onClick={() => this.changeLanguage('ar')} primaryText="ar" />

                                                        </IconMenu>
                                                    </div>
                                                    : ''}
                                                <div className="dropdown">
                                                                <a className='profile-tag hide-overflow-text text-center' data-toggle="dropdown">
                                                                    {this.props.selectedLang}
                                                                </a>
                                                                <div className="dropdown-menu">
                                                                    <a className="dropdown-item" onClick={() => this.changeLanguage('en')}>en</a>
                                                                    <a className="dropdown-item" onClick={() => this.changeLanguage('ar')}>ar</a>
                                                                </div>
                                                            </div> */}

                                            </div>

                                            {this.props.isAuthorized ?
                                                this.props.userProfileDetail ?
                                                    // <div className="col-auto hide-overflow text-center">
                                                    <div className="col-auto text-center" style={{ minWidth: "105px" }}>
                                                        {/* <Link href='/profile'> */}
                                                        <div className="dropdown tab-hide">
                                                            <a className='profile-tag hide-overflow-text text-center' data-toggle="dropdown">
                                                                {/* <img src="/static/images/account-outline.svg" width="24" height="25" className="img-fluid" alt="cart" /> */}
                                                                {/* <img src={this.props.userProfileDetail.profilePic || "/static/images/unperson.png"} className="img-fluid" alt="cart" /> */}
                                                                {/* <span className="">{this.props.userProfileDetail.name}</span> */}
                                                                <span className="color-black">
                                                                    {/* Account   */}
                                                                    {this.props.userProfileDetail.name}
                                                                    <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', padding: '2px 0px', color: "#444", lineHeight: "1px" }}> <i className="fa fa-angle-down"></i></FontIcon></span>

                                                            </a>
                                                            <div className="dropdown-menu">
                                                                <a className="dropdown-item px-3 py-1 profileName">Hi, {this.props.userProfileDetail.name}</a>
                                                                <a className="dropdown-item profileList px-2" onClick={() => Router.push('/profile')}>
                                                                    {/* <img src="/static/images/profile.svg" className="mx-2" height="12px"></img> */}
                                                                    <img src={enVariables.PROFILE_ICON} className="mx-2" height="12px"></img>
                                                                    <span>Profile</span></a>
                                                                <a className="dropdown-item profileList px-2" onClick={() => Router.push('/profile')}>
                                                                    {/* <img src="/static/images/orders.svg" className="mx-2" height="12px"></img> */}
                                                                    <img src={enVariables.ORDERS_ICON} className="mx-2" height="12px"></img>
                                                                    <span>My Orders</span></a>
                                                                <a className="dropdown-item profileList px-2" onClick={this.logOut}>
                                                                    {/* <img src="/static/images/logout.svg" className="mx-2" height="12px"></img> */}
                                                                    <img src={enVariables.LOGOUT_ICON} className="mx-2" height="12px"></img>
                                                                    <span>Logout</span></a>
                                                            </div>
                                                        </div>

                                                        <div className="tab-show">
                                                            <IconMenu
                                                                iconButtonElement={
                                                                    <a className='profile-tag hide-overflow-text text-center'>
                                                                        {/* <img src="/static/images/account-outline.svg" width="24" height="25" className="img-fluid" alt="cart" /> */}
                                                                        {/* <img src={this.props.userProfileDetail.profilePic || "/static/images/unperson.png"} width="18" height="18" className="img-fluid rounded-circle" alt="cart" /> */}
                                                                        {/* <p style={{ fontSize: '10px' }}>{this.props.userProfileDetail.name}</p> */}
                                                                        <span className="color-black">
                                                                            {/* Account   */}
                                                                            {this.props.userProfileDetail.name}
                                                                            <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', marginLeft: '3px', padding: '2px 0px', color: "#444" }}> <i className="fa fa-angle-down"></i></FontIcon></span>
                                                                    </a>
                                                                }
                                                            >
                                                                <MenuItem value="1" onClick={() => Router.push('/profile')} primaryText="Profile" />
                                                                <MenuItem value="2" onClick={() => Router.push('/profile')} primaryText="My Orders" />
                                                                <MenuItem value="3" onClick={this.logOut} primaryText="Logout" />
                                                            </IconMenu>

                                                        </div>
                                                        {/* </Link> */}
                                                    </div> :
                                                    <div className="col-3 hide-overflow text-center">
                                                        <Link href='/profile'>
                                                            <a className='profile-tag hide-overflow-text text-center'>
                                                                {/* <img src="/static/images/account-outline.svg" width="24" height="25" className="img-fluid" alt="cart" /> */}
                                                                {/* <img src={"/static/images/unperson.png"} className="img-fluid shine" alt="cart" /> */}
                                                                <span className="shine" style={{ minWidth: '40px' }}>         </span>
                                                            </a>
                                                        </Link>
                                                    </div>

                                                :
                                                <div className="col-auto" onClick={this.props.showLoginHandler}  >
                                                    <h6 className="rapLogIn tab-hide">{this.props.locale.logIn} <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', padding: '2px 0px', color: "#444" }}> <i className="fa fa-angle-down"></i></FontIcon></h6>
                                                    <div className="tab-show">
                                                        <FontIcon onClick={this.props.showLoginHandler} className="material-icons" style={{ fontSize: "18px", marginRight: '0px' }}> <i className="fa fa-sign-in"></i></FontIcon>
                                                    </div>
                                                </div>
                                            }
                                            <div className="col-auto" id="cartModalTrigger">
                                                {/* <img src="/static/images/cart-outline-black.svg" onClick={this.props.isAuthorized ? this.props.showCart : this.props.showLoginHandler} width="22" height="25" className="img-fluid" alt="cart" /> */}
                                                <a style={{ fontSize: "16px" }} onClick={this.props.isAuthorized ? this.props.showCart : this.props.showLoginHandler}> {enVariables.CART_ICON}</a>
                                                {
                                                    this.props.cartProducts && this.props.cartProducts.length > 0 ? <div style={{ top: 5, right: 14 }} className="customBadge"> <span>{this.props.cartProducts.length}</span> </div> :
                                                        this.props.mycartProducts && this.props.mycartProducts.length > 0 ? <div style={{ top: 5, right: 14 }} className="customBadge"> <span>{this.props.mycartProducts.length}</span> </div> : ''
                                                }
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
                                                    <img src="/static/images/person.svg" width="14" height="15" className="img-fluid" alt="cart" />
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
                            </div>
                        </div>
                    </div>
                    {this.props.children ? (
                        <div className="col-12">{this.props.children}</div>
                    ) : (
                            ""
                        )}
                </header>

                <header className="header mobile-show">
                    <div className="col-12 py-2 px-3">
                        {this.props.children}
                    </div>
                </header>

                <StoreRightSlider onRef={ref => (this.StoreSlider = ref)} stores={this.props.stores} width={this.state.SliderWidth} changeStore={this.changeStore} />
                {/* <LogOutDialog onRef={ref => (this.logOutRef = ref)} /> */}
            </Wrapper>
        )
    }
}


const mapStateToProps = state => {
    return {
        reduxState: state,
        userProfileDetail: state.userProfile,
        locale: state.locale,
        mycartProducts: state.cartProducts,
        lat: state.lat,
        lng: state.long,
        selectedLang: state.selectedLang
    };
};

export default connect(mapStateToProps)(Header);