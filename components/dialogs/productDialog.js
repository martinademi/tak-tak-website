import React from "react";
import Dialog from "material-ui/Dialog";
import DialogTitle from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import { connect } from "react-redux";
import RefreshIndicator from "material-ui/RefreshIndicator";

import { getProductDetails } from "../../services/category";
import { getCookie } from "../../lib/session";
import { List, ListItem, ListItemText } from "material-ui/List";
import * as actions from "../../actions/index";
import $ from "jquery";
import ProductImageSlider from "./slider";
import ReactImageMagnify from "react-image-magnify";
import { CSSTransition } from "react-transition-group";
import {
  editFavtService,
  addToWishlistService,
  getFavtProducts,
  addProductToWishList
} from "../../services/cart";
import WishListModalContent from "../wishlist/wishlist";
import CircularProgressLoader from "../ui/loaders/circularLoader";

const styles = {
  radioButton: {
    marginTop: 16
  },
  container: {
    position: "relative",
    background: "white"
  }
};

/**
 * Dialog content can be scrollable.
 */

class ProductDialog extends React.Component {
  state = {
    open: false,
    product: [],
    details: [],
    loader: false,
    showDetails: false,
    selctedUnit: null,
    dialogImage: null,
    isFav: false,
    favtProducts: [],
    listOpen: false,
    listArray: [],
    showProgress: false,
    loading: false,
    isBlast: false
  };

  constructor(props) {
    super(props);
    this.openProductDialog = this.openProductDialog.bind(this);
    this.selctedUnit = this.selctedUnit.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.selectedImage = this.selectedImage.bind(this);
    this.updateCheck = this.updateCheck.bind(this);
  }
  dataArray = [];
  openProductDialog = async product => {
    this.setState({ dialogImage: null, product: product, loader: true });
    let lat = getCookie("lat", "");
    let lng = getCookie("long", "");
    let token = getCookie("token", "");

    $("body").css("overflow", "hidden");

    await setTimeout(() => {
      this.props.cartProducts.findIndex(
        item => item.childProductId == this.state.product.childProductId
      ) >= 0
        ? this.setState({ open: true, showDetails: true })
        : this.setState({ open: true, showDetails: true });
    }, 100);

    await getProductDetails(product.childProductId, lat, lng, token).then(
      ({ data }) => {
        data.error ? "" : this.setState({ details: data.data, loader: false });
      }
    );

    this.state.product.mobileImage
      ? this.selectedImage(this.state.product.mobileImage[0].image)
      : "";
  };

  closeProductDialog = () => {
    $("body").css("overflow", "scroll");
    this.setState({
      open: false,
      product: null,
      details: null,
      loader: false,
      selctedUnit: null
    });
    this.render();
  };

  getFavorites = () => {
    let favtdata = {
      storeID: getCookie("storeId"),
      zoneID: getCookie("zoneid"),
      type: 0
    };
    getFavtProducts(favtdata.storeID).then(({ data }) => {
      // data.error ? "" : this.setState({ favtProducts: data.data });
    });
  };

  componentDidMount() {
    this.props.onRef(this);
    let isAuthorized = getCookie("authorized", "");
    isAuthorized ? this.props.dispatch(actions.getCart()) : "";

    this.getFavorites();
  }

  selctedUnit = unit => {
    this.setState({ selctedUnit: unit });
  };

