import { Component } from "react";
import { connect } from "react-redux";
import Wrapper from "../hoc/wrapperHoc";
import Header from "../components/header/innerPageHeader";
import Authmodals from "../components/authmodals/index";
import * as actions from "../actions/index";
import { setCookie, getCookie, getCookiees } from "../lib/session";

import { redirectIfNotAuthenticated } from "../lib/auth";
import CategoryProductsList from "../components/productList/categoryProductList";
import {
  getFilterParams,
  searchFilterParams,
  sortFilterParams,
} from "../services/filterApis";
import { IconButton } from "material-ui";
import CircularProgressLoader from "../components/ui/loaders/circularLoader";
import redirect from "../lib/redirect";
import "../assets/style.scss";
import "../assets/login.scss";
import { multiStoreCartCheck } from "../lib/multiStoreCartCheck";
import ExpireCartDialog from "../components/dialogs/expireCart";
import { addToCartExFunc } from "../lib/cart/addToCart";

class Products extends Component {
  static async getInitialProps({ ctx }) {
    let token = getCookiees("token", ctx.req);
    let lat = getCookiees("lat", ctx.req);
    let lng = getCookiees("long", ctx.req);
    let zoneID = getCookiees("zoneid", ctx.req);
    const userName = await getCookiees("username", ctx.req);
    const isAuthorized = await getCookiees("authorized", ctx.req);
    let zoneDetails = (await getCookiees("zoneDetails", ctx.req)) || null;
    const queries = ctx.query;
    let lang = (await (queries.lang || getCookiees("lang", ctx.req))) || "en";
    ctx && ctx.store ? ctx.store.dispatch(actions.selectLocale(lang)) : "";
    const category = queries;

    if (redirectIfNotAuthenticated(ctx)) {
      return {};
    }

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
    subCategories: [],
    subSubCategory: [],
    manufacturers: [],
    emptyMessage: "",
    sort1: "",
    sort2: "",
    sort3: "",
    filterQuery: [],
    sortQuery: [],
    sortText: "",
    categorySelected: "",
    subcategorySelected: "",
    subsubcategorySelected: "",
    showEmpty: false,
    priceCurrency: "",
    maxPrice: "",
    start: 10,
  };

  constructor(props) {
    super(props);
    this.searchFilter = this.searchFilter.bind(this);
    this.sortProducts = this.sortProducts.bind(this);
    this.getSubSubCategory = this.getSubSubCategory.bind(this);
    this.showLoginHandler = this.showLoginHandler.bind(this);
    this.getFilters = this.getFilters.bind(this);
    this.applyPriceFilter = this.applyPriceFilter.bind(this);
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
      type: getCookie("categoryType"),
      categoryId: getCookie("categoryId"),
    };
    // to get the all the store 
    this.props.dispatch(actions.getStoresByType(getStoresPayload));

    this.props.queries.store && this.props.queries.name
      ? (setCookie("storeId", this.props.queries.store),
        setCookie("catQuery", this.props.queries.name))
      : "";
     let storeId = getCookie("storeId", "");
    let zoneID = this.props.zoneID;
    let queryName = getCookie("catQuery", "");
    let query = { match_phrase_prefix: { "catName.en": queryName } };

    await this.getProducts(storeId, zoneID);

    this.state.isAuthorized ? this.props.dispatch(actions.getCart()) : "";

    this.getFilters(1, 50, 0);

    setTimeout(() => {
      this.props.dispatch(actions.selectedStore(storeId));
      window.addEventListener("scroll", this.handleScroll);
    }, 2000);

    // let sid = getCookie('sid');
    // let mqttTopic = localStorage.getItem('dlvMqtCh');
    // this.child.mqttConnector(sid, mqttTopic);
  }
