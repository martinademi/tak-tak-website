import React from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { CSSTransition } from "react-transition-group";

import {
  setCookie,
  getCookie,
  getCookiees,
  removeCookie
} from "../../lib/session";
import Authmodals from "../authmodals/index";
import Wrapper from "../../hoc/wrapperHoc";
import Router from "next/router";
import * as actions from "../../actions/index";
import * as enVariables from "../../lib/envariables";
import ExpireCartDialog from "../dialogs/expireCart";
import TopLoader from "../ui/loaders/TopBarLoader/TopBarLoader";
import CartBadge from "../ui/cart/badge";
import ProfileMenu from "./profile/profileMenu";
import CartContent from "./cart/cart";
import LogOutDialog from "../dialogs/logOut";

class MainPageHeader extends React.Component {
  state = {
    currentAddress: "",
    city: "",
    isRendered: false,
    sessionVerified: false
  };

  constructor(props) {
    super(props);
    this.setDeliveryType = this.setDeliveryType.bind(this);
  }

  showLoginHandler = () => {
    this.props.showLoginHandler();
  };
  showSignUpHandler = () => {
    this.props.showSignupHandler();
  };
  showLocationMobileHandler = () => {
    this.props.showLocationMobileHandler();
  };
  showLocationHandler = () => {
    this.props.showLocationHandler();
  };
  showCart = () => {
    this.props.isAuthorized ? this.props.showCart() : this.showLoginHandler();
  };

  RouteBack = () => {
    Router.back();
  };
  RouteSearch = () => {
    Router.push("/restoSearch");
  };
  RouteProfile = () => {
    Router.push("/profile");
  };

  changeAddress = (lat, lng) => {
    location.reload();
  };

  logOut = () => {
    this.logOutRef.openOptionsDialog(2);
  };

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

