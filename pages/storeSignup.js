import React from "react";
import { connect } from "react-redux";
import Footer from "../components/footer/Footer";
import Header from "../components/header/innerPageHeader";
import Authmodals from "../components/authmodals/index";
import { getCookiees } from "../lib/session";
import LinearProgress from "material-ui/LinearProgress";
import {
  getCityList,
  getStoreCategories,
  getCityZones,
  getCityPlans,
  StoreSignUp,
  getCitywiseCategories,
} from "../services/getIpInfo";
import $ from "jquery";
import StoreCategory from "../components/storeSignUp/storeCategory";
import ZoneSelect from "../components/storeSignUp/zoneSelection";
import AuthInput from "../components/ui/auth/input";
import StoreDetailInPuts from "../components/storeSignUp/storeDetails";
import SelectRadio from "../components/storeSignUp/selectRadio";
import SelectMulti from "../components/storeSignUp/selectMultiple";
import * as enVariables from "../lib/envariables";
import * as actions from "../actions";

import "../assets/login.scss";
import "../assets/style.scss";
import ActionResponse from "../components/dialogs/actionResponse";
import Wrapper from "../hoc/wrapperHoc";

import CustomHead from "../components/html/head";
import moment from "moment";

class SignUp extends React.Component {
  static async getInitialProps({ ctx }) {
    const isAuthorized = await getCookiees("authorized", ctx.req);
    const queries = ctx.query;

    let lang = (await (queries.lang || getCookiees("lang", ctx.req))) || "en";
    ctx && ctx.store ? ctx.store.dispatch(actions.selectLocale(lang)) : "";
    return { isAuthorized };
  }
  state = {
    cityList: null,
    categoryList: null,
    selectedCityID: "Select City",
    selectedCategoryValue: null,
    selectedService: null,
    CityPlans: null,
    storeName: null,
    businessPhone: null,
    businessEmail: null,
    ownerEmail: null,
    ownerName: null,
    ownerNumber: null,

    ownerPassword: null,
    minimumOrderPrice: null,
    freeDeliveryAbove: null,
    center: {
      lat: 0,
      lng: 0,
      place: "",
    },

    selectedDriver: null,
    selectedPriceSettings: null,
    readyToShowDivs: false,
    storeDetail: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      completed: 0,
      isAuthorized: props.isAuthorized,
      zoneSelected: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleZoneChange = this.handleZoneChange.bind(this);
    this.updateForm = this.updateForm.bind(this);
  }

  componentDidMount() {
   // to get city list
    getCityList()
      .then(({ data }) => {
      
        this.setState({ cityList: data.data });
      })
      .catch((err) => {});

    this.setState({ readyToShowDivs: true });
  }
// city wise categories 
  getCitywiseCategories = (cityId) => {
    getCitywiseCategories(cityId).then(({ data }) => {
    
      this.setState({ categoryList: data.data });
    });
  };

  change = (event) => {
    $(".zoneSelect").hide();
    $(".categorySelect").hide();
    this.setState({
      completed: 0,
      CityZones: null,
      selectedCategoryValue: null,
      selectedCityID: event.target.value,
    });
// to get city zones 
    getCityZones(event.target.value).then(({ data }) => {
     
      this.setState({ CityZones: data.data });
      this.setState({ completed: 10 });
      $(".zoneSelect").fadeIn("slow");
    });
// to get ciry plan
    getCityPlans(event.target.value).then(({ data }) => {
      
      this.setState({ CityPlans: data.data });
    });

    this.getCitywiseCategories(event.target.value);
  };

  handleChange = (event) => {
   
    var result = this.state.categoryList.filter((obj) => {
      return obj.categoryName === event.target.value;
    });

   
    this.setState({
      completed: 30,
      cat: result,
      selectedCategoryValue: event.target.value,
    });
  };

  handleZoneChange = (event, category) => {
    this.setState({
      ["zoneSelected"]: this.state["zoneSelected"].concat([category._id]),
    });
    $(".categorySelect").fadeIn("slow");
    this.setState({ completed: 20 });
  };

  handlePickupPayChange = (event, category) => {
   
    $(".DeliveryPayMent").fadeIn("slow");
  };

  handleDeliveryPayChange = (event, category) => {
   
    $(".registerDisabled").hide();
    $(".registerEnabled").fadeIn("slow");
  };