// this is for the get right side of parts like price ,sub categories ,brands ,etc
  getFilters(from, to, type) {
    let storeId = getCookie("storeId", "");
    let zoneID = this.props.zoneID;
    let queryName = getCookie("catQuery", "");
    let query = { match_phrase_prefix: { "catName.en": queryName } };
  
    switch (type) {
      case 0:
        getFilterParams(0, 4, from, to, storeId, false, query)
          .then(({ data }) => {
         
            this.setState({
              brandsList: data.data,
              brandPenCount: data.penCount,
            });
          })
          .catch((err) =>{});
        getFilterParams(0, 5, from, to, storeId, false, query)
          .then(({ data }) => {
            
            this.setState({
              manufacturers: data.data,
              ManuPenCount: data.penCount,
            });
          })
          .catch((err) => {});
        getFilterParams(0, 2, from, to, storeId, false, query)
          .then(({ data }) => {
            
            this.setState({ subCategories: data.data });
          })
          .catch((err) => {});
        getFilterParams(0, 6, from, to, storeId, false, query)
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
        getFilterParams(0, 4, from, to, storeId, false, query)
          .then(({ data }) => {
           
            this.setState({
              brandsList: this.state.brandsList.concat(data.data),
              brandPenCount: data.penCount,
            });
          })
          .catch((err) => {});
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
              subCategories: this.state.subCategories.concat(data.data),
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
            
            this.setState({ subCategories: data.data });
          })
          .catch((err) => {});
        break;
    }
  }

  getSubSubCategory = (subCatName) => {
    let storeId = getCookie("storeId", "");
    let queryName = getCookie("catQuery", "");
    let query = [
      { match_phrase_prefix: { "catName.en": queryName } },
      { match_phrase_prefix: { "subCatName.en": subCatName } },
    ];
    getFilterParams(0, 3, 0, 10, storeId, false, query)
      .then(
        ({ data }) => {
        
          this.setState({ subSubCategory: data.data });
        },
        (error) => {
     
          this.setState({ subSubCategory: [] });
        }
      )
      .catch((err) => {});
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.reduxState.userName !== this.props.reduxState.userName) {
      this.setState({
        username: this.props.reduxState.userName,
        isAuthorized: this.props.reduxState.authorized,
      });
    }
    if (
      prevProps.reduxState.categoryList !== this.props.reduxState.categoryList
    ) {
      this.setState({ categoryList: this.props.reduxState.categoryList });
      setCookie("place", this.state.categoryList.data.store.storeAddr);
    }
  }

  //   handleScroll = event => {
  //     this.prev = window.scrollY;
  //     this.prev > 70
  //       ? this.setState({ stickyHeader: true })
  //       : this.setState({ stickyHeader: false });
  //   };

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
// sort filter like newly arrived ,price hight to low,low to high
  sortProducts = async (sortType, text) => {
    let storeId = getCookie("storeId", "");
    let zoneID = this.props.zoneID;

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
    let query = { match_phrase_prefix: { "catName.en": queryName } };
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
          20,
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

  applyPriceFilter(query) {
    this.applySearchFilter(query);
  }
// with all the query apply and get the products 
  searchFilter(query) {
    query.length < 1
      ? this.setState({
          categoryList: this.props.getCategoryList,
          filterQuery: [],
        })
      : (this.setState({ filterQuery: query }), this.applySearchFilter(query));
  }

  applySearchFilter(query) {
   
    let storeId = getCookie("storeId", "");
    let zoneID = this.props.zoneID;

    query.length <= 0
      ? this.getProducts(storeId, zoneID)
      : this.setState({ filterQuery: query });
    this.state.sortQuery.length < 1
      ? searchFilterParams(0, 0, 10, storeId, zoneID, false, query)
          .then(
            ({ data }) => {
              this.setState({ categoryList: data.data, showEmpty: false });
            },
            (error) => {
              
              query.length > 0
                ? this.setState({ categoryList: [], showEmpty: true })
                : "";
            }
          )
          .catch((err) => {})
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
              this.setState({ categoryList: data.data, showEmpty: false });
              
            },
            (error) => {
              
              query.length > 0
                ? this.setState({ categoryList: [], showEmpty: true })
                : "";
            }
          )
          .catch((err) => {});
  }