  getAddress = async (lat, lng) => {
    let geocoder = new google.maps.Geocoder();
    let latlng = new google.maps.LatLng(lat, lng);
    await geocoder.geocode({ latLng: latlng }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        // let addr = results[results.length - 6].formatted_address.split(",");
        let mainLocIndex = -1;
        let currentCity = "";
        results.map(location => {
          mainLocIndex = location.types.findIndex(
            typeOfLocation =>
              typeOfLocation === "locality" || typeOfLocation === "country"
          );
          // check if the locality (city) is available in google result
          if (mainLocIndex > -1) {
            currentCity = location.formatted_address.split(",")[0];
          }
        });
        this.setState({
          city: currentCity,
          currentAddress: results[0].formatted_address
        });
      }
    });
  };

  initGeolocation() {
    let options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    if (navigator.geolocation) {
      // Call getCurrentPosition with success and failure callbacks
      navigator.geolocation.getCurrentPosition(
        this.successLocation,
        this.successLocation,
        options
      );
    } else {
      toastr.error(
        "Desculpe, seu navegador não suporta serviços de geolocalização."
      );
    }
  }

  successLocation = async position => {
    if (position && position.coords) {
      // this.setPosition(position.coords.latitude, position.coords.longitude);
      let geocoder = new google.maps.Geocoder();
      let latlng = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );
      await geocoder.geocode({ latLng: latlng }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          let addr = results[results.length - 6].formatted_address.split(",");
          // this.setState({
          //   city: addr[1],
          //   currentAddress: results[0].formatted_address
          // });
         
        }
      });
    }
  };

  componentDidMount() {
    let lat = getCookie("lat", "");
    let lng = getCookie("long", "");
    this.getAddress(lat, lng);
    this.props.dispatch(actions.getProfile());
    this.setState({ isRendered: true });

    // this.initGeolocation();
  }

  componentWillReceiveProps = newProps => {
    this.checkForSession(newProps); // calling a function to check the user session
  };

  checkForSession = newProps => {
    if (
      getCookie("authorized") &&
      newProps.sessionExpired &&
      !this.state.sessionVerified
    ) {
      this.logOutRef.openOptionsDialog(1);
      this.setState({ sessionVerified: true });
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.lat !== this.props.lat) {
      this.getAddress(this.props.lat, this.props.lng);
    }
  }

  startTopLoader = () => this.TopLoader.startLoader();

  hammburgerHandler = () => {
    this.props.handleHammburger();
  };

  showUserMenu = () => {
    this.setState({
      showUserMenu: true
    });
  };
  hideUserMenu = () => {
    this.setState({
      showUserMenu: false
    });
  };
  showUserCart = () => {
    if (this.props.myCart && this.props.myCart.cart) {
      this.setState({
        showUserCart: true
      });
    }
  };
  hideUserCart = () => {
    this.setState({
      showUserCart: false
    });
  };

  render() {
    let { lang } = this.props;
    let addrParts = this.state.currentAddress
      ? this.state.currentAddress.split(",")
      : "";
    addrParts =
      addrParts && addrParts.length > 4 ? addrParts[addrParts.length - 4] : "";

    return (
      <Wrapper>
        {this.props.headerMobile ? (
          <div className="headerM">
            <div className="col-12">
              <div className="row align-items-center">
                {this.props.hammburger ? (
                  <div className="col-auto pr-0">
                    <a onClick={this.hammburgerHandler}>
                      <img
                        src="/static/images/grocer/hammburger.png"
                        width="22px"
                      />
                    </a>
                  </div>
                ) : (
                  <div className="col-auto pr-0">
                    <a onClick={this.RouteBack}>
                      <img
                        src="/static/foodImages/backBtn.svg"
                        width="20"
                        className="img-fluid"
                        alt="go to previous"
                      />
                    </a>
                  </div>
                )}

                <div className="col">
                  <h6
                    onClick={this.showLocationMobileHandler}
                    className="locAreaTitle pt-1"
                    // style={{ lineHeight: "23px" }}
                  >
                    {/* {this.state.city} */}
                    {/* {this.state.currentAddress ? this.state.currentAddress.split(",")[1] : ''} */}
                    {addrParts}
                    {this.state.city ? (
                      <i className="fa fa-chevron-down" />
                    ) : (
                      ""
                    )}
                  </h6>
                  {this.props.componentMounted ? (
                    <p className="locaAreaDyn">{this.state.currentAddress}</p>
                  ) : (
                    ""
                  )}
                </div>

                {this.props.hideFilters ? (
                  ""
                ) : (
                  <div className="col-3 text-right">
                    <h6 className="filtersM">
                      {lang.filterCap || "FILTERS"}
                      <i className="fa fa-filter" />
                    </h6>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div
            className={"col-12 headerWrap " + this.props.className}
            id={this.props.id}
          >
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
                          </a>
                        </div>
                        <div
                          style={{ cursor: "pointer" }}
                          onClick={this.showLocationHandler}
                          className="col pl-0 px-sm-0 position-relative"
                        >
                          <span className="currentLocationType">
                            <span>
                              {/* {this.state.city} */}
                              {addrParts || ""}
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

                      <div
                        className="collapse navbar-collapse"
                        id="navbarSupportedContent"
                      >
                        <ul className="navbar-nav ml-auto headerNavUL">
                          <li className="nav-item active"></li>
                          {this.props.isAuthorized ? (
                            this.props.userProfileDetail ? (
                              <li className="nav-item">
                                <a
                                  className="navTextWrapper"
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
                                    unmountOnExit
                                  >
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
                                onClick={this.showLoginHandler}
                              >
                                {lang.logIn || "Sign in"}
                              </a>
                            </li>
                          )}

                          <li className="nav-item">
                            {enVariables.CART_ICON}
                            <a
                              className="nav-link foodCart"
                              style={{ position: "relative" }}
                              onClick={this.props.showCart}
                              onMouseLeave={this.hideUserCart}
                              onMouseMove={this.showUserCart}
                              // onMouseOver={this.showUserCart}
                            >
                              <div>
                                {lang.cart}
                                {this.props.mycartProducts &&
                                this.props.mycartProducts.length > 0 ? (
                                  <div className="customBadge">
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
                                  unmountOnExit
                                >
                                  <CartContent
                                    cart={this.props.myCart}
                                    setDeliveryType={this.setDeliveryType}
                                  />
                                </CSSTransition>
                              </div>
                            </a>
                          </li>
                          {/* <li className="nav-item">
                              <i className="fa fa-question-circle" />
                              <a className="nav-link" href="#">
                                Help
                            </a>
                            </li> */}
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
          </div>
        )}
        <TopLoader onRef={ref => (this.TopLoader = ref)} />

        <LogOutDialog onRef={ref => (this.logOutRef = ref)} />

        {/* <Authmodals key={"herder"+ Math.Random} onRef={ref => (this.props = ref)} getAddress={this.changeAddress} restaurants={true} /> */}
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    reduxState: state,
    userProfileDetail: state.userProfile,
    myCart: state.cartList,
    mycartProducts: state.cartProducts,
    lat: state.lat,
    lng: state.long,
    sessionExpired: state.sessionExpired,
    lang: state.locale
  };
};

export default connect(mapStateToProps)(MainPageHeader);
