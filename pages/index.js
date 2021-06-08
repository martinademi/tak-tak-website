import React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import $ from "jquery";
import Router from "next/router";
import axios from "axios";
import * as enVariables from "../lib/envariables";
import * as actions from "../actions/index";
import Wrapper from "../hoc/wrapperHoc";
// import Footer from '../components/footer/Footer'
import LocationSelect from "../components/location/Locate";
import Authmodals from "../components/authmodals/index";
import redirect from "../lib/redirect";
import {
  setCookie,
  getCookie,
  getCookiees,
  removeCookie
} from "../lib/session";
import { redirectIfAuthenticated, getJwt, getLocation } from "../lib/auth";
import { getCategoriesApi, getStoreCategoriesApi } from "../services/category";
import { getLocationZone } from "../services/guestLogin";
import TopLoader from "../components/ui/loaders/TopBarLoader/TopBarLoader";
import { getCities } from "../services/auth";
import "../assets/login.scss";
import "../assets/style.scss";
import CustomHead from "../components/html/head";
import { getAreaData } from "../lib/location/location";
import Demo from "../components/location/Demo";

import { geolocated } from "react-geolocated";

let globalArea = "";
let globalCity = "";

const Test = props => {
 
};
class LocationPage extends Component {
  static async getInitialProps({ ctx }) {
    if (redirectIfAuthenticated(ctx)) {
      return {};
    }
    let token = await getCookiees("token", ctx.req);
    const userName = await getCookiees("username", ctx.req);
    const isAuthorized = await getCookiees("authorized", ctx.req);
    let lat = getCookiees("lat", ctx.req);
    let lng = getCookiees("long", ctx.req);
    let zoneID = getCookiees("zoneid", ctx.req);
    // let lang = getCookiees("lang", ctx.req) || "spa";
    // let lang = getCookiees("lang", ctx.req) || "en";
    // ctx && ctx.store ? ctx.store.dispatch(actions.selectLocale(lang)) : "";

    await ctx.store.dispatch(actions.checkCookies(ctx.req));

    return { userName, isAuthorized, token };
  }

  lang = this.props.lang;
  state = {
    showLogin: true,
    showSignup: false,
    username: this.props.userName,
    isAuthorized: this.props.isAuthorized,
    locationData: [],
    lat: "",
    long: "",
    loading: false,
    error: null,
    cityData: []
  };

  constructor(props) {
    super(props);
    this.getInnerRef = this.getInnerRef.bind(this);
    this.getLocation = this.getLocation.bind(this);
  }

  innerRef;

  getInnerRef(ref) {
    this.innerRef = ref;
  }

  getLocation() {
    this.innerRef && this.innerRef.getLocation();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.reduxState.userName != this.props.reduxState.userName) {
     
      this.setState({
        username: this.props.reduxState.userName,
        isAuthorized: this.props.reduxState.authorized
      });
    }
  }

  componentDidMount() {
    let authorized = getCookie("authorized", "");
    let username = getCookie("username", "");
    setCookie("lang","en")
    // $.mobile.zoom.disable();

    authorized
      ? (this.setState({ isAuthorized: true, username: username }),
        this.props.dispatch(actions.getProfile()))
      : this.props.dispatch(actions.guestLogin());
    this.getCities();
    this.startTopLoader();
    this.setState({ isRendered: true });
    setTimeout(() => {
      document.getElementById("landingPageLocBox").focus();
      // this.getUserLocation();
    }, 1800);

    $("body").on("touchstart touchend", function() {});

    // this.getLocation();
    // connect(mapStateToProps, null)(geolocated({ positionOptions: { enableHighAccuracy: true }, userDecisionTimeout: 5000 })(Test));
    // geolocated({
    //     positionOptions: { enableHighAccuracy: true },
    //     userDecisionTimeout: 5000
    // })(Test)

  

    // this.getGeoLocation();
  }

  getUserLocation = () => {
    axios.get("https://ipapi.co/json").then(data => {
      setCookie("cityReg", data.data.city);
      this.setState({ city: data.data.city });
    });
  };

  // getting area details
  getAreaData = (lat, lng) => {
    let geocoder = new google.maps.Geocoder();
    let latlng = new google.maps.LatLng(lat, lng);

    let currentArea = "";
    let subLocIndex = -1;
    let mainLocIndex = -1;
    let currentCity = "";

    return new Promise(async (resolve, reject) => {
      await geocoder.geocode({ latLng: latlng }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          results.map((location, index) => {
            subLocIndex = location.types.findIndex(
              typeOfLocation => typeOfLocation === "sublocality"
            );
            mainLocIndex = location.types.findIndex(
              typeOfLocation => typeOfLocation === "locality"
            );

            // check if the locality and sub locality is available in google result
            if (subLocIndex > -1) {
              currentArea = location.formatted_address.split(",")[0];
            }

            if (mainLocIndex > -1) {
              currentCity = location.formatted_address.split(",")[0];
            }
          });

          // setting up result data in global variables
          globalArea = currentArea;
          globalCity = currentCity;

          setCookie("areaReg", currentArea);
          setCookie("cityReg", currentCity);

          return resolve(1);
        }
      });
    });
  };

  // get location of users in lat and long
  getGeoLocation = () => {
    // geolocation.getCurrentPosition(function (err, position) {
    //     if (err) throw err
    
    // })
    const location = getLocation(); //  detect user current user location
    location.then(
      res => {
      
        // res.coords.latitude && res.coords.longitude ?
        this.updateLocation(
          { lat: res.coords.latitude, lng: res.coords.longitude },
          1
        );
        // :
        // axios.get('https://ipapi.co/json').then((data) => {
        //     this.updateLocation({ lat: data.data.latitude, lng: data.data.longitude, city: data.data.city }, 1)
        // })
      },
      error => {
        // axios.get('https://ipapi.co/json').then((data) => {
        //     this.updateLocation({ lat: data.data.latitude, lng: data.data.longitude, city: data.data.city }, 1)
        // })
      }
    );
    this.startTopLoader();
  };

  // get serving city data
  getCities = () => {
    getCities()
      .then(data => {
        this.setState({ cityData: data.data });
      })
      .catch(err => {
       
      });
  };

  startTopLoader = () => this.TopLoader.startLoader();
  showLoginHandler = () => {
    this.child.showLoginHandler();
  };
  showSignUpHandler = () => {
    this.child.showSignupHandler();
  };

  // update location in website, based on user input and selections
  updateLocation = (data, type) => {
    data["token"] = getCookie("token", "");

    //get area, city data based on result lat long
    getAreaData(data.lat, data.lng).then(areaData => {
      this.setState({
        loading: true,
        location: data.location,
        lat: data.lat,
        long: data.lng,
        locationData: data
      });
      this.props.dispatch(actions.initLocChange(data));

      // getting new zone data based on selected location lat and long
      getLocationZone(data.lat, data.lng).then(zone => {
        if (zone.error) {
          this.errorHandler(zone.data.message);
        } else {
          if (zone.data.zoneId && data.lat && data.lng && data.token) {
            setCookie("zoneid", zone.data.zoneId);
            setCookie("cityid", zone.data.cityId);
            setCookie("locAuthenticated", true);
            setCookie("authenticatedZone", true);
            // redirection to either profile pageXOffset, or main page based on type
            type && type == 2
              ? redirect("/profile")
              : redirect(`/${areaData.city}/stores`);
            // : redirect('/restaurants')
          }
        }
      });
    });
  };

  getCategories = (data, type) => {
    let locAuth;
    const locale = this.props.locale;

    this.errorHandler(
      this.lang.pleaseSelect || "Please select delivery location"
    );
    // data ?
    //     (
    //         locAuth = getCookie("authenticatedZone", ''),
    //         setCookie("storeId", data.data.store.businessId),
    //         setCookie("storeName", data.data.store.businessName),

    //         locAuth ?
    //             type && type == 2 ? (redirect('/profile'), this.startTopLoader()) :
    //                 (redirect(`/stores/${data.data.store.businessName.replace(/,/g, '').replace(/& /g, '').replace(/ /g, '-')}?lang=${this.props.lang}`), this.startTopLoader())
    //             :
    //             this.errorHandler(locale.index.locMsg)
    //     )
    //     :
    //     this.errorHandler(locale.index.locMsg)
  };