// to get more products 
  handleScroll = (event) => {
 
    let deskListSection = document.getElementById("mainSectionDesk");
    let currentScroll = window.scrollY;
    let sectionHeight = deskListSection ? deskListSection.clientHeight : 350;
 
    if (currentScroll > sectionHeight - 600) {
      if (
        !this.state.callingApi &&
        this.state.categoryList &&
        this.state.categoryList.products &&
        this.state.categoryList.products.length < this.state.penCount
      ) {
        
        this.getMoreProducts();
      }
    }
    // this.prev = window.scrollY;
    // this.prev > 70 ? this.setState({ stickyHeader: true }) : this.setState({ stickyHeader: false })
  };

  

  getMoreProducts = () => {
    this.setState({ loading: true, callingApi: true });
    let queryName = getCookie("catQuery", "");
    let query =
      this.state.filterQuery && this.state.filterQuery.length > 0
        ? this.state.filterQuery
        : { match_phrase_prefix: { "catName.en": queryName } };
    let storeId = getCookie("storeId");
    let zoneID = getCookie("zoneid");
    
    this.state.sortQuery.length < 1
      ? searchFilterParams(
          0,
          (this.state.categoryList &&
            this.state.categoryList.products &&
            this.state.categoryList.products.length) ||
            0,
          30,
          storeId,
          zoneID,
          false,
          query
        )
          .then(
            ({ data }) => {
              if (data && data.data && data.data.products) {
                let oldProducts = this.state.categoryList
                  ? this.state.categoryList
                  : [];
                
                oldProducts["products"] = [
                  ...oldProducts.products,
                  ...data.data.products,
                ];
                this.setState({
                  categoryList: oldProducts,
                  loading: false,
                  showEmpty: false,
                  callingApi: false,
                  start: oldProducts.products.length,
                  penCount: data.penCount || 1000,
                });
              }
            },
            (error) => {
              this.setState({ loading: false });
              query.length > 0
                ? this.setState({
                    // categoryList: [],
                    showEmpty: true,
                    loading: false,
                    callingApi: false,
                  })
                : "";
            }
          )
          .catch((err) => {})
      : sortFilterParams(
          0,
          (this.state.categoryList &&
            this.state.categoryList.products &&
            this.state.categoryList.products.length) ||
            0,
          30,
          storeId,
          zoneID,
          false,
          query,
          this.state.sortQuery
        )
          .then(
            ({ data }) => {
              if (data && data.data && data.data.products) {
                let oldProducts = this.state.categoryList
                  ? this.state.categoryList
                  : [];
                
                oldProducts["products"] = [
                  ...oldProducts.products,
                  ...data.data.products,
                ];
                this.setState({
                  categoryList: oldProducts,
                  loading: false,
                  showEmpty: false,
                  callingApi: false,
                  start: oldProducts.products.length,
                  penCount: data.penCount || 1000,
                });
              }
            },
            (error) => {
              this.setState({ loading: false });
              query.length > 0
                ? this.setState({
                    // categoryList: [],
                    showEmpty: true,
                    loading: false,
                    callingApi: false,
                  })
                : "";
            }
          )
          .catch((err) => {});
  };
//for initially get the products
  getProducts(storeId, zoneID) {
    this.setState({ loading: true });
    let queryName = getCookie("catQuery", "");
    let query = { match_phrase_prefix: { "catName.en": queryName } };
    searchFilterParams(0, 0, 10, storeId, zoneID, false, query)
      .then(
        ({ data }) => {
          this.setState({
            categoryList: data.data,
            loading: false,
            showEmpty: false,
            penCount: data.penCount,
          });
          
        },
        (error) => {
         
          this.setState({ loading: false });
          query.length > 0
            ? this.setState({
                categoryList: [],
                showEmpty: true,
                loading: false,
              })
            : "";
        }
      )
      .catch((err) => {});
  }
