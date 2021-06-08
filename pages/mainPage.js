import React from "react";
import { connect } from "react-redux";

import $ from "jquery";
import Slider from "react-slick";
import Link from "next/link";
import Router from "next/router";

import Head from "next/head";

import { redirectIfNotAuthenticated } from "../lib/auth";
import {
  setCookie,
  getCookiees,
  getCookie,
  removeCookie,
} from "../lib/session";
import RestaurantList from "../components/FoodTheme/RestaurantList/restaurants";
import RestaurantSection from "../components/FoodTheme/RestaurantSection/section";
// import Header from "../components/FoodTheme/Header/header";
import Wrapper from "../hoc/wrapperHoc";
import { getAllStoreList, getAllOffers } from "../services/category";
import * as enVariables from "../lib/envariables";
import * as actions from "../actions";
import fetch from "isomorphic-unfetch";
import { CSSTransition } from "react-transition-group";

import StoreCard from "../components/FoodTheme/Cards/storeCard";
import CategoryList from "../components/FoodTheme/CategoryList/categorylist";
import Authmodals from "../components/authmodals";
import Footer from "../components/footer/Footer";
import cardLoader from "../components/FoodTheme/Loaders/cardLoader";
import TopLoader from "../components/ui/loaders/TopBarLoader/TopBarLoader";
import "../assets/style.scss";
import "../assets/about.scss";
import "../assets/login.scss";
import CustomHead from "../components/html/head";
// import InnerPageHeader from "../components/header/innerPageHeader";
import CategoryHomeHeader from "../components/header/categoryHomeHeader";
import MainPageHeader from "../components/header/mainPageHeader";
import ExpireCartDialog from "../components/dialogs/expireCart";
import SwitchStoreDialog from "../components/dialogs/switchStoreDialog";
import { getOffersFilter } from "../services/filterApis";
import {
  NavigateToStore,
  NavigateToRestaurant,
} from "../lib/navigation/navigation";
import CartSlider from "../components/cart/cartSlider";

const getBackGround = (type) => {
  switch (type) {
    case 1:
      return "/static/images/gifs/resto.gif";
      break;
    case 2:
      return "/static/images/gifs/store.gif";
      break;

    case 3:
      return "/static/images/gifs/fashion.gif";
      break;
  }
};

const NotAllowedCategories = [ "Bulk", "Laundry"];