// based on the location if the selected store have store then it will redirect to profile page
  goToProfile = () => {
    const locale = this.props.locale;
    const location = getLocation();
    location.then(
      res => {
        res.coords.latitude && res.coords.longitude
          ? this.updateLocation(
              { lat: res.coords.latitude, lng: res.coords.longitude },
              2
            )
          : toastr.error(locale.index.locMsg);
      },
      error => {
        toastr.error(locale.index.locMsg);
      }
    );
  };
  setDetectedLocation = location => {
  
  };

  errorHandler = res => {
    this.state.error
      ? ""
      : (this.setState({ error: res, loading: false }),
        setTimeout(() => {
          this.setState({ error: null });
        }, 3500));
  };

  render() {
    const locale = this.props.locale;

    const { getInnerRef, getLocation } = this;

    return (
      <Wrapper>
        {/* setting up custom head tag for SEO html */}
        {/* <CustomHead title={enVariables.APP_NAME} /> */}

        <CustomHead
          description={enVariables.OG_DESC}
          ogImage={enVariables.OG_LOGO}
          title={enVariables.OG_TITLE}
        />

        {/* <Demo setDetectedLocation={this.setDetectedLocation} ref={getInnerRef} />

                <button onClick={getLocation}>Get it</button> */}

        {this.state.isRendered ? (
          <LocationSelect
            loading={this.state.loading}
            isAuthorized={this.state.isAuthorized}
            locErrStatus={this.props.locErrStatus}
            locErrMessage={this.state.error}
            userName={this.state.username}
            showLoginHandler={this.showLoginHandler}
            showSignUpHandler={this.showSignUpHandler}
            updateLocation={this.updateLocation}
            getCategories={this.getCategories}
            getGeoLocation={this.getGeoLocation}
            goToProfile={this.goToProfile}
            cityData={this.state.cityData}
            lang={this.props.lang}
            locale={locale}
          />
        ) : (
          ""
        )}
        <Authmodals
          onRef={ref => (this.child = ref)}
          locale={this.props.locale}
        />
        <TopLoader onRef={ref => (this.TopLoader = ref)} />
        {/* <Footer /> */}
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    reduxState: state,
    locErrStatus: state.locErrStatus,
    locErrMessage: state.locErrMessage,
    userProfileDetail: state.userProfile,
    selectedLang: state.selectedLang,
    locale: state.locale,
    lang: state.lang
  };
};

export default connect(mapStateToProps)(LocationPage);

// export default geolocated({
//     positionOptions: {
//         enableHighAccuracy: false,
//     },
//     userDecisionTimeout: 5000,
//     suppressLocationOnMount: true
// })(Demo);

// LocationPage.propTypes = { ...geoPropTypes };

// export default connect(mapStateToProps, null)(geolocated({ positionOptions: { enableHighAccuracy: true }, userDecisionTimeout: 5000, })(LocationPage));
