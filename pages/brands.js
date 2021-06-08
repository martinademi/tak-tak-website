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
import CategoryProductsList from "../components/productList/categoryProductList";
import {
  getFilterParams,
  searchFilterParams,
  sortFilterParams,
} from "../services/filterApis";
import { FontIcon, IconButton } from "material-ui";
import CircularProgressLoader from "../components/ui/loaders/circularLoader";

import "../assets/login.scss";
import "../assets/style.scss";
import CustomHead from "../components/html/head";
import { OG_LOGO, OG_DESC, OG_TITLE } from "../lib/envariables";

class Products extends Component {
  static async getInitialProps({ ctx }) {
    let token = getCookiees("token", ctx.req);
    let zoneID = getCookiees("zoneid", ctx.req);
    const isAuthorized = await getCookiees("authorized", ctx.req);
    const queries = ctx.query;
    const category = queries;

    if (redirectIfNotAuthenticated(ctx)) {
      return {};
    }
    let lang = (await (queries.lang || getCookiees("lang", ctx.req))) || "en";
    ctx && ctx.store ? ctx.store.dispatch(actions.selectLocale(lang)) : "";
    return { isAuthorized, token, queries, category, zoneID, lang };
  }

  prev = 0;

  state = {
    username: this.props.userName,
    isAuthorized: this.props.isAuthorized,
    loading: false,
    categoryList: [],
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
    priceCurrency: "",
    maxPrice: "",
  };

  constructor(props) {
    super(props);
    this.searchFilter = this.searchFilter.bind(this);
    this.sortProducts = this.sortProducts.bind(this);
    this.showLoginHandler = this.showLoginHandler.bind(this);
    this.getFilters = this.getFilters.bind(this);
  }

  async componentDidMount() {
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
    // for the get all the stores 
    this.props.dispatch(actions.getStoresByType(getStoresPayload));
    this.props.queries.store && this.props.queries.name
      ? (setCookie("storeId", this.props.queries.store),
        setCookie("catQuery", this.props.queries.name))
      : "";
    let storeId = getCookie("storeId", "");
    let zoneID = this.props.zoneID || getCookie("zoneid");
    let queryName = getCookie("catQuery", "");
    let query = { match_phrase_prefix: { "brandTitle.en": queryName } };

    await this.getProducts(storeId, zoneID);

    this.getFilters(0, 20, 0);
    setTimeout(() => {
      this.props.dispatch(actions.selectedStore(storeId));
    }, 2000);

    // let sid = getCookie('sid');
    // let mqttTopic = localStorage.getItem('dlvMqtCh');
    // this.child.mqttConnector(sid, mqttTopic);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.reduxState.userName !== this.props.reduxState.userName) {
      this.setState({
        username: this.props.reduxState.userName,
        isAuthorized: this.props.reduxState.authorized,
      });
    }
  }