class Index extends React.Component {
  static async getInitialProps({ ctx }) {
    if (redirectIfNotAuthenticated(ctx)) {
      return {};
    }

    let token = getCookiees("token", ctx.req);
    let cityId = getCookiees("cityid", ctx.req);
    let zoneId = getCookiees("zoneid", ctx.req);
    let lat = getCookiees("lat", ctx.req);
    let long = getCookiees("long", ctx.req);
    const isAuthorized = await getCookiees("authorized", ctx.req);

    let lang = (await getCookiees("lang", ctx.req)) || "en";

    const getCategoryList = await fetch(
      enVariables.API_HOST + `/store/categories/${cityId}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          language: "en",
          authorization: token,
        },
      }
    );

    const categoryList = await getCategoryList.json();

    const defaultCategory =
      (await categoryList) && categoryList.data ? categoryList.data[0] : "";

    let data = await {
      from: 0,
      size: 10,
      query: {
        bool: {
          must: [
            { match: { status: 1 } },
            { match: { serviceZones: zoneId } },
            { match: { "storeCategory.categoryId": defaultCategory._id } },
            { match: { storeType: defaultCategory.type } },
          ],
        },
      },
    };
// to get restaturant categories
    const getCategory = await fetch(
      enVariables.FILTER_HOST + `/storeFilterParameters/`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          language: "en",
          authorization: token,
          filterType: 3,
        },
        body: JSON.stringify(data),
      }
    );


    const getFilterList = await getCategory.json();
    ctx && ctx.store ? ctx.store.dispatch(actions.selectLocale(lang)) : "";

    return {
      token,
      zoneId,
      getFilterList,
      getCategory,
      categoryList,
      defaultCategory,
      lat,
      long,
      isAuthorized,
      lang,
    };
  }

  state = {
    subCategoryList: [],
    componentMounted: false,
    selectedCategory: [],
    storeList: [],
    offerList: [],
    renderNav: false,
    username: "",
    isAuthorized: this.props.isAuthorized,
    categoryList: [],
    getFilterList: [],
    offerListLoading: false,
    isCategoryLoading: true,
  };
// for the diffrent categories like grocery,food,baby care ,etc
  onChangeCategory = (category) => {
    this.setState(
      { selectedCategory: category, offerList: [], offerListLoading: true },
      () => {
        this.callGetAllStoreList(this.state.selectedCategory);
        this.getAllOffers();
        this.state.selectedCategory.type == 1 ? this.changeCusines() : "";
        
     //   this.state.selectedCategory ==7 ?Router.push('/checkout').then(() => window.scrollTo(0, 0)) :""
      }
    );

    setCookie("categoryId", category._id);
    setCookie("categoryType", category.type);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  callGetAllStoreList(category) {
    let query = {
      lat: this.props.lat,
      long: this.props.long,
      token: this.props.token,
      zoneId: this.props.zoneId,
      offset: 0,
      limit: 40,
      type: category.type,
      categoryId: category._id,
    };

    // , offerList: data.offerData,
    getAllStoreList(query).then((data) => {
      
      if (data && data.data) {
        this.setState({ storeList: data.data.data, offerListLoading: false });
      }
      if (data.error) {
        this.setState({ noStores: true, storeList: null });
      }
    });
  }

  componentWillUnmount() {
    removeCookie("cartOpen");
  }
  componentDidUpdate(prevProps) {
    if (prevProps.reduxState.userName !== this.props.reduxState.userName) {
      this.setState({
        username: this.props.reduxState.userName,
        isAuthorized: this.props.reduxState.authorized,
      });
    }
  }

  changeCusines = async () => {
    let data = await {
      from: 0,
      size: 10,
      query: {
        bool: {
          must: [
            { match: { status: 1 } },
            { match: { serviceZones: this.props.zoneId } },
            {
              match: {
                "storeCategory.categoryId": this.state.selectedCategory._id,
              },
            },
            { match: { storeType: this.state.selectedCategory.type } },
          ],
        },
      },
    };
    const getCategory = await fetch(
      enVariables.FILTER_HOST + `/storeFilterParameters/`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          language: "en",
          authorization: this.props.token,
          filterType: 3,
        },
        body: JSON.stringify(data),
      }
    );

    const getFilterList = await getCategory.json();

    this.setState({ getFilterList: getFilterList });
  };
  editCart = (cartDetail, products, type, event) => {
    let editCartData = {
      cartId: this.props.reduxState.cartList.cartId,
      childProductId: cartDetail.childProductId,
      unitId: cartDetail.unitId,
    };

    type == 1
      ? (editCartData["quantity"] = cartDetail.quantity - 1)
      : (editCartData["quantity"] = cartDetail.quantity + 1);

    this.props.dispatch(actions.editCard(editCartData));
    // event.stopPropagation();
    // event.preventDefault();
 
    // this.child.showCart();
  };

  callGetAllOffers(category) {
    let query = {
      lat: this.props.lat,
      long: this.props.long,
      token: this.props.token,
      zoneId: this.props.zoneId,
      offset: 0,
      limit: 10,
      type: category.type,
      categoryId: category._id,
    };

    getAllOffers(query).then(({ data }) => {
    
      this.setState({ offerList: data.offerData });
    });
  }

  // componentWillMount() {
  // }
  startTopLoader = () => {
    this.TopLoader.startLoader();
  };

  toggleMenu() {
    let sidenav = document.getElementById("sidenav");
    let contentWrapID = document.getElementById("contentWrapID");
    sidenav.classList.toggle("sidenavWidth");
  }

  handleOfferPagination = (index) => {
    
  };

  testUpdate = (index, newInd) => {
  
  };

  getAllOffers = () => {
    
    getOffersFilter(getCookie("zoneid"), this.state.selectedCategory.type)
      .then((data) => {
     
        this.setState({ offerList: data.data.data });
      })
      .catch((err) => {
       
      });
  };

  componentDidMount() {
    removeCookie("dlvxCartLmt");
    // removeCookie("storeType");

    this.setState(
      {
        selectedCategory: this.props.defaultCategory,
        categoryList: this.props.categoryList,
        getFilterList: this.props.getFilterList,
        isAuthorized: this.props.isAuthorized || false,
        isCategoryLoading: false,
      },
      () => {
        this.state.selectedCategory.type == 1
          ? this.callGetAllOffers(this.props.defaultCategory)
          : this.callGetAllStoreList(this.props.defaultCategory);

        this.getAllOffers(); // get all offers
      }
    );

    setCookie("categoryId", this.props.defaultCategory._id);
    setCookie("categoryType", this.props.defaultCategory.type);

    let sid = getCookie("sid");
    let mqttTopic = localStorage.getItem("dlvMqtCh");
    this.child.mqttConnector(sid, mqttTopic);

    // this.props.dispatch(actions.getProfile());
    // document.cookie = "storeId=; expires = Thu, 01 Jan 1970 00:00:00 GMT";
// to get cart details
    this.props.isAuthorized ? this.props.dispatch(actions.getCart()) : "";

    setTimeout(() => {
      // let offerNextButton = document.getElementById("mainPageOfferList").getElementsByClassName("slick-next")[0];
      // offerNextButton.addEventListener("click", this.handleOfferPagination)
    
    }, 5000);

    $(document).ready(() => {
      let offset = 80;

      $(".hamIcon").click(() => {
        $(".hamIcon").toggleClass("active");
      });
      setTimeout(() => {
        this.setState({ componentMounted: true });
        this.props.dispatch(actions.selectLocale(this.props.lang));
      }, 1200);
    });

    //position sticky
    let windowWidth = $(window).width();
    if (windowWidth >= 992) {
      $(window).scroll(() => {
        this.setState({ renderNav: true });

        //home page scrollspy
        let scrollPos = $(window).scrollTop();
        let scrollspyNav = $(".scrollspy-sidebar");
        let headerWrapID = $("#headerWrapID");
        let headerLinks = $(".restHeadLinks");

        let headerWrapIDpHeight = headerWrapID.outerHeight();

        // getting the html sections
        let categorySlider = $(".categorySliderSec");
        let storeCategoryList = $(".storeCategoryList");
        let popNSuper = $(".popNSuperSec");

        // getting height of the html section
        let storeCategoryListSec = storeCategoryList.outerHeight();
        let offerSliderSec = categorySlider.outerHeight();
        let popNSuperSec = popNSuper.outerHeight();

        let totalSectionHeight =
          this.state.offerList && this.state.offerList.length >= 3
            ? storeCategoryListSec + offerSliderSec
            : storeCategoryListSec;
        totalSectionHeight += 150;

        // check if the scroll position is equal or greater than the above parts height total
        if (scrollPos >= totalSectionHeight) {
          $(".categoryCrumbz").show();
          $(".headerNav").css({
            backgroundColor: "#f2f6fc",
            transition: ".1s",
          });
          $(".restHeadCont").addClass("bottom-shadow");
          // $(".categoryCrumbz").css({
          //   backgroundColor: "#f2f6fc"
          // })

          // $(".popNSuperCont").addClass("popNSuperDescContSticky");
          // $(".scrollspyNavParent").css("margin-top", "200px")

          // $(".headerWrap nav").css({ padding: "0px 0px 8px" });
        } else {
          this.setState({ renderNav: false });

          $(".categoryCrumbz").hide();

          $(".restHeadCont").removeClass("bottom-shadow");

          $(".headerNav").css({
            backgroundColor: "#fff",
            transition: ".1s",
          });

          // $(".popNSuperCont").removeClass("popNSuperDescContSticky");
          $(".scrollspyNavParent").css("margin-top", "0px");
          // $(".headerWrap nav").css({ padding: "0px 0px" });
        }

        // scroll spy code - start
        jQuery.noConflict();

        let lastId;
        let offsetTop;
        let href;
        let topMenu = jQuery("#myScrollspy");
        let topMenuHeight = topMenu.outerHeight() - -80;

        // Get All list items as array
        let menuItems = topMenu.find("a");

        let scrollItems = menuItems.map(function () {
          let item = jQuery(jQuery(this).attr("href"));
          if (item.length) {
            return item;
          }
        });

        // Bind click handler to menu items
        // so we can get a fancy scroll animation
        menuItems.click(function (e) {
          href = jQuery(this).attr("href");
          offsetTop =
            href === "#" ? 0 : jQuery(href).offset().top - topMenuHeight;
          jQuery("html, body").stop().animate(
            {
              scrollTop: offsetTop,
            },
            20
          );
          e.preventDefault();
        });

        // Get id of current scroll item
        let cur = scrollItems.map(function () {
          if (
            jQuery(this).offset().top - topMenuHeight - 200 <
            window.scrollY
          ) {
            return this;
          }
        });

        // Get the id of the current element
        cur = cur[cur.length - 1];
        let id = cur && cur.length ? cur[0].id : "";

        if (lastId !== id) {
          lastId = id;
          // Set/remove active class
          menuItems
            .removeClass("active")
            .filter("[href='#" + id + "']")
            .addClass("active");
        }
        // scroll spy code - end
      });
    }
  }

  updateStoreList = () => {
    let cateogryData = {
      _id: getCookie("categoryId"),
    };

    this.callGetAllStoreList(this.state.selectedCategory);
   
  };
//navigate to restaurant
  RouteToRestaurant = (store, loaderCallback, props) => {
    // check if the category is different, clear the old cart
    if (
      this.props.myCart &&
      this.props.myCart.cart &&
      this.props.myCart.cart.length > 0 &&
      getCookie("storeType") != store.storeType
    ) {
      this.expireCart(store, "restaurant"); // calling the parent function to open cart reset dialog
      return;
    }

    // loaderCallback();
    NavigateToRestaurant(store);
  };
// navigate to  grocery store
  RouteToStore = (store, loaderCallback, props) => {
    // check if the category is different, clear the old cart
    if (
      this.props.myCart &&
      this.props.myCart.cart &&
      this.props.myCart.cart.length > 0 &&
      getCookie("storeType") &&
      getCookie("storeType") != store.storeType
    ) {
      this.expireCart(store, "store", this.state.selectedCategory._id); // calling the function to open cart reset dialog
      return;
    }

    // loaderCallback();
    NavigateToStore(store, this.state.selectedCategory._id);
  };
// if the cart is expire 
  expireCart = (storeData, type, categoryId) => {
    this.switchStoreRef.openDialog(storeData, type, categoryId);
  };

  handleGlobalOffers = (store) => {
    this.startTopLoader();
  
    switch (store.storeType) {
      case 1:
        this.RouteToRestaurant(store);
        break;
      default:
        this.RouteToStore(store);
        break;
    }
  };

  showLoginHandler = (isMobile) => {
    this.child.showLoginHandler(isMobile);
  };
  showLocationHandler = () => {
    this.child.showLocationHandler();
  };
  showLocationMobileHandler = (userLocation) => {
    // this.setState({ isLocationAvailable: userLocation }, () => {
    this.child.showLocationMobileHandler(userLocation);
    // });
  };
  showCart = () => {
    // if (this.props.isAuthorized) {
    this.cartRef.handleToggle();
    setCookie("cartOpen", true);
    // } else {
    //   this.showLoginHandler();
    // }
  };
  showSignUpHandler = () => {
    this.child.showSignUpHandler();
  };
  RouteBack = () => {
    Router.back();
  };

  handleHammburger = () => {
   
    // this.state.isAuthorized ? Router.push("/profile") : this.showLoginHandler(true);
    Router.push("/profile");
  };

  render() {
    const settings = {
      arrows: true,
      infinite: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3,
      afterChange: this.handleOfferPagination,
      beforeChange: this.testUpdate,
      responsive: [
        { breakpoint: 2000, settings: { slidesToShow: 4, slidesToScroll: 4 } },
        { breakpoint: 1600, settings: { slidesToShow: 4, slidesToScroll: 4 } },
        { breakpoint: 1300, settings: { slidesToShow: 4, slidesToScroll: 3 } },
        {
          breakpoint: 900,
          settings: {
            arrows: true,
            infinite: false,
            slidesToShow: 3,
            slidesToScroll: 3,
          },
        },
        { breakpoint: 550, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ,
        { breakpoint: 420, settings: { slidesToShow: 1, slidesToScroll: 1 } },
      ],
    };

    const settingsStoreType = {
      arrows: true,
      infinite: false,
      speed: 500,
      slidesToShow: 8,
      slidesToScroll: 3,
    };

    const settingsMobile = {
      arrows: true,
      infinite: false,
      speed: 500,
      slidesToShow: 2,
      slidesToScroll: 2,
    };

    const currencySymbol = this.state.getFilterList
      ? this.state.getFilterList.currencySymbol
      : "₹";

    const { selectedCategory } = this.state;
    let title = `${enVariables.APP_NAME} - `;
 
    return (
      <Wrapper>
        {/* setting up custom head tag for SEO html */}

        {/* <CustomHead
          description={enVariables.OG_DESC}
          ogImage={enVariables.OG_LOGO}
          title={enVariables.OG_TITLE}
        /> */}

        <Head>
          <title>{enVariables.OG_TITLE}</title>
          <meta name="title" content={enVariables.OG_TITLE} />
          <meta name="description" content={enVariables.OG_DESC} />

          <meta property="og:locale" content="en_US" />
          <meta property="og:type" content="article" />
          <meta property="og:title" content={enVariables.OG_TITLE} />

          <meta
            name="og_title"
            property="og:title"
            content={enVariables.OG_LOGO}
          />

          <meta property="og:description" content={enVariables.OG_DESC} />
          <meta property="og:url" content={enVariables.WEB_LINK} />
          <meta property="og:site_name" content={enVariables.WEB_LINK} />
          <meta property="article:publisher" content={enVariables.WEB_LINK} />

          <meta property="og:image" content={enVariables.OG_LOGO} />

          <meta property="og:image:width" content="512" />
          <meta property="og:image:height" content="512" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:description" content={enVariables.OG_DESC} />
          <meta name="twitter:title" content={enVariables.OG_TITLE} />
          {/* <meta name="twitter:site" content="@Real_CSS_Tricks" /> */}
          <meta name="twitter:image" content={this.state.dialogImage} />
          {/* <meta name="twitter:creator" content="@adamcoti" /> */}
        </Head>

        <div>
          {/* lapNDeskView */}
          <div className="lapNDeskView d-none d-lg-block">
            {/* sidePanel */}
            <div id="sidenav" className="sideBarWrapSec d-none d-lg-block">
              <ul className="nav flex-column sideBarWrapMainUL">
                <li className="nav-item">
                  <i className="fa fa-gift" />
                  <a className="nav-link promotions" href="#">
                    Promotions
                  </a>
                </li>
                <li className="nav-item">
                  <i className="fa fa-apple" />
                  <a className="nav-link" href="index.html">
                    restaurants
                  </a>
                </li>
                <li className="nav-item">
                  <i className="fa fa-shopping-basket" />
                  <a className="nav-link" href="fashion.html">
                    shops
                  </a>
                  <ul className="nav flex-column sideBarWrapSubUL sideBarWrapinnerSubUL">
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        markets
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        kiosk
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        farmacity
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link seeMoreSpl" href="#">
                        see more
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <i className="fa fa-apple" />
                  <a className="nav-link" href="#">
                    rappiFavour
                  </a>
                </li>
                <li className="nav-item border-top">
                  <ul className="nav flex-column sideBarWrapSubUL">
                    <li className="nav-item">
                      <i className="fa fa-list-ul" />
                      <a className="nav-link" href="#">
                        shopping list
                      </a>
                      <span className="newItemSpl">new</span>
                    </li>
                    <li className="nav-item">
                      <i className="fa fa-ellipsis-h" />
                      <a className="nav-link" href="#">
                        rappi prime
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        I want to be Rappitendero
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            {/* sidePanel */}

            <CartSlider
              onRef={(ref) => (this.cartRef = ref)}
              editCart={this.editCart}
            />
            <Authmodals
              key={"restaurants" + Math.random()}
              onRef={(ref) => (this.child = ref)}
              isAuthorized={this.state.isAuthorized}
              editCart={this.editCart}
              updateStoreList={this.updateStoreList}
            />
            {/* main header */}
            <MainPageHeader
              className="fixed-top"
              id="headerWrapID"
              hammburger={false}
              componentMounted={this.state.componentMounted}
              headerMobile={false}
              isAuthorized={this.state.isAuthorized}
              handleHammburger={this.handleHammburger}
              showLoginHandler={this.showLoginHandler}
              showLocationHandler={this.showLocationHandler}
              showLocationMobileHandler={this.showLocationMobileHandler}
              showCart={this.showCart}
              showSignUpHandler={this.showSignupHandler}
            >
              {/* the category type navigation links */}
              <CSSTransition
                in={this.state.renderNav}
                timeout={2000}
                classNames="stickeyHeader"
                unmountOnExit
              >
                <div className="row justify-content-center categoryCrumbz">
                  <div className="col pb-2 pt-1 restHeadLinks">
                    <ul className="nav homeNavUL">
                      {this.state.categoryList && this.state.categoryList.data
                        ? this.state.categoryList.data.map((category, index) =>
                            !NotAllowedCategories.includes(
                              category.categoryName
                            ) ? (
                              <li
                                onClick={() => this.onChangeCategory(category)}
                                key={"restClist" + index}
                                className="nav-item"
                              >
                               
                                <a
                                  className={
                                    this.state.selectedCategory &&
                                    this.state.selectedCategory._id ==
                                      category._id
                                      ? "nav-link active"
                                      : "nav-link"
                                  }
                                  style={{ color: "#3d4152", fontSize: "16px" }}
                                >
                                  {category.categoryName}
                                </a>
                              </li>
                            ) : (
                              ""
                            )
                          )
                        : ""}
                    </ul>
                  </div>
                </div>
              </CSSTransition>
              {/* the category type navigation links */}
            </MainPageHeader>
            {/* main header */}

            <div className="headerWrapMarginFix clearfix" />

            {/* contentWrap */}
            <div className="contentWrap" id="contentWrapID">
              <div className="col-12">
                {/* categorySliderSec */}
                <div className="row my-4">
                  {this.state.categoryList &&
                  this.state.categoryList.data &&
                  this.state.categoryList.data.length > 1 ? (
                    <div className="col-12 storeCategoryList">
                      <div className="row justify-content-center">
                        <div className="col-xl-12 col-lg-12 categorySlider restPageCatSlider">
                          <Slider {...settingsStoreType}>
                            {this.state.categoryList &&
                            this.state.categoryList.data
                              ? this.state.categoryList.data.map(
                                  (category, index) =>
                                    !NotAllowedCategories.includes(
                                      category.categoryName
                                    ) ? (
                                      <div key={"restCat" + index}>
                                        <div
                                          onClick={() =>
                                            this.onChangeCategory(category)
                                          }
                                          style={{ cursor: "pointer" }}
                                          className={
                                            category._id ===
                                            this.state.selectedCategory._id
                                              ? "col-12 category active "
                                              : "col-12 category"
                                          }
                                        >
                                          <div
                                            className="col mobLpSecCatSec newStyleContainer"
                                            style={{
                                              backgroundColor:
                                                "#" + category.colorCode,
                                              borderRadius: "10px",
                                            }}
                                          >
                                            <div
                                              className="row"
                                              style={{ padding: "8px 0" }}
                                            >
                                              <div className="col-12 p-0">
                                                <div
                                                  className="mobLpSecCatSecInner"
                                                  style={{
                                                    padding: "0px 15px",
                                                  }}
                                                >
                                                  <img
                                                    style={{
                                                      background: "transparent",
                                                    }}
                                                    src={category.bannerImage}
                                                    width="80"
                                                    height="80"
                                                    className="rounded-circle"
                                                    alt="pop icon"
                                                    style={{
                                                      maxWidth: "100%",
                                                      height: "60px",
                                                      margin: "auto",
                                                    }}
                                                  />
                                                </div>
                                              </div>

                                              <div className="col-12 p-0">
                                                <div
                                                  className="mobLpSecCatSecInner"
                                                  style={{ padding: "15px" }}
                                                >
                                                  <h5 className="storeTypeHeader">
                                                    {category.categoryName}
                                                  </h5>
                                                  {/* <div className="mobLpSecSubCatTitle">
                                                  <span className="">
                                                    {category.categoryName || category.typeName}
                                                  </span>
                                                </div> */}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      ""
                                    )
                                )
                              : ""}
                          </Slider>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                {/* categorySliderSec */}

                {/* offersSliderSec */}
                {(this.state.offerList && this.state.offerList.length > 0) ||
                this.state.offerListLoading ? (
                  <div className="row">
                    <div className="col-12 categorySliderSec">
                      <div className="row justify-content-center">
                        <div
                          className="col-xl-12 col-lg-12 categorySlider mainPageOfferList"
                          id="mainPageOfferList"
                        >
                          {this.state.offerList &&
                          this.state.offerList.length > 0 ? (
                            <Slider {...settings}>
                              {this.state.offerList.map((offer, index) => (
                                // <Link
                                //   key={"offerIndex" + index}
                                //   href={`/offers?offerId=${offer._id}&type=2`}
                                //   as={`/offers/${offer.name
                                //     .replace(/%/g, "percentage")
                                //     .replace(/,/g, "")
                                //     .replace(/& /g, "")
                                //     .replace(/ /g, "-")}`}
                                // >
                                <a
                                  className="d-block"
                                  onClick={this.handleGlobalOffers.bind(
                                    this,
                                    offer
                                  )}
                                >
                                  {/* <div key={"offer" + index} title={offer.name} className="offerImages" style={{ backgroundImage: `url(/static/images/new_imgs/offerDummy.png)` }}> */}
                                  <div
                                    key={"offer" + index}
                                    title={offer.name}
                                    className="offerImages"
                                    style={{
                                      backgroundImage: `url(${offer.images.image})`,
                                    }}
                                  >
                                    {/* <div key={"offer" + index} title={offer.name} className="offerImages" style={{ backgroundImage: `url(https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_520,h_520/marketing-dashboard/carousel/vop86ndkxtu5ql3tkzlj)` }}> */}
                                    {/* <img
                                          // width="240"
                                          // height="240"
                                          src={offer.images.image}
                                          alt="Beverages"
                                          title={offer.name}
                                        /> */}
                                    <p className="offerMainCaption">
                                      {offer.name}
                                    </p>
                                  </div>
                                </a>
                                // </Link>
                              ))}
                            </Slider>
                          ) : (
                            <Wrapper>
                              <div className="row justify-content-center text-center">
                                <div className="circle-loader-small" />
                                <img
                                  className="loader-image"
                                  src="/static/foodImages/icecream_wwomsa.webp"
                                />
                              </div>
                              <div className="row justify-content-center text-center">
                                <div className="loader-text">
                                  Looking for{" "}
                                  {this.state.selectedCategory
                                    ? this.state.selectedCategory.categoryName
                                    : "food"}{" "}
                                  near you ...
                                </div>
                              </div>
                            </Wrapper>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {/* offersSliderSec */}

                {/* popNSuper
                <div className={"row popNSuperCont"}>
                  <div className="col-12 popNSuperSec">
                    <div className="row justify-content-center">
                      <div className="col-xl-12 col-lg-12 px-5">
                        <div className="row justify-content-between align-items-center">
                          <div className="col-6">
                            <div className="row align-items-center">
                              <div className="col-auto pl-0">
                                <img
                                  src="/static/foodImages/ezgif.com-webp-to-jpg (4).jpg"
                                  width="60"
                                  height="60"
                                  className="img-fluid rounded-circle"
                                  alt="pop icon"
                                />
                              </div>
                              <div className="col px-0">
                                <h3 className="popNSuperH3Title">
                                  Introducing {enVariables.APP_NAME}
                                </h3>
                                <p className="popNSuperDesc">
                                  The all in one delivery solution by {enVariables.APP_NAME}
                                </p>
                              </div>
                              <div className="col-xl-4 col-lg-auto col-4 text-center">
                                <button className="btn btn-default">
                                  order now
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="row align-items-center">
                              <div className="col-auto">
                                <img
                                  src="/static/foodImages/ezgif.com-webp-to-jpg (1).jpg"
                                  width="60"
                                  height="60"
                                  className="img-fluid rounded-circle"
                                  alt="pop icon"
                                />
                              </div>
                              <div className="col px-0">
                                <h3 className="popNSuperH3Title">
                                  Introducing {enVariables.APP_NAME} Favor
                                </h3>
                                <p className="popNSuperDesc">
                                  Get anything delivered using our delivery
                                  fleet.
                                </p>
                              </div>
                              <div className="col-xl-4 col-lg-auto col-4 text-center">
                                <button className="btn btn-default">
                                  REQUEST NOW
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                {/* popNSuper */}

                {/* render restaurants if type is 1, else render store cards */}

                {this.state.componentMounted ? (
                  this.state.selectedCategory.type == 1 ? (
                    <div class="container-fluid">
                      <div class="row" style={{ paddingLeft: 15 }}>
                        <nav class="col-auto homeRestScrollSpy">
                          <RestaurantList
                            subCategoryList={this.state.getFilterList.webData}
                          />
                        </nav>

                        <div className="col-sm col-8 testNavCont pr-0">
                          <div
                            className="scrollspyMainCont"
                            style={{ marginTop: "40px", marginLeft: "20px" }}
                          >
                            {this.state.getFilterList &&
                            this.state.getFilterList.webData
                              ? this.state.getFilterList.webData.map(
                                  (category) => (
                                    <section
                                      key={
                                        "RestaurantMobile" + category.subCatName
                                      }
                                      id={category.subCatName.replace(
                                        /\s+/g,
                                        ""
                                      )}
                                      className="section1"
                                    >
                                      <RestaurantSection
                                        category={category}
                                        categoryId={
                                          this.state.selectedCategory._id
                                        }
                                        zoneId={this.props.zoneId}
                                        currencySymbol={currencySymbol}
                                        startTopLoader={this.startTopLoader}
                                        expireCart={this.expireCart}
                                        myCart={this.props.myCart}
                                      />
                                    </section>
                                  )
                                )
                              : ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="row justify-content-center">
                      <div className="col-xl-12 col-12 px-4">
                        <div className="row scrollspyNavParent px-4">
                          <div className="col-12 popularBrandsSec">
                            <div className="row align-items-center">
                              {" "}
                              {/* style={{ justifyContent: "space-between" }} */}
                              {this.state.storeList &&
                              this.state.storeList.length > 0 ? (
                                this.state.storeList.map(
                                  (restaurant, index) => (
                                    <StoreCard
                                      type={2}
                                      className={"col-md-3 col-xl-3 my-4"}
                                      key={"StoreCard" + index}
                                      restaurant={restaurant}
                                      loading={this.state.offerListLoading}
                                      categoryId={
                                        this.state.selectedCategory._id
                                      }
                                      startTopLoader={this.startTopLoader}
                                      expireCart={this.expireCart}
                                      myCart={this.props.myCart}
                                    />
                                  )
                                )
                              ) : (
                                <div className={"NoStoresCont"}>
                                  <img
                                    height="110"
                                    className="m-3"
                                    src={enVariables.EMPTY_STORE}
                                  />
                                  <p>
                                    No Nearby Stores Found for{" "}
                                    {this.state.selectedCategory
                                      ? this.state.selectedCategory.categoryName
                                      : ""}
                                    !
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="row mt-5">{cardLoader()}</div>
                )}
              </div>
            </div>
          </div>

          {/* mobNTabView */}
          <div className="mobNTabView d-block d-lg-none">
            <CategoryList
              categoryList={this.state.categoryList}
              handleHammburger={this.handleHammburger}
              showLocationMobileHandler={this.showLocationMobileHandler}
              isCategoryLoading={this.state.isCategoryLoading}
            />
          </div>
          {/* mobNTabView */}

          <div className="row mobile-hide">
            <div
              style={{ background: "#fff" }}
              className="col-12 py-md-5 productDetailAddressSec"
            >
              <Footer />
            </div>
          </div>
        </div>
        <TopLoader onRef={(ref) => (this.TopLoader = ref)} />

        {/* <ExpireCartDialog onRef={ref => (this.expRef = ref)} /> */}

        <SwitchStoreDialog onRef={(ref) => (this.switchStoreRef = ref)} />

        <ExpireCartDialog onRef={(ref) => (this.expRef = ref)} />
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    reduxState: state,
    locErrStatus: state.locErrStatus,
    locErrMessage: state.locErrMessage,
    userProfileDetail: state.userProfile,
    notifications: state.notifications,
    stateLat: state.lat,
    stateLong: state.long,
    myCart: state.cartList,
    selectedLang: state.selectedLang,
  };
};

export default connect(mapStateToProps)(Index);
