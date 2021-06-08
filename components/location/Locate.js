import React from "react";
import Slider from "react-slick";
import Footer from "../footer/LandingFooter";
import Wrapper from "../../hoc/wrapperHoc";
import LocationSearchInput from "./map";
import Spinner from "../ui/loaders/threeDotSpinner";
import LocationDrawer from "./locateDrawer";
import CircularProgressLoader from "../ui/loaders/circularLoader";
import * as enVariables from "../../lib/envariables";
import LanguageSelector from "../language/selector";
import { selectLocale } from "../../actions/language";
import { setCookie, getCookie } from "../../lib/session";
// import { DEFAULT_LANG } from "../../lib/envariables";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { connect } from "react-redux";
class LocationSelect extends React.Component {
  state = {
    loginSliderWidth: "100%",
    language: getCookie("lang") || "en" ,
  };
// to open the location drawer
  showLocationHandler = () => {
    this.setState({ loginSliderWidth: "100%" });
    this.child.handleToggle();
  };

  handleClose = () => {
    this.setState({ loginSliderWidth: "0%" });
  };
// onclick the cities 
  handleClick =(data)=>{
    this.setState({address : data})
    geocodeByAddress(data)
            .then(results => getLatLng(results[0]))
            .then(latLng => this.updateData(latLng))
            .catch(error => {})
   
  }
  updateData(data) {
    data['address'] = this.state.address
    this.props.updateLocation(data)
}
  selectLanguage = (event) => {
    this.props.changeLang(event.target.value);
    this.setState({ language: event.target.value });
    setCookie("lang", event.target.value);
  };
  render() {
    let settings = {
      arrows: false,
      autoplay: true,
      dots: false,
      infinite: true,
      vertical: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    let mobileSettings = {
      arrows: false,
      autoplay: true,
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    const locale = this.props.locale;

    return (
      <Wrapper>
        <main className="mobile-hide">
          <div className="col-12 wrapper white">
            <div className="row">
              <div className="col">
                <div className="row">
                  <div className="col-md-7 loginFormSectionLayout">
                    <div className="row justify-content-center">
                     {/* selection of the language */}
                      <div className="col-12 mt-3">
                        <select
                          class="selectpicker"
                          value={this.state.language}
                          data-width="fit"
                          onChange={this.selectLanguage.bind(this)}
                        >
                          <option
                            data-content='<span class="fa fa-globe"></span> English'
                            value="en"
                          >
                            English
                          </option>
                          <option
                            data-content='<span class="fa fa-globe"></span> Español'
                            value="spa"
                          >
                            spanish
                          </option>
                        </select>
                      </div>
                      <div className="col-sm-11 col-md-12 col-lg-10 col-xl-9 py-lg-5 py-4 pr-5 locateSectionLayout">
                        <div className="row align-items-center pr-2">
                          <div className="col-sm-6">
                            <img
                              src={enVariables.DESK_LOGO}
                              width="30"
                              alt={enVariables.APP_NAME}
                              title={enVariables.APP_NAME}
                              className="img-fluid logoImg"
                            />
                          </div>
                     {/* sign in and sign up */}
                          <div className="col-sm-6 text-right">
                            {this.props.isAuthorized ? (
                              <div className="row">
                                <div className="col-12">
                                  <a
                                    onClick={this.props.goToProfile}
                                    className="userBox"
                                  >
                                    <b>{this.props.userName}</b>
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <div className="row">
                                <div className="col-5 ml-auto loginBtnLogLayout px-sm-2">
                                  <button
                                    className="btn btn-primary loginBtnLog text-right"
                                    data-toggle="modal"
                                    data-target="#loginModal"
                                    onClick={this.props.showLoginHandler}
                                  >
                                    {locale
                                      ? locale.locationSel.login
                                      : "Log In"}
                                  </button>
                                </div>
                                <div className="col-5 ml-auto signUpBtnLogLayout px-sm-2">
                                  <button
                                    className="btn btn-primary signUpBtnLog"
                                    data-toggle="modal"
                                    data-target="#loginModal"
                                    onClick={this.props.showSignUpHandler}
                                  >
                                    {locale
                                      ? locale.locationSel.signUp
                                      : "Sign up"}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col py-lg-5 py-3 mt-lg-3">
                            <div className="row">
                              <div className="col">
                                <ul className="nav flex-column" id="vertical">
                                  {/* <Slider {...settings}> */}
                                  <div>
                                    <li className="nav-item">
                                      <a className="nav-link active" href="#">
                                        {locale
                                          ? locale.locationSel.noTimeMsg
                                          : "No time to drive to the local grocery store?"}
                                      </a>
                                    </li>
                                  </div>

                                  {/* <div>
                                                                            <li className="nav-item">
                                                                                <a className="nav-link" href="#">Hate waiting long hours in a queue?</a>
                                                                            </li>
                                                                        </div> <div>
                                                                            <li className="nav-item">
                                                                                <a className="nav-link" href="#">Looking for the lowest grocery prices?</a>
                                                                            </li>
                                                                        </div> */}
                                  {/* </Slider> */}
                                </ul>
                              </div>
                            </div>
                            <h5 className="orderTextLog">
                              {locale
                                ? locale.locationSel.ordTime
                                : "One-stop solution to all your delivery needs"}
                            </h5>
                          </div>
                        </div>
                     {/* main search location */}
                        <div className="row">
                          <div className="col">
                            <form>
                              <div className="row">
                                <div className="col pr-0">
                                  <div className="form-group m-0">
                                    <LocationSearchInput
                                      updateLocation={this.props.updateLocation}
                                      id="landingPageLocBox"
                                      locErrMessage={this.props.locErrMessage}
                                      inputClassName="form-control py-lg-3 rounded-0 findInputLog overflow-ellipsis"
                                      locale={this.props.locale}
                                      ref={(ref) => (this.LocSearchRef = ref)}
                                    />

                                    <a
                                      onClick={this.props.getGeoLocation}
                                      className="locateMeIcon"
                                    >
                                      {locale
                                        ? locale.locationSel.locateMe
                                        : "Locate Me"}
                                    </a>
                                  </div>
                                </div>
                                <div className="col-3  pl-0">
                                  <div className="form-group m-0">
                                    <a
                                      onClick={() => this.props.getCategories()}
                                      className="form-control py-lg-3 rounded-0 findBtnLog"
                                    >
                                      {locale
                                        ? locale.locationSel.search
                                        : "Search"}
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>

                        {this.props.locErrMessage ? (
                          <div className="row">
                            <div className="col">
                              <div className="locationError">
                                <p> {this.props.locErrMessage} </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                {/* all the cities */}
                        <div className="row">
                          <div className="col-lg-12 col-xl-11 py-lg-5 py-4 pr-3">
                            <ul className="nav locationCitiesUL">
                              {this.props.cityData &&
                                this.props.cityData.map((city, key) => (
                                  <li
                                    className="nav-item"
                                    key={"cityData-" + key}
                                  >
                                    <a className="nav-link" onClick={()=>this.handleClick(city.cityName)}>
                                      {city.cityName}
                                    </a>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-5 d-none d-md-block bannerBgRightLogin">
                    {/* <img src="/static/images/pexels-photo-277253.png" width="100%" className="img-fluid shine" alt="pexels" /> */}
                  </div>
                </div>
              </div>
            </div>

            <div className="row align-items-center">
              <div className="col py-lg-5 py-sm-3 descFeatLayoutLog">
                <div className="row justify-content-center align-items-center">
                  <div className="col-xl-10 col-md-12 col-sm-11 py-lg-5 py-3">
                    <div className="row align-items-center">
                      <div className="col-12 col-sm-4 text-center">
                        {/* <i className="fa fa-users"></i> */}
                        <img
                          src="/static/images/noMinOrder1.svg"
                          width="120"
                          height="120"
                          className=""
                          alt="icon"
                        />
                        <h5 className="descFeatLogH5">
                          {locale
                            ? locale.locationSel.noMinimumOrd
                            : "No Minimum Order"}
                        </h5>
                        <h6 className="descFeatLogH6">
                          {locale
                            ? locale.locationSel.noMinCap
                            : "Order in for yourself or for the group, with no restrictions on order value"}
                        </h6>
                      </div>
                      <div className="col-12 col-sm-4 text-center">
                        {/* <i className="fa fa-home"></i> */}
                        <img
                          src="/static/images/liveTracking1.svg"
                          width="110"
                          height="110"
                          style={{ marginBottom: "28px" }}
                          className=""
                          alt="icon"
                        />
                        <h5 className="descFeatLogH5">
                          {locale
                            ? locale.locationSel.liveTrackMsg
                            : "Live Order Tracking"}
                        </h5>
                        <h6 className="descFeatLogH6">
                          {locale
                            ? locale.locationSel.liveTrackCap
                            : "Know where your order is at all times, from the store to your doorstep"}
                        </h6>
                      </div>
                      <div className="col-12 col-sm-4 text-center">
                        {/* <i className="fa fa-motorcycle"></i> */}
                        <img
                          src="/static/images/deliverySpeed1.svg"
                          width="120"
                          style={{ marginBottom: "16px" }}
                          height="120"
                          className=""
                          alt="icon"
                        />
                        <h5 className="descFeatLogH5">
                          {locale
                            ? locale.locationSel.lightFast
                            : "Lightning-Fast Delivery"}
                        </h5>
                        <h6 className="descFeatLogH6">
                          {locale
                            ? locale.locationSel.lightFastCap
                            : "Experience Grocer's superfast delivery for groceries delivered fresh & on time"}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <div className="row my-4 justify-content-center">
                  <div className="col-sm-11 col-md-12">
                    <div className="row align-items-center">
                      <div className="col-6 py-5 py-lg-0">
                        <div className="row justify-content-center my-5 groceriesStoresLayout">
                          {/* <div className="col-lg-9 col-xl-9 locateSectionLayout">
                                                        <h3 className="resHeadTitLog">Groceries Stores in your pocket</h3>
                                                        <h5 className="resDescTitLog">Order from your favorite restaurants & track on the go, with the all-new Grocers
                                                            app.
                                                        </h5>
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <div className="row">
                                                                    <div className="col-auto appImages mb-2">
                                                                        <img src="/static/images/google-play.png" className="img-fluid shine googleNStoreImg" width="180" height="60" alt="google-play" />
                                                                    </div>
                                                                    <div className="col-auto appImages">
                                                                        <img src="/static/images/app-store.png" className="img-fluid shine googleNStoreImg" width="180" height="60" alt="app-store" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> */}
                       {/* apple and google links */}
                          <div className="col-12 col-lg-10">
                            <h3 className="resHeadTitLog">
                              {locale
                                ? locale.locationSel.groceryInPkt
                                : "Save the excuses and time."}
                            </h3>
                            <h5 className="resDescTitLog">
                              {locale
                                ? locale.locationSel.ordFromFav
                                : "The better way to get things done,"}
                              <span className="justCaption">
                                {" "}
                                {"just " + enVariables.APP_NAME + " it!"}
                              </span>
                            </h5>
                          </div>
                          <div className="col-12 col-lg-10">
                            <div className="row align-items-center">
                              <div className="col-auto appImages mb-sm-2 mb-md-0 mb-lg-2">
                                <a
                                  href={enVariables.PLAY_STORE}
                                  target="_blank"
                                >
                                  <img
                                    src="/static/images/google-play.png"
                                    className="img-fluid shine googleNStoreImg"
                                    width="180"
                                    height="60"
                                    alt="google-play"
                                  />
                                </a>
                              </div>
                              <div className="col-auto appImages mb-sm-2 mb-md-0 mb-lg-2">
                                <a href={enVariables.APP_STORE} target="_blank">
                                  <img
                                    src="/static/images/app-store.png"
                                    className="img-fluid shine googleNStoreImg"
                                    width="180"
                                    height="60"
                                    alt="app-store"
                                  />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-6 bannerBgRightStores  text-center">
                        <img
                          src="/static/images/bannerBgRightStores.png"
                          style={{ width: "50%" }}
                          className=""
                          alt="iPhone"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* landing footer */}
          <Footer lang={this.props.lang} locale={this.props.locale} />
        </main>
        {/* style={{ background: `url(${enVariables.SPLASH})` }} */}
        <div className="col-12 loginMobilePage mobile-show mobileLandingDiv">
          <div className="row">
            <div className="col-12">
              <div className="row">
                <div
                  className="col-12 p-0 text-center loginItems"
                  style={{ height: "90vh", display: "flex" }}
                >
                  <img src="/static/images/grocer/icon.png"></img>
                </div>
              </div>
            </div>
          </div>

          <div
            className="row"
            style={{ position: "absolute", width: "100%", top: "65vh" }}
          >
            <div className="col-12 text-center">
              <div className="row justify-content-center">
                <div className="col-12 px-5">
                  <div className="setUpLoc">
                    <button
                      onClick={this.props.getGeoLocation}
                      type="button"
                      className="form-control"
                    >
                      {locale
                        ? locale.locationSel.detectLoc
                        : "DETECT MY LOCATION"}
                    </button>
                    <p>
                      {" "}
                      <a onClick={this.showLocationHandler}>
                        {locale
                          ? locale.locationSel.setLocMan
                          : "Set location manually"}{" "}
                      </a>
                    </p>
                  </div>

                  {this.props.locErrMessage ? (
                    <p className="locErrMobi">
                      {locale.notDeliver ||
                        "Sorry! We don't deliver here, try another location"}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>

            <LocationDrawer
              onRef={(ref) => (this.child = ref)}
              width={this.state.loginSliderWidth}
              updateLocation={this.props.updateLocation}
              loading={this.props.loading}
              handleClose={this.handleClose}
              locErrMessage={this.props.locErrMessage}
              getGeoLocation={this.props.getGeoLocation}
            />
          </div>
        </div>

        {this.props.loading ? <CircularProgressLoader /> : ""}
      </Wrapper>
    );
  }
}

const dispatchAction = (dispatch) => {
  return {
    changeLang: (lang) => dispatch(selectLocale(lang)),
  };
};
const stateToProps = (state) => {
  return {
    lang: state.locale,
  };
};
export default connect(stateToProps, dispatchAction)(LocationSelect);