  handleDriverChange = (e) => {
    
    this.setState({ selectedDriver: e.target.value, completed: 40 });
    $(".priceSettings").fadeIn("slow");
  };

  handlePriceSettings = (e) => {
    this.setState({ selectedPriceSettings: e.target.value });
    $(".priceSettings").fadeIn("slow");
  };

  handleServiceChange = (e) => {
    this.setState({ selectedService: e.target.value });
    $(".PickupPayMent").fadeIn("slow");
  };
// email validate
  validateEmail = (email) => {
    
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    re.test(email)
      ? ($("#ownerEmail").css({ borderColor: "#ddd" }),
        $("#ownerEmailError").hide())
      : ($("#ownerEmail").css({ borderColor: "red" }),
        $("#ownerEmailError").fadeIn("slow"));
    return re.test(email);
  };
// validate date url
  valiDateUrl = (url) => {
 
    let re = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    re.test(url)
      ? ($("#businessEmail").css({ borderColor: "#ddd" }),
        $("#businessEmailError").hide())
      : ($("#businessEmail").css({ borderColor: "red" }),
        $("#businessEmailError").fadeIn("slow"));
    
    return re.test(url);
  };
// validate formate 
  validateFormats = (tab) => {
    let emailcheck = this.validateEmail(this.state.ownerEmail);
    let urlcheck = this.valiDateUrl(this.state.businessEmail);
    

    emailcheck && urlcheck
      ? ($(".loading-message").show(),
        $(".success-message").hide(),
        $(".navTabUl").hide("slow"),
        $(".tab-pane").removeClass("in show active"),
        $(".nav-link ").removeClass("active"),
        $("#" + tab + "-button").addClass("active"),
        $("#" + tab).addClass("in show active"),
        $("html, body").animate(
          {
            scrollTop: $("#registerStoreSection").offset().top,
          },
          500
        ),
        this.registerStore())
      : "";
  };
// tab switch
  switchTab = (tab) => {
    tab == "LoaderDiv"
      ? this.validateFormats(tab)
      : ($(".tab-pane").removeClass("in show active"),
        $(".nav-link ").removeClass("active"),
        $("#" + tab + "-button").addClass("active"),
        $("#" + tab).addClass("in show active"),
        $("html, body").animate(
          {
            scrollTop: $("#registerStoreSection").offset().top,
          },
          500
        ));

    tab == "Personal" ? this.setState({ completed: 50 }) : "";

    tab == "business" ? this.setState({ completed: 50 }) : "";

    tab == "Payment" ? this.setState({ completed: 75 }) : "";

    // tab == 'LoaderDiv' ? (
    //     $('.loading-message').show(),
    //     $('.success-message').hide(),
    //     this.registerStore()
    // ) : ''
  };

  submitStoreData = (payload) => {
    this.setState(
      {
        ...this.state,
        storeDetail: payload,
      },
      () => {
        this.registerStore();
      }
    );
  };
  showLoginHandler = () => {
    this.child.showLoginHandler();
  };
  showLocationHandler = () => {
    this.child.showLocationHandler();
  };
  showLocationMobileHandler = () => {
    this.child.showLocationMobileHandler();
  };
  showCart = () => {
    this.child.showCart();
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.reduxState.authorized !== this.props.reduxState.authorized) {
      this.setState({ isAuthorized: this.props.reduxState.authorized });
    }
  }

  updateForm = (e, name) => {
    this.setState({ [name]: e.target.value }, () => {
      
    });
  };

  allowOnlyNumber(e) {
    let char = e.which || e.keyCode;
    if (
      (char >= 37 && char <= 40) ||
      (char >= 48 && char <= 57) ||
      (char >= 96 && char <= 105) ||
      char == 8 ||
      char == 9 ||
      char == 13
    ) {
    } else {
      e.preventDefault();
    }
  }

  updateLocation = (data, type) => {
 
    this.setState({
      center: {
        ...this.state.center,
        lat: data.lat,
        lng: data.lng,
        place: data.address,
      },
    });
  };

  updateLocation1 = (data, type) => {
  
    this.setState({
      businessAddress: {
        ...this.state.center,
        lat: data.lat,
        lng: data.lng,
        place: data.address,
      },
    });
  };

  submitFileID = (file) => {
    return new Promise((resss, rej) => {
      AWS.config.update({
        accessKeyId: "AKIAIUEEKTGNKHAC6NYQ",
        secretAccessKey: "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",
        region: "us-east-1",
      });

      var s3 = new AWS.S3();
      let tStamp = +new Date();
      var params = {
        Bucket: "loopzadmin",
        Key: "Customers/IDPic/" + "IDPic_" + moment().unix(),
        ContentType: file.type,
        Body: file,
        ACL: "public-read",
      };

      s3.putObject(params, (err, res) => {
        if (err) {
          rej();
        } else {
          resss("https://s3.amazonaws.com/loopzadmin/" + params.Key);
          let data = {
            identityCard: "https://s3.amazonaws.com/loopzadmin/" + params.Key,
          };
        }
      });
    });
  };
  focusedIn = (e) => {

    e.target.name == "owneremail"
      ? ($("#ownerEmailError").hide(),
        $("#ownerEmail").css({ borderColor: "#ddd" }))
      : "";

    e.target.name == "BusinessWebsite"
      ? ($("#businessEmailError").hide(),
        $("#businessEmail").css({ borderColor: "#ddd" }))
      : "";
  };
