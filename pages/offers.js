import { Component } from "react";
import { connect } from "react-redux";
import Head from "next/head";
import fetch from "isomorphic-unfetch";
import Router from "next/router";

import redirect from "../lib/redirect";
import Wrapper from "../hoc/wrapperHoc";
import Header from "../components/header/innerPageHeader";
import Authmodals from "../components/authmodals/index";
import Footer from "../components/footer/Footer";
import * as actions from "../actions/index";
import {
  setCookie,
  getCookie,
  getCookiees,
  removeCookie,
} from "../lib/session";

import { getCategories, getStores, getProducts } from "../services/category";
import { redirectIfNotAuthenticated, getJwt, getLocation } from "../lib/auth";
import ProductsListComponent from "../components/productList/productList";
import {
  getFilterParams,
  searchFilterParams,
  sortFilterParams,
} from "../services/filterApis";
import { FontIcon, IconButton } from "material-ui";
import CircularProgressLoader from "../components/ui/loaders/circularLoader";
import * as enVariables from "../lib/envariables";
import CategoryProductsList from "../components/productList/categoryProductList";
import "../assets/login.scss";
import "../assets/style.scss";

class OfferProducts extends Component {
  static async getInitialProps({ ctx, router }) {
    let getCategoryList = [];

    let token = getCookiees("token", ctx.req);
    let lat = getCookiees("lat", ctx.req);
    let lng = getCookiees("long", ctx.req);
    let zoneID = getCookiees("zoneid", ctx.req);
    const userName = await getCookiees("username", ctx.req);
    const isAuthorized = await getCookiees("authorized", ctx.req);
    let zoneDetails = (await getCookiees("zoneDetails", ctx.req)) || null;
    const queries = ctx.query;
    let queryStoreId = queries.store || getCookiees("storeId", ctx.req);
    let queryOfferId = queries.offerId || getCookiees("offerId", ctx.req);
    let filterType = queries.type || getCookiees("filterType", ctx.req);
    // const jwt = getJwt(ctx);

    if (redirectIfNotAuthenticated(ctx)) {
      return {};
    }

    // const getCategory = await fetch(enVariables.API_HOST + '/business/home/' + zoneID + '/' + queryStoreId + '/0/2/' + queryOfferId, {
    //     method: "get",
    //     headers: {
    //         'language': 'en',
    //         'content-type': 'application/json',
    //         'authorization': token
    //     },
    // });
    // getCategoryList = await getCategory.json();
    let lang = (await (queries.lang || getCookiees("lang", ctx.req))) || "en";
    ctx && ctx.store ? ctx.store.dispatch(actions.selectLocale(lang)) : "";
    let StoreName = getCookiees("storeName", ctx.req);
    return {
      getCategoryList,
      isAuthorized,
      token,
      queries,
      zoneID,
      StoreName,
      filterType,
      router,
      lang,
    };
    // return { zoneID, lat, lng, getCategoryList, token }
  }

  prev = 0;

  state = {
    username: this.props.userName,
    isAuthorized: this.props.isAuthorized,
    loading: false,
    categoryList: this.props.getCategoryList,
    width: "100%",
    stickyHeader: false,
    brandsList: [],
    Categories: [],
    manufacturers: [],
    emptyMessage: "",
    loading: true,
    sort1: "",
    sort2: "",
    sort3: "",
    filterQuery: [],
    sortQuery: [],
    sortText: "",
    categorySelected: "",
    subcategorySelected: "",
    subsubcategorySelected: "",
    currentLocation: "",
    minPrice: 0,
    priceCurrency: "",
  };

  constructor(props) {
    super(props);
    this.searchFilter = this.searchFilter.bind(this);
    this.sortProducts = this.sortProducts.bind(this);
    this.getFilters = this.getFilters.bind(this);
    this.applySearchFilter = this.applySearchFilter.bind(this);
    this.applyPriceFilter = this.applyPriceFilter.bind(this);
  }