  editCart = (cartDetail, type) => {
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

  selectedImage = url => {
    this.setState({ dialogImage: url });
  };

  addToCart = async selectedUnit => {
    let isAuthorized = await getCookie("authorized", "");
    let cartData;
    isAuthorized
      ? ((cartData = {
          childProductId: this.state.product.childProductId,
          unitId: selectedUnit.unitId,
          quantity: parseFloat(1).toFixed(1)
        }),
        this.props.dispatch(actions.initAddCart(cartData)),
        setTimeout(() => {
          this.props.dispatch(actions.getCart());
        }, 100))
      : this.props.showLoginHandler();
  };

  editFavorite = async () => {
    let isAuthorized = await getCookie("authorized", "");
    // this.setState({ loading: true});
    let data = {
      childProductId: this.state.product.childProductId,
      parentProductId: this.state.product.parentProductId
    };
    isAuthorized
      ? editFavtService(data).then(({ data }) => {
          data.error
            ? ""
            : // toastr.success(data.message),
              (this.getFavorites(),
              this.props.getFavtData ? this.props.getFavtData() : "",
              this.setState({ loading: false, isBlast: true }));
        })
      : this.props.showLoginHandler();
  };

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
  handleWishlist = () => this.setState({ listOpen: true });
  handleListClose = () => this.setState({ listOpen: false });
  addToWishList = () => {
    this.setState({ listOpen: true, showProgress: true });
    let data = {
      parentProductId: this.state.details.parentProductId,
      childProductId: this.state.details.productId,
      storeId: getCookie("storeId", ""),
      list: this.state.listArray
    };

    addProductToWishList(data).then(data => {
      data.error
        ? this.setState({ showProgress: false, listOpen: false })
        : this.setState({ showProgress: false, listOpen: false });
    });
  };
  handleFav = () => {
    this.setState({ isBlast: !this.state.isBlast });
  };
  componentWillUnmount() {
    this.setState({ dialogImage: null });
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
      <div className="col-4">
        <div className="row mt-3">
          <div className="col-12 nutritionalFactsLayout">
            <h6 className="product-price">{facts.name}</h6>
          </div>
        </div>

        <div className="row">
          <div className="col-12 mx-3 pdDescCommtxt border">
            <ul class="nav flex-column">
              <li class="nav-item">
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
    const lang = this.props.lang;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.closeProductDialog}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={this.closeProductDialog}
      />
    ];

    let databox;

    this.state.open ? (databox = "block") : (databox = "none");