// post the form to store sign up api
  async registerStore() {
    this.ActionRes.openDialog();
    this.setState({
      loadingMsg: "Please Wait...",
      redirectionFlag: 0,
      successMsg: null,
      actionErrMsg: null,
    });
    let SelectedCity;
    let SelectedStoreType;
    let ccOwner = $(".ownerNumber .selected-dial-code").text();
    let ccBusiness = $(".businessNumber .selected-dial-code").text();

    let Cid = this.state.cityList.findIndex(
      (item) => item.id == this.state.selectedCityID
    );

    Cid >= 0 ? (SelectedCity = this.state.cityList[Cid]) : "";

    let Sid = this.state.categoryList.findIndex(
      (item) => item.categoryName == this.state.selectedCategoryValue
    );

    Sid >= 0 ? (SelectedStoreType = this.state.categoryList[Sid]) : "";

   
    let storeImage = "";
    let bannerImage = "";
    try {
      storeImage = await this.submitFileID(this.state.storeDetail.profileImage);
      bannerImage = await this.submitFileID(this.state.storeDetail.bannerImage);
    } catch (e) {
     
    }
    try {
    } catch (e) {}

    let storeData = this.state.storeDetail;
    let data = {
      name: [storeData.storeName],
      sName: {
        en: storeData.storeName,
      },
      logoImage: storeImage,
      imageFlag: storeImage,
      bannerImage: bannerImage,
      storeCategory: [
        {
          categoryId: this.state.cat[0]._id,
          categoryName: {
            en: this.state.cat[0].categoryName,
            ar: "",
            ab: "",
          },
        },
      ],
      ownerName: storeData.ownerName,

      countryId: SelectedCity.country,
      ownerEmail: storeData.ownerEmail,
      password: storeData.password,

      ownerPhone:
        (storeData.ownerPhone && storeData.ownerPhone.phoneNo) || "" || "",
      countryCode:
        (storeData.ownerPhone && storeData.ownerPhone.countryIntl) ||
        "+1" ||
        "",
      businessNumber:
        (storeData.BusinessPhoneNo && storeData.BusinessPhoneNo.phoneNo) ||
        "" ||
        "",
      bcountryCode:
        (storeData.BusinessPhoneNo && storeData.BusinessPhoneNo.countryIntl) ||
        "" ||
        "",

      storeAddr: this.state.center.place || "",
      storeBillingAddr:
        (this.state.businessAddress && this.state.businessAddress.place) || "",
      streetName: storeData.streetName || "",
      localityName: storeData.localityName || "",
      storedescription: {
        en: storeData.storedescription,
      },
      areaName: storeData.areaName || "",
      website: storeData.website || "",
      cityId: this.state.selectedCityID,
      cityName: SelectedCity.cityName,
      storeType: SelectedStoreType.type,
      storeTypeMsg: SelectedStoreType.typeMsg,
      cartsAllowed: SelectedStoreType.cartsAllowed,
      cartsAllowedMsg: SelectedStoreType.cartsAllowedMsg,
      businessZoneId: "0",
      serviceZones: this.state.zoneSelected,
      status: 3,
      baseFare: storeData.baseFare || 0,
      mileagePrice: storeData.mileagePrice || 0,
      mileagePriceAfterMinutes: storeData.mileagePriceAfterMinutes || 0,
      timeFee: storeData.timeFee || 0,
      timeFeeAfterMinutes: storeData.timeFeeAfterMinutes || 0,
      waitingFee: storeData.waitingFee || 0,
      waitingFeeAfterMinutes: storeData.waitingFeeAfterMinutes || 0,
      minimumFare: storeData.minimumFare || 0,
      onDemandBookingsCancellationFee:
        storeData.onDemandBookingsCancellationFee || 0,
      onDemandBookingsCancellationFeeAfterMinutes:
        storeData.onDemandBookingsCancellationFeeAfterMinutes || 0,
      scheduledBookingsCancellationFee:
        storeData.scheduledBookingsCancellationFee || 0,
      scheduledBookingsCancellationFeeAfterMinutes:
        storeData.scheduledBookingsCancellationFeeAfterMinutes || 0,
      convenienceFee: storeData.convenienceFee || 0,
      commission: 0,
      commissionType: 0,
      forcedAccept: storeData.forcedAccept == "Enabled" ? 1 : 2,
      forcedAcceptMsg:
        storeData.forcedAccept == "Enabled" ? "Enabled" : "Disabled",
      autoDispatch: storeData.autoDispatch == "Enabled" ? 1 : 2,
      autoDispatchMsg:
        storeData.autoDispatch == "Enabled" ? "Enabled" : "Disabled",

      autoApproval: storeData.autoApproval == "Enabled" ? 1 : 2,
      autoApprovalMsg:
        storeData.autoApproval == "Enabled" ? "Enabled" : "Disabled",
      coordinates: {
        longitude: this.state.center.lng,
        latitude: this.state.center.lat,
      },
      costForTwo: storeData.costForTwo || 0,
      pricingStatus: storeData.pricingModel || 1,
      pricingStatusMsg:
        storeData.pricingModel == "1" ? "mileagePricing" : "zonalPricing",
      driverType: storeData.driverType || 1,
      driverTypeMsg: storeData.driverType == "2" ? "StoreDrivers" : "Freelance",
      minimumOrder: storeData.minOrderValue || 0,
      avgDeliveryTime: storeData.minOrderValue || "",
      orderType: storeData.orderType || 3,
      freeDeliveryAbove: storeData.freeDeliveryAbove || 0,
      orderTypeMsg:
        storeData.orderType == "1"
          ? "pickupOrder"
          : storeData.orderType == "2"
          ? "deliveryOrder"
          : "both",

      Facebook: "",
      twitterUrl: storeData.twitter || "",
      instagramUrl: storeData.instagram || "",
      twitterUrl: storeData.linkedin || "",
      googleplusUrl: storeData.google || "",
    };

    Object.keys(data).map((key) => {
      if (data[key] === "") {
        delete data[key];
      }
    });

    if (storeData.orderType == "1" || storeData.orderType == "3") {
      data["pickupCash"] = storeData.cash ? 1 : 0;
      data["pickupCard"] = storeData.creditCard ? 1 : 0;
      data["pickupCashMsg"] = storeData.cash ? "Enable" : "Disable";
      data["pickupCardMsg"] = storeData.creditCard ? "Enable" : "Disable";
    }

    if (storeData.orderType == "1" || storeData.orderType == "3") {
      data["deliveryCash"] = storeData.dcash ? 1 : 0;
      data["deliveryCard"] = storeData.dcreditCard ? 1 : 0;
      data["deliveryCashMsg"] = storeData.dcash ? "Enable" : "Disable";
      data["deliveryCardMsg"] = storeData.dcreditCard ? "Enable" : "Disable";
    }
   

    StoreSignUp(data)
      .then((data) => {
       

        if (data.error) {
          this.setState({
            actionErrMsg:
              "Something went wrong while registering store. Please try after some time.",
            loadingMsg: null,
            successMsg: null,
          });
        }
        this.ActionRes.closeDialog();
        window.location.reload();

        // $('.loading-message').show(),
        //     $('.success-message').hide(),

        //     this.setState({ completed: 100 }),
        //     $('.loading-message').hide()
        // $('.circle-loader').toggleClass('load-complete'), $('.checkmark').toggle()
        // $('.success-message').fadeIn('slow')
      })
      .catch((err) => {
        
      });
  }

  handleResponseActions = () => {
    window.location.reload();
  };

  handleErrResponseActions = () => window.location.reload();

  render() {
    return (
      <Wrapper>
        <CustomHead
          description={enVariables.OG_DESC}
          ogImage={enVariables.OG_LOGO}
          title={enVariables.OG_TITLE}
        />
         {/* header */}
        <div className="storeSignupPage">
          <Header
            stickyHeader={true}
            showLoginHandler={this.showLoginHandler}
            isAuthorized={this.state.isAuthorized}
            hideSearch={true}
            hideCategory={true}
            showCart={this.showCart}
            showLocationHandler={this.showLocationHandler}
            showLocationMobileHandler={this.showLocationMobileHandler}
            hideBottom={true}
            staticPage={true}
          >
            {" "}
          </Header>

          {/* storeSignupSection */}
          <div className="col-12 storeSignupSection">
            <div className="row">
              <div className="col-12 expandBusinessSec">
                <div className="row justify-content-center">
                  <div className="col-xl-11 col-lg-11">
                    <div className="row">
                      <div className="col-md-7 expandBusinessSecContent">
                        <h1 className="expandBusinessH1">
                          Expand your store business with {enVariables.APP_NAME}
                        </h1>
                        <p className="expandBusinessDesc">
                          <span>Join a community of </span>
                          <strong> 70,000+ </strong>
                          <span>
                            grocery stores who have successfully grown their
                            business with {enVariables.APP_NAME}.
                          </span>
                        </p>
                        <div className="row expandBusinessCount text-center py-md-5 py-4">
                          <div className="col-md-4">
                            <h4 className="expandBusinessCountH4">
                              3.0 Million +
                            </h4>
                            <p className="expandBusinessCountDesc">
                              Order requests on our platform
                            </p>
                          </div>
                          <div className="col-md-4">
                            <h4 className="expandBusinessCountH4">100,000 +</h4>
                            <p className="expandBusinessCountDesc">
                              Drivers earning on our platform
                            </p>
                          </div>
                          <div className="col-md-4">
                            <h4 className="expandBusinessCountH4">5 Million</h4>
                            <p className="expandBusinessCountDesc">
                              Products across various categories
                            </p>
                          </div>
                        </div>
                        <div className="row justify-content-center">
                          <div className="col-sm-3 col-5">
                            <a
                              href={enVariables.STORE_APP_STORE}
                              target="_blank"
                            >
                              <img
                                alt="App store"
                                src="https://d2qb2fbt5wuzik.cloudfront.net/iserve_goTasker/images/appStore.svg"
                                width=""
                                height=""
                                className=""
                              />
                            </a>
                          </div>
                          <div className="col-sm-3 col-5">
                            <a
                              href={enVariables.STORE_PLAY_STORE}
                              target="_blank"
                            >
                              <img
                                alt="App store"
                                src="https://d2qb2fbt5wuzik.cloudfront.net/iserve_goTasker/images/playStore.svg"
                                width=""
                                height=""
                                className=""
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-5 d-none d-md-block expandBusinessImgBg"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* register store */}
            <div className="row">
              <div className="col-12 registerStoreSection">
                <div className="row justify-content-center">
                  <div className="col-xl-10 col-lg-11">
                    <div className="row">
                      <div className="col-12 py-xl-5">
                        <div className="row">
                          <div className="col-12 text-center">
                            <h3
                              className="registerStoreH3Title"
                              id="registerStoreSection"
                            >
                              <strong>Register as a store</strong>
                            </h3>
                            <p className="mb-5 registerStoreDesc">
                              Fill in the below details and our support team
                              shall contact you at the earliest.
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 registerStoreFormSection">
                            <div className="row">
                              {/* <div className="col-md-3 registerStoreFormList"> */}
                              <div className="col-12 col-md-auto mb-3 mb-md-0 registerStoreFormList">
                                {/* <div className="border"> */}
                                <div className="row">
                                  <div className="col-12 border-bottom pb-2">
                                    <h6 className="registerStoreFormH6Title">
                                      {this.state.completed}% complete
                                    </h6>
                                    <LinearProgress
                                      color="#00cec5"
                                      style={{
                                        height: "20px",
                                        borderRadius: "35px",
                                      }}
                                      mode="determinate"
                                      value={this.state.completed}
                                    />

                                    {/* <div className="progress">
                                                                        <div className="progress-bar" style={{ width: '0%' }}></div>
                                                                        
                                                                    </div> */}
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-12">
                                    <ul className="nav flex-column navTabUl registerStoreFormUL py-3">
                                      <li className="nav-item">
                                        <a
                                          className="nav-link active"
                                          data-toggle="pill"
                                          id="Category-button"
                                          href="#Category"
                                        >
                                          <span className="dotList"></span>
                                          Category Details
                                        </a>
                                      </li>
                                      {this.state.selectedCategoryValue ? (
                                        <li className="nav-item">
                                          <a
                                            className="nav-link"
                                            data-toggle="pill"
                                            id="Personal-button"
                                            href="#Personal"
                                          >
                                            <span className="dotList"></span>
                                            General settings
                                          </a>
                                        </li>
                                      ) : (
                                        <li className="nav-item">
                                          <a
                                            className="nav-link"
                                            style={{ cursor: "not-allowed " }}
                                          >
                                            <span className="dotList"></span>
                                            General settings
                                          </a>
                                        </li>
                                      )}
                                    </ul>
                                  </div>
                                </div>
                                {/* </div> */}
                              </div>
                              {/* <div className="col-md-9 registerStoreFormContent"> */}

                              <div className="col-12 col-md registerStoreFormContent">
                                <div className="tab-content">
                                  <div
                                    className="tab-pane fade in show active"
                                    id="Category"
                                    role="tabpanel"
                                  >
                                    <div className="row">
                                      <div
                                        className="col-12 border-bottom px-lg-5 d-flex align-items-center"
                                        style={{ height: "60px" }}
                                      >
                                        <h5 className="registerStoreFormH5Title">
                                          Category Details
                                        </h5>
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="col-12 px-lg-5">
                                        <form>
                                          <div className="form-group">
                                            <label
                                              htmlFor="sel13"
                                              className="registerStoreFormLabel"
                                            >
                                              Select City<em>*</em>
                                            </label>
                                            <select
                                              onChange={this.change}
                                              id="sel13"
                                              name="sellist1"
                                              className="form-control form-control-lg registerStoreFormSelect"
                                            >
                                              <option>select city</option>
                                              {this.state.cityList ? (
                                                this.state.cityList.map(
                                                  (city, index) => (
                                                    <option
                                                      value={city.id}
                                                      key={"cityOption" + index}
                                                    >
                                                      {city.cityName}
                                                    </option>
                                                  )
                                                )
                                              ) : (
                                                <option>select city</option>
                                              )}
                                            </select>
                                          </div>

                                          <div
                                            className="form-group zoneSelect"
                                            style={{ display: "none" }}
                                          >
                                            <label
                                              htmlFor="sel13"
                                              className="registerStoreFormLabel"
                                            >
                                              Select Zones<em>*</em>
                                            </label>
                                            {this.state.CityZones ? (
                                              <ZoneSelect
                                                categoryList={
                                                  this.state.CityZones
                                                }
                                                handleChange={
                                                  this.handleZoneChange
                                                }
                                              />
                                            ) : (
                                              <p className="text-danger pl-4 text-left">
                                                {" "}
                                                <b>No zones found </b>{" "}
                                              </p>
                                            )}
                                          </div>

                                          <div
                                            className="form-group categorySelect"
                                            style={{ display: "none" }}
                                          >
                                            <label
                                              htmlFor="sel13"
                                              className="registerStoreFormLabel"
                                            >
                                              Select Categories<em>*</em>
                                            </label>
                                            {this.state.categoryList ? (
                                              <StoreCategory
                                                categoryList={
                                                  this.state.categoryList
                                                }
                                                handleChange={this.handleChange}
                                                selectedCategoryValue={
                                                  this.state
                                                    .selectedCategoryValue
                                                }
                                              />
                                            ) : (
                                              ""
                                            )}
                                          </div>

                                          {this.state.selectedCategoryValue ? (
                                            <div className="form-group">
                                              <label
                                                htmlFor="sel13"
                                                className="registerStoreFormLabel"
                                              >
                                                Do you want your own driver ?
                                                <em>*</em>
                                              </label>
                                              <SelectRadio
                                                selectedvalue={
                                                  this.state.selectedDriver
                                                }
                                                nameOne="Yes"
                                                nameTwo="No"
                                                handleChange={
                                                  this.handleDriverChange
                                                }
                                              />
                                            </div>
                                          ) : (
                                            ""
                                          )}

                                          {this.state.selectedDriver ? (
                                            <div className="btn-group btn-group-lg w-100">
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  this.switchTab("Personal")
                                                }
                                                className="btn btn-primary w-100 nextBtnCustom"
                                              >
                                                Next
                                              </button>
                                            </div>
                                          ) : (
                                            <div className="btn-group btn-group-lg w-100">
                                              <button
                                                className="btn  w-100"
                                                type="button"
                                                style={{
                                                  background: "#aaa !important",
                                                  backgroundColor:
                                                    "#aaa !important",
                                                  borderColor:
                                                    "#aaa !important",
                                                  cursor: "not-allowed",
                                                  fontSize: "16px",
                                                }}
                                              >
                                                Next
                                              </button>
                                            </div>
                                          )}
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className="tab-pane fade"
                                    id="Personal"
                                    role="tabpanel"
                                  >
                                    <div className="row">
                                      <div
                                        className="col-12 border-bottom px-lg-5 d-flex align-items-center"
                                        style={{ height: "60px" }}
                                      ></div>
                                    </div>
                                    <div className="row">
                                      <div className="col-12 px-lg-5">
                                        <StoreDetailInPuts
                                          state={this.state}
                                          submitStoreData={this.submitStoreData}
                                          switchTab={this.switchTab}
                                          updateForm={this.updateForm}
                                          allowOnlyNumber={this.allowOnlyNumber}
                                          updateLocation={this.updateLocation}
                                          updateLocation1={this.updateLocation1}
                                          validateEmail={this.validateEmail}
                                          valiDateUrl={this.valiDateUrl}
                                          locale={this.props.locale}
                                          focusedIn={this.focusedIn}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    className="tab-pane fade text-center"
                                    id="LoaderDiv"
                                    role="tabpanel"
                                    style={{ paddingTop: "75px" }}
                                  >
                                    <div className="circle-loader">
                                      <div className="checkmark draw"></div>
                                    </div>
                                    <div className="loading-message">
                                      {" "}
                                      Registering your profile ...{" "}
                                    </div>
                                    <div
                                      className="success-message"
                                      style={{ display: "none" }}
                                    >
                                      You have successfully completed your
                                      profile, one of our representative will
                                      contact you for verification in another
                                      24hrs{" "}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* register store */}

            <div className="row">
              <div className="col-12 whyAddStoreSec text-center py-md-5 py-4">
                <h3 className="whyAddStoreH3Title mb-4 mb-md-5">
                  Why Become A Store With {enVariables.APP_NAME}?
                </h3>
                <div className="row justify-content-center">
                  <div className="col-xl-11 col-lg-11">
                    <div className="row">
                      <div className="col-sm-4 mb-4 mb-sm-0">
                        <img
                          src="/static/images/2.png"
                          width="80"
                          height="80"
                          className=""
                          alt=""
                        />
                        <h3 className="whyAddStoreDescTitle">
                          Grow your business
                        </h3>
                        <p className="whyAddStoreDescCont">
                          Get new customers to order groceries every day.
                        </p>
                      </div>
                      <div className="col-sm-4 mb-4 mb-sm-0">
                        <img
                          src="/static/images/1.png"
                          width="80"
                          height="80"
                          className=""
                          alt=""
                        />
                        <h3 className="whyAddStoreDescTitle">
                          Work on your own terms
                        </h3>
                        <p className="whyAddStoreDescCont">
                          Put a price on your products that earns your profits,
                          add and update your inventory any time.
                        </p>
                      </div>
                      <div className="col-sm-4 mb-4 mb-sm-0">
                        <img
                          src="/static/images/3.png"
                          width="80"
                          height="80"
                          className=""
                          alt=""
                        />
                        <h3 className="whyAddStoreDescTitle">Business Tools</h3>
                        <p className="whyAddStoreDescCont">
                          Get business tools like online payment and invoicing.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* storeSignupSection */}

          <ActionResponse
            onRef={(ref) => (this.ActionRes = ref)}
            handleResponseActions={this.handleResponseActions}
            handleErrResponseActions={this.handleErrResponseActions}
            loadingMsg={this.state.loadingMsg}
            actionErrMsg={this.state.actionErrMsg}
            successMsg={this.state.successMsg}
          />

          {/* Footer container */}
          <Authmodals
            onRef={(ref) => (this.child = ref)}
            editCart={this.editCart}
          />
          <div className="container-fluid" id="footerContainer">
            <Footer lang={this.props.lang || "en"} />
          </div>
        </div>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    reduxState: state,
    locale: state.locale,
  };
};

export default connect(mapStateToProps)(SignUp);
