import React from "react";
import { Component } from "react";
import { connect } from "react-redux";

import $ from "jquery";
import * as actions from "../actions";
import Router from "next/router";
import Link from "next/link";
import { setCookie, getCookiees, getCookie } from "../lib/session";

import Header from "../components/FoodTheme/Header/header";

import Wrapper from "../hoc/wrapperHoc";
import {
  storeFilterParameters,
  storeWiseProductSuggestions
} from "../services/filterApis";
import * as enVariables from "../lib/envariables";
import fetch from "isomorphic-unfetch";
import BreadCrumbs from "../components/FoodTheme/Header/breadcrumb";
import RestaurantHeader from "../components/FoodTheme/Header/restaurantHeader";
import RestaurantHeaderMobile from "../components/FoodTheme/Header/restaurantHeaderMobile";
import FoodCard from "../components/FoodTheme/Cards/foodCard";
import FoodCardMobile from "../components/FoodTheme/Cards/foodCardMobile";
import FoodCategories from "../components/FoodTheme/RestaurantSection/categories";
import FoodCategoriesMobile from "../components/FoodTheme/RestaurantSection/categoriesMobile";
import Footer from "../components/footer/Footer";
import AddOnDialog from "../components/FoodTheme/Dialog/addOnDialog";
import EditAddOns from "../components/FoodTheme/Dialog/editAddOn";
import AddOnSlider from "../components/FoodTheme/Dialog/addOnSlider";
import Authmodals from "../components/authmodals";
import OptionsDialog from "../components/FoodTheme/Dialog/optionsDialog";
import OptionsDialogMobile from "../components/FoodTheme/Dialog/optionsDialogMobile";
import {
  getFilterParams,
  searchFilterParams,
  sortFilterParams
} from "../services/filterApis";
import FoodListCard from "../components/FoodTheme/Cards/foodListCard";
import ExpireCartDialog from "../components/dialogs/expireCart";
import "../assets/style.scss";
import "../assets/login.scss";
import { multiStoreCartCheck } from "../lib/multiStoreCartCheck";
import FoodCartButtons from "../components/FoodTheme/Cart/CartButtons";
import { addToCartExFunc } from "../lib/cart/addToCart";
import CustomHead from "../components/html/head";
import CategoryHomeHeader from "../components/header/categoryHomeHeader";
import MainPageHeader from "../components/header/mainPageHeader";
import BottomDrawer from "../components/ui/sliders/bottomDrawer";
import CartFooter from "../components/cart/cartFooter";
import { RouteToDetails } from "../lib/navigation/navigation";
import eventAvailable from "material-ui/svg-icons/notification/event-available";

const RouteToRestaurant = (store, loaderCallback) => {
  setCookie("storeId", store.storeId);
  setCookie("dlvxCartLmt", store.cartsAllowed);
  setCookie("storeType", store.storeType);
  // loaderCallback();

  if (store.storeType == "1") {
    Router.push(
      `/restofront?id=${store.storeId}`,
      `/restaurant/${(store.storeName || store.businessName)
        .replace(/%20/g, "")
        .replace(/,/g, "")
        .replace(/&/g, "")
        .replace(/ /g, "-")}`
    ).then(() => window.scrollTo(0, 0));
  } else {
    let storeName = store.storeName
      .replace(/,/g, "")
      .replace(/& /g, "")
      .replace(/ /g, "-");
    Router.push(`/stores/${storeName}`);
  }
};

class Index extends Component {
  lang = this.props.lang;
  static async getInitialProps({ ctx }) {
    let token = getCookiees("token", ctx.req);
    let lat = getCookiees("lat", ctx.req);
    let lng = getCookiees("long", ctx.req);
    let zoneID = getCookiees("zoneid", ctx.req);
    const queries = ctx.query;

    let storeId = queries.id || getCookiees("storeId", ctx.req);

    const getCategory = await fetch(
      enVariables.API_HOST +
        `/business/product/${zoneID}/${storeId}/${"2019-01-30 15:22:33"}/${lat}/${lng}/${"0/1000"}`,
      {
        method: "get",
        headers: {
          language: "en",
          "content-type": "application/json",
          authorization: token
        }
      }
    );

    const getCategoryList = await getCategory.json();
    const isAuthorized = await getCookiees("authorized", ctx.req);

    return { getCategoryList, isAuthorized, storeId, zoneID };
  }

  state = {
    sortedProducts: [],
    componentMounted: false,
    isAuthorized: false,
    searchQuery: "",
    searchData: [],
    sortedSearchData: [],
    breadCrumbData: [],
    noProductsError: null,
    stickyHeader: false,
    menuOpen :false,
  };