// to display carts details
  editCart = (cartDetail, products, type, event) => {
    event.stopPropagation();

    
    let editCartData = {
      cartId: this.props.reduxState.cartList.cartId,
      childProductId: cartDetail.childProductId,
      unitId: cartDetail.unitId,
    };
    //  let mainQantity = this.props.productDetail.data.units[0].availableQuantity ? this.props.productDetail.data.units[0].availableQuantity : this.props.productDetail.data.units[0].quantity ? this.props.productDetail.data.units[0].quantity.en : 100;
    // if (cartDetail.quantity < products.availableQuantity || type == 1) {
      type == 1
        ? (editCartData["quantity"] = cartDetail.quantity - 1)
        : (editCartData["quantity"] = cartDetail.quantity + 1);
      this.props.dispatch(actions.editCard(editCartData));
    // } else {
    //   alert("Only " + products.availableQuantity + " items available");
    // }
  };

  addToCart = (data, event) => {
    event.stopPropagation();
  
    let cartData;
    this.state.isAuthorized
      ? ((cartData = {
          childProductId: data.childProductId,
          unitId: data.units[0].unitId,
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
    let heading = this.props.queries.name || getCookie("catQuery", "");

    let storename;

    this.state.categoryList &&
    this.state.categoryList.data &&
    this.state.categoryList.data.store
      ? (storename = this.state.categoryList.data.store)
      : (storename = "");

    return (
      <Wrapper>
        {/* header */}
        <Header
          stickyHeader={this.state.stickyHeader}
          showLoginHandler={this.showLoginHandler}
          isAuthorized={this.state.isAuthorized}
          showChildren={true}
          showLocationHandler={this.showLocationHandler}
          showLocationMobileHandler={this.showLocationMobileHandler}
          showLocation={true}
          hideSideMenu={() => this.hideSideMenu()}
          showSideMenu={() => this.showSideMenu()}
          showCart={this.showCart}
          stores={this.props.stores.data}
          selectedStore={this.props.selectedStore}
          deleteAllCookies={this.deleteAllCookies}
          cartProducts={this.props.cartProducts}
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
                <IconButton onClick={() => this.mainRefs.opendrawer()} style={{ height: '30px', padding: '6px' }}>
                                    <img src='/static/icons/Common/Filter.imageset/filter@3x.png' width="24" />
                                </IconButton>
              </div>
            </div>
          </div>
        </Header>
{/* content  */}
        <CategoryProductsList
          onRef={(ref) => (this.mainRefs = ref)}
          heading={heading}
          getFilters={this.getFilters}
          lang={this.props.lang}
          locale={this.props.locale}
          list={this.state.categoryList}
          brandsList={this.state.brandsList}
          subSubCategory={this.state.subSubCategory}
          subCategories={this.state.subCategories}
          manufacturers={this.state.manufacturers}
          searchFilter={this.searchFilter}
          applyPriceFilter={this.applyPriceFilter}
          height={this.prev}
          sortProducts={this.sortProducts}
          sortText={this.state.sortText}
          sort1={this.state.sort1}
          sort2={this.state.sort2}
          sort3={this.state.sort3}
          cartProducts={this.props.cartProducts}
          updateSlug={this.updateSlug}
          addToCart={this.addToCart}
          editCart={this.editCart}
          isFromCategory={true}
          showSubCategory={true}
          getSubSubCategory={this.getSubSubCategory}
          slug={5}
          loading={this.state.loading}
          brandPenCount={this.state.brandPenCount}
          CatPenCount={this.state.CatPenCount}
          ManuPenCount={this.state.ManuPenCount}
          showEmpty={this.state.showEmpty}
          minPrice={this.state.minPrice}
          maxPrice={this.state.maxPrice}
          priceCurrency={this.state.priceCurrency}
          showLoginHandler={this.showLoginHandler}
          subcategorySelected={this.state.subcategorySelected}
          subsubcategorySelected={this.state.subsubcategorySelected}
        />

        <Authmodals
          onRef={(ref) => (this.child = ref)}
          editCart={this.editCart}
        />

        <ExpireCartDialog onRef={(ref) => (this.expRef = ref)} />

        {/* {this.state.loading ? <CircularProgressLoader /> : ''} */}
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    reduxState: state,
    cartProducts: state.cartProducts,
    stores: state.stores,
    locErrStatus: state.locErrStatus,
    locErrMessage: state.locErrMessage,
    selectedStore: state.selectedStore,
    selectedLang: state.selectedLang,
    myCart: state.cartList,
    locale:state.locale
  };
};

export default connect(mapStateToProps)(Products);
