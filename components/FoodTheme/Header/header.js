import React from "react";
import { connect } from "react-redux";
import Link from "next/link";
import {
  setCookie,
  getCookie,
  getCookiees,
  removeCookie
} from "../../../lib/session";
import Authmodals from "../../authmodals/index";
import Wrapper from "../../../hoc/wrapperHoc";
import Router from "next/router";
import * as actions from "../../../actions/index";
import * as enVariables from "../../../lib/envariables";
import ExpireCartDialog from "../../dialogs/expireCart";
import TopLoader from "../../ui/loaders/TopBarLoader/TopBarLoader";
import CartBadge from "../../ui/cart/badge";



class Header extends React.Component {
  state = {
    currentAddress: "",
    city: "",
    isRendered: false
  };

  showLoginHandler = () => {
    this.props.showLoginHandler();
  };
  showSignUpHandler = () => {
    this.props.showSignupHandler();
  };
  showLocationMobileHandler = () => {
    this.props.showLocationMobileHandler(this.state.currentAddress);
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

  getAddress = async (lat, lng) => {
    let geocoder = new google.maps.Geocoder();
    let latlng = new google.maps.LatLng(lat, lng);
    await geocoder.geocode({ latLng: latlng }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        let mainLocIndex = -1; let currentCity = "";
        // let addr = results[results.length - 6].formatted_address.split(",");
        results.map((location) => {
          mainLocIndex = location.types.findIndex((typeOfLocation) => typeOfLocation === "locality" || typeOfLocation === "country");
          // check if the locality (city) is available in google result
          if (mainLocIndex > -1) {
            currentCity = location.formatted_address.split(',')[0];
          }
        })
        this.setState({
          city: currentCity,
          currentAddress: results[0].formatted_address
        });
      }
    });
  };

  componentDidMount() {
    let lat = getCookie("lat", "");
    let lng = getCookie("long", "");
    this.getAddress(lat, lng);
    this.props.dispatch(actions.getProfile());
    this.setState({ isRendered: true })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.lat !== this.props.lat) {
      this.getAddress(this.props.lat, this.props.lng);
    }
  }

  startTopLoader = () => this.TopLoader.startLoader();

  hammburgerHandler = () => {
    this.props.handleHammburger();
  };

  render() {
    let addrParts = this.state.currentAddress ? this.state.currentAddress.split(",") : '';
    addrParts = addrParts && addrParts.length > 4 ? addrParts[addrParts.length - 4] : ''

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
                        src="/static/img/svg/bars.svg"
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
                    {/* {this.state.currentAddress ? this.state.currentAddress : ''} */}
                    {/* {this.state.currentAddress ? this.state.currentAddress.split(",")[1] : ''} */}
                    {/* {addrParts} */}
                    <marquee className="mobileLocMarquee" scrolldelay="190">{this.state.currentAddress ? this.state.currentAddress : ''}</marquee>

                    {this.state.city ? (
                      // <i className="fa fa-chevron-down" />
                      <img
                          src="/static/img/svg/downArrow.svg"
                          width="14"
                          height="14"
                          className="img-fluid"
                          alt="go to previous"
                          style={{verticalAlign: 'baseline'}}
                        />
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
                        FILTERS
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

                          <div className="col-auto" style={{ paddingLeft: "30px", paddingRight: 0 }}>
                            <a
                              className="navbar-brand"
                              onClick={this.startTopLoader}
                              href="/"
                            >
                              <img
                                src={enVariables.DESK_SMALL_LOGO}
                                width="30"
                                height=""
                                className="d-none d-sm-block"
                                alt="logoName"
                              />
                              <img
                                src={enVariables.DESK_SMALL_LOGO}
                                width="28"
                                height=""
                                className="d-inline-block d-sm-none"
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
                            <li className="nav-item active">
                              {/* <i className="fa fa-search" />
                            <Link href="/restoSearch" prefetch>
                            <a
                              // onClick={this.RouteSearch}
                              className="nav-link"
                              href="#"
                            >
                              Search
                              <span className="sr-only">(current)</span>
                            </a>
                            </Link> */}
                            </li>
                            {this.props.isAuthorized ? (
                              this.props.userProfileDetail ? (
                                <li className="nav-item">
                                  <i className="fa fa-user" />
                                  <a
                                    onClick={this.RouteProfile}
                                    className="nav-link"
                                  >
                                    {" "}
                                    {this.props.userProfileDetail.name}{" "}
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
                                    Sign in
                              </a>
                                </li>
                              )}

                            <li className="nav-item">
                              {/* {this.state.isRendered ?
                                <CartBadge count={this.props.mycartProducts &&
                                  this.props.mycartProducts.length > 0 ? this.props.mycartProducts.length : 0} /> : ''} */}
                              {enVariables.CART_ICON}
                              <a
                                className="nav-link foodCart" style={{ position: "relative" }}
                                onClick={this.showCart}
                              >
                                Cart
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
                              </a>
                            </li>
                            <li className="nav-item">
                              <i className="fa fa-question-circle" />
                              <a className="nav-link" href="#">
                                Help
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
            </div>
          )}
        <TopLoader onRef={ref => (this.TopLoader = ref)} />
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
    lng: state.long
  };
};

export default connect(mapStateToProps)(Header);