  componentDidMount() {
    let urlSlug = window.location.pathname.split("/");
    this.setState({ currentLocation: urlSlug[2].replace(/-/g, " ") });
    this.state.isAuthorized ? this.props.dispatch(actions.getCart()) : "";
    let lat = getCookie("lat", "");
    let lng = getCookie("long", "");
    // get stores category wise
    let getStoresPayload = {
      lat: lat,
      long: lng,
      token: getCookie("token"),
      zoneId: getCookie("zoneid"),
      offset: 0,
      limit: 40,
      type: 2,
      categoryId: getCookie("categoryId"),
    };
    // for the getting the all the stores 
    this.props.dispatch(actions.getStoresByType(getStoresPayload));

    window.addEventListener("scroll", this.handleScroll);

    this.props.queries.store
      ? setCookie("storeId", this.props.queries.store)
      : "";
    this.props.queries.offerId
      ? setCookie("offerId", this.props.queries.offerId)
      : "";
    this.props.queries.type
      ? setCookie("filterType", this.props.queries.type)
      : "";

    this.getFilters(0, 30, 0);
    this.getProducts();

    // let sid = getCookie('sid');
    // let mqttTopic = localStorage.getItem('dlvMqtCh');
    // this.child.mqttConnector(sid, mqttTopic);

    setTimeout(() => {
      this.props.dispatch(actions.selectedStore(this.props.queries.store));
    }, 2000);
  }

  //get initial page load - products
  getProducts() {
    this.setState({ loading: true });
    let query = {
      match: {
        "offer.offerId": this.props.queries.offerId || getCookie("offerId"),
      },
    };
    let zoneID = getCookie("zoneid");
    let storeId = getCookie("storeId");

    searchFilterParams(0, 0, 100, storeId || 0, zoneID, true, query)
      .then(
        ({ data }) => {
          this.setState({
            categoryList: data.data,
            totalPenCount: data.totalPenCount,
            loading: false,
            showEmpty: false,
          });
        },
        (error) => {
          this.setState({ loading: false });
          query.length > 0
            ? this.setState({ categoryList: [], showEmpty: true })
            : "";
        }
      )
      .catch((err) => this.setState({ loading: false }));
  }
// all the filters
  getFilters(from, to, type) {
    let ifOffer;
    let popularStatus;
    let filterType = this.props.filterType;
    let storeId = this.props.queries.store || getCookie("storeId", "");
    if (this.props.queries.type == 2 || filterType == 2) {
      ifOffer = true;
      popularStatus = 0;
    } else if (this.props.queries.type == 1) {
      ifOffer = false;
      popularStatus = 1;
    }
    let zoneID = getCookie("zoneid");

    switch (type) {
      case 0:
        getFilterParams(
          popularStatus,
          4,
          from,
          to,
          storeId || 0,
          ifOffer,
          null,
          zoneID
        )
          .then(({ data }) => {
            this.setState({ brandsList: data.data });
          })
          .catch((err) => "");
        getFilterParams(
          popularStatus,
          5,
          from,
          to,
          storeId || 0,
          ifOffer,
          null,
          zoneID
        )
          .then(({ data }) => {
            this.setState({ manufacturers: data.data });
          })
          .catch((err) => "");
        getFilterParams(
          popularStatus,
          1,
          from,
          to,
          storeId || 0,
          ifOffer,
          null,
          zoneID
        )
          .then(({ data }) => {
            this.setState({ Categories: data.data });
          })
          .catch((err) => "");
        getFilterParams(
          popularStatus,
          6,
          from,
          to,
          storeId || 0,
          ifOffer,
          null,
          zoneID
        )
          .then(({ data }) => {
            this.setState({
              minPrice: 1,
              maxPrice: data.data[0],
              priceCurrency: data.currency,
            });
          })
          .catch((err) => {});
        break;

      case 1:
        getFilterParams(popularStatus, 4, 4, 100, storeId, ifOffer)
          .then(({ data }) => {
            this.setState({
              brandsList: this.state.brandsList.concat(data.data),
            });
          })
          .catch((err) => "");
        break;

      case 2:
        getFilterParams(popularStatus, 5, 4, 100, storeId, ifOffer)
          .then(({ data }) => {
            this.setState({
              manufacturers: this.state.manufacturers.concat(data.data),
            });
          })
          .catch((err) => "");
        break;

      case 3:
        getFilterParams(popularStatus, 1, 1, 100, storeId, ifOffer)
          .then(({ data }) => {
            this.setState({ Categories: data.data });
          })
          .catch((err) => "");
        break;
      case 4:
        getFilterParams(popularStatus, 4, 1, 4, storeId, ifOffer)
          .then(({ data }) => {
            this.setState({ brandsList: data.data });
          })
          .catch((err) => "");
        break;

      case 5:
        getFilterParams(popularStatus, 5, 1, 4, storeId, ifOffer)
          .then(({ data }) => {
            this.setState({ manufacturers: data.data });
          })
          .catch((err) => "");
        break;

      case 6:
        getFilterParams(popularStatus, 1, 1, 4, storeId, ifOffer)
          .then(({ data }) => {
            this.setState({ Categories: data.data });
          })
          .catch((err) => "");
        break;
    }
  }

  applyPriceFilter(query) {
   
    let ifOffer;
    let popularStatus;
    if (this.props.queries.type == 2) {
      ifOffer = true;
      popularStatus = 0;
    } else if (this.props.queries.type == 1) {
      ifOffer = false;
      popularStatus = 1;
    } else popularStatus = 0;

    let storeId = this.props.queries.store || getCookie("storeId");
    let zoneID = this.props.zoneID || getCookie("zoneid");

    this.state.sortQuery.length < 1
      ? searchFilterParams(
          popularStatus,
          0,
          10,
          storeId,
          zoneID,
          ifOffer,
          query
        )
          .then(
            ({ data }) => {
            

              this.updateProducts(data);
            },
            (error) => {
             
              query.length > 0 ? this.setState({ categoryList: [] }) : "";
            }
          )
          .catch((err) => {})
      : sortFilterParams(
          popularStatus,
          0,
          10,
          storeId,
          zoneID,
          ifOffer,
          query,
          this.state.sortQuery
        )
          .then(
            ({ data }) => {
              this.updateProducts(data);
             
            },
            (error) => {
            
              query.length > 0 ? this.setState({ categoryList: [] }) : "";
            }
          )
          .catch((err) => {});
  }

  applySearchFilter(query) {
   

    let ifOffer;
    let popularStatus;
    if (this.props.queries.type == 2) {
      ifOffer = true;
      popularStatus = 0;
    } else if (this.props.queries.type == 1) {
      ifOffer = false;
      popularStatus = 1;
    } else popularStatus = 0;

    let storeId = this.props.queries.store;
    let zoneID = this.props.zoneID || getCookie("zoneid");

    this.state.sortQuery.length < 1
      ? searchFilterParams(
          popularStatus,
          0,
          10,
          storeId,
          zoneID,
          ifOffer,
          query
        )
          .then(
            ({ data }) => {
             

              this.updateProducts(data);
            },
            (error) => {
             
              query.length > 0 ? this.setState({ categoryList: [] }) : "";
            }
          )
          .catch((err) => {})
      : sortFilterParams(
          popularStatus,
          0,
          10,
          storeId,
          zoneID,
          ifOffer,
          query,
          this.state.sortQuery
        )
          .then(
            ({ data }) => {
              this.updateProducts(data);
             
            },
            (error) => {
             
              query.length > 0 ? this.setState({ categoryList: [] }) : "";
            }
          )
          .catch((err) => {});
  }
// sort by new ,price -- high to low ,low to high
  sortProducts = async (sortType, text) => {
    await this.setState({
      sort1: "",
      sort2: "",
      sort3: "",
      sortText: "",
      [sortType]: "active",
      sortText: text,
    });
    let storeId = this.props.queries.store || getCookie("storeId");
    let zoneID = this.props.zoneID || getCookie("zoneid");

    if (sortType == "") {
      await this.setState({ categoryList: this.props.getCategoryList });
      return;
    }

    let ifOffer;
    let popularStatus;
    if (this.props.queries.type == 2) {
      ifOffer = true;
      popularStatus = 0;
    } else if (this.props.queries.type == 1) {
      ifOffer = false;
      popularStatus = 1;
    } else popularStatus = 0;

    let queryName = this.props.queries.name;
    let query;
    (await this.state.sort1) == "active"
      ? this.setState({ sortQuery: { createdTimestamp: { order: "asc" } } })
      : this.state.sort2 == "active"
      ? this.setState({ sortQuery: { "units.floatValue": { order: "asc" } } })
      : this.state.sort3 == "active"
      ? this.setState({ sortQuery: { "units.floatValue": { order: "desc" } } })
      : "";
    query = {
      match: {
        "offer.offerId": this.props.queries.offerId || getCookie("offerId"),
      },
    };

    this.state.filterQuery.length > 0
      ? await this.searchFilter(this.state.filterQuery)
      : await sortFilterParams(
          popularStatus,
          0,
          10,
          storeId,
          zoneID,
          ifOffer,
          query,
          this.state.sortQuery
        ).then(
          ({ data }) => {
            // this.updateProducts(data)
            this.setState({
              categoryList: data.data,
              totalPenCount: data.totalPenCount,
              loading: false,
              showEmpty: false,
            });
          },
          (error) => {}
        );
  };

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.reduxState.userName !== this.props.reduxState.userName) {
      this.setState({
        username: this.props.reduxState.userName,
        isAuthorized: this.props.reduxState.authorized,
      });
    }
  }
// on scroll products
  handleScroll = (event) => {
    this.prev = window.scrollY;
    this.prev > 70
      ? this.setState({ stickyHeader: true })
      : this.setState({ stickyHeader: false });
  };
// geting product accourding to the filters
  searchFilter(query) {
    query.length <= 0
      ? this.setState({
          categoryList: this.props.getCategoryList,
          filterQuery: [],
        })
      : this.setState({ filterQuery: query });

    let ifOffer;
    let popularStatus;
    if (this.props.queries.type == 2) {
      ifOffer = true;
      popularStatus = 0;
    } else if (this.props.queries.type == 1) {
      ifOffer = false;
      popularStatus = 1;
    } else popularStatus = 0;

    let storeId = this.props.queries.store || getCookie("storeId");
    let zoneID = this.props.zoneID || getCookie("zoneid");

    let newMatch = {
      match: {
        "offer.offerId": this.props.queries.offerId || getCookie("offerId"),
      },
    }; // adding offer id into query for filtering
    query.push(newMatch);

    this.state.sortQuery.length < 1
      ? searchFilterParams(
          popularStatus,
          0,
          10,
          storeId,
          zoneID,
          ifOffer,
          query
        )
          .then(
            ({ data }) => {
              this.setState({
                categoryList: data.data,
                totalPenCount: data.totalPenCount,
                loading: false,
                showEmpty: false,
              });
              // this.updateProducts(data)
            },
            (error) => {
              query.length > 0 ? this.setState({ categoryList: [] }) : "";
            }
          )
          .catch((err) => "")
      : sortFilterParams(
          popularStatus,
          0,
          10,
          storeId,
          zoneID,
          ifOffer,
          query,
          this.state.sortQuery
        )
          .then(
            ({ data }) => {
              // this.updateProducts(data)
              this.setState({
                categoryList: data.data,
                totalPenCount: data.totalPenCount,
                loading: false,
                showEmpty: false,
              });
            },
            (error) => {
              query.length > 0 ? this.setState({ categoryList: [] }) : "";
            }
          )
          .catch((err) => "");
  }

  updateSlug = (
    categorySelected,
    subcategorySelected,
    subsubcategorySelected
  ) => {
    this.setState({
      categorySelected: categorySelected,
      subcategorySelected: subcategorySelected,
      subsubcategorySelected: subsubcategorySelected,
    });
  };

  updateProducts = (data) => {
    let newArray = [];
    data.data.products.map((product, index) => {
      let ind = this.props.getCategoryList.data.findIndex(
        (item) => item.childProductId == product.childProductId
      );
      ind >= 0 ? newArray.push(this.props.getCategoryList.data[ind]) : "";
    });
    this.setState({
      categoryList: { ...this.state.categoryList, data: newArray },
    });
  };

  showSideMenu() {
    this.setState({ width: "80%" });
  }

  hideSideMenu() {
    this.setState({ width: "100%" });
  }

  addToCart = (data, event) => {
    event.stopPropagation();
    let cartData;
    this.state.isAuthorized
      ? ((cartData = {
          childProductId: data.childProductId,
          unitId: data.unitId || data.units[0].unitId,
          quantity: parseFloat(1).toFixed(1),
          storeType: getCookie("storeType"),
          addOns: [],
        }),
        this.props.dispatch(actions.initAddCart(cartData)),
        setTimeout(() => {
          this.props.dispatch(actions.getCart());
        }, 100))
      : this.showLoginHandler();
  };
//cart
  editCart = (cartDetail, product, type, event) => {
    event.stopPropagation();

    let editCartData = {
      cartId: this.props.reduxState.cartList.cartId,
      childProductId: cartDetail.childProductId,
      unitId: cartDetail.unitId,
    };

    type == 1
      ? (editCartData["quantity"] = cartDetail.quantity - 1)
      : (editCartData["quantity"] = cartDetail.quantity + 1);

    this.props.dispatch(actions.editCard(editCartData));
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
  deleteAllCookies() {
    document.cookie.split(";").forEach((c) => {
      document.cookie =
        c.trim().split("=")[0] +
        "=;" +
        "expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    });
    redirect("/");
  }
  render() {
    let storename;
    let heading;
    this.props.queries.type == 2
      ? (heading = "Offers")
      : (heading = "Every day lowest price");

    this.state.categoryList.data && this.state.categoryList.data.store
      ? (storename = this.state.categoryList.data.store)
      : (storename = "----");

    return (
      <Wrapper>
       {/* header */}
        <Header
          stickyHeader={this.state.stickyHeader}
          showLoginHandler={this.showLoginHandler}
          isAuthorized={this.state.isAuthorized}
          showLocation={true}
          showLocationHandler={this.showLocationHandler}
          showLocationMobileHandler={this.showLocationMobileHandler}
          stores={this.props.stores.data}
          hideSideMenu={() => this.hideSideMenu()}
          selectedStore={this.props.selectedStore}
          showSideMenu={() => this.showSideMenu()}
          showCart={this.showCart}
          deleteAllCookies={this.deleteAllCookies}
        >
          <div className="col-12">
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
                <h6 className="innerPage-heading lineSetter">{heading}</h6>
              </div>
              <div className="col-2">
                <IconButton
                  onClick={() => this.mainRefs.opendrawer()}
                  style={{ height: "35px", padding: "6px" }}
                >
                  <img
                    src="/static/icons/Common/Filter.imageset/filter@3x.png"
                    width="24"
                  />
                </IconButton>
              </div>
            </div>
          </div>
        </Header>
        {/* main product list content */}
        <CategoryProductsList
          onRef={(ref) => (this.mainRefs = ref)}
          list={this.state.categoryList}
          lang={this.props.lang}
          locale={this.props.locale}
          getFilters={this.getFilters}
          selectedStore={this.props.selectedStore}
          brandsList={this.state.brandsList}
          Categories={this.state.Categories}
          manufacturers={this.state.manufacturers}
          currentLocation={this.state.currentLocation}
          searchFilter={this.searchFilter}
          height={this.prev}
          addToCart={this.addToCart}
          editCart={this.editCart}
          loading={this.state.loading}
          slug={3}
          sortProducts={this.sortProducts}
          sortText={this.state.sortText}
          sort1={this.state.sort1}
          sort2={this.state.sort2}
          priceCurrency={this.state.priceCurrency}
          applyPriceFilter={this.applyPriceFilter}
          sort3={this.state.sort3}
          heading={heading}
          cartProducts={this.props.cartProducts}
          updateSlug={this.updateSlug}
          maxPrice={this.state.maxPrice}
          minPrice={this.state.minPrice}
          categorySelected={this.state.categorySelected}
          subcategorySelected={this.state.subcategorySelected}
          subsubcategorySelected={this.state.subsubcategorySelected}
          showLoginHandler={this.showLoginHandler}
        />

        <Authmodals
          onRef={(ref) => (this.child = ref)}
          editCart={this.editCart}
        />

        {/* {this.state.loading ? <CircularProgressLoader /> : ''} */}
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    reduxState: state,
    stores: state.stores,
    cartProducts: state.cartProducts,
    locErrStatus: state.locErrStatus,
    locErrMessage: state.locErrMessage,
    selectedStore: state.selectedStore,
    selectedLang: state.selectedLang,
    locale:state.locale
  };
};

export default connect(mapStateToProps)(OfferProducts);
