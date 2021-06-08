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
import "../assets/style.scss";
import "../assets/login.scss";
import { multiStoreCartCheck } from "../lib/multiStoreCartCheck";
import ExpireCartDialog from "../components/dialogs/expireCart";
import { addToCartExFunc } from "../lib/cart/addToCart";

class Products extends Component {
  static async getInitialProps({ ctx }) {
    let getCategoryList = [];

    let token = getCookiees("token", ctx.req);
    let lat = getCookiees("lat", ctx.req);
    let lng = getCookiees("long", ctx.req);
    let zoneID = getCookiees("zoneid", ctx.req);
    const userName = await getCookiees("username", ctx.req);
    const isAuthorized = await getCookiees("authorized", ctx.req);
    let zoneDetails = (await getCookiees("zoneDetails", ctx.req)) || null;
    const queries = ctx.query;
    let lang = (await (queries.lang || getCookiees("lang", ctx.req))) || "en";
    // const jwt = getJwt(ctx);
    ctx && ctx.store ? ctx.store.dispatch(actions.selectLocale(lang)) : "";
    if (redirectIfNotAuthenticated(ctx)) {
      return {};
    }

    const getCategory = await fetch(
      enVariables.API_HOST +
        "/business/home/" +
        zoneID +
        "/" +
        queries.store +
        "/0/" +
        queries.type +
        "/0",
      {
        method: "get",
        headers: {
          language: "en",
          "content-type": "application/json",
          authorization: token,
        },
      }
    );
    getCategoryList = await getCategory.json();
    let StoreName = getCookiees("storeName", ctx.req);
    return {
      getCategoryList,
      isAuthorized,
      token,
      queries,
      zoneID,
      StoreName,
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
    maxPrice: "",
    priceCurrency: "",
    emptyMessage: "",
    loading: false,
    sort1: "",
    sort2: "",
    sort3: "",
    filterQuery: [],
    sortQuery: [],
    sortText: "",
    categorySelected: "",
    subcategorySelected: "",
    subsubcategorySelected: "",
    isFilterSelected: false,
  };

  constructor(props) {
    super(props);
    this.searchFilter = this.searchFilter.bind(this);
    this.sortProducts = this.sortProducts.bind(this);
    this.getFilters = this.getFilters.bind(this);
    this.applyPriceFilter = this.applyPriceFilter.bind(this);
  }

  componentDidMount() {
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
    this.props.dispatch(actions.getStoresByType(getStoresPayload));

    window.addEventListener("scroll", this.handleScroll);
   
    this.getFilters(1, 20, 0);

    setTimeout(() => {
      this.props.dispatch(actions.getZones(lat, lng)); // dispatching actions to get currecy symbol based on zone
    }, 200);

    setTimeout(() => {
      this.props.dispatch(actions.selectedStore(this.props.queries.store));
    }, 2000);

    // let sid = getCookie('sid');
    // let mqttTopic = localStorage.getItem('dlvMqtCh');
    // this.child.mqttConnector(sid, mqttTopic);
  }
// get inital products
  getProducts = async () => {
    const getCategory = await fetch(
      enVariables.API_HOST +
        "/business/home/" +
        this.props.zoneID +
        "/" +
        this.props.queries.store +
        "/0/" +
        this.props.queries.type +
        "/0",
      {
        method: "get",
        headers: {
          language: "en",
          "content-type": "application/json",
          authorization: this.props.token,
        },
      }
    );
    let getCategoryList = await getCategory.json();
    this.setState({ categoryList: getCategoryList });
  };
// get the all filter queries 
  getFilters(from, to, type) {
    let ifOffer;
    let popularStatus;
    if (this.props.queries.type == 2) {
      ifOffer = true;
      popularStatus = 0;
    } else if (this.props.queries.type == 1) {
      ifOffer = false;
      popularStatus = 1;
    }

   

    switch (type) {
      case 0:
        // getting brands
        getFilterParams(
          popularStatus,
          4,
          from,
          to,
          this.props.queries.store,
          ifOffer
        )
          .then(({ data }) => {
            this.setState(
              { brandsList: data.data, brandPenCount: data.penCount },
              () => {
                // getting manufactures
                getFilterParams(
                  popularStatus,
                  5,
                  from,
                  to,
                  this.props.queries.store,
                  ifOffer
                )
                  .then(({ data }) => {
                    this.setState(
                      { manufacturers: data.data, ManuPenCount: data.penCount },
                      () => {
                        // getting categories
                        getFilterParams(
                          popularStatus,
                          1,
                          from,
                          to,
                          this.props.queries.store,
                          ifOffer
                        )
                          .then(({ data }) => {
                            this.setState(
                              {
                                Categories: data.data,
                                CatPenCount: data.penCount,
                              },
                              () => {
                                //  getting price data
                               
                                getFilterParams(
                                  popularStatus,
                                  6,
                                  from,
                                  to,
                                  this.props.queries.store,
                                  ifOffer
                                )
                                  .then(({ data }) => {
                                    this.setState({
                                      minPrice: 1,
                                      maxPrice: data.data[0],
                                      priceCurrency: data.currency,
                                    });
                                  })
                                  .catch((err) =>
                                    {}
                                  );
                              }
                            );
                          })
                          .catch((err) =>
                           {}
                          );
                      }
                    );
                  })
                  .catch((err) => {});
              }
            );
          })
          .catch((err) => {});

        break;

      case 1:
        getFilterParams(
          popularStatus,
          4,
          4,
          100,
          this.props.queries.store,
          ifOffer
        )
          .then(({ data }) => {
          
            this.setState({
              brandsList: this.state.brandsList.concat(data.data),
              brandPenCount: data.penCount,
            });
          })
          .catch((err) => {});
        break;

      case 2:
        getFilterParams(
          popularStatus,
          5,
          4,
          100,
          this.props.queries.store,
          ifOffer
        )
          .then(({ data }) => {
           
            this.setState({
              manufacturers: this.state.manufacturers.concat(data.data),
              ManuPenCount: data.penCount,
            });
          })
          .catch((err) => {});
        break;

      case 3:
        getFilterParams(
          popularStatus,
          1,
          1,
          100,
          this.props.queries.store,
          ifOffer
        )
          .then(({ data }) => {
          

            this.setState({
              Categories: data.data,
              CatPenCount: data.penCount,
            });
          })
          .catch((err) => {});
        break;
      case 4:
        getFilterParams(
          popularStatus,
          4,
          1,
          4,
          this.props.queries.store,
          ifOffer
        )
          .then(({ data }) => {
            
            this.setState({
              brandsList: data.data,
              brandPenCount: data.penCount,
            });
          })
          .catch((err) => {});
        break;

      case 5:
        getFilterParams(
          popularStatus,
          5,
          1,
          4,
          this.props.queries.store,
          ifOffer
        )
          .then(({ data }) => {
         
            this.setState({
              manufacturers: data.data,
              ManuPenCount: data.penCount,
            });
          })
          .catch((err) => {});
        break;

      case 6:
        getFilterParams(
          popularStatus,
          1,
          1,
          4,
          this.props.queries.store,
          ifOffer
        )
          .then(({ data }) => {
          
            this.setState({
              Categories: data.data,
              CatPenCount: data.penCount,
            });
          })
          .catch((err) => {});
        break;
    }
  }
// sort products -new ,high to low ,low to high
  sortProducts = async (sortType, text) => {
    await this.setState({
      sort1: "",
      sort2: "",
      sort3: "",
      sortText: "",
      [sortType]: "active",
      sortText: text,
    });
    let storeId = this.props.queries.store;
    let zoneID = this.props.zoneID;

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
    }

    let queryName = this.props.queries.name;
    let query;
    (await this.state.sort1) == "active"
      ? this.setState({ sortQuery: { createdTimestamp: { order: "asc" } } })
      : this.state.sort2 == "active"
      ? this.setState({ sortQuery: { "units.floatValue": { order: "asc" } } })
      : this.state.sort3 == "active"
      ? this.setState({ sortQuery: { "units.floatValue": { order: "desc" } } })
      : "";

   

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
            this.updateProducts(data);
           
          },
          (error) => {
          
            query.length > 0 ? this.setState({ categoryList: [] }) : "";
          }
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
// on scroll 
  handleScroll = (event) => {
    this.prev = window.scrollY;
    this.prev > 70
      ? this.setState({ stickyHeader: true })
      : this.setState({ stickyHeader: false });
  };

  applyPriceFilter(query) {
    this.applySearchFilter(query);
  }

  searchFilter(query) {
    query.length < 1
      ? this.setState({
          categoryList: this.props.getCategoryList,
          filterQuery: [],
        })
      : (this.setState({ filterQuery: query }), this.applySearchFilter(query));
  }
// with the queries get the products according  
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
    let zoneID = this.props.zoneID;

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

  handleFilterSelection = () => {
    this.setState({
      isFilterSelected: true,
    });
  };
  clearFilters = () => {
    this.getProducts();
    this.getFilters(1, 20, 0);
  };
  addToCart = (data, event) => {
    event.stopPropagation();

    let cartData;
    this.state.isAuthorized
      ? ((cartData = {
          childProductId: data.childProductId,
          unitId: data.unitId,
          quantity: parseFloat(1).toFixed(1),
          storeType: getCookie("storeType"),
          addOns: [],
        }),
        // check multicart auth
        addToCartExFunc(this.props.myCart)
          .then(() => {
            this.props.dispatch(actions.initAddCart(cartData));

            setTimeout(() => {
              this.props.dispatch(actions.getCart());
            }, 100);
          })
          .catch(() => {
            this.props.dispatch(actions.expireCart(true, cartData)); // expire cart action for opening cart option dialog
          }))
      : this.showLoginHandler();
  };
// cart
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
    this.props.queries && this.props.queries.type == 2
      ? (heading = "Every day lowest price")
      : this.props.queries && this.props.queries.type == 1
      ? (heading = "Trending Products")
      : (heading = "Favourite Products");