    return this.state.showDetails ? (
      <div
        className="popup-Box-Overlay scroller"
        style={{ display: databox, top: "0px" }}
      >
        <div
          className="popup-Box "
          style={{ display: databox, margin: "10px auto" }}
        >
          <div className="col">
            <div className="row">
              {/* popup-Box */}
              <div className="col py-4 popUpBoxBtLayout">
                {/* popUpBoxCloseLayout */}
                <div className="productBoxCloseLayout">
                  <a onClick={this.closeProductDialog}>
                    <img
                      src="/static/images/popUpBoxClose.svg"
                      height="20"
                      width="24"
                    />
                  </a>
                </div>
                {/* popUpBoxCloseLayout */}

                {/* breadcrumb */}
                <div className="row">
                  {/* <div className="col paddLRProdModalBtCustom">
                                            <nav aria-label="breadcrumb">
                                                <ol class="breadcrumb">
                                                    <li class="breadcrumb-item"><a href="#">Pantry</a></li>
                                                    <li class="breadcrumb-item active" aria-current="page">Doughs, Gelatins & Bake Mixes</li>
                                                </ol>
                                            </nav>
                                        </div> */}
                </div>
                {/* breadcrumb */}

                {/* product-img-thumbnails  */}
                <div className="row">
                  <div className="col border-bottom py-3 paddLRProdModalBtCustom">
                    <div className="row">
                      <div className="col-6">
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
                                width: 350,
                                height: 300,
                                objectFit: "contain",
                                padding: 25,
                                background: "#fff"
                              },
                              largeImage: {
                                isFluidWidth: false,
                                src: this.state.dialogImage,
                                width: 1200,
                                height: 900,
                                background: "#fff",
                                objectFit: "contain"
                              },
                              shouldUsePositiveSpaceLens: false,
                              enlargedImageContainerStyle: {
                                background: "#fff",
                                zIndex: 1000,
                                width: 300,
                                height: 300
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
                          <div className="col py-3">
                            <div className="product-img-thumbnails scrollerthin">
                              {this.state.product &&
                              this.state.product.mobileImage
                                ? this.state.product.mobileImage.map(
                                    (step, index) => (
                                      <img
                                        key={"imagekey" + index}
                                        style={{ objectFit: "contain" }}
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
                          <div className="col pb-2">
                            {this.state.product ? (
                              <div>
                                <h3 className="prodDialogH3 mb-0">
                                  {this.state.product.productName}
                                </h3>
                                <p className="byStore">
                                  by {this.state.product.storeName}
                                </p>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>

                        <div className="row">
                          <div className="col py-2">
                            {this.state.loader == false
                              ? this.state.details &&
                                this.state.details.units &&
                                this.state.details.units.length > 0
                                ? this.state.details.units.map(
                                    (unit, index) => (
                                      <div key={"customRadio" + index}>
                                        <div className="float-left">
                                          <input
                                            id={unit.unitId}
                                            name="should_be_same"
                                            onChange={() =>
                                              this.selctedUnit(unit)
                                            }
                                            className="customradio"
                                            type="radio"
                                          />
                                          <label htmlFor={unit.unitId}>
                                            {unit.title}
                                          </label>
                                        </div>
                                      </div>
                                    )
                                  )
                                : ""
                              : ""}
                          </div>
                        </div>

                        <div className="row">
                          <div className="col">
                            {this.state.selctedUnit ? (
                              <div className="pb-4">
                                <p
                                  key="info-1"
                                  className="product-price product-real-price prodPriceBtP prodPriceBtPSpl"
                                >
                                  {" "}
                                  {this.state.details.currencySymbol}
                                  {parseFloat(
                                    this.state.selctedUnit.finalPrice
                                  ).toFixed(2)}
                                  <span className="product-price-before prodPriceBtBefore">
                                    {" "}
                                    {this.state.details.currencySymbol}{" "}
                                    {parseFloat(
                                      this.state.selctedUnit.value
                                    ).toFixed(2)}{" "}
                                  </span>
                                </p>
                                <p className="product-saving">
                                  {" "}
                                  Save {this.state.details.currencySymbol}{" "}
                                  {parseFloat(
                                    this.state.selctedUnit.appliedDiscount
                                  ).toFixed(2) || 0}{" "}
                                </p>
                                <div className="buttons-product">
                                  {this.state.product ? (
                                    this.props.cartProducts.findIndex(
                                      item =>
                                        item.unitId ==
                                        this.state.selctedUnit.unitId
                                    ) < 0 ? (
                                      this.state.selctedUnit.outOfStock ? (
                                        <button
                                          className="btn btn-disabled w-100 prodModalAddCartBtn"
                                          title="Out of stock"
                                          style={{
                                            float: "none",
                                            backgroundColor: "#aaa",
                                            cursor: "not-allowed"
                                          }}
                                        >
                                          {" "}
                                          {lang.addTocart || "Add To Cart"}
                                        </button>
                                      ) : (
                                        <button
                                          className="btn btn-default w-100 prodModalAddCartBtn"
                                          style={{ float: "none" }}
                                          onClick={() =>
                                            this.addToCart(
                                              this.state.selctedUnit
                                            )
                                          }
                                        >
                                          {" "}
                                          {lang.addTocart || "Add To Cart"}
                                        </button>
                                      )
                                    ) : (
                                      <div className="calculator-market shadow">
                                        <button
                                          onClick={() =>
                                            this.editCart(
                                              this.props.cartProducts[
                                                this.props.cartProducts.findIndex(
                                                  item =>
                                                    item.unitId ==
                                                    this.state.selctedUnit
                                                      .unitId
                                                )
                                              ],
                                              1
                                            )
                                          }
                                          className="subtract"
                                        >
                                          -
                                        </button>
                                        <div>
                                          {
                                            this.props.cartProducts[
                                              this.props.cartProducts.findIndex(
                                                item =>
                                                  item.unitId ==
                                                  this.state.selctedUnit.unitId
                                              )
                                            ].quantity
                                          }
                                        </div>
                                        <button
                                          onClick={() =>
                                            this.editCart(
                                              this.props.cartProducts[
                                                this.props.cartProducts.findIndex(
                                                  item =>
                                                    item.unitId ==
                                                    this.state.selctedUnit
                                                      .unitId
                                                )
                                              ],
                                              2
                                            )
                                          }
                                        >
                                          +
                                        </button>
                                      </div>
                                    )
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            ) : this.state.loader == false &&
                              this.state.details ? (
                              <div>
                                <p
                                  key="info-1"
                                  className="product-price product-real-price prodPriceBtP prodPriceBtPSpl"
                                >
                                  {" "}
                                  {this.state.details.currencySymbol}
                                  {parseFloat(
                                    this.state.details.units[0].finalPrice
                                  ).toFixed(2)}
                                  {this.state.details.units[0].appliedDiscount >
                                  0 ? (
                                    <span className="product-price-before prodPriceBtBefore">
                                      {" "}
                                      {this.state.details.currencySymbol}
                                      {parseFloat(
                                        this.state.details.units[0].value
                                      ).toFixed(2)}{" "}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </p>
                                {this.state.details.units[0].appliedDiscount >
                                0 ? (
                                  <p className="product-saving prodSavingBt">
                                    {" "}
                                    Save {
                                      this.state.details.currencySymbol
                                    }{" "}
                                    {parseFloat(
                                      this.state.details.units[0]
                                        .appliedDiscount
                                    ).toFixed(2) || 0}{" "}
                                  </p>
                                ) : (
                                  ""
                                )}
                                <div className="buttons-product">
                                  {this.state.details &&
                                  this.state.details.units &&
                                  this.state.details.units.length > 0 ? (
                                    this.props.cartProducts.findIndex(
                                      item =>
                                        item.unitId ==
                                        this.state.details.units[0].unitId
                                    ) < 0 ? (
                                      this.state.details.units[0].outOfStock ? (
                                        <button
                                          className="btn btn-disabled w-100 prodModalAddCartBtn"
                                          title="Out of stock"
                                          style={{
                                            float: "none",
                                            backgroundColor: "#aaa",
                                            cursor: "not-allowed"
                                          }}
                                        >
                                          {" "}
                                          {lang.addTocart || "Add To Cart"}
                                        </button>
                                      ) : (
                                        <button
                                          className="btn btn-default w-100 prodModalAddCartBtn"
                                          onClick={() =>
                                            this.addToCart(
                                              this.state.details.units[0]
                                            )
                                          }
                                          style={{ float: "none" }}
                                        >
                                          {" "}
                                          {lang.addTocart || "Add To Cart"}
                                        </button>
                                      )
                                    ) : (
                                      <div className="calculator-market shadow">
                                        <button
                                          onClick={() =>
                                            this.editCart(
                                              this.props.cartProducts[
                                                this.props.cartProducts.findIndex(
                                                  item =>
                                                    item.unitId ==
                                                    this.state.details.units[0]
                                                      .unitId
                                                )
                                              ],
                                              1
                                            )
                                          }
                                          className="subtract"
                                        >
                                          -
                                        </button>
                                        <div>
                                          {
                                            this.props.cartProducts[
                                              this.props.cartProducts.findIndex(
                                                item =>
                                                  item.unitId ==
                                                  this.state.details.units[0]
                                                    .unitId
                                              )
                                            ].quantity
                                          }
                                        </div>
                                        <button
                                          onClick={() =>
                                            this.editCart(
                                              this.props.cartProducts[
                                                this.props.cartProducts.findIndex(
                                                  item =>
                                                    item.unitId ==
                                                    this.state.details.units[0]
                                                      .unitId
                                                )
                                              ],
                                              2
                                            )
                                          }
                                        >
                                          +
                                        </button>
                                      </div>
                                    )
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>

                        <div className="row wishFavBtRow">
                          <div className="col">
                            <div className="border-top">
                              <div className="row justify-content-around">
                                <div
                                  className="col-auto wishFavBt"
                                  onClick={() => this.handleWishlist()}
                                >
                                  <img
                                    src="/static/images/addWishIconSelect.png"
                                    className=""
                                    width="20"
                                    alt="addWishIcon"
                                  />
                                  <p
                                    className="wishFavBtP"
                                    style={{ lineHeight: "27px" }}
                                  >
                                    {lang.wishlist || "Wishlist"}
                                  </p>
                                </div>
                                <div
                                  className="col-5 wishFavBt"
                                  onClick={() => this.editFavorite()}
                                >
                                  {" "}
                                  {/* <div
                                    className={
                                      this.state.isBlast
                                        ? "heart heart-blast"
                                        : "heart"
                                    }
                                    // onClick={this.handleFav}
                                  /> */}
                                  {/* <CSSTransition
                                    in={
                                      this.state.product &&
                                      this.state.favtProducts &&
                                      this.state.favtProducts.findIndex(
                                        item =>
                                          item.childProductId ==
                                          this.state.product.childProductId
                                      ) < 0
                                    }
                                    timeout={100}
                                    classNames="stickeyHeader"
                                    unmountOnExit
                                  >
                                    <p className="wishFavBtP">
                                      <i
                                        className="fa fa-heart-o"
                                        style={{ fontSize: "20px" }}
                                        aria-hidden="true"
                                      />
                                      <br />
                                      
                                    </p>
                                  </CSSTransition> */}
                                  {this.state.product &&
                                  this.state.favtProducts &&
                                  this.state.favtProducts.findIndex(
                                    item =>
                                      item.childProductId ==
                                      this.state.product.childProductId
                                  ) >= 0 ? (
                                    <p className="wishFavBtP">
                                      <i
                                        className="fa fa-heart"
                                        style={{ fontSize: "20px" }}
                                        aria-hidden="true"
                                      />
                                      <br />
                                      {lang.favorited || "Favorited"}
                                    </p>
                                  ) : (
                                    <p className="wishFavBtP">
                                      <i
                                        className="fa fa-heart-o"
                                        style={{ fontSize: "20px" }}
                                        aria-hidden="true"
                                      />
                                      <br />
                                      {lang.addToFav || "Add to Favorite"}
                                    </p>
                                  )}
                                  {/* <p className="wishFavBtP">Favorite</p> */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* product-img-thumbnails */}

                {/* descriptionFacts */}
                <div className="row">
                  <div className="col py-5 px-md-5 border-bottom paddLRProdModalBtCustom">
                    <div className="row">
                      {this.state.loader == false && this.state.details ? (
                        this.state.details.detailedDescription ||
                        this.state.details.ingredients ? (
                          <div className="col-12">
                            <div className="row">
                              <div className="col-12 pt-3 productModalAboutProductSection">
                                <div className="info-product">
                                  {this.state.loader == false ? (
                                    this.state.details.detailedDescription ? (
                                      <div>
                                        <span className="product-price">
                                          {lang.des || "Description"}
                                        </span>
                                        <p
                                          key="info-2"
                                          className="product-description prodDescBtP"
                                          style={{ width: "100%" }}
                                        >
                                          {
                                            this.state.details
                                              .detailedDescription
                                          }
                                        </p>
                                      </div>
                                    ) : (
                                      ""
                                    )
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

                                <div className="info-product">
                                  {this.state.loader == false ? (
                                    this.state.details.ingredients ? (
                                      <div>
                                        <span className="product-price">
                                          {lang.ingred || "Ingredients"}
                                        </span>
                                        <p
                                          key="info-3"
                                          className="product-description prodDescBtP"
                                          style={{ width: "100%" }}
                                        >
                                          {this.state.details.ingredients}
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
                            </div>
                          </div>
                        ) : (
                          ""
                        )
                      ) : (
                        ""
                      )}

                      {this.state.loader == false && this.state.details
                        ? this.state.details.additionalEffects &&
                          this.state.details.additionalEffects.length > 0
                          ? this.state.details.additionalEffects.map(item =>
                              this.printAdditionalFacts(item)
                            )
                          : ""
                        : ""}
                    </div>
                  </div>
                </div>
                {/* descriptionFacts */}

                {/* disclaimer */}
                <div className="row">
                  <div className="col pt-4 px-5 paddLRProdModalBtCustom">
                    {/* <span className="product-price">Disclaimer</span> */}
                    <p
                      key="info-4"
                      className="product-description prodDisclaimerBt"
                      style={{ width: "100%" }}
                    >
                      {lang.productinfo ||
                        `Productinformation or packaging displayed may not be
                      current or complete. Always refer to the physical product
                      for the most accurate information and warnings. For
                      additional information, contact the retailer or
                      manufacturer. *Some item weights, like produce, are
                      measured by shoppers using in-aisle scales. The weight of
                      items from the deli, meat and seafood counters are
                      determined by the label applied in-store to those items.`}
                    </p>
                  </div>
                </div>
                {/* disclaimer */}
              </div>
              {/* popup-Box */}
            </div>
          </div>
          {/* </Dialog> */}
        </div>
        {this.state.loading ? <CircularProgressLoader /> : ""}
        <Dialog
          title={
            <div class="text-center p-3">
              <p class="text-center w-100 my-1">
                {lang.addToList || "Add to List"}
              </p>
              <button
                type="button"
                class="close"
                onClick={this.handleListClose}
                style={{
                  fontSize: "35px",
                  position: "absolute",
                  right: "25px",
                  top: "20px"
                }}
              >
                &times;
              </button>
            </div>
          }
          modal={false}
          open={this.state.listOpen}
          onRequestClose={this.handleClose}
          contentStyle={{ marginTop: "-100px" }}
        >
          <div class="modal-body px-0">
            <WishListModalContent updateCheck={this.updateCheck} />
          </div>

          <div class="text-center pt-3 py-2">
            <button
              type="button"
              onClick={() => this.addToWishList()}
              style={{ width: "50%", color: "white", background: "orange" }}
              class="wishListModalBtn"
              data-dismiss="modal"
            >
              {lang.confirm || "Confirm"}
              {this.state.showProgress ? (
                <RefreshIndicator
                  size={30}
                  left={1}
                  top={0}
                  status="loading"
                  style={{
                    background: "transparent",
                    boxShadow: "none",
                    float: "right",
                    position: "relative"
                  }}
                />
              ) : (
                ""
              )}
            </button>
          </div>
        </Dialog>
      </div>
    ) : (
      ""
    );
  }
}

const mapStateToProps = state => {
  return {
    reduxState: state,
    myCart: state.cartList,
    cartProducts: state.cartProducts,
    lang: state.locale
  };
};

export default connect(mapStateToProps)(ProductDialog);