// all the filters 
  getFilters(from, to, type) {
    let storeId = getCookie("storeId", "");
    let zoneID = this.props.zoneID || getCookie("zoneid");
    let queryName = getCookie("catQuery", "");
    let query = { match_phrase_prefix: { "brandTitle.en": queryName } };
    this.setState({
      filterCatLoading: true,
      filterManuLoading: true,
      filterPriceLoading: true,
    });
    switch (type) {
      case 0:
        getFilterParams(0, 5, from, to, storeId, false, query)
          .then(({ data }) => {
          
            this.setState({
              manufacturers: data.data,
              ManuPenCount: data.penCount,
              filterManuLoading: false,
            });
          })
          .catch((err) => {
            this.setState({ filterManuLoading: false });
          
          });
        getFilterParams(0, 2, from, to, storeId, false, query)
          .then(({ data }) => {
           
            this.setState({
              Categories: data.data,
              CatPenCount: data.penCount,
              filterCatLoading: false,
            });
          })
          .catch((err) => {
            this.setState({ filterCatLoading: false });
       
          });
        getFilterParams(0, 6, from, to, storeId, false, query)
          .then(({ data }) => {
           
            this.setState({
              minPrice: 1,
              maxPrice: data.data[0],
              priceCurrency: data.currency,
              filterPriceLoading: false,
            });
          })
          .catch((err) => {
            this.setState({ filterPriceLoading: false });
          
          });
        break;

      case 1:
        getFilterParams(0, 4, from, to, storeId, false, query)
          .then(({ data }) => {
            
            this.setState({
              brandsList: this.state.brandsList.concat(data.data),
              brandPenCount: data.penCount,
            });
          })
          .catch((err) =>{});
        break;

      case 2:
        getFilterParams(0, 5, from, to, storeId, false, query)
          .then(({ data }) => {
           
            this.setState({
              manufacturers: this.state.manufacturers.concat(data.data),
              ManuPenCount: data.penCount,
            });
          })
          .catch((err) => {});
        break;

      case 3:
        getFilterParams(0, 2, from, to, storeId, false, query)
          .then(({ data }) => {
           
            this.setState({
              Categories: this.state.Categories.concat(data.data),
              CatPenCount: data.penCount,
            });
          })
          .catch((err) => {});
        break;
      case 4:
        getFilterParams(0, 4, from, to, storeId, false, query)
          .then(({ data }) => {
            
            this.setState({
              brandsList: data.data,
              brandPenCount: data.penCount,
            });
          })
          .catch((err) => {});
        break;

      case 5:
        getFilterParams(0, 5, from, to, storeId, false, query)
          .then(({ data }) => {
        
            this.setState({
              manufacturers: data.data,
              ManuPenCount: data.penCount,
            });
          })
          .catch((err) => {});
        break;

      case 6:
        getFilterParams(0, 2, from, to, storeId, false, query)
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
// on scroll products 
  handleScroll = (event) => {
    this.prev = window.scrollY;
    this.prev > 70
      ? this.setState({ stickyHeader: true })
      : this.setState({ stickyHeader: false });
  };

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
// sort like new arrival,price-- high to low ,low to high
  sortProducts = async (sortType, text) => {
    let storeId = getCookie("storeId", "");
    let zoneID = this.props.zoneID || getCookie("zoneid");

    if (sortType == "") {
      await this.getProducts(storeId, zoneID);
      return;
    }

    await this.setState({
      sort1: "",
      sort2: "",
      sort3: "",
      sortText: "",
      [sortType]: "active",
      sortText: text,
    });

    let queryName = getCookie("catQuery", "");
    let query = { match_phrase_prefix: { "brandTitle.en": queryName } };
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
          0,
          0,
          10,
          storeId,
          zoneID,
          false,
          query,
          this.state.sortQuery
        )
          .then(
            ({ data }) => {
              this.setState({ categoryList: data.data });
             
            },
            (error) => {
            
              query.length > 0 ? this.setState({ categoryList: [] }) : "";
            }
          )
          .catch((err) => {});
  };

  showSideMenu() {
   
    this.setState({ width: "80%" });
  }

  hideSideMenu() {
   
    this.setState({ width: "100%" });
  }

  showLoginHandler = () => {
    this.child.showLoginHandler();
  };
  showLocationHandler = () => {
    this.child.showLocationHandler();
  };
  showLocationMobileHandler = () => {
    this.child.showLocationMobileHandler();
  };
// from the all the query getting the products
  searchFilter(query) {
    let storeId = getCookie("storeId", "");
    let zoneID = this.props.zoneID || getCookie("zoneid");
    let queryName = getCookie("catQuery", "");

    query.length <= 0
      ? this.getProducts(storeId, zoneID)
      : this.setState({ filterQuery: query });
    query.length <= 1
      ? query.push({ match: { "brandTitle.en": queryName } })
      : "";

    this.state.sortQuery.length < 1
      ? searchFilterParams(0, 0, 10, storeId, zoneID, false, query).then(
          ({ data }) => {
            this.setState({ categoryList: data.data });
          },
          (error) => {
         

            query.length > 0 ? this.setState({ categoryList: [] }) : "";
            this.setState({
              emptyMessage: "No products Available",
              loading: false,
            });
          }
        )
      : sortFilterParams(
          0,
          0,
          10,
          storeId,
          zoneID,
          false,
          query,
          this.state.sortQuery
        )
          .then(
            ({ data }) => {
              this.setState({ categoryList: data.data });
             
            },
            (error) => {
              
              query.length > 0 ? this.setState({ categoryList: [] }) : "";
            }
          )
          .catch((err) => {});
  }
// get initial products 
  getProducts(storeId, zoneID) {
    this.setState({ loading: true });
    let queryName = getCookie("catQuery", "");
    let query = { match_phrase_prefix: { "brandTitle.en": queryName } };

    let query2 = { match_phrase_prefix: { "brandTitle.en": "ITC Limited" } };

    searchFilterParams(0, 0, 10, storeId, zoneID, false, query)
      .then(
        ({ data }) => {
          this.setState({
            categoryList: data.data,
            loading: false,
            showEmpty: false,
          });
         
          this.state.categoryList.length < 1
            ? this.setState({ emptyMessage: "No products Available" })
            : this.setState({ emptyMessage: "" });
        },
        (error) => {
        
          this.setState({
            emptyMessage: "No products Available",
            loading: false,
            showEmpty: true,
          });
          query.length > 0 ? this.setState({ categoryList: [] }) : "";
        }
      )
      .catch((err) => {});
  }
// cart
  editCart = (cartDetail, products, type, event) => {
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

  showCart = () => {
    this.child.showCart();
  };
 
 // if user logout or somthing get wrong redirect to home page
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
    let heading = this.props.queries.name || getCookie("catQuery", "");

    return (
      <Wrapper>
        <CustomHead description={OG_DESC} ogImage={OG_LOGO} title={OG_TITLE} />
        {/* header */}
        <Header
          stickyHeader={this.state.stickyHeader}
          showLoginHandler={this.showLoginHandler}
          isAuthorized={this.state.isAuthorized}
          stores={this.props.stores.data}
          showLocationHandler={this.showLocationHandler}
          showLocationMobileHandler={this.showLocationMobileHandler}
          showCart={this.showCart}
          showLocation={true}
          hideSideMenu={() => this.hideSideMenu()}
          showSideMenu={() => this.showSideMenu()}
          selectedStore={this.props.selectedStore}
          deleteAllCookies={this.deleteAllCookies}
        >
          <div className="col-12">
            <div className="row align-items-center">
              <div className="col-2 pl-0">
                <IconButton href="/" style={{ height: "30px", padding: "6px" }}>
                  <img
                    src="/static/icons/Common/BackIcon.imageset/back_btn@2x.png"
                    width="24"
                  />
                </IconButton>
              </div>
              <div className="col-8 text-center">
                <h6 className="innerPage-heading lineSetter">{heading}</h6>
              </div>

              <div className="col-2">
                <IconButton
                  onClick={() => this.mainRefs.opendrawer()}
                  style={{ height: "30px", padding: "6px" }}
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
    {/* main products list content  */}
        <CategoryProductsList
          onRef={(ref) => (this.mainRefs = ref)}
          heading={heading}
          getFilters={this.getFilters}
          lang={this.props.lang}
          list={this.state.categoryList}
          brandsList={this.state.brandsList}
          Categories={this.state.Categories}
          manufacturers={this.state.manufacturers}
          searchFilter={this.searchFilter}
          locale={this.props.locale}
          height={this.prev}
          sortProducts={this.sortProducts}
          sortText={this.state.sortText}
          sort1={this.state.sort1}
          sort2={this.state.sort2}
          sort3={this.state.sort3}
          filterPriceLoading={this.state.filterPriceLoading}
          filterCatLoading={this.state.filterCatLoading}
          filterManuLoading={this.state.filterManuLoading}
          cartProducts={this.props.cartProducts}
          showSubCategory={false}
          useBrand={true}
          addToCart={this.addToCart}
          editCart={this.editCart}
          updateSlug={this.updateSlug}
          slug={4}
          isFromBrands={true}
          categorySelected={this.state.categorySelected}
          subcategorySelected={this.state.subcategorySelected}
          subsubcategorySelected={this.state.subsubcategorySelected}
          brandPenCount={this.state.brandPenCount}
          CatPenCount={this.state.CatPenCount}
          ManuPenCount={this.state.ManuPenCount}
          showEmpty={this.state.showEmpty}
          minPrice={this.state.minPrice}
          maxPrice={this.state.maxPrice}
          priceCurrency={this.state.priceCurrency}
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

export default connect(mapStateToProps)(Products);