    this.state.categoryList &&
    this.state.categoryList.data &&
    this.state.categoryList.data.store
      ? (storename = this.state.categoryList.data.store)
      : (storename = "----");

    return (
      <Wrapper>
        {/* Header */}
         <Header
          stickyHeader={this.state.stickyHeader}
          showLoginHandler={this.showLoginHandler}
          isAuthorized={this.state.isAuthorized}
          showLocation={true}
          showLocationHandler={this.showLocationHandler}
          showLocationMobileHandler={this.showLocationMobileHandler}
          stores={this.props.stores.data}
          showChildren={true}
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
                  href={
                    this.props.StoreName
                      ? `/stores/${this.props.StoreName.replace(/%20/g, "-")
                          .replace(/,/g, "")
                          .replace(/& /g, "")
                          .replace(/ /g, "-")}`
                      : "/"
                  }
                  style={{ height: "35px", padding: "6px" }}
                >
                  <img
                    src="/static/icons/Common/BackIcon.imageset/back_btn@2x.png"
                    width="24"
                  />
                </IconButton>
              </div>
              <div className="col-8 text-center">
                <h6 className="innerPage-heading">{heading}</h6>
              </div>

              <div className="col-2">
                {/* <IconButton onClick={() => this.mainRefs.opendrawer()} style={{ height: '35px', padding: '6px' }}>
                  <img src='/static/icons/Common/Filter.imageset/filter@3x.png' width="24" />
                </IconButton> */}
              </div>
            </div>
          </div>
        </Header>
        {/* main product list content */}
        <ProductsListComponent
          onRef={(ref) => (this.mainRefs = ref)}
          list={this.state.categoryList}
          getFilters={this.getFilters}
          selectedStore={this.props.selectedStore}
          currencySymbol={this.props.currencySymbol}
          brandsList={this.state.brandsList}
          Categories={this.state.Categories}
          manufacturers={this.state.manufacturers}
          lang={this.props.lang}
          searchFilter={this.searchFilter}
          applyPriceFilter={this.applyPriceFilter}
          height={this.prev}
          addToCart={this.addToCart}
          editCart={this.editCart}
          sortProducts={this.sortProducts}
          sortText={this.state.sortText}
          sort1={this.state.sort1}
          sort2={this.state.sort2}
          loading={this.state.loading}
          sort3={this.state.sort3}
          heading={heading}
          cartProducts={this.props.cartProducts}
          updateSlug={this.updateSlug}
          slug={this.props.queries ? this.props.queries.type : ""}
          categorySelected={this.state.categorySelected}
          subcategorySelected={this.state.subcategorySelected}
          subsubcategorySelected={this.state.subsubcategorySelected}
          brandPenCount={this.state.brandPenCount}
          CatPenCount={this.state.CatPenCount}
          ManuPenCount={this.state.ManuPenCount}
          currency={this.state.priceCurrency}
          showLoginHandler={this.showLoginHandler}
          minPrice={this.state.minPrice}
          priceCurrency={this.state.priceCurrency}
          maxPrice={this.state.maxPrice}
          isFilterSelected={this.state.isFilterSelected}
          handleFilterSelection={this.handleFilterSelection}
          clearFilters={this.clearFilters}
        />

        <Authmodals
          onRef={(ref) => (this.child = ref)}
          editCart={this.editCart}
        />

        <ExpireCartDialog onRef={(ref) => (this.expRef = ref)} />
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
    currencySymbol: state.currencySymbol,
    myCart: state.cartList,
  };
};

export default connect(mapStateToProps)(Products);