  constructor(props) {
    super(props);
    this.openAddOnDialog = this.openAddOnDialog.bind(this);
    this.openOptionsDialog = this.openOptionsDialog.bind(this);
    this.OnChangeSearch = this.OnChangeSearch.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.reduxState.userName !== this.props.reduxState.userName) {
      this.setState({ isAuthorized: this.props.reduxState.authorized });
    }
  }
  handleMenu =()=>{
    this.setState({menuOpen:!this.state.menuOpen})
  }
  // for the mobile menu option
  scrollToSection=(type)=>{
   
    
     $('html, body').animate({
            scrollTop: $(`${type}`).offset().top - 100
          
       }, 100);

   }
  componentWillMount() {
    this.setState({
      isAuthorized:
        this.props.isAuthorized || this.props.reduxState.authorized || false
    });
  }

  componentWillUnmount = () =>
    window.removeEventListener("scroll", this.handleScroll);

  showLoginHandler = isMobile => {
    this.child.showLoginHandler(isMobile);
  };
  showLocationHandler = () => {
    this.child.showLocationHandler();
  };
  showLocationMobileHandler = () => {
    this.child.showLocationMobileHandler();
  };
  showSignUpHandler = () => {
    this.child.showSignUpHandler();
  };
  showCart = () => {
    this.child.showCart();
  };
  RouteBack = () => {
    Router.back();
  };

  addToCart = (data, event) => {
   

    event ? event.stopPropagation() : ""; // chek of the event object is available

    let cartData;
    this.state.isAuthorized
      ? ((cartData = {
          childProductId: data.childProductId,
          unitId: data.unitId,
          quantity: parseFloat(1).toFixed(1),
          storeType: getCookie("storeType"),
          addOns: []
        }),
        // check multicart auth
        addToCartExFunc(this.props.myCart)
          .then(() => {
            this.setState({ cartLoadProdId: data.childProductId });
            this.props.dispatch(actions.initAddCart(cartData));
            setTimeout(() => {
              this.setState({ cartLoadProdId: null });
            }, 1500);
          })
          .catch(() => {
            this.props.dispatch(actions.expireCart(true, cartData)); // expire cart action for opening cart option dialog
          }))
      : this.showLoginHandler(window.innerWidth < 576 ? true : false); // pass true if the request from mobile size devices, else false.
  };

  // checkForMultipleStore(store) {
  //   if (
  //     this.props.myCart &&
  //     this.props.myCart.cart &&
  //     this.props.myCart.cart[0].storeId
  //   ) {
  //     if (this.props.myCart.cart[0].storeId == store) {
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   } else {
  //     return false;
  //   }
  // }

  openBottomSearch = () => {
    // this.clearStoreSearchResult();
    this.BottomSearch.openDrawer();
    setTimeout(() => {
      document.getElementById("searchBoxMV-rest").focus();
    }, 200);
  };
// validate through minimum order value
  setDeliveryType = () => {
    this.props.dispatch(actions.deliveryType(1));
    // Router.push("/checkout");
    this.verifyMinimuOrderCheck();
  };

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
        `${this.lang.minimamOrderValue ||
          "The minimum order value is $"} ${minAmount} ${this.lang.for ||
          "for"} ${storeName}. ${this.lang.addRs || "Add $"} ${minAmount -
          storeCurrentTotal} ${this.lang.validOrder || "to be able to order"}.`
      );
      return;
    }

    Router.push("/checkout").then(() => window.scrollTo(0, 0));
  };

  editCart = (cartDetail, products, type, event) => {
  
    event ? event.stopPropagation() : "";
    let editCartData = {
      cartId: this.props.reduxState.cartList.cartId,
      childProductId: cartDetail.childProductId,
      unitId: cartDetail.unitId
    };
    type == 1
      ? (editCartData["quantity"] = cartDetail.quantity - 1)
      : (editCartData["quantity"] = cartDetail.quantity + 1);

    this.props.dispatch(actions.editCard(editCartData));
  };
//render initial data
  renderData = async (productList, arrayName) => {
    let Category = {};
    let CatArray = [];

    for (let i = 0; i < productList.length; i++) {
      let item = productList[i];

      if (typeof Category[item.firstCategoryId] == "undefined") {
        Category[item.firstCategoryId] = {
          id: item.firstCategoryId,
          name: item.catName.en,
          subCat: {}
        };
      }

      if (
        typeof Category[item.firstCategoryId]["subCat"][
          item.secondCategoryId
        ] == "undefined"
      ) {
        Category[item.firstCategoryId]["subCat"][item.secondCategoryId] = {
          id: item.secondCategoryId,
          name: item.subCatName.en,
          product: []
        };
      }

      await Category[item.firstCategoryId]["subCat"][item.secondCategoryId][
        "product"
      ].push(item);
    }

    CatArray = await Object.keys(Category).map(item => {
      Category[item].subCat = Object.keys(Category[item].subCat).map(item1 => {
        return Category[item].subCat[item1];
      });
      return Category[item];
    });

    await this.setState({ [arrayName]: CatArray });

 
  };

  componentDidMount() {
    

    this.props.getCategoryList &&
    this.props.getCategoryList.data &&
    this.props.getCategoryList.data.products
      ? this.renderData(
          this.props.getCategoryList.data.products,
          "sortedProducts"
        )
      : "";

    let sid = getCookie("sid");
    let mqttTopic = localStorage.getItem("dlvMqtCh");
    this.child.mqttConnector(sid, mqttTopic);

    $(document).ready(() => {
      this.setState({ componentMounted: true });
      //position sticky
      let windowWidth = $(window).width();
      if (windowWidth >= 992) {
        $(window).scroll(() => {
          let scrollPos = $(window).scrollTop();
          let breadCrumbsSec = $(".breadCrumbsSec");
          let breadCrumbsSecHeight = breadCrumbsSec.outerHeight();
          let prodDetHeaderNav = $("#headerWrapID");
          let prodDetHeaderNavHeight = prodDetHeaderNav.outerHeight();
          let productDetailTitleSecID = $("#productDetailTitleSecID");

          let productDetailTitleSecIDTop;
          productDetailTitleSecID.length
            ? (productDetailTitleSecIDTop = productDetailTitleSecID.offset()
                .top)
            : "";

          let productDetailTitleSecIDHeight = productDetailTitleSecID.outerHeight();

          let limit_productDetailTitleSecID =
            prodDetHeaderNavHeight + breadCrumbsSecHeight;

          let listExampleID = $("#restHomeSpy");
          let listExampleIDTop;
          listExampleID.length
            ? (listExampleIDTop = listExampleID.offset().top)
            : "";

          let productDetailSrlSpyMain = $(".productDetailSrlSpyMain");
          let productDetailAddressSecTop;
          productDetailSrlSpyMain.length
            ? (productDetailAddressSecTop = $(
                ".productDetailAddressSec"
              ).offset().top)
            : "";

          let listExampleIDHeight = listExampleID.outerHeight();
          let limit_ListExampleID =
            productDetailAddressSecTop - listExampleIDHeight;
          if (scrollPos > limit_productDetailTitleSecID) {
            productDetailTitleSecID.css({
              position: "fixed",
              top: 0,
              paddingTop: "15px",
              paddingBottom: "15px",
              transition: "0.2s"
            });
            // $("#productTitleAllInOneRowID").hide();
            $(".productTitleDetailsSearchFilters").css({ bottom: -13 });
            $(".popularBrandItemImgRepClsImg").css({ height: "120px" });
            $(".popularBrandItemImgRepClsImg").addClass(
              "popularBrandItemImgSticky"
            );
            // $("#productTitleAllInOneRowID").css({ marginBottom: "30px" });
            $("#productTitleAllInOneRowID").addClass("stickyDullClass");
            $(".productTitleDetailsSearchFilters").css(
              "transform",
              "translate3d(0,30px,0)"
            );
            // $(".productTitleH1").css({ marginBottom: "30px" });
            $(".cartProducts").fadeIn();
            $(".productTitleP").hide();
            $(".productTitleAllInOneP").hide();
            $("#restHomeSpy, .productDetailSrlSpyCartFixed").css({
              position: "fixed",
              top: productDetailTitleSecIDHeight + 30
            });
            productDetailSrlSpyMain.css({
              marginTop: productDetailTitleSecIDHeight + 30
            });
            $(".productDetailSrlSpyCartFixed").css({
              position: "fixed",
              marginTop: 10,
              maxWidth: "300px"
            });
          } else {
            productDetailTitleSecID.css({
              position: "static",
              paddingTop: "40px",
              paddingBottom: "40px"
            });
            // $("#productTitleAllInOneRowID").show();
            $(".productTitleP").show();
            // $(".cartProducts").hide();
            $(".productTitleH1").css({ marginBottom: "2px" });
            $(".productTitleDetailsSearchFilters").css({ bottom: -55 });
            $(".popularBrandItemImgRepClsImg").css({ height: "160px" });
            $("#restHomeSpy, .productDetailSrlSpyCartFixed").css({
              position: "static",
              top: 0
            });
            productDetailSrlSpyMain.css({ marginTop: 0 });
            $(".productDetailSrlSpyCartFixed").css({
              position: "static",
              top: 0
            });
            $(".productTitleAllInOneP").show();

            $(".popularBrandItemImgRepClsImg").removeClass(
              "popularBrandItemImgSticky"
            );
            $("#productTitleAllInOneRowID").removeClass("stickyDullClass");
          }

          if (scrollPos > limit_ListExampleID) {
            let diff_limit_ListExampleID = limit_ListExampleID - scrollPos;
            $("#restHomeSpy, .productDetailSrlSpyCartFixed").css({
              top: diff_limit_ListExampleID
            });
          }

          let topMenu = jQuery("#restHomeSpy");
          let topMenuHeight = topMenu.outerHeight() - -80;
          // All list items
          let menuItems = topMenu.find("a");

          // Bind click handler to menu items
          // so we can get a fancy scroll animation
          // menuItems.click(function (e) {
          //   // menuItems.map((item) => {
          //   //   $(item).removeClass("active")
          //   // })
          //   var href = jQuery(this).attr("href"),
          //     offsetTop = href === "#" ? 0 : jQuery(href).offset().top - topMenuHeight;
          //   jQuery('html, body').stop().animate({
          //     scrollTop: offsetTop
          //   }, 20);
          //   e.preventDefault();
          // });
        });
      }

      let store =
        this.props.getCategoryList && this.props.getCategoryList.data
          ? this.props.getCategoryList.data
          : null;

      if (store) {
        
        setCookie("storeId", store.storeId || store.businessId);
        // setCookie("dlvxCartLmt", store.cartsAllowed);
      }
    });

    // get the target DOM elements
    let mobileHeader = document.getElementById("mobileHeaderRest"); // header
    let mobileMainSection = document.getElementById("mobileMainSection"); // storeList main

    // add margin - y to "storeList main" based on header height
    mobileMainSection.style.marginTop = 10 + mobileHeader.clientHeight + "px";
    mobileMainSection.style.marginBottom = mobileHeader.clientHeight + "px";

    setTimeout(() => {
      this.props.isAuthorized
        ? (this.props.dispatch(actions.getCart()),
          this.props.dispatch(actions.getProfile()))
        : "";
    }, 2000);

    window.addEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    this.prev = window.scrollY;

    this.prev > 60
      ? !this.state.stickyHeader
        ? this.setState({ stickyHeader: true })
        : ""
      : this.state.stickyHeader
      ? this.setState({ stickyHeader: false })
      : "";
  };

  openAddOnDialog(addons, event) {
    event ? event.stopPropagation() : "";

    this.state.isAuthorized
      ? this.dialogRef.openProductDialog(addons)
      : this.showLoginHandler();
  }

  closeBottomSearch = () => {
    // this.clearStoreSearchResult();
    this.BottomSearch.closeDrawer();
  };

  openEditAddOnDialog(cartProduct) {
    this.editRef.openProductDialog(cartProduct);
  }

  openAddOnSlider = (addons, event) => {
    event ? event.stopPropagation() : "";

    // check if the user is authenticated
    this.state.isAuthorized
      ? this.sliderRef.openProductDialog(addons)
      : this.showLoginHandler(true);
  };

  handleDetailToggle = product => {
    // RouteToDetails(product);
  };

  openOptionsDialog(product, type, event) {
   
    event ? event.stopPropagation : "";
    product.addOnAvailable > 0
      ? this.optionRef.openOptionsDialog(product)
      : this.editCart(product, "", type);
  }

  openOptionsDialogMobile = (product, type, event) => {
    event ? event.stopPropagation() : "";
    product.addOnAvailable > 0
      ? this.optionRefMob.openOptionsDialog(product)
      : this.editCart(product, "", type);
  };

  toggleMenu() {
    var sidenav = document.getElementById("sidenav");
    var contentWrapID = document.getElementById("contentWrapID");
    sidenav.classList.toggle("sidenavWidth");
  }

  getProducts() {
    let query = {
      match_phrase_prefix: { "productname.en": this.state.searchQuery }
    };
    searchFilterParams(
      0,
      0,
      10,
      this.props.storeId,
      this.props.zoneID,
      false,
      query
    )
      .then(
        ({ data }) => {
          this.setState({
            searchData: data.data.products,
            noProductsError: false
          });
         
         
        },
        error => {
         
          this.setState({ searchData: [], noProductsError: true });
        }
      )
      .catch(err => {});
  }

  OnChangeSearch = e => {
  
    e.target.value.length < 1
      ? this.setState({
          searchData: [],
          searchQuery: e.target.value,
          noProductsError: false
        })
      : // this.state.searchQuery.length < e.target.value.length
        //   ?
        this.setState({ searchQuery: e.target.value }, () => {
          this.state.searchQuery.length > 0 ? this.getProducts() : "";
        });
    // : this.setState({ searchQuery: e.target.value }, () => {
    //   this.getProducts();
    // });
  };

  openSearchBar() {
    Router.push("/restoSearch").then(() => window.scrollTo(0, 0));
  }

  searchProducts = e => {
    this.setState(
      {
        searchingValue: e.target.value,
        trendySearch: false,
        noProductsError: false
      },
      () => {
        this.state.searchingValue.length > 0
          ? this.getSearchResult(this.state.searchingValue)
          : "";
      }
    );
  };

  getSearchResult = searchString => {
    storeWiseProductSuggestions(
      0,
      50,
      this.props.zoneID,
      searchString,
      this.props.categoryId,
      this.props.categoryType,
      this.props.lat,
      this.props.lng
    )
      .then(
        ({ data }) => {
          this.setState({ searchData: data }, () => {
           
          });
        },
        error => {
          
          this.setState({
            searchData: [],
            noProductsError: this.props.noProduct || "No Items Found !"
          });
        }
      )
      .catch(err => {});
  };

  render() {
   
    const currencySymbol =
      this.props.getCategoryList && this.props.getCategoryList.data
        ? this.props.getCategoryList.data.currencySymbol
        : "€";
    let store =
      this.props.getCategoryList && this.props.getCategoryList.data
        ? this.props.getCategoryList.data
        : "Restaurant";

    let title = `${enVariables.APP_NAME} - `;

    return (
      <Wrapper>
        {/* setting up custom head tag for SEO html */}
        {store && store.businessName ? (
          <CustomHead
            // title={store && store.businessName ? title + store.businessName : title + store}
            description={
              store && store.businessName
                ? enVariables.ORDER_FOOD +
                  store.businessName +
                  " " +
                  store.businessAddress +
                  " " +
                  enVariables.ORDER_FOOD_SUBLINE
                : enVariables.ORDER_FOOD + title + store
            }
            ogImage={store && store.businessImage ? store.businessImage : null}
            title={
              store && store.businessName
                ? store.businessName + " | " + this.lang.homeDelivery ||
                  "Home Delivery" + " | " + this.lang.orderOnline ||
                  "Order Online" + " | " + store.businessAddress
                : ""
            }
            // url={this.state.selfPath}
          />
        ) : (
          ""
        )}

        <div className="lapNDeskView d-none d-lg-block">
          <MainPageHeader
            id="headerWrapID"
            hammburger={false}
            componentMounted={this.state.componentMounted}
            handleHammburger={this.handleHammburger}
            headerMobile={false}
            isAuthorized={this.state.isAuthorized}
            stickyHeader={this.state.stickyHeader}
            showLoginHandler={this.showLoginHandler}
            isAuthorized={this.state.isAuthorized}
            showLocationHandler={this.showLocationHandler}
            showLocationMobileHandler={this.showLocationMobileHandler}
            showSignUpHandler={this.showSignupHandler}
            hideSideMenu={() => this.hideSideMenu()}
            showSideMenu={() => this.showSideMenu()}
            selectedLang={this.props.selectedLang}
            showCart={this.showCart}
            // stores={this.props.stores.data}
            selectedStore={this.props.selectedStore}
            deleteAllCookies={this.deleteAllCookies}
            cartProducts={this.props.cartProducts}
          ></MainPageHeader>

          {/* <Header
            className=""
            id="prodDetHeaderNav"
            hammburger={false}
            componentMounted={this.state.componentMounted}
            headerMobile={false}
            isAuthorized={this.state.isAuthorized}
            showLoginHandler={this.showLoginHandler}
            showLocationHandler={this.showLocationHandler}
            showLocationMobileHandler={this.showLocationMobileHandler}
            showCart={this.showCart}
            showSignUpHandler={this.showSignupHandler}
          /> */}

          <div className="col-12 productDetailSec">
            {/* breadCrumb component */}
            <BreadCrumbs store={this.props.getCategoryList.data} />

            {/* restaurant title component  */}
            <RestaurantHeader
              store={this.props.getCategoryList.data}
              OnChangeSearch={this.OnChangeSearch}
              searchQuery={this.state.searchQuery}
              currencySymbol={currencySymbol}
              locale={this.props.lang}
            />

            {/* productDetailSrlSpySec  */}
            <div className="row">
              <div className="col-12 productDetailSrlSpySec">
                <div className="row justify-content-center">
                  <div className="col cusWidthImpClsComm py-xl-5 pt-5">
                    <div className="row">
                     {/* all the categories  */}
                      <div
                        className="col-auto pr-lg-0 list-group productDetailSrlSpyListGroup"
                        id="restHomeSpy"
                        style={{ paddingTop: "22px" }}
                      >
                        {this.state.searchData.length > 0 ? (
                          <a
                            className="list-group-item list-group-item-action"
                            href="#searchData"
                          >
                            {this.lang.searchResult || "Search Results"}
                          </a>
                        ) : (
                          ""
                        )}
                        <a
                          className="list-group-item list-group-item-action"
                          href="#recommended"
                        >
                          {this.lang.recommended || "Recommended"}
                        </a>
                        {this.state.sortedProducts.length > 0
                          ? this.state.sortedProducts.map(category => (
                              <a
                                key={"categoryName " + category.name}
                                className="list-group-item list-group-item-action"
                                href={
                                  "#" + category.name.replace(/[^A-Za-z]/g, "")
                                }
                              >
                                {category.name}
                              </a>
                            ))
                          : ""}
                      </div>

                      <div className="col-auto ml-auto productDetailSrlSpyMain scrollspy-example">
                        <div className="row">
                          <div className="col-lg-7 mx-auto">
                            {this.state.searchData.length > 0 ? (
                              <div id="searchData">
                                <div className="row">
                                  <div className="col-12">
                                    <div className="productDetailSrlSpyItemsList">
                                      <h4 className="productDetailSrlSpyH4Title">
                                        {this.lang.searchResult ||
                                          "Search Results"}
                                      </h4>
                                   
                                      <div>
                                        {this.state.searchData.map(product => (
                                          <FoodListCard
                                            product={product}
                                            addToCart={this.addToCart}
                                            editCart={this.editCart}
                                            openAddOnDialog={
                                              this.openAddOnDialog
                                            }
                                            openOptionsDialog={
                                              this.openOptionsDialog
                                            }
                                            cartProducts={
                                              this.props.cartProducts
                                            }
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                            <div id="recommended">
                              <div className="row">
                                <div className="col-12">
                                  <div className="productDetailSrlSpyItemsList">
                                    <h4 className="productDetailSrlSpyH4Title">
                                      {this.lang.recommended || "Recommended"}
                                    </h4>
                                    <p className="productDetailSrlSpyPTitle">
                                      {this.props.getCategoryList &&
                                      this.props.getCategoryList.data &&
                                      this.props.getCategoryList.data
                                        .recomendedProducts
                                        ? this.props.getCategoryList.data
                                            .recomendedProducts.length +
                                          " items"
                                        : 0 + " item"}
                                    </p>

                                    <div className="row">
                                      <div className="col-12">
                                    {/* recommended products */}
                                        <div className="row productDetailSrlSpyItemsListInner justify-content-center justify-content-sm-start">
                                          {this.props.getCategoryList &&
                                          this.props.getCategoryList.data &&
                                          this.props.getCategoryList.data
                                            .recomendedProducts
                                            ? this.props.getCategoryList.data.recomendedProducts.map(
                                                (product, index) => (
                                                  <FoodCard
                                                    key={"FoodCard " + index}
                                                    product={product}
                                                    currencySymbol={
                                                      currencySymbol
                                                    }
                                                    openAddOnDialog={
                                                      this.openAddOnDialog
                                                    }
                                                    openOptionsDialog={
                                                      this.openOptionsDialog
                                                    }
                                                    addToCart={this.addToCart}
                                                    editCart={this.editCart}
                                                    cartProducts={
                                                      this.props.cartProducts
                                                    }
                                                    cartLoadProdId={
                                                      this.state.cartLoadProdId
                                                    }
                                                  />
                                                )
                                              )
                                            : ""}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* category wise food products list */}
                            {this.state.sortedProducts &&
                            this.state.sortedProducts.length > 0
                              ? this.state.sortedProducts.map(category => (
                                  <FoodCategories
                                    category={category}
                                    addToCart={this.addToCart}
                                    editCart={this.editCart}
                                    openAddOnDialog={this.openAddOnDialog}
                                    openOptionsDialog={this.openOptionsDialog}
                                    cartProducts={this.props.cartProducts}
                                    cartLoadProdId={this.state.cartLoadProdId}
                                  />
                                ))
                              : ""}
                            {/* category wise food products list */}
                          </div>

                          {/* cart section */}
                          <div className="col-lg-4 col-md productDetailSrlSpyCart">
                            {this.props.cartProducts &&
                            this.props.cartProducts.length > 0 ? (
                              <div className="productDetailSrlSpyCartFixed">
                                <div className="cartHeader p-0">
                                  {this.lang.cart || "Cart"}
                                  {/* <p><span>From</span><a></a></p>
                                  <p className="cartSubHeader">
                                      {" "}
                                      {
                                        this.props.cartProducts.length
                                      } Item(s){" "}
                                    </p> */}
                                </div>

                                {this.props.myCart.cart
                                  ? this.props.myCart.cart.map((cart, key) => (
                                      <div
                                        className="restCheckoutCart"
                                        key={"cartParent-" + key}
                                      >
                                        {store &&
                                        store.businessName &&
                                        store.businessName != cart.storeName ? (
                                          <p>
                                            <span className="fromCaption">
                                              {this.lang.from || "from"}
                                            </span>
                                            <a
                                              onClick={() =>
                                                RouteToRestaurant(cart)
                                              }
                                              className="storeNameLink"
                                            >
                                              {cart.storeName}
                                            </a>
                                          </p>
                                        ) : (
                                          ""
                                        )}
                                        <p className="cartSubHeader mb-4">
                                          {" "}
                                          {this.props.cartProducts.length}{" "}
                                          {this.lang.items || "Item(s)"}{" "}
                                        </p>

                                        <div
                                          className="cartProducts scroller"
                                          // style={{ display: "none" }}
                                        >
                                          {this.props.myCart.cart
                                            ? this.props.myCart.cart.map(
                                                (cart, index) =>
                                                  cart.products
                                                    ? cart.products.map(
                                                        product => (
                                                          <div
                                                            className="col-12 mb-2 px-0"
                                                            style={{
                                                              background: "#fff"
                                                            }}
                                                          >
                                                            <div className="row align-items-center">
                                                              <div className="col-6">
                                                                {/* <p
                                                            style={{
                                                              fontSize: "11px"
                                                            }}
                                                            className="cart-product twoLineDisplay"
                                                          >
                                                            <img src="/static/images/grocer/veg.png" className="vegIcon" />
                                                            
                                                            <span>{product.itemName}</span>

                                                            {product.addOnAvailable ==
                                                              1 ? (
                                                                <a
                                                                  onClick={() =>
                                                                    this.openEditAddOnDialog(
                                                                      product
                                                                    )
                                                                  }
                                                                  className="cart-product-desc cartCutBtn d-block">
                                                                  
                                                                  <span>
                                                                    customize
                                                                  </span>

                                                                </a>
                                                              ) : (
                                                                ""
                                                              )}
                                                          </p> */}
                                                                <div
                                                                  style={{
                                                                    fontSize:
                                                                      "11px"
                                                                  }}
                                                                  className="row cart-product"
                                                                  style={{
                                                                    fontSize:
                                                                      "11px"
                                                                  }}
                                                                >
                                                                  <div className="col-auto">
                                                                    <img
                                                                      src="/static/images/grocer/veg.png"
                                                                      width="12"
                                                                      height="12"
                                                                      className=""
                                                                    />
                                                                  </div>
                                                                  <div className="col px-0">
                                                                    <span
                                                                      style={{
                                                                        marginBottom:
                                                                          "5px",
                                                                        display:
                                                                          "inline-block"
                                                                      }}
                                                                    >
                                                                      {
                                                                        product.itemName
                                                                      }
                                                                    </span>

                                                                    {product.addOnAvailable ==
                                                                    1 ? (
                                                                      <a
                                                                        onClick={() =>
                                                                          this.openEditAddOnDialog(
                                                                            product
                                                                          )
                                                                        }
                                                                        className="cart-product-desc cartCutBtn d-block"
                                                                      >
                                                                        <span>
                                                                          {this
                                                                            .lang
                                                                            .customize ||
                                                                            "customize"}
                                                                        </span>
                                                                      </a>
                                                                    ) : (
                                                                      ""
                                                                    )}
                                                                  </div>
                                                                </div>
                                                              </div>

                                                              <div
                                                                className="col-3 cartAfterAddBtn"
                                                                id="afterAddBtnID"
                                                              >
                                                                <FoodCartButtons
                                                                  cartSection={
                                                                    true
                                                                  }
                                                                  product={
                                                                    product
                                                                  }
                                                                  cartProducts={
                                                                    this.props
                                                                      .cartProducts
                                                                  }
                                                                  editCart={
                                                                    this
                                                                      .editCart
                                                                  }
                                                                  openOptionsDialog={
                                                                    this
                                                                      .openOptionsDialog
                                                                  }
                                                                />

                                                                {/* <div className="row">
                                                      <div className="col-auto px-0">
                                                        <button
                                                          onClick={() =>
                                                            this.editCart(
                                                              product,
                                                              1
                                                            )
                                                          }
                                                          className="btn btn-default prodetailsRecomItemAddBtn prodetailsRecomItemAddBtnSpl"
                                                        >
                                                          -
                                                          </button>
                                                      </div>
                                                      <div className="col text-center px-1">
                                                        <span className="prodetailsRecomItemCount">
                                                          {product.quantity}
                                                        </span>
                                                      </div>
                                                      <div className="col-auto px-0">
                                                        <button
                                                          onClick={() =>
                                                            this.editCart(
                                                              product,
                                                              2
                                                            )
                                                          }
                                                          className="btn btn-default prodetailsRecomItemAddBtn prodetailsRecomItemAddBtnSpl"
                                                        >
                                                          +
                                                          </button>
                                                      </div>
                                                    </div> */}
                                                              </div>
                                                              <div className="col-3 pl-0 text-center">
                                                                <span className="cart-prod-prize">
                                                                  {
                                                                    cart.currencySymbol
                                                                  }
                                                                  {parseFloat(
                                                                    product.finalPrice +
                                                                      product.addOnsPrice
                                                                  ).toFixed(2)}
                                                                </span>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        )
                                                      )
                                                    : ""
                                              )
                                            : ""}
                                        </div>
                                      </div>
                                    ))
                                  : ""}
                                <div className="cartSubTotalRest">
                                  <div className="_161V3">
                                    <div className="_1DWmI">Subtotal</div>
                                    <div style={{ paddingRight: "10px" }}>
                                      {this.props.myCart &&
                                      this.props.myCart.cartDiscount &&
                                      parseFloat(
                                        this.props.myCart.cartDiscount
                                      ).toFixed(2) ? (
                                        <span className="product-price-before">
                                          {currencySymbol || "€"}
                                          {parseFloat(
                                            this.props.myCart.cartTotal
                                          ).toFixed(2)}
                                        </span>
                                      ) : (
                                        ""
                                      )}

                                      <span>
                                        {currencySymbol || "€"}
                                        {parseFloat(
                                          this.props.myCart.totalPrice
                                        ).toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="_26NCu">
                                    {this.lang.extraChargeApply ||
                                      "Extra charges may apply"}
                                  </div>
                                  <button
                                    onClick={this.setDeliveryType}
                                    className="foodCheckoutRest w-100"
                                  >
                                    {this.lang.checkout || " Checkout →"}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="productDetailSrlSpyCartFixed">
                                <h4 className="productDetailSrlSpyCartTitle">
                                  {this.lang.cartEmpty || " Cart Empty"}
                                </h4>
                                <img
                                  src="/static/foodImages/cartEmpty.jpg"
                                  width="278"
                                  className="productDetailSrlSpyCartImg"
                                  alt="cartEmpty"
                                />
                                <p className="productDetailSrlSpyCartPTitle">
                                  {this.lang.goodFood ||
                                    `Good food is always cooking! Go ahead, order
                                  some yummy items from the menu.`}
                                </p>
                              </div>
                            )}
                          </div>
                          {/* cart section */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div
                style={{ background: "#fff" }}
                className="col-12 py-md-5 productDetailAddressSec"
              >
                <Footer />
              </div>
            </div>
          </div>
        </div>

        {/* mobile and tablet view */}

        <header className="header mobile-show" id="mobileHeaderRest">
          <div className="col-12 py-3">
            <div className="row align-items-center">
              <div className="col-2">
                <a onClick={this.RouteBack}>
                  {/* <img
                    src="/static/foodImages/backBtn.svg"
                    width="20"
                    className="img-fluid"
                    alt="go to previous"
                  /> */}
                  <img
                    src="/static/icons/Common/BackIcon.imageset/back_btn@2x.png"
                    width="24"
                  />
                </a>
              </div>
              <div className="col-8 text-center">
                <h6 className="innerPage-heading lineSetter">
                  {this.state.stickyHeader
                    ? store.storeName || store.businessName
                    : ""}
                </h6>
              </div>
              <div className="col-2 pl-0 text-center">
                <a onClick={this.openBottomSearch}>
                  {/* <img
                    src="/static/foodImages/searchBtn.svg"
                    width="20"
                    className="img-fluid"
                    alt="go to previous"
                  /> */}
                  <img src={enVariables.SEARCH_ICON} width="20" />

                  {/* <i className="fa fa-search" style={{ fontSize: "18px", marginTop: "5px" }} aria-hidden="true"></i> */}
                </a>
              </div>
            </div>
          </div>
        </header>

        <div
          className="mobNTabView prodDetailsWrapper d-block d-lg-none"
          style={{ overflowY: "scroll" }}
          id="mobileMainSection"
        >
          {/* prodDetailsHeaderM  */}

          {/* mobile view - store name, rating, offers */}
          <div className="row mr-1 text-center mobile-show">
            <div className="col-12 py-2" style={{ background: "#fff" }}>
              <div className="row align-items-start">
                <div className="col-3 pr-0">
                  <img
                    src={store.bannerImage}
                    height="60px"
                    width="90%"
                    alt={store.storeName}
                  />
                </div>
                <div className="col-9 pl-2 text-left">
                  <p
                    className="storeName"
                    style={{ fontSize: "16px", fontWeight: 500 }}
                  >
                    {store.storeName || store.businessName}
                  </p>
                  <p className="storeName" style={{ fontSize: "14px" }}>
                    {store.areaName}
                  </p>
                  {/* <p className="storeName" style={{ fontSize: "14px" }}>{store.storeSubCategory}</p> */}
                </div>
              </div>
            </div>

            <div className="col-12 pb-1 px-0 storeDetail">
              {/* {store.offer && store.offer.length > 0 ? */}
              {/* <div className="row py-2 offerSection"> */}
              <div className="col-12 offerSection">
                <p className="offerTitle text-left px-4">{store.offerTitle}</p>
              </div>
              {/* </div> */}

              <div className="row storeListing storeListingHome align-items-center">
                <div className="col-3 pl-0 storeDetailTags">
                  <span>
                    <i className="fa fa-star" />
                  </span>{" "}
                  <span className="storeTagValue">
                    {parseFloat(
                      store.averageRating || store.businessRating || 0
                    ).toFixed(2)}
                  </span>
                  <p className="storeName">{this.props.lang.rate || "Rating"}</p>
                </div>
                <div className="col-3 storeDetailTags">
                  <span className="storeTagValue">
                    {parseFloat(store.distanceKm || 0).toFixed(2)}{" "}
                  </span>
                  <span>Km</span>
                  <p className="storeName">
                    {this.props.lang.distance || "Distance"}
                  </p>
                </div>
                <div className="col-3 pr-0 storeDetailTags">
                  <span className="storeTagValue">
                    {store.currencySymbol}
                    {store.costForTwo}
                  </span>
                  <p className="storeName">
                    {this.props.lang.ForTwo|| "For Two"}
                  </p>
                </div>
                <div className="col-3 pr-0 storeDetailTags">
                  <span className="storeTagValue">
                    
                    {store.avgDeliveryTime} mins
                  </span>
                  <p className="storeName">
                    {this.props.lang.Average||"Avg. Time"}
                  </p>
                </div>
                <div></div>
              </div>
            </div>
          </div>

          {/* prodDetailsHeaderM  */}

          {/* prodetailsTitleSecM  */}
          <div className="col-12 prodetailsSecM">
            {/* <RestaurantHeaderMobile
              store={this.props.getCategoryList.data}
              OnChangeSearch={this.OnChangeSearch}
              searchQuery={this.state.searchQuery}
            /> */}
 {!this.state.menuOpen ? 
                  <div className="menu d-flex align-items-center" onClick={this.handleMenu} >
                  <i className="fa fa-cutlery mr-2"></i>
                    <p>{this.props.lang.Menu||"Menu"}</p>
                  </div>
                :  
                <div className ={`menu_after_above ${this.state.closeM ? "d-none" :""} `} onClick={this.handleMenu} >
                <div className="menu_after">
                     
          <div class="m1 menu_wrapper">
    <div id="menu-center">
        <ul>
     
         {this.state.sortedProducts.length > 0
                          ? this.state.sortedProducts.map(category => (
                          <li>
                            <a
                              // key={"categoryName " + category.name}
                              style={{textDecoration:"none",color:"black",fontWeight:"600"}}
                              // href={
                              //   "#mobile" + category.name.replace(/[^A-Za-z]/g, "")
                              // }
                            >
                             <div className="d-flex justify-content-between align-items-center" style={{padding: "10px 0px"}} onClick={()=>this.scrollToSection("#mobile" + category.name.replace(/[^A-Za-z]/g, ""))} data-toggle="collapse" href={"#" +category.name.replace(/[^A-Za-z]/g, "")}>
                            <p style={{fontWeight:"600"}}>{category.name}</p>
                               <p style={{fontWeight:"600"}}>{category.subCat[0].product.length}</p>
                               </div> 
                            </a></li>
                          ))
                          : ""}
        </ul>
    </div>   
</div>
                  </div>
                  </div>}
            <div className="row">
              <div className="col-12 prodetailsListItemsSec">
                <div className="row">
                  {this.state.searchData.length > 0 ? (
                    <div className="col-12 mb-3 prodetailsRecomSec productDetailSrlSpySec">
                      <div className="row prodetailsRecomH6TitleRow">
                        <div className="col-12">
                          <h6 className="prodetailsRecomH6Title">
                            {this.lang.searchProduct || "Searched Products"}
                          </h6>
                        </div>
                      </div>

                      {this.state.searchData.map(product => (
                        <FoodListCard
                          product={product}
                          addToCart={this.addToCart}
                          openAddOnDialog={this.openAddOnDialog}
                          openOptionsDialog={this.openOptionsDialog}
                          cartProducts={this.props.cartProducts}
                        />
                      ))}
                    </div>
                  ) : (
                    ""
                  )}

                  <div className="col-12 mb-3 prodetailsRecomSec">
                    <div className="row prodetailsRecomH6TitleRow">
                      <div className="col-12">
                        <h6 className="prodetailsRecomH6Title">
                          {this.lang.recommended || "Recommended"}
                        </h6>
                      </div>
                    </div>
                    <div className="row">
                      {this.props.getCategoryList &&
                      this.props.getCategoryList.data &&
                      this.props.getCategoryList.data.recomendedProducts
                        ? this.props.getCategoryList.data.recomendedProducts.map(
                            (product, index) => (
                              <FoodCardMobile
                                key={"FoodCardMobile" + index}
                                product={product}
                                openAddOnDialog={this.openAddOnSlider}
                                openOptionsDialog={this.openOptionsDialogMobile}
                                addToCart={this.addToCart}
                                editCart={this.editCart}
                                cartProducts={this.props.cartProducts}
                                currencySymbol={currencySymbol}
                              />
                            )
                          )
                        : ""}
                    </div>
                  </div>
                </div>

                {this.state.sortedProducts &&
                this.state.sortedProducts.length > 0
                  ? this.state.sortedProducts.map(category => (
                    <div id={"mobile"+(category.name).replace(/[^A-Za-z]/g, "")}> 
                    <FoodCategoriesMobile
                        category={category}
                        addToCart={this.addToCart}
                        openAddOnDialog={this.openAddOnSlider}
                        openOptionsDialog={this.openOptionsDialogMobile}
                        cartProducts={this.props.cartProducts}
                        currencySymbol={currencySymbol}
                        editCart={this.editCart}
                      />
                      </div>
                    ))
                  : ""}
              </div>
            </div>
          </div>
          {/* prodetailsTitleSecM  */}
          <CartFooter />
        </div>

        <BottomDrawer onRef={ref => (this.BottomSearch = ref)}>
          <div className="col-12">
            <div className="row align-items-center py-3 header">
              <div className="col-1 pr-0">
                <a onClick={this.closeBottomSearch}>
                  <img
                    src="/static/icons/Common/BackIcon.imageset/back_btn@2x.png"
                    width="24"
                  />
                </a>
              </div>
              <div className="col-10">
                <input
                  type="text"
                  className="searchBoxMV"
                  id="searchBoxMV-rest"
                  onChange={this.OnChangeSearch}
                  placeholder={
                    this.lang.searchItemIn ||
                    "Search Items in " + store.businessName
                  }
                />
              </div>
            </div>
          </div>
          <div style={{ height: "100vh" }}>
            {/* <div className="col-12">
                            <input type="text" className="searchBoxMV" id="searchBoxMV"
                                onChange={this.getSearchResult} placeholder="Search Stores" />
                        </div> */}
            <div className="col-12 popularSearchSection">
              {/* <div className="row py-3 align-items-center align-items-md-start padLeftNRightMulti"> */}
              <div className="row popularSearchULLayout text-left">
                {this.state.searchData ? (
                  <ul className="nav popularSearchUL w-100 px-4">
                    {this.state.searchData.map((item, index) =>
                      item.productName.length > 0 ? (
                        // <Link key={"searchResFood" + index} as={`/search/${item.productName.replace(/,/g, '').replace(/& /g, '').replace(/ /g, '-')}`} href={`/search?name=${item.productName.replace('&', '%26')}&store=${store.businessId}`} key={"searchItem" + index} >
                        <li className="nav-item">
                          <a
                            className="nav-link"
                            onClick={() => this.handleDetailToggle(item)}
                            href="#"
                          >
                            <img
                              src="/static/images/search.svg"
                              width="10"
                              height="10"
                              className="img-fluid popularSearchImage"
                              alt="search"
                            />
                            <span className="popularSearchSuggestion">
                              {item.productName}
                            </span>
                            <i className="fa fa-angle-right popularSearchRightIcon"></i>
                          </a>
                        </li>
                      ) : (
                        // </Link>
                        ""
                      )
                    )}
                  </ul>
                ) : (
                  ""
                )}
              </div>
              {!this.state.noStores &&
                this.state.storeSearchList &&
                this.state.storeSearchList.map((store, index) => (
                  <StoreListMobile
                    store={store}
                    handleStoreRoute={this.handleStoreRoute}
                    index={index}
                  />
                ))}
              {this.state.noProductsError ? (
                // <div className="row popularSearchULLayout text-center align-items-center" >
                <ul
                  className="col nav popularSearchUL d-flex align-items-center"
                  style={{ height: "80vh" }}
                >
                  <div className="col-12 py-5 text-center">
                    <img
                      src="/static/icons/EmptyScreens/EmptySearch.imageset/empty_products.png"
                      width="150"
                      height="120"
                      className="img-fluid"
                      alt="search"
                    />
                    <p
                      className="text-danger text-center py-3"
                      style={{ width: "100%" }}
                    >
                      {this.state.noProductsError}
                    </p>
                  </div>
                </ul>
              ) : (
                // </div>
                ""
              )}
              {/* </div> */}
            </div>
          </div>
        </BottomDrawer>

        <EditAddOns
          onRef={ref => (this.editRef = ref)}
          showLoginHandler={this.showLoginHandler}
          isAuthorized={this.state.isAuthorized}
        />
        <AddOnDialog
          onRef={ref => (this.dialogRef = ref)}
          showLoginHandler={this.showLoginHandler}
          isAuthorized={this.state.isAuthorized}
          currencySymbol={currencySymbol}
          myCart={this.props.myCart}
        />
        <AddOnSlider
          onRef={ref => (this.sliderRef = ref)}
          showLoginHandler={this.showLoginHandler}
          isAuthorized={this.state.isAuthorized}
        />
        <OptionsDialog
          onRef={ref => (this.optionRef = ref)}
          showLoginHandler={this.showLoginHandler}
          openAddOnDialog={this.openAddOnDialog}
          isAuthorized={this.state.isAuthorized}
        />
        <OptionsDialogMobile
          onRef={ref => (this.optionRefMob = ref)}
          showLoginHandler={this.showLoginHandler}
          openAddOnDialog={this.openAddOnSlider}
          isAuthorized={this.state.isAuthorized}
        />
        <Authmodals
          // key={"restFront" + Math.random()}
          onRef={ref => (this.child = ref)}
          editCart={this.editCart}
        />
        <ExpireCartDialog onRef={ref => (this.expRef = ref)} />
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    reduxState: state,
    myCart: state.cartList,
    locErrStatus: state.locErrStatus,
    locErrMessage: state.locErrMessage,
    userProfileDetail: state.userProfile,
    notifications: state.notifications,
    cartProducts: state.cartProducts,
    stateLat: state.lat,
    stateLong: state.long,
    expireCart: state.expireCart,
    lang: state.locale
  };
};

export default connect(mapStateToProps)(Index);
