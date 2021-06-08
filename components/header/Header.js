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

class Header extends React.Component {

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
                        <div className={this.props.stickyHeader ? "col-12 p-0" : "col-12 p-0 add-overlay"}>
                            <div className="justify-content-center">
                                <div className="headerNavDeskView col-xl-12 col-sm-12 py-2 py-md-2  mobile-hide">
                                    <div className="row pt-1 padLeftNRightMulti">
                                        <div className="col-auto col-xl-2 col-lg-2 col-sm-2">
                                            {this.props.stickyHeader ?
                                                <div className="row" style={{ height: "45px" }}>
                                                    <div className="col-3 py-2 px-3 text-left">
                                                        <a href="/">
                                                            <img src={enVariables.DESK_LOGO} alt={enVariables.APP_NAME} title={enVariables.APP_NAME}
                                                                // width="30"
                                                                width="120"
                                                                style={{ position: "absolute", zIndex: 999 }} className="logoImg" />
                                                        </a>
                                                    </div>
                                                    <div className="col-9 col-md-12 col-lg-9 py-lg-2 text-right pr-lg-0 floatClass selected-store">
                                                        <a style={{ textDecoration: "none" }} onClick={this.LeftSliderHandler}>
                                                            <span style={{ display: 'block', marginBottom: '2px', fontSize: "14px", color: "#f08455" }}> {this.props.locale.selectStores} <FontIcon className="material-icons" style={{ fontSize: "15px", marginRight: '0px', padding: '3px 2px 0px', color: "#f08455" }}> <i className="fa fa-angle-down"></i></FontIcon></span>
                                                            {/* <p>  {this.props.selectedStore.businessName} <FontIcon className="material-icons" style={{ fontSize: "15px", marginRight: '0px', padding: '3px 2px 0px' }}> <i className="fa fa-angle-down"></i></FontIcon></p> */}
                                                        </a>
                                                    </div>
                                                </div> :
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

                                        <div className="col px-md-0 mobile-hide">
                                            {this.props.stickyHeader ?
                                                <SearchBar selectedStore={this.props.selectedStore} locale={this.props.locale} />
                                                : ''
                                            }
                                        </div>
                                        <div className="col-xl-5 col-lg-5 col-sm-6 text-right rapLogInLayout mobile-hide">
                                            <div className="row align-items-center justify-content-end">


                                                {
                                                    this.state.currentAddress ?

                                                        RTL == "ltr" ?
                                                            <div className="col-4 text-center pt-1 selected-store hide-overflow same-line-center" style={{ cursor: 'pointer' }} onClick={this.props.showLocationHandler} >
                                                                {/* <div className="col text-left p-sm-0 p-0 selected-store hide-overflow" style={{ cursor: 'pointer' }} onClick={this.props.showLocationHandler} > */}
                                                                {/* <span className={this.props.stickyHeader ? "color-black oneLineSetter" : "color-black oneLineSetter"} style={{ borderBottom: "0.7px dotted #a8a2a2" }}> <i className="fa fa-map-marker" aria-hidden="true"></i> {this.state.currentAddress} <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', padding: '2px 0px', color: this.props.stickyHeader ? "#444" : "#444" }}> <i className="fa fa-angle-down"></i></FontIcon></span> */}
                                                                {/* <div style={{ marginTop: '-6px', textAlign: 'left' }} className={this.props.stickyHeader ? "hide-overflow-text scroller-text current-address color-black": "hide-overflow-text scroller-text current-address color-white"}>  {this.state.currentAddress} </div> */}
                                                                <img src={enVariables.LOC_ICON_BLACK} className="locNewImg" />
                                                                <span className={"color-black oneLineSetter ml-1"} style={{ borderBottom: "0.7px dotted #a8a2a2" }}> {this.state.currentAddress} <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', padding: '2px 0px', color: "#444" }}> <i className="fa fa-angle-down"></i></FontIcon></span>
                                                            </div>
                                                            :
                                                            <div className="col-4 text-right p-sm-0 p-0 selected-store hide-overflow same-line-center" style={{ cursor: 'pointer' }} onClick={this.props.showLocationHandler} >
                                                                {/* <div className="col text-left p-sm-0 p-0 selected-store hide-overflow" style={{ cursor: 'pointer' }} onClick={this.props.showLocationHandler} > */}
                                                                {/* <span className={this.props.stickyHeader ? "color-black" : "color-black"} style={{ borderBottom: "0.7px dotted #a8a2a2" }}> <i className="fa fa-map-marker" aria-hidden="true"></i> {this.state.currentAddress} <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', padding: '2px 0px', color: this.props.stickyHeader ? "#444" : "#444" }}> <i className="fa fa-angle-down"></i></FontIcon></span> */}
                                                                {/* <div style={{ marginTop: '-6px', textAlign: 'right' }} className={this.props.stickyHeader ? "hide-overflow-text scroller-text current-address color-black": "hide-overflow-text scroller-text current-address color-white"}>  {this.state.currentAddress} </div> */}
                                                                <img src={enVariables.LOC_ICON_BLACK} className="locNewImg" />
                                                                <span className={"color-black oneLineSetter ml-1"} style={{ borderBottom: "0.7px dotted #a8a2a2" }}> {this.state.currentAddress} <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', padding: '2px 0px', color: "#444" }}> <i className="fa fa-angle-down"></i></FontIcon></span>
                                                            </div>
                                                        : ''
                                                }
                                                <div className="col-auto px-md-0 px-lg-2" style={{ background: 'transparent' }}>
                                                    {/* <Link href='/profile'> */}
                                                    <div className={"text-center langMenu color-black"}>
                                                        <IconMenu
                                                            iconButtonElement={
                                                                <a className='profile-tag langSelection hide-overflow-text text-center'>
                                                                    {/* <i class="fa fa-language" style={{fontSize: "16px"}} aria-hidden="true"></i>  */}
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
                                                    {/* <div className="dropdown">
                                                    <a className='profile-tag hide-overflow-text text-center' data-toggle="dropdown">
                                                        {this.props.selectedLang}
                                                    </a>
                                                    <div className="dropdown-menu">
                                                        <a className="dropdown-item" onClick={() => this.changeLanguage('en')}>en</a>
                                                        <a className="dropdown-item" onClick={() => this.changeLanguage('ar')}>ar</a>
                                                    </div>
                                                </div> */}
                                                    {/* </Link> */}
                                                </div>
                                                {this.props.isAuthorized ?
                                                    this.props.userProfileDetail ?
                                                        // <div className="col-auto hide-overflow text-center">
                                                        // <div className="col-auto text-center">
                                                        <div className="col col-md-auto px-md-0 px-lg-2 text-center">
                                                            {/* <Link href='/profile'> */}
                                                            <div className="dropdown tab-hide">
                                                                <a className='profile-tag hide-overflow-text text-center' data-toggle="dropdown">
                                                                    {/* <img src="/static/images/account-outline.svg" width="24" height="25" className="img-fluid" alt="cart" /> */}
                                                                    {/* <img src={this.props.userProfileDetail.profilePic || "/static/images/unperson.png"} className="img-fluid" alt="cart" /> */}
                                                                    <span className={"color-black"}>Account  <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', padding: '2px 0px', margin: 0, lineHeight: "1px", color: "#444" }}> <i className="fa fa-angle-down"></i></FontIcon></span>
                                                                </a>
                                                                <div className="dropdown-menu">
                                                                    <a className="dropdown-item px-3 py-1 profileName">Hi, {this.props.userProfileDetail.name}</a>
                                                                    <a className="dropdown-item profileList px-3 " onClick={() => Router.push('/profile')}>
                                                                        {/* <img src="/static/images/profile.svg" className="mr-2" height="12px"></img><span>Profile</span> */}
                                                                        <img src={enVariables.PROFILE_ICON} className="mr-2" height="12px"></img><span>Profile</span>
                                                                    </a>
                                                                    <a className="dropdown-item profileList px-3 " onClick={() => Router.push('/profile')}>
                                                                        {/* <img src="/static/images/orders.svg" className="mr-2" height="12px"></img> */}
                                                                        <img src={enVariables.ORDERS_ICON} className="mr-2" height="12px"></img>
                                                                        <span>My Orders</span></a>
                                                                    <a className="dropdown-item profileList px-3 " onClick={this.logOut}>
                                                                        {/* <img src="/static/images/logout.svg" className="mr-2" height="12px"></img> */}
                                                                        <img src={enVariables.LOGOUT_ICON} className="mr-2" height="12px"></img>
                                                                        <span>Logout</span></a>
                                                                </div>
                                                            </div>
                                                            <div className="tab-show">
                                                                <IconMenu
                                                                    iconButtonElement={
                                                                        <a className='profile-tag hide-overflow-text text-center'>
                                                                            {/* <img src="/static/images/account-outline.svg" width="24" height="25" className="img-fluid" alt="cart" /> */}
                                                                            {/* <img src={this.props.userProfileDetail.profilePic || "/static/images/unperson.png"} width="18" height="18" className="img-fluid rounded-circle" alt="cart" />
                                                                        <p style={{ fontSize: '10px' }}>{this.props.userProfileDetail.name}</p>  */}
                                                                            <span className={"color-black"}>Account  <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', padding: '2px 0px', color: "#444" }}> <i className="fa fa-angle-down"></i></FontIcon></span>
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

                                                            <a className='profile-tag hide-overflow-text text-center'>
                                                                {/* <img src="/static/images/account-outline.svg" width="24" height="25" className="img-fluid" alt="cart" /> */}
                                                                {/* <img src={"/static/images/unperson.png"} className="img-fluid shine" alt="cart" /> */}
                                                                <span className={this.props.stickyHeader ? "color-black" : "color-black"}>Sign In  <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', padding: '2px 0px', color: "#444" }}> <i className="fa fa-angle-down"></i></FontIcon></span>
                                                                <span className="shine" style={{ minWidth: '40px' }}>         </span>
                                                            </a>

                                                        </div>
                                                    :
                                                    <div className="col-auto  px-lg-2" onClick={this.props.showLoginHandler}  >
                                                        <h6 className="profile-tag rapLogIn tab-hide color-black">{this.props.locale.logIn} <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', padding: '2px 0px', color: this.props.stickyHeader ? "#444" : "#444" }}> <i className="fa fa-angle-down"></i></FontIcon></h6>
                                                        <div className="tab-show">
                                                            <FontIcon onClick={this.props.showLoginHandler} className="material-icons" style={{ fontSize: "18px", marginRight: '0px', color: this.props.stickyHeader ? "#444" : "#444" }}> <i className="fa fa-sign-in"></i></FontIcon>
                                                        </div>
                                                    </div>
                                                }

                                                <div className="col-auto" id="cartModalTrigger">
                                                    <a style={{ fontSize: "16px" }} onClick={this.props.isAuthorized ? this.props.showCart : this.props.showLoginHandler}>{enVariables.CART_ICON}</a>
                                                    {/* <img src={"/static/images/cart-outline-black.svg"} onClick={this.props.isAuthorized ? this.props.showCart : this.props.showLoginHandler} width="21" height="21" className="img-fluid" alt="cart" /> */}
                                                    {this.props.mycartProducts && this.props.mycartProducts.length > 0 ? <div style={{ top: 5, right: 14 }} className="customBadge"> <span>{this.props.mycartProducts.length}</span> </div> : ''}
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
                                                    <div className="col-auto pr-md-0 pr-lg-2">
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
                                    <div className="row pt-1 padLeftNRightMulti">
                                        <div className="col-auto col-xl-2 col-lg-2 col-sm-2">
                                            {this.props.stickyHeader ?
                                                <div className="row">
                                                    <div className="col-3 py-2 px-3 text-left">
                                                        <a href="/">
                                                            {this.props.stickyHeader ?
                                                                <img src={enVariables.DESK_LOGO} alt={enVariables.APP_NAME} title={enVariables.APP_NAME} style={{ width: 30 }} className="logoImg" />
                                                                : <img src={enVariables.DESK_LOGO} alt={enVariables.APP_NAME} title={enVariables.APP_NAME} width="30" className="logoImg" />}
                                                        </a>
                                                    </div>
                                                    <div className="col-9 col-md-12 col-lg-9 py-lg-2 text-right pr-lg-0 floatClass selected-store">
                                                        <a style={{ textDecoration: "none" }} onClick={this.LeftSliderHandler}>
                                                            <span style={{ display: 'block', marginBottom: '2px', fontSize: "14px", color: "#f08455" }}> {this.props.locale.selectStores} <FontIcon className="material-icons" style={{ fontSize: "15px", marginRight: '0px', padding: '3px 2px 0px', color: "#f08455" }}> <i className="fa fa-angle-down"></i></FontIcon></span>
                                                            {/* <p>  {this.props.selectedStore.businessName} <FontIcon className="material-icons" style={{ fontSize: "15px", marginRight: '0px', padding: '3px 2px 0px' }}> <i className="fa fa-angle-down"></i></FontIcon></p> */}
                                                        </a>
                                                    </div>
                                                </div> :
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

                                        <div className="col px-md-0 mobile-hide">
                                            {this.props.stickyHeader ?
                                                <SearchBar selectedStore={this.props.selectedStore} locale={this.props.locale} />
                                                : ''
                                            }
                                        </div>
                                        <div className="col-xl-5 col-lg-5 col-sm-6 text-right rapLogInLayout mobile-hide">
                                            <div className="row align-items-center justify-content-end">


                                                {
                                                    this.state.currentAddress ?

                                                        RTL == "ltr" ?
                                                            <div className="col-4 text-center pt-1 selected-store hide-overflow same-line-center" style={{ cursor: 'pointer' }} onClick={this.props.showLocationHandler} >
                                                                {/* <div className="col text-left p-sm-0 p-0 selected-store hide-overflow" style={{ cursor: 'pointer' }} onClick={this.props.showLocationHandler} > */}
                                                                {/* <span className={this.props.stickyHeader ? "color-black" : "color-white"}> {this.props.locale.deliveryLocation} <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', padding: '2px 0px', color: this.props.stickyHeader ? "#444" : "#fff" }}> <i className="fa fa-angle-down"></i></FontIcon></span> */}
                                                                {/* <span className={this.props.stickyHeader ? "color-black oneLineSetter" : "color-white oneLineSetter"} style={{ borderBottom: "0.7px dotted #a8a2a2" }}> <i className="fa fa-map-marker" aria-hidden="true"></i> {this.state.currentAddress} <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', padding: '2px 0px', color: this.props.stickyHeader ? "#444" : "#fff" }}> <i className="fa fa-angle-down"></i></FontIcon></span> */}
                                                                {/* <span className={this.props.stickyHeader ? "color-black" : "color-white"}> {this.props.locale.deliveryLocation} <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', padding: '2px 0px', color: this.props.stickyHeader ? "#444" : "#fff" }}> <i className="fa fa-angle-down"></i></FontIcon></span> */}
                                                                <img src={enVariables.LOC_ICON_WHITE} className="locNewImg" />
                                                                <span className={"color-white oneLineSetter ml-1"} style={{ borderBottom: "0.7px dotted #a8a2a2" }}> {this.state.currentAddress} <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', padding: '2px 0px', color: this.props.stickyHeader ? "#444" : "#fff" }}> <i className="fa fa-angle-down"></i></FontIcon></span>

                                                            </div>
                                                            :
                                                            <div className="col-4 text-right pt-1 selected-store hide-overflow same-line-center" style={{ cursor: 'pointer' }} onClick={this.props.showLocationHandler} >
                                                                {/* <div className="col text-left p-sm-0 p-0 selected-store hide-overflow" style={{ cursor: 'pointer' }} onClick={this.props.showLocationHandler} > */}
                                                                {/* <span className={this.props.stickyHeader ? "color-black" : "color-white"}> {this.props.locale.deliveryLocation} <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', padding: '2px 0px', color: this.props.stickyHeader ? "#444" : "#fff" }}> <i className="fa fa-angle-down"></i></FontIcon></span> */}
                                                                {/* <span className={this.props.stickyHeader ? "color-black oneLineSetter" : "color-white oneLineSetter"} style={{ borderBottom: "0.7px dotted #a8a2a2" }}> <i className="fa fa-map-marker" aria-hidden="true"></i> {this.state.currentAddress} <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', padding: '2px 0px', color: this.props.stickyHeader ? "#444" : "#fff" }}> <i className="fa fa-angle-down"></i></FontIcon></span> */}
                                                                {/* <div style={{ marginTop: '-6px', textAlign: 'right' }} className={this.props.stickyHeader ? "hide-overflow-text scroller-text current-address color-black": "hide-overflow-text scroller-text current-address color-white"}>  {this.state.currentAddress} </div> */}
                                                                <img src={enVariables.LOC_ICON_WHITE} className="locNewImg" />
                                                                <span className={"color-white oneLineSetter ml-1"} style={{ borderBottom: "0.7px dotted #a8a2a2" }}> {this.state.currentAddress} <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', padding: '2px 0px', color: this.props.stickyHeader ? "#444" : "#fff" }}> <i className="fa fa-angle-down"></i></FontIcon></span>
                                                            </div>
                                                        : ''
                                                }
                                                <div className="col-auto" style={{ background: 'transparent' }}>
                                                    {/* <Link href='/profile'> */}
                                                    <div className={this.props.stickyHeader ? "text-center langMenu color-black" : "text-center langMenu color-white"}>
                                                        <IconMenu
                                                            iconButtonElement={
                                                                <a className='profile-tag hide-overflow-text text-center' style={{ marginTop: "8px" }}>
                                                                    {/* <i class="fa fa-language" style={{fontSize: "16px"}} aria-hidden="true"></i>  */}
                                                                    {/* - {this.props.selectedLang} */}
                                                                    {this.getLangName(this.props.selectedLang)} <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', padding: '2px 0px', margin: 0, lineHeight: "1px", color: this.props.stickyHeader ? "#444" : "#fff" }}> <i className="fa fa-angle-down"></i></FontIcon>
                                                                </a>
                                                            }
                                                            onChange={this.handleChangeSingle}
                                                            value={this.state.valueSingle}
                                                        >
                                                            <MenuItem value="1" onClick={() => this.changeLanguage('en')} primaryText="en" />
                                                            <MenuItem value="2" onClick={() => this.changeLanguage('ar')} primaryText="ar" />

                                                        </IconMenu>
                                                    </div>
                                                    {/* <div className="dropdown">
                                                    <a className='profile-tag hide-overflow-text text-center' data-toggle="dropdown">
                                                        {this.props.selectedLang}
                                                    </a>
                                                    <div className="dropdown-menu">
                                                        <a className="dropdown-item" onClick={() => this.changeLanguage('en')}>en</a>
                                                        <a className="dropdown-item" onClick={() => this.changeLanguage('ar')}>ar</a>
                                                    </div>
                                                </div> */}
                                                    {/* </Link> */}
                                                </div>
                                                {this.props.isAuthorized ?
                                                    this.props.userProfileDetail ?
                                                        // <div className="col-auto hide-overflow text-center">
                                                        // <div className="col-auto text-center">
                                                        <div className="col col-md-auto text-center">
                                                            {/* <Link href='/profile'> */}
                                                            <div className="dropdown tab-hide">
                                                                <a className='profile-tag hide-overflow-text text-center' data-toggle="dropdown">
                                                                    {/* <img src="/static/images/account-outline.svg" width="24" height="25" className="img-fluid" alt="cart" /> */}
                                                                    {/* <img src={this.props.userProfileDetail.profilePic || "/static/images/unperson.png"} className="img-fluid" alt="cart" /> */}
                                                                    <span className={this.props.stickyHeader ? "color-black" : "color-white"}>Account  <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', lineHeight: "1px", padding: '2px 0px', margin: 0, color: this.props.stickyHeader ? "#444" : "#fff" }}> <i className="fa fa-angle-down"></i></FontIcon></span>
                                                                </a>
                                                                <div className="dropdown-menu">
                                                                    <a className="dropdown-item px-3 mb-2 mt-2 py-1 profileName">Hi, {this.props.userProfileDetail.name}</a>
                                                                    <a className="dropdown-item px-3" onClick={() => Router.push('/profile')}>
                                                                        {/* <img src="/static/images/profile.svg" className="mr-2" height="12px"></img> */}
                                                                        <img src={enVariables.PROFILE_ICON} className="mr-2" height="12px"></img>
                                                                        <span>Profile</span></a>
                                                                    <a className="dropdown-item px-3" onClick={() => Router.push('/profile')}>
                                                                        {/* <img src="/static/images/orders.svg" className="mr-2" height="12px"></img> */}
                                                                        <img src={enVariables.ORDERS_ICON} className="mr-2" height="12px"></img>
                                                                        <span>My Orders</span></a>
                                                                    <a className="dropdown-item px-3" onClick={this.logOut}>
                                                                        {/* <img src="/static/images/logout.svg" className="mr-2" height="12px"></img> */}
                                                                        <img src={enVariables.LOGOUT_ICON} className="mr-2" height="12px"></img>
                                                                        <span>Logout</span></a>
                                                                </div>
                                                            </div>
                                                            <div className="tab-show">
                                                                <IconMenu
                                                                    iconButtonElement={
                                                                        <a className='profile-tag hide-overflow-text text-center'>
                                                                            {/* <img src="/static/images/account-outline.svg" width="24" height="25" className="img-fluid" alt="cart" /> */}
                                                                            {/* <img src={this.props.userProfileDetail.profilePic || "/static/images/unperson.png"} width="18" height="18" className="img-fluid rounded-circle" alt="cart" />
                                                                        <p style={{ fontSize: '10px' }}>{this.props.userProfileDetail.name}</p>  */}
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

                                                            <a className='profile-tag hide-overflow-text text-center'>
                                                                {/* <img src="/static/images/account-outline.svg" width="24" height="25" className="img-fluid" alt="cart" /> */}
                                                                {/* <img src={"/static/images/unperson.png"} className="img-fluid shine" alt="cart" /> */}
                                                                <span className={this.props.stickyHeader ? "color-black" : "color-white"}>Sign In  <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', padding: '2px 0px', lineHeight: "1px", color: this.props.stickyHeader ? "#444" : "#fff" }}> <i className="fa fa-angle-down"></i></FontIcon></span>
                                                                <span className="shine" style={{ minWidth: '40px' }}>         </span>
                                                            </a>

                                                        </div>
                                                    :
                                                    <div className="col-auto pt-1" onClick={this.props.showLoginHandler}  >
                                                        <a className="rapLogIn tab-hide color-white">{this.props.locale.logIn}<FontIcon className="material-icons" style={{ fontSize: "11px", marginLeft: '3px', padding: '2px 0px', color: this.props.stickyHeader ? "#444" : "#fff" }}> <i className="fa fa-angle-down"></i></FontIcon></a>
                                                        <div className="tab-show">
                                                            <FontIcon onClick={this.props.showLoginHandler} className="material-icons" style={{ fontSize: "18px", marginRight: '0px', color: this.props.stickyHeader ? "#444" : "#fff" }}> <i className="fa fa-sign-in"></i></FontIcon>
                                                        </div>
                                                    </div>
                                                }

                                                <div className="col-auto" id="cartModalTrigger">
                                                    <a className="cartIconComm color-white cartIconCommWhite" onClick={this.props.isAuthorized ? this.props.showCart : this.props.showLoginHandler} >{enVariables.CART_ICON}</a>
                                                    {/* <img src={"/static/images/cart-outline.svg"} onClick={this.props.isAuthorized ? this.props.showCart : this.props.showLoginHandler} width="21" height="21" className="img-fluid" alt="cart" /> */}
                                                    {this.props.mycartProducts && this.props.mycartProducts.length > 0 ? <div className="cartCount"> <span>{this.props.mycartProducts.length}</span> </div> : ''}
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

                <header className="header mobile-show">
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

                    <div className="col-12 py-2">
                        <div className="row py-1 align-items-center">
                            <div className="col-2 pl-0">
                                <IconButton onClick={() => Router.back()} style={{ height: '30px', padding: '6px' }}>
                                    <img src='/static/icons/Common/BackIcon.imageset/back_btn@2x.png' width="24" />
                                </IconButton>
                            </div>
                            <div className="col-8 text-center">
                                <h6 className="innerPage-heading lineSetter">{this.props.selectedStore.storeTypeMsg}</h6>
                            </div>

                            <div className="col-2 pr-0 text-center">
                                {/* <IconButton onClick={() => this.opendrawer()} style={{ height: '30px', padding: '6px' }}> */}
                                {/* <i className="fa fa-search mt-2" style={{ fontSize: "18px" }} aria-hidden="true"></i> */}
                                {/* </IconButton> */}
                            </div>
                        </div>
                    </div>

                    <div className="col-12 py-2">
                        <div className="row align-items-center">
                            <div className="col-3 pr-0">
                                <img src={this.props.selectedStore.bannerImage} height="60px" width="90%" alt={this.props.selectedStore.storeName} />
                            </div>
                            <div className="col-9 pl-2">
                                <p className="storeName">{this.props.selectedStore.businessName}</p>
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
        selectedLang: state.selectedLang
    };
};

export default connect(mapStateToProps)(Header);