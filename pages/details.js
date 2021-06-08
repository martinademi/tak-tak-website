import { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";

import Head from "next/head";
import fetch from "isomorphic-unfetch";
import { List, ListItem, IconButton, FontIcon } from "material-ui";
import ReactImageMagnify from "react-image-magnify";
import Wrapper from "../hoc/wrapperHoc";
import Header from "../components/header/innerPageHeader";
import Footer from "../components/footer/Footer";
import Authmodals from "../components/authmodals/index";
import { authenticateGuest } from "../services/guestLogin";
import { redirectIfAuthenticated, getJwt, getLocation } from "../lib/auth";
import {
  setCookie,
  getCookie,
  getCookiees,
  removeCookie
} from "../lib/session";
import * as actions from "../actions/index";
import { getLocationZone } from "../services/guestLogin";
import ProductImageSlider from "../components/dialogs/slider";
import {
  editFavtService,
  getFavtProducts,
  createWishList,
  addProductToWishList
} from "../services/cart";
import WishListModalContent from "../components/wishlist/wishlist";
import Router from "next/router";
import * as enVariables from "../lib/envariables";
import CustomizedSnackbars from "../components/ui/snackbars/Snackbar";
import LeftSlider from '../components/ui/sliders/leftSlider'
import redirect from "../lib/redirect";
import CartButtonsPID from "../components/cart/CartButtons";
import StoreRightSlider from "../components/store/StoreRightSlider";
import ExpireCartDialog from "../components/dialogs/expireCart";

import "../assets/style.scss";
import "../assets/about.scss";
import "../assets/login.scss";
import { addToCartExFunc } from "../lib/cart/addToCart";
import ManageCart from "../components/cart/ManageCart";

import MenuItem from '@material-ui/core/MenuItem';
import FoodCartButtons from "../components/FoodTheme/Cart/CartButtons";
import { inCart } from "../lib/cart/inCart";
import AddOnDialog from "../components/FoodTheme/Dialog/addOnDialog";
import AddOnSlider from "../components/FoodTheme/Dialog/addOnSlider";
import OptionsDialog from "../components/FoodTheme/Dialog/optionsDialog";
import OptionsDialogMobile from "../components/FoodTheme/Dialog/optionsDialogMobile";

class Itemdetails extends Component {
  static async getInitialProps({ ctx }) {
    let token, res;
    token = await getCookiees("token", ctx.req);

    (await token)
      ? ''
      : ((res = await authenticateGuest()),
        (axios.defaults.headers.common["authorization"] = await res.data.token),
        (token = res.data.token));

    const isAuthorized = await getCookiees("authorized", ctx.req);
    const queries = ctx.query;
    let lang = await (queries.lang || getCookiees("lang", ctx.req)) || "en";
    const slug = queries.slug;
// for the get products details
    const getProductDetail = await fetch(
      enVariables.API_HOST + "/business/productDetails/" + queries.id + "/0/0",
      {
        method: "get",
        headers: {
          language: "en",
          "content-type": "application/json",
          authorization: token
        }
      }
    );
    const productDetail = await getProductDetail.json();
    ctx && ctx.store ? ctx.store.dispatch(actions.selectLocale(lang)) : ''

    return { productDetail, isAuthorized, token, lang, slug };
  }

  state = {
    dialogImage: null,
    selectedUnit: null,
    isAuthorized: this.props.isAuthorized,
    product: this.props.productDetail.data,
    listArray: [],
    editedQuantity: 0,
    loader: false,
    currentSlug: null,
    showUnitErr: "",
    selectedStore: "",
    favLoading: false,
    isRendered: false,
    cartQuantity: [1, 2, 3, 4, 5],
    cartQtyInpVal: 1,
    hideCartEdit: true
  };

  dataArray = [];

  constructor(props) {
    super(props);
    this.selectedUnit = this.selectedUnit.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.selectedImage = this.selectedImage.bind(this);
    this.updateCheck = this.updateCheck.bind(this);
    this.openOptionsDialog = this.openOptionsDialog.bind(this);
  }

  componentDidMount() {

    setTimeout(() => {
      let storeData = {
        businessId: this.props.productDetail ? this.props.productDetail.data.businessId : '',
        businessName: this.props.productDetail ? this.props.productDetail.data.businessName : ''
      }
      this.setState({ selectedStore: { ...this.props.productDetail.data }, isRendered: true })
    }, 100);

    this.state.isAuthorized
      ? (this.props.dispatch(actions.getProfile()),
        this.props.dispatch(actions.getCart()))
      : ''
    // this.getGeoLocation();
    this.getFavorites();

    let lat = getCookie("lat", '');
    let lng = getCookie("long", '');

    // get stores category wise
    let getStoresPayload = {
      lat: lat,
      long: lng,
      token: getCookie("token"),
      zoneId: getCookie("zoneid"),
      offset: 0,
      limit: 40,
      type: 2,
      categoryId: getCookie("categoryId")
    }

    setTimeout(() => {
      this.props.dispatch(actions.getStoresByType(getStoresPayload));
      this.setState({ selectedUnit: this.state.product.units[0] }, () => {
        if (window.outerWidth < 580) {
          document.getElementById('mobi-' + this.state.selectedUnit.unitId).setAttribute("checked", "true");
        } else {
          document.getElementById(this.state.selectedUnit.unitId).setAttribute("checked", "true");
        }
      });
    }, 900);

    let breadType = this.getBreadType(this.props.slug);
    this.setState({ currentSlug: breadType });

    let lastRowId = document.getElementById("lastRowDetail");
    let footer = document.getElementById("mobileDetailFooter");

    lastRowId.style.marginBottom = footer.clientHeight - 40 + "px";

  }
  getBreadType = (slug) => {
    switch (slug) {
      case "0": return "Favorite Products";
      case "1": return "Trending Products";
      case "2": return "Everyday Lowest Price";
      case "3": return "Offers";
      case "4": return "Brands";
      case "5": return "Categories";

    }
  }

  getGeoLocation = () => {
    const location = getLocation();
    location.then(
      res => {
        res.coords.latitude && res.coords.longitude
          ? this.updateLocation({
            lat: res.coords.latitude,
            lng: res.coords.longitude
          })
          : toastr.error("Location Access is required");
      },
      error => {
        toastr.error("Location Access is required");
      }
    );
  };

  updateLocation = data => {
    setCookie("token", this.props.token);
    data["token"] = this.props.token;
    this.setState({
      loading: true,
      location: data.location,
      lat: data.lat,
      long: data.lng
    });
    this.props.dispatch(actions.initLocChange(data));
    getLocationZone(data.lat, data.lng).then(zone => {
      zone.error
        ? ""
        : zone.data.zoneId
          ? (
            setCookie("zoneid", zone.data.zoneId),
            setCookie("locAuthenticated", true),
            setCookie("authenticatedZone", true))
          : "";
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.reduxState.userName !== this.props.reduxState.userName) {
      this.setState({ isAuthorized: this.props.reduxState.authorized });
    }
  }

  componentWillMount() {
    this.props.productDetail &&
      this.props.productDetail.data &&
      this.props.productDetail.data.mobileImage.length > 0
      ? this.selectedImage(this.props.productDetail.data.mobileImage[0].image)
      : "";
  }

  updateCheck(event) {
    this.dataArray.findIndex(item => item.id == event.target.value) >= 0
      ? (this.dataArray[
        this.dataArray.findIndex(item => item.id == event.target.value)
      ].checked = event.target.checked)
      : this.dataArray.push({
        id: event.target.value,
        checked: event.target.checked
      });

    this.setState({ listArray: this.dataArray });
  }
// for the add wishlist
  addToWishList = () => {
    let data = {
      parentProductId: this.state.product.parentProductId,
      childProductId: this.state.product.productId,
      storeId: getCookie("storeId", ""),
      list: this.state.listArray,
      zoneId:getCookie("zoneid")
    };

    addProductToWishList(data).then(data => {
     
    });
  };

  editCartQuantity = (Quantity, type) => {

    type == 1
      ? this.setState({ editedQuantity: Quantity + 1 })
      : Quantity >= 0 ? this.setState({ editedQuantity: Quantity - 1 }) : ''
  };

  changeCart = cartDetail => {
    let editCartData = {
      cartId: this.props.reduxState.cartList.cartId,
      childProductId: cartDetail.childProductId,
      unitId: cartDetail.unitId
    };

    editCartData["quantity"] = cartDetail.quantity + this.state.editedQuantity;

    this.props.dispatch(actions.editCard(editCartData));

    this.setState({ editedQuantity: 0 });
  };

  editCart = (cartDetail, product, type) => {
    let editCartData = {
      cartId: this.props.reduxState.cartList.cartId,
      childProductId: cartDetail.childProductId,
      // unitId: this.state.selectedUnit ? this.state.selectedUnit.unitId : cartDetail.unitId
      unitId: cartDetail.unitId
    };

    type == 1
      ? (editCartData["quantity"] = cartDetail.quantity - 1)
      : (editCartData["quantity"] = cartDetail.quantity + 1);

    this.props.dispatch(actions.editCard(editCartData));
  };

  setCart = (cartDetail, type) => {

    if (type == "remove") {
      this.removeItemFromCart(cartDetail);
      return;
    }

    if (type == "custom") {
      this.setState({ selectedCartQty: this.state.cartQtyInpVal }, () => {
        let editCartData = {
          cartId: this.props.reduxState.cartList.cartId,
          childProductId: cartDetail.childProductId,
          unitId: cartDetail.unitId
        };

        editCartData["quantity"] = this.state.selectedCartQty;
        this.props.dispatch(actions.editCard(editCartData));
        setTimeout(() => {
          this.setState({ selectedCartQty: null, isQtyChanged: false, hideCartEdit: true })
        }, 500);
      })
      return;
    }
    let editCartData = {
      cartId: this.props.reduxState.cartList.cartId,
      childProductId: cartDetail.childProductId,
      unitId: cartDetail.unitId
    };

    editCartData["quantity"] = this.state.selectedCartQty;
    this.props.dispatch(actions.editCard(editCartData));
    setTimeout(() => {
      this.setState({ selectedCartQty: null, isQtyChanged: false })
    }, 500);
  }
// remove from the cart
  removeItemFromCart = (cartDetail, product, type) => {
    let editCartData = {
      cartId: this.props.reduxState.cartList.cartId,
      childProductId: cartDetail.childProductId,
      // unitId: this.state.selectedUnit ? this.state.selectedUnit.unitId : cartDetail.unitId
      unitId: cartDetail.unitId
    };

    editCartData["quantity"] = 0;
    this.props.dispatch(actions.editCard(editCartData));
    setTimeout(() => {
      this.setState({ selectedCartQty: null, isQtyChanged: false })
    }, 500);
  }

  addToCart = async selectedUnit => {

    let isAuthorized = await getCookie("authorized", "");
    let cartData;
    if (isAuthorized) {

      if (!this.state.selectedUnit) {
        this.setState({ showToastErr: "Please select the Unit", toastType: "info" })
        // this.SnackbarRef.showToast();
        return;
      }

      cartData = {
        childProductId: this.props.productDetail.data.productId,
        unitId: selectedUnit.unitId,
        quantity: this.state.selectedCartQty || parseFloat(1).toFixed(1),
        addOns: [],
        storeType: getCookie("storeType")
      }
      // check multicart auth
      addToCartExFunc(this.props.myCart)
        .then(() => {
      
          this.props.dispatch(actions.initAddCart(cartData))

          setTimeout(() => {
            this.props.dispatch(actions.getCart())
          }, 100)
        })
        .catch((err) => {
         
          this.props.dispatch(actions.expireCart(true, cartData)) // expire cart action for opening cart option dialog
        })
    }
    else {
      this.showLoginHandler(window.outerWidth <= 580 ? true : false);
    }
  };

  selectedUnit = (unit, unitIndex) => {
    this.setState({ selectedUnit: unit, selectedUnitIndex: unitIndex });
  };

  selectedImage = url => {
    this.setState({ dialogImage: url });
  };

  showLoginHandler = (isMobile) => {
    this.child.showLoginHandler(isMobile);
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
  GoBack = () => Router.back()
 // favorite 
  getFavorites = () => {

    let favtdata = {
      storeId: this.state.product.storeId
    };

    favtdata.storeId
      ? getFavtProducts(favtdata.storeId, getCookie("zoneid")).then(data => {
        data.error
          ? data.status == 404 ? this.setState({ favLoading: false, favtProducts: [] }) : this.setState({ favLoading: false })
          : (this.setState({ favtProducts: data.data.data, favLoading: false })
          )
      })
      : "";
  };

  editFavorite = async () => {
    let isAuthorized = await getCookie("authorized", "");
    let data = {
      childProductId: this.state.product.productId,
      parentProductId: this.state.product.parentProductId
    };

    if (isAuthorized) {
      this.setState({ favLoading: true })
      editFavtService(data).then(data => {
        data.error
          ? this.getFavorites()
          : // toastr.success(data.message),
          this.getFavorites();
      })
    } else
      this.showLoginHandler();
  };
// products unit ui
  getUnits = (isMobile) => {
    return (
      <div className="row justify-content-left text-left mt-3">
        {this.state.product &&
          this.state.product.units &&
          this.state.product.units.length >
          0 ? (
            <div className="col-12">
              {!isMobile ?
                <h4 className="unitSelection py-2">
                  {this.props.locale.SelectUnity||"Select Unit"}
              </h4> : ''
              }
              <div className="row mt-2">
                {this.state.product.units.map(
                  (unit, index) => (
                    <div
                      className="col-auto pr-0"
                      style={{
                        maxWidth: "100%"
                      }}
                      key={
                        "customRadio" + index
                      }
                    >
                      <input
                        id={isMobile ? "mobi-" + unit.unitId : unit.unitId}
                        name="should_be_same"
                        onChange={() =>
                          this.selectedUnit(unit, index)
                        }
                        className={unit.unitId + " customradio"}
                        type="radio"
                      // checked={!this.state.selectedUnit && index == 0 || this.state.selectedUnit && this.state.selectedUnit.unitId == unit.unitId}
                      />
                      <label htmlFor={isMobile ? "mobi-" + unit.unitId : unit.unitId}>
                        {unit.title}
                      </label>
                    </div>
                  )
                )}
              </div>
            </div>
          ) : (
            ""
          )}
      </div>
    )
  }
  // for multiple unit get different price
  getPrice = (isMobile) => {
    let unitData = this.state.selectedUnit || this.state.product.units[0];
    return (
      <p
        key="info-1"
        className="product-price product-real-price prodPriceBtP prodPriceBtPSpl"
      >
        <span>
          {" "}
          {this.state.product.currencySymbol || "€"}
          {parseFloat(
            unitData
              .finalPrice
          ).toFixed(2)}
        </span>
        {/* product-price-before */}
        {unitData.appliedDiscount > 0 ?
          <span className="product-price-before prodPriceBtBefore mx-2 my-0 p-0">
            {" "}
            {this.state.product.currencySymbol || "€"}
            {parseFloat(
              unitData
                .value
            ).toFixed(2)}{" "}
          </span> : ''}
        {/* percentage off */}
        {parseInt(unitData.appliedDiscount) > 0 ?
          <span className="discount-with-brace" style={{ height: isMobile ? "auto" : "20px" }}>
            {parseFloat(
              (parseInt(
                unitData
                  .appliedDiscount
              ) *
                100) /
              unitData.value
            ).toFixed(0) +
              "% OFF"
            }
          </span> : ''}
      </p>
    )
  }
  handleCartQty = (event) => {
    this.setState({ selectedCartQty: event.target.value, isQtyChanged: true })
  }

  handleCartInputQty = (event) => {
    this.setState({ cartQtyInpVal: event.target.value })
  }

  showCartEdit = () => {
    this.setState({ hideCartEdit: false })
  }

  openOptionsDialog(product, type) {
   
    this.state.selectedUnit.addOnAvailable > 0 ?
      this.optionRefMob.openOptionsDialog(product, this.state.selectedUnit) :
      this.editCart(product, '', type)
  }

  openAddOnDialog(addons) {
    this.state.isAuthorized ?
      this.dialogRef.openProductDialog(addons) : this.showLoginHandler();
  }

  openAddOnSlider = addons => {
    this.sliderRef.openProductDialog(addons);
  };

  getActionButtons = (isLangAvailable, showWishlist) => {

    // get the selected unit data
    let unitData = this.state.selectedUnit ? this.state.selectedUnit : this.state.product ? this.state.product.units[0] : '';
    let selUnitId = this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.unitId == unitData.unitId)];


    return (
      this.state.product.storeTypeMsg == "Food" ?
        <div className={showWishlist ? "row px-3 my-3 align-items-center w-100" : "row px-3 my-3 align-items-center"}>
          {/* cart buttons */}
          <div className="col text-right px-0">
            <div>
              {inCart(this.props.cartProducts, this.state.product) ?
                <FoodCartButtons product={this.state.product} cartLoadProdId={''} cartProducts={this.props.cartProducts} width={"45%"}
                  editCart={this.editCart} openOptionsDialog={this.openOptionsDialog} selectedUnit={this.state.selectedUnit} float={"left"} /> :
                <button
                  className="btn btn-default w-100 prodModalAddCartBtn"
                  style={{
                    float: "none",
                    lineHeight: "32px"
                  }}
                  onClick={() =>
                    this.addToCart(
                      this.state.selectedUnit ||
                      this.state.product.units[0]
                    )
                  }
                >
                  {isLangAvailable
                    ? isLangAvailable.general.addToCart
                    : this.props.locale.addTocart||"Add to Cart"}
                </button>
              }

              {inCart(this.props.cartProducts, this.state.product) ?
                <button
                  className="btn btn-default prodModalAddCartBtn"
                  onClick={() => Router.push("/cart")}
                // style={{
                //   float: "none",
                //   lineHeight: "32px"
                // }}
                >
                  {this.props.locale.ViewCart||"View Cart"}
              </button> : ''
              }

            </div>
            <div>

            </div>
          </div>
          {/* cart buttons */}
        </div> :
        <div className={showWishlist ? "row px-3 my-3 align-items-center w-100" : "row px-3 my-3 align-items-center"}>
          {/* cart buttons */}
          <div className="col pl-0">
            {
              unitData && typeof selUnitId == "undefined"
                ?
                (
                  unitData.availableQuantity < 1 ?
                    <div>
                      <h3 className="mb-0">{this.props.locale.SoldOut||"Sold Out"}</h3>
                      <p className="outStockMsg">{this.props.locale.currenltyoutstock}</p>
                    </div> :
                    <button
                      className="btn btn-default w-100 prodModalAddCartBtn"
                      style={{
                        float: "none",
                        lineHeight: "32px"
                      }}
                      onClick={() =>
                        this.addToCart(
                          this.state.selectedUnit ||
                          this.state.product.units[0]
                        )
                      }
                    >
                      {isLangAvailable
                        ? isLangAvailable.general.addToCart
                        : this.props.locale.addTocart||"Add to Cart"}
                    </button>
                ) : (
                  this.state.isRendered ?
                    selUnitId.quantity > 5 && this.state.hideCartEdit ?
                      <div>
                        <p className="inCartUI" onClick={this.showCartEdit}>{selUnitId.quantity} - {this.props.locale.incart}</p>
                      </div> :
                      <div>
                        <ManageCart onChange={this.handleCartQty} onChangeCartInput={this.handleCartInputQty} isQtyChanged={this.state.isQtyChanged} setCart={this.setCart} selUnitId={selUnitId} width={this.state.isQtyChanged || inCart(this.props.cartProducts, this.state.product) ? "50%" : "100%"} inCart={inCart(this.props.cartProducts, this.state.product)} value={this.state.selectedCartQty || selUnitId.quantity} controlName="Select Quantity">
                          {this.state.cartQuantity.map((cartQty, index) =>
                            <MenuItem value={cartQty}>{selUnitId.quantity == cartQty ? `${cartQty} ${this.props.locale.incart}` : cartQty}</MenuItem>
                          )}
                          <MenuItem value={"custom"}>{this.props.locale.Custom} </MenuItem>
                          <MenuItem value={"remove"}>{this.props.locale.RemoveFromCart}</MenuItem>
                        </ManageCart>
                      </div> : ''


                )}
          </div>
          {/* cart buttons */}

          {/* wishlist and favorite */}
          <div className={showWishlist ? "col-5" : "col-5 d-none"} >
            <div className="row justify-content-center align-items-center">
              <div
                className="col-12 text-center wishFavBt p-0"
                onClick={() => this.editFavorite()}
              >
                {this.state.product &&
                  this.state.favtProducts &&
                  this.state.favtProducts.findIndex(
                    item =>
                      item.childProductId ==
                      this.state.product.productId
                  ) >= 0 ? (
                    <p className="wishFavBtP favDetailPage active">
                      {this.state.favLoading ?
                        <i className="fa fa-refresh fa-spin mx-3"></i> :
                        <img src="/static/images/updated/like-filled-white.svg" className="wishlistIcon" />

                      }
                      {isLangAvailable
                        ? isLangAvailable.other.favorited
                        :this.props.locale.favorited|| "Favorited"}
                    </p>
                  ) : (
                    <p className="wishFavBtP favDetailPage">
                      {this.state.favLoading ?
                        <i className="fa fa-refresh fa-spin mx-3"></i> :
                        <img src="/static/images/updated/like-filled.svg" className="wishlistIcon" />
                      }
                      {isLangAvailable
                        ? isLangAvailable.other.addToFav
                        : this.props.locale.favorited||"Favorite"}
                    </p>
                  )}
              </div>
            </div>
          </div>
          {/* wishlist and favorite */}
        </div>
    )
  }

  LeftSliderHandler = () => {
    this.setState({ SliderWidth: 450 })
    this.StoreSlider.handleLeftSliderToggle()
  }
  changeStore = (store) => {

    this.setState({ storeId: store.storeId })
    setCookie('storeName', store.storeName)
    setCookie('storeId', store.storeId)

    let lang = getCookie("lang", '') || "en"

    redirect(`/stores/${store.storeName.replace(/%20/g, '-').replace(/,/g, '').replace(/& /g, '').replace(/ /g, '-')}?lang=${lang}`);

    this.StoreSlider.handleLeftClose();
  }
  printAdditionalFacts = facts => {
    let factsObj = {};
    let measure = "";
    factsObj[facts.name] = [];

    measure =
      facts.name == "Strain Effects"
        ? " %"
        : facts.name == "Nutrition Facts"
          ? " "
          : "";

    Object.keys(facts.data).map(
      key => (
        facts.name == "Strain Effects" && facts.data[key] > 0
          ? factsObj[facts.name].push({ key: key, value: facts.data[key] })
          : "",
        facts.name == "Nutrition Facts" && facts.data[key].length > 0
          ? factsObj[facts.name].push({ key: key, value: facts.data[key] })
          : ""
      )
    );

    return factsObj[facts.name] && factsObj[facts.name].length > 0 ? (
      <div className="col-12">
        <div className="row">
          <div
            className="col-12 px-4 pdDescTitleCommSec"
            style={{ background: "#eee" }}
          >
            <h6 className="pdDescTitleH6Comm lineSetter">{facts.name}</h6>
          </div>
        </div>

        <div className="row">
          <div className="col-12 px-4 pdDescCommtxt border">
            <ul className=" flex-column">
              <li className="nav-item">
                {factsObj[facts.name].map(item => (
                  <div className="row">
                    <div className="col text-left">
                      <p className="pdPlistItems">{item.key}</p>
                    </div>
                    <div className="col text-right">
                      <p className="pdPlistItems">
                        {item.value} {measure}
                      </p>
                    </div>
                  </div>
                ))}
              </li>
            </ul>
          </div>
        </div>
      </div>
    ) : (
        ""
      );
  };

  render() {
    let isLangAvailable = null;
    let soldOnline = true;

    let currencySymbol = this.state.product ? this.state.product.currencySymbol : '';

  

    return (
      <Wrapper>
        <Head>
          <title>
            {this.props.productDetail.data.productName} | {enVariables.APP_NAME}{" "}
          </title>
          <meta
            name="title"
            content={this.props.productDetail.data.productName}
          />
          <meta
            name="description"
            content={this.props.productDetail.data.productName}
          />

          <meta property="og:locale" content="en_US" />
          <meta property="og:type" content="article" />
          <meta
            property="og:title"
            content={this.props.productDetail.data.productName}
          />
          <meta
            property="og:description"
            content={this.props.productDetail.data.productName}
          />
          <meta
            property="og:url"
            content="https://website.instacart-clone.com"
          />
          <meta property="og:site_name" content={enVariables.APP_NAME} />
          <meta
            property="article:publisher"
            content="https://website.instacart-clone.com"
          />
          <meta property="article:section" content="Article" />

          <meta property="og:image" content={this.state.dialogImage} />
          <meta
            property="og:image:secure_url"
            content={this.state.dialogImage}
          />
          <meta property="og:image:width" content="512" />
          <meta property="og:image:height" content="512" />
          <meta name="twitter:card" content="summary" />
          <meta
            name="twitter:description"
            content={this.props.productDetail.data.productName}
          />
          <meta
            name="twitter:title"
            content={this.props.productDetail.data.productName}
          />
          {/* <meta name="twitter:site" content="@Real_CSS_Tricks" /> */}
          <meta name="twitter:image" content={this.state.dialogImage} />
          {/* <meta name="twitter:creator" content="@adamcoti" /> */}
        </Head>
         {/* Header */}
        <Header
          showLoginHandler={this.showLoginHandler} hideStoreSelection={true} showLocation={true}
          isAuthorized={this.state.isAuthorized} hideCategory={true} showChildren={true}
          showLocationHandler={this.showLocationHandler} stores={this.props.stores ? this.props.stores.data : []}
          showCart={this.showCart} selectedStore={this.state.selectedStore} changeStore={this.changeStore}
        >
          <div className="col-12 py-2 px-1">
            <div className="row align-items-center">
              <div className="col-2 pl-0">
                <IconButton
                  onClick={() => Router.back()}
                  style={{ height: "30px", padding: "0px 12px" }}
                >
                  <img
                    src="/static/icons/Common/BackIcon.imageset/back_btn@2x.png"
                    width="24"
                  />
                </IconButton>
              </div>
              <div className="col-8 px-0 text-center">
                <h6 className="innerPage-heading lineSetter">
                  {this.props.productDetail && this.props.productDetail.data
                    ? this.props.productDetail.data.productName
                    : ""}
                </h6>
              </div>
            </div>
          </div>
        </Header>

        <div className="mobile-hide mt-5">
          <main className="main-div detailPage main-full" style={{ paddingTop: "20px" }}>
            <div className="scroller" style={{ display: "block", top: "0px" }}>
              <div
                className=""
                style={{ display: "block", margin: "0px auto" }}
              >
                <div className="col">
                  <div className="row mt-4">
                    {/* popup-Box */}
                    <div
                      className="col py-4 px-5 popUpBoxBtLayout"
                      style={{ background: "#fff" }}
                    >
                      {/* product-img-thumbnails  */}
                      <div className="row">
                        <div className="col-9 px-4 py-2">
                          <nav aria-label="breadcrumb" className="col-12 px-0">
                            <ol className="breadcrumb">
                              <li className="breadcrumb-item">
                                <a href="/">
                                  {isLangAvailable
                                    ? isLangAvailable["Header.home"]
                                    : "Home"}
                                </a>
                              </li>
                              {this.state.currentSlug ? (
                                <li className="breadcrumb-item">
                                  <a onClick={this.GoBack}>
                                    {this.state.currentSlug}
                                  </a>
                                </li>
                              ) : (
                                  ""
                                )}
                              <li
                                className="breadcrumb-item active"
                                aria-current="page"
                              >
                                <a
                                  style={{ textTransform: "capitalize" }}
                                  onClick={this.Reload}
                                >
                                  {this.state.product &&
                                    this.state.product.productName
                                    ? this.state.product.productName
                                    : ""}
                                </a>
                              </li>
                            </ol>
                          </nav>
                        </div>
                        <div className="col-3 py-2">
                          {/* <span style={{ fontSize: "11px", margin: "0px 5px", color: "#8a8888" }}>Sold By: </span>  <a onClick={this.LeftSliderHandler}><span className={"color-black"} style={{ borderBottom: "0.7px dotted #a8a2a2" }} onClick={this.LeftSliderHandler}> <i className="fa fa-map-marker d-none" aria-hidden="true"></i> {this.props.productDetail ? this.props.productDetail.data.businessName : "Change Store"} <FontIcon className="material-icons" style={{ fontSize: "11px", marginRight: '0px', padding: '2px 0px', color: "#444" }}> <i className="fa fa-angle-down"></i></FontIcon></span></a> */}
                        </div>
                        <div className="col border-bottom py-3 paddLRProdModalBtCustom">
                          <div className="row">
                            <div
                              className="col-6"
                            // style={{ overflowX: "hidden" }}
                            >
                              {this.state.dialogImage ? (
                                <ReactImageMagnify
                                  imageStyle={{
                                    objectFit: "contain",
                                    maxHeight: 300
                                  }}
                                  {...{
                                    smallImage: {
                                      isFluidWidth: false,
                                      src: this.state.dialogImage,
                                      width: 500,
                                      height: 340,
                                      objectFit: "contain",
                                      padding: 25,
                                      background: "#fff"
                                    },
                                    largeImage: {
                                      isFluidWidth: true,
                                      src: this.state.dialogImage,
                                      width: 1200,
                                      height: 900,
                                      background: "#fff",
                                      objectFit: "contain"
                                    },
                                    shouldUsePositiveSpaceLens: false,
                                    enlargedImageContainerStyle: {
                                      background: "#fff",
                                      zIndex: 9999,
                                      width: 200,
                                      height: 400
                                    },
                                    enlargedImageStyle: {
                                      zoom: 1
                                    },
                                    lensStyle: {
                                      height: 80,
                                      width: 80
                                    }
                                  }}
                                />
                              ) : (
                                  <img
                                    className="shine"
                                    src=""
                                    width="300"
                                    height="275"
                                  />
                                )}
                              <div className="row">
                                <div className="col">
                                  <div className="product-img-thumbnails scrollerthin">
                                    {this.state.product &&
                                      this.state.product.mobileImage
                                      ? this.state.product.mobileImage.map(
                                        (step, index) => (
                                          <img
                                            key={"imagekey" + index}
                                            style={{ objectFit: "contain" }}
                                            onError={e => {
                                              e.target.onerror = null;
                                              e.target.src =
                                                enVariables.DESK_LOGO;
                                            }}
                                            onClick={() =>
                                              this.selectedImage(step.image)
                                            }
                                            src={step.image}
                                            alt={step.image}
                                          />
                                        )
                                      )
                                      : ""}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="row">
                                {this.state.product ? (
                                  <div className="col">
                                    <div className="row">
                                      <div className="col-12 px-0">
                                      <div className="d-flex align-items-center justify-content-between">
                                        <h3 className="productDetailsTitle">
                                          {this.state.product.productName}
                                        </h3>
                                        
                                        <div
                                              className=""
                                              data-toggle="modal"
                                              href="#wishListModal"
                                              style={{
                                                paddingRight: "18px",
                                                textAlign: "center"
                                              }}
                                            >
                                              <img
                                                src="/static/images/grocer/list.png"
                                                className=""
                                                width="15"
                                                alt="addWishIcon"
                                              />
                                              </div>
</div>
                                        <p className="prodShortDesc">
                                          {this.state.product.shortDescription}
                                        </p>

                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                    ""
                                  )}
                              </div>

                              <div className="row align-items-end">
                                <div className="col-12 px-0">
                                  {
                                    //   this.state.selectedUnit &&
                                    // this.state.selectedUnit.appliedDiscount > 0 ? (
                                    //   <div className="">
                                    //     {/* <p
                                    //       key="info-1"
                                    //       className="product-price product-real-price prodPriceBtP prodPriceBtPSpl"
                                    //     >
                                    //       {" "}
                                    //       {this.state.product.currencySymbol}
                                    //       {parseFloat(
                                    //         this.state.selectedUnit.finalPrice
                                    //       ).toFixed(2)}
                                    //       <span className="product-price-before prodPriceBtBefore m-0 p-0">
                                    //         {" "}
                                    //         {
                                    //           this.state.product.currencySymbol
                                    //         }{" "}
                                    //         {parseFloat(
                                    //           this.state.selectedUnit.value
                                    //         ).toFixed(2)}{" "}
                                    //       </span>
                                    //     </p> */}

                                    //         {/* original price */}
                                    //         {this.getPrice()}
                                    //        {/* select unit */}
                                    //        {this.getUnits()}
                                    //       {/* select unit */}

                                    //   </div>
                                    // ) : 
                                    this.state.product ? (
                                      <div className="row">
                                        <div className="col">
                                          {this.state.product ? (
                                            // original price
                                            this.getPrice()
                                          ) : (
                                              ""
                                            )}

                                          {/* select unit */}
                                          {this.getUnits()}
                                          {/* select unit */}
                                        </div>
                                      </div>
                                    ) : (
                                        ""
                                      )}
                                </div>


                                {this.getActionButtons(isLangAvailable, true)}

                                {/* available at store */}
                                <div className="row my-3">
                                  <div className="col-12">
                                    <p className="text-left">
                                      {this.props.locale.productavailable}
                                    </p>
                                    <p
                                      className="py-2"
                                      style={{ fontWeight: "900" }}
                                    >
                                      {this.state.product.businessName}
                                    </p>
                                    <p>{this.state.product.businessAddress}</p>
                                  </div>
                                </div>
                                {/* available at store */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* product-img-thumbnails */}

                      {/* similar products */}
                      <div className="row">
                        {/* <div className="col-12 px-md-5">
                              <SimilarList {...this.props} handleDetailToggle={this.handleDetailToggle} addToCart={this.addToCartForSimilar} locale={this.props.locale} editCart={this.editCart} selectedStore={this.props.selectedStore} heading={isLangAvailable ? isLangAvailable.general.similarProducts : 'Similar Products'} rowId="categoryList" />
                            </div> */}
                      </div>
                      {/* similar products */}

                      {/* description */}
                      {this.state.product ? (
                        this.state.product.detailedDescription &&
                          this.state.product.detailedDescription.length > 0 ? (
                            <div className="row my-3">
                              <div className="col px-0 px-md-5 paddLRProdModalBtCustom">
                                <div className="row">
                                  <div className="col-12 px-0 productModalAboutProductSection">
                                    <div className="info-product ">
                                      {this.state.loader == false ? (
                                        <div>
                                          <p className="productDetailsTitle">
                                            {isLangAvailable
                                              ? isLangAvailable.other.detDesc
                                              : this.props.locale.DetailedDescription||"Detailed Description"}
                                          </p>

                                          <p
                                            key="info-2"
                                            className="product-description prodDescBtP"
                                            style={{
                                              width: "100%",
                                              whiteSpace: "pre-wrap"
                                            }}
                                          >
                                            {
                                              this.state.product
                                                .detailedDescription
                                            }
                                          </p>
                                        </div>
                                      ) : (
                                          <p
                                            key="info-2"
                                            className="col-12 product-description shine"
                                            style={{
                                              margin: "10px",
                                              width: "100%",
                                              minWidth: "472px",
                                              minHeight: "30px"
                                            }}
                                          />
                                        )}
                                    </div>
                                    <div />

                                    <div className="info-product">
                                      {this.state.loader == false ? (
                                        this.state.product.ingredients ? (
                                          <div>
                                            <span className="product-price">
                                              {this.props.locale.ingred}
                                              </span>
                                            <p
                                              key="info-3"
                                              className="product-description prodDescBtP"
                                              style={{ width: "100%" }}
                                            >
                                              {this.state.product.ingredients}
                                            </p>
                                          </div>
                                        ) : (
                                            ""
                                          )
                                      ) : (
                                          <p
                                            key="info-3"
                                            className="col-12 product-description shine"
                                            style={{
                                              margin: "10px",
                                              width: "100%",
                                              minWidth: "472px",
                                              minHeight: "30px"
                                            }}
                                          />
                                        )}
                                    </div>
                                  </div>

                                  {/* disclaimer */}
                                  <div className="col-12 px-0 paddLRProdModalBtCustom">
                                    <p className="productDetailsTitle">
                                      {isLangAvailable
                                        ? isLangAvailable.other.disclaimer
                                        :this.props.locale.Disclaimer|| "Disclaimer"}
                                    </p>
                                    <p
                                      key="info-4"
                                      className="product-description prodDescBtP"
                                      style={{ width: "100%" }}
                                    >
                                      Product information or packaging displayed may not be
                                       current or complete. Always refer to the physical product
                                       for the most accurate information and warnings. For
                                       additional information, contact the retailer or
                                       manufacturer. *Some item weights
                                      </p>
                                  </div>
                                  {/* disclaimer */}

                                </div>
                              </div>

                              {this.state.loader == false &&
                                this.state.product
                                ? this.state.product.additionalEffects &&
                                  this.state.product.additionalEffects
                                    .length > 0
                                  ? this.state.product.additionalEffects.map(
                                    item => this.printAdditionalFacts(item)
                                  )
                                  : ""
                                : ""}
                            </div>
                          ) : (
                            ""
                          )
                      ) : (
                          ""
                        )}

                      {/* description */}

                      {/* similar branded products */}
                      {/* <div className="row">
                                                <div className="col-12">
                                                    <SimilarBrandedList {...this.props} handleDetailToggle={this.handleDetailToggle} addToCart={this.addToCartForSimilar} editCart={this.editCart} selectedStore={this.props.selectedStore} heading={"Similar Branded Products"} rowId="categoryList" />
                                                </div>
                                            </div> */}
                      {/* similar branded products */}

                    </div>
                  </div>
                </div>

              </div>
            </div>
          </main>
        </div>

        {/* mobile view upper part */}
        <div
          className="scroller horizontal-scroll mobile-show"
          style={{ marginTop: "60px", marginBottom: "50px", maxHeight: "78vh" }}
        >
           <div
                                              className=""
                                              data-toggle="modal"
                                              href="#wishListModal"
                                              style={{
                                                paddingRight: "18px",
                                                textAlign: "right",
                                                paddingTop:"20px"
                                              }}
                                            >
                                              <img
                                                src="/static/images/grocer/list.png"
                                                className=""
                                                width="15"
                                                alt="addWishIcon"
                                              />
                                              </div>
          <div className="col-12 productDetaildDialogBt">
            <div className="row">
              <div className="col-12 mb-2">
                <ProductImageSlider product={this.state.product} />
              </div>
            </div>

            <div className="row">
              <div className="col-12 favAddListSecMView py-3">
                <div className="row">
                  {/* || (this.state.favtProducts.findIndex((item) => item.productId == this.state.product.childProductId) >= 0)
                                                    (this.state.favtProducts.findIndex((item) => item.childProductId == this.state.product.childProductId) >= 0)) */}
                  <div className="col-12 text-center">
                    <div onClick={this.editFavorite}>
                      {this.state.product &&
                        this.state.favtProducts &&
                        this.state.favtProducts.findIndex(
                          item =>
                            item.childProductId == this.state.product.productId
                        ) >= 0 ? (
                          <p
                            className="wishFavBtP"
                            style={{
                              color: enVariables.BASE_COLOR,
                              fontSize: "12px",
                              fontWeight: 400
                            }}
                          >
                            {/* <img src="/static/images/solid-heart.png" className="" width="23" alt="addFavIcon" />  */}
                            <i
                              className="fa fa-heart"
                              style={{ fontSize: "20px" }}
                              aria-hidden="true"
                            />
                            <br />
                            {this.props.locale.favorited||"Favorited"}
                        </p>
                        ) : (
                          <p
                            className="wishFavBtP"
                            style={{
                              color: enVariables.BASE_COLOR,
                              fontSize: "12px",
                              fontWeight: 400
                            }}
                          >
                            {/* <img src="/static/images/addFavIconSelect.png" className="" width="23" alt="addFavIcon" /> */}
                            <i
                              className="fa fa-heart-o"
                              style={{ fontSize: "20px" }}
                              aria-hidden="true"
                            />
                            <br />
                            {this.props.locale.addToFav||"Add to Favorite"}
                        </p>
                        )}
                    </div>
                  </div>

                  {/* <div
                    className="col-6 text-center "
                    data-toggle="modal"
                    href="#wishListModal"
                  >
                    <img
                      src="/static/images/addWishIconSelect.png"
                      className=""
                      width="20"
                      alt="addWishIcon"
                    />
                    <p className="favAddListCommMView">Add To List</p>
                  </div> */}
                </div>
              </div>
            </div>

            <div className="row" style={{ borderTop: "1px solid #ddd" }}>
              <div className="col-12 text-left pdTitleBtSec py-3 px-4">
                <h6 className="pdH6Title">
                  {this.state.product ? this.state.product.productName : ""}
                </h6>
                <p className="pdPTitle">
                  {this.state.product ? this.state.product.catName.en : ""}
                </p>
             {/* price  */}
                <p>
                  {this.getPrice(true)}
                </p>
              </div>
            </div>
            {/* shortDescription */}
            {this.state.product &&
              this.state.product.shortDescription &&
              this.state.product.shortDescription.length > 0 ? (
                <div className="row">
                  <div className="col-12" style={{ background: "#eee" }}>
                    <div className="row">
                      <div className="col-12 px-4 pdDescTitleCommSec">
                        <h6 className="pdDescTitleH6Comm">{this.props.locale.des||"Description"}</h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 px-4 pdDescCommtxt">
                        <p className="pdPTitle">
                          {this.state.product.shortDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            {/* ingredients */}
            {this.state.product &&
              this.state.product.ingredients &&
              this.state.product.ingredients.length > 0 ? (
                <div className="row">
                  <div className="col-12" style={{ background: "#eee" }}>
                    <div className="row">
                      <div className="col-12 px-4 pdDescTitleCommSec">
                        <h6 className="pdDescTitleH6Comm">{this.props.locale.ingred||"Ingredients"}</h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 px-4 pdDescCommtxt">
                        <p className="pdPTitle">
                          {this.state.product.ingredients}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}

            <div className="row">
              {this.state.product &&
                this.state.product.additionalEffects &&
                this.state.product.additionalEffects.length > 0
                ? this.state.product.additionalEffects.map(item =>
                  this.printAdditionalFacts(item)
                )
                : ""}
            </div>
            {/* Disclaimer */}
            <div className="row" id="lastRowDetail">
              <div className="col-12">
                <div className="row">
                  <div
                    className="col-12 px-4 pdDescTitleCommSec"
                    style={{ background: "#eee" }}
                  >
                    <h6 className="pdDescTitleH6Comm">{this.props.locale.Disclaimer}</h6>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 px-4 pdDescCommtxt">
                    <p className="pdPTitle">
                      Product information or packaging displayed may not be
                      current or complete. Always refer to the physical product
                      for the most accurate information and warnings. For
                      additional information, contact the retailer or
                      manufacturer. *Some item weights
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="checkoutToPayLayout border mobile-show" id="mobileDetailFooter">
          <div style={{ background: "#fff", borderTop: "1px solid #eee" }}>
            <div className="col-12 addCartSecBtFB ">
              {/* units */}
              {this.getUnits(true)}

              {/* <div className="row px-1 justify-content-left text-left">
               {this.state.product &&
                  this.state.product.units &&
                  this.state.product.units.length > 0
                  ? this.state.product.units.map((unit, index) => (
                    <div
                      className="col-auto pr-0"
                      style={{ maxWidth: "100%" }}
                      key={"customRadio-mobi-" + index}
                    >
                      <input
                        id={"detail-mobi-" + unit.unitId}
                        name="should_be_same"
                        onChange={() => this.selectedUnit(unit)}
                        className="customradio"
                        type="radio"
                      />
                      <label htmlFor={"detail-mobi-" + unit.unitId}>{unit.title}</label>
                    </div>
                  ))
                  : ""} 
              </div>*/}
              <div className="clearfix" />

              <div className="row">
                <div className="col-12 ">
                  <div className="row">
                    <div className="col-12">
                      {this.getActionButtons(isLangAvailable, false)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* fixedBottom */}
{/* ui for the wishlist model */}
        <div className="modal fade" id="wishListModal" style={{ top: "18vh" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header text-center">
                <div
                  className="row w-100 align-items-center py-1"
                  style={{ right: "0px", backgroundColor: "white" }}
                >
                  <div className="col pt-2 text-left">
                    <h6
                      className="lineSetter"
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#333"
                      }}
                    >
                      Add to List
                    </h6>
                  </div>
                  <div className="col-1 pt-1 text-right">
                    <a href="/" data-dismiss="modal">
                      <img
                        src="/static/icons/Common/CloseIcon.imageset/close_btn@3x.png"
                        width="13"
                      />
                    </a>
                  </div>
                </div>
                {/* <div className="row align-items-center">
                                    <p className="text-center w-100 my-1"></p>
                                    <button type="button" className="close" >&times;</button>
                                </div> */}
              </div>

              <div className="modal-body px-0">
                <WishListModalContent updateCheck={this.updateCheck} />
              </div>

              <div className="text-center py-3">
                <button
                  type="button"
                  onClick={() => this.addToWishList()}
                  style={{ width: "50%", color: "white", background: "orange" }}
                  className="wishListModalBtn"
                  data-dismiss="modal"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>

        <Authmodals
          onRef={ref => (this.child = ref)}
          editCart={this.editCart}
        />
        <ExpireCartDialog onRef={ref => (this.expRef = ref)} />

        <StoreRightSlider onRef={ref => (this.StoreSlider = ref)} width={this.state.SliderWidth} stores={this.props.stores && this.props.stores.data ? this.props.stores.data : []} changeStore={this.changeStore} />

        <CustomizedSnackbars onRef={ref => (this.SnackbarRef = ref)} type={this.state.toastType} message={this.state.showToastErr} />

        <AddOnDialog
          onRef={ref => (this.dialogRef = ref)}
          showLoginHandler={this.showLoginHandler}
          isAuthorized={this.state.isAuthorized}
          currencySymbol={currencySymbol} myCart={this.props.myCart}
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
          openAddOnDialog={this.openAddOnDialog}
          openAddOnSlider={this.openAddOnSlider}
          isAuthorized={this.state.isAuthorized}
        />

      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    reduxState: state,
    myCart: state.cartList,
    cartProducts: state.cartProducts,
    userProfileDetail: state.userProfile,
    stores: state.stores,
    locale:state.locale
  };
};

export default connect(mapStateToProps)(Itemdetails);
