import React from "react";
import { Component } from "react";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";

import Footer from "../footer/Footer";
import Wrapper from "../../hoc/wrapperHoc";
import LabelBottomNavigation from "../footer/BottomNavigation";
import ProductDialog from "../dialogs/productDialog";
import ListExampleNested from "../sideBar/rightSideFilters";
import { FontIcon, IconButton } from "material-ui";
import LeftSlider from "../ui/sliders/leftSlider";
import ProductDetails from "../sideBar/productDetails";
import MobileViewFilters from "../sideBar/mobileViewFilter";
import CustomSlider from "../ui/sliders/customSlider";
import CircularProgressLoader from "../ui/loaders/circularLoader";
import redirect from "../../lib/redirect";
import Router from "next/router";
import CartFooter from "../cart/cartFooter";
import ProductListMView from "../producthome/ProductList/ProductListMView";
import Shimmer from "react-shimmer-effect";
import injectSheet from "react-jss";
import Tab from "../ui/tabs/Tab";
import ProductListShimmer from "../producthome/ProductList/ProductListShimmer";
import { RouteToDetails } from "../../lib/navigation/navigation";

const FilterIcon = (
  <FontIcon className="material-icons" style={{ fontSize: "20px" }}>
    {" "}
    <i className="fa fa-filter" />
  </FontIcon>
);

const StyleSheet = {
  container: {
    border: "0px solid rgba(255, 255, 255, 1)",
    boxShadow: "0px 0px 20px rgba(0, 0, 0, .1)",
    borderRadius: "4px",
    backgroundColor: "white",
    display: "flex",
    padding: "16px",
    width: "200px",
  },
  circle: {
    height: "100px",
    width: "100px",
    borderRadius: "50%",
    padding: "10px",
    margin: "10px 15px",
  },
  line: {
    width: "100%",
    height: "15px",
    alignSelf: "center",
    margin: "7px 16px",
    borderRadius: "4px",
  },
  paraLine: {
    width: "37%",
    height: "25px",
    alignSelf: "center",
    margin: "7px 16px",
    borderRadius: "4px",
  },
};

class ProductsListComponent extends Component {
  constructor(props) {
    super(props);
    this.openProductDialog = this.openProductDialog.bind(this);
    this.opendrawer = this.opendrawer.bind(this);
    this.handleDetailToggle = this.handleDetailToggle.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
  }
  state = {
    value: 1,
    showSideFilter: false,
    SliderWidth: "100%",
    loading: true,
    windowWidth: 580,
  };

  opendrawer() {
    this.setState({ SliderWidth: "100%" });
    this.child.handleLeftSliderToggle();
  }

  opendrawerTab() {
    this.setState({ SliderWidth: 500 });
    this.child.handleLeftSliderToggle();
  }

  handleChange = (event, index, value) => this.setState({ value });

  openProductDialog(product) {
    // this.dialogRef.openProductDialog(product);
    this.handleDetailToggle(product);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        showSideFilter: true,
        loading: false,
        windowWidth: window.outerWidth,
      });
    }, 500);

    this.props.onRef(this);
    this.handleScroll();
    window.addEventListener("resize", this.handleScroll);
  }

  handleScroll = () => {
    this.setState({ windowWidth: window.outerWidth });
  };

  handleDetailToggle = (post) => {
    RouteToDetails(post);
    // Router.push(`/details?id=${post.childProductId}&slug=${this.props.slug}`).then(() =>
    //   window.scrollTo(0, 0)
    // );
  };

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.handleScroll);
  };

  handleClose = () => {
    this.setState({ SliderWidth: 0 });
  };
  closeDrawer = () => {
    this.child.handleLeftSliderClose();
  };

  breadCumbsFilter = (
    categorySelected,
    subcategorySelected,
    subsubcategorySelected
  ) => {
    this.filterRef.categorySelection(
      categorySelected,
      subcategorySelected,
      subsubcategorySelected
    );
  };
  handleSortFilter = (type) => {
    // type ->   1: newest, 2: lowest price, 3: highest price
    switch (type) {
      case 1:
        this.props.sortProducts("sort1", "Newest");
        break;
      case 2:
        this.props.sortProducts("sort2", "Price Lowest");
        break;
      case 3:
        this.props.sortProducts("sort3", "Price Highest");
        break;
    }
  };
  Reload() {
    location.reload();
  }
  printEmptyData = () => {
    return (
      <div className="col-12 py-5 text-center" style={{ height: "60vh" }}>
        <img
          style={{ marginTop: "4%" }}
          src="/static/icons/EmptyScreens/EmptySearch.imageset/empty_products.png"
          width="150"
          height="150"
          className="img-fluid"
          alt="search"
        />
        <p style={{ fontSize: "18px", marginTop: "20px" }}>
          <strong>Sorry! No matching Results Found !</strong> <br />
          <span style={{ color: "#999", lineHeight: "2em" }}>
            Try a different keyword maybe ?
          </span>
        </p>
      </div>
    );
  };

  printNormalEmpty = () => {
    return (
      <div className="col-12 py-5 text-center">
        <img
          src="/static/icons/EmptyScreens/EmptySearch.imageset/empty_products.png"
          width=""
          height=""
          className="img-fluid"
          alt="search"
        />
        <p style={{ letterSpacing: "0px" }}>
          Sorry! No matching Products Found !
        </p>
      </div>
    );
  };
  render() {
    let sideNavClass;
    let mainClass;
    let sideContainer;

    this.props.height > 550 ? (sideContainer = "sticky") : (sideContainer = "");

    const { classes } = this.props;

    const TabLabels = [
      "Sort By ",
      "Newest First",
      "Price--Low to High",
      "Price--High to Low",
    ];

    const TabContent =
      this.props.list &&
      this.props.list.data &&
      this.props.list.data.length > 0 ? (
        this.props.list.data.map((post, index) => (
          <ProductListMView
            post={post}
            currency={post.currencySymbol || this.props.currencySymbol}
            openProductDialog={this.openProductDialog}
            addToCart={this.props.addToCart}
            handleDetailToggle={this.handleDetailToggle}
            editCart={this.props.editCart}
            index={index}
            total={this.props.list.data.length}
            cartProducts={this.props.cartProducts}
          />
        ))
      ) : this.props.loading ? (
        <ProductListShimmer />
      ) : (
        this.printNormalEmpty()
      );

    return (
      <Wrapper>
        <div
          className="col-12 catProdListCommSec"
          style={{ background: "#f7f7f7" }}
        >
          <div className="row">
            <div className="col-12">
              <div className="row">
                {/* <div className="col-12 px-5 px-xl-5 py-md-4 py-lg-0 mb-5"> */}
                <div className="col-12 py-md-4 py-lg-0 mb-5">
                  <div className="row">
                    {/* filters */}
                    <div className="col-xl-3 col-lg-3 mobile-hide d-none d-lg-block outer-padding filterPart">
                      <div className="white-card">
                        <div className="row align-items-center bgFilterHeader">
                          <div className="col px-0 border-bottom">
                            <div className="left-Filter-Header">Filters</div>
                            {this.props.isFilterSelected ? (
                              <div className="clearFilters">
                                <a onClick={this.Reload}>Clear All</a>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>

                        <div className="row">
                          <div
                            className="col"
                            style={{
                              padding: "10px",
                              height: "auto",
                              zIndex: "9",
                              width: "100%",
                              transition: "top 0.2s ease-out",
                              fontSize: "13px !important",
                            }}
                          >
                            {this.state.showSideFilter ? (
                              <ListExampleNested
                                classFloat={sideContainer}
                                brandsList={this.props.brandsList}
                                searchFilter={this.props.searchFilter}
                                applyPriceFilter={this.props.applyPriceFilter}
                                Categories={this.props.Categories}
                                manufacturers={this.props.manufacturers}
                                showSubCategory={false}
                                updateSlug={this.props.updateSlug}
                                getFilters={this.props.getFilters}
                                height="70vh"
                                overFlow="scroll"
                                onRef={(ref) => (this.filterRef = ref)}
                                list={this.props.list}
                                brandPenCount={this.props.brandPenCount}
                                ManuPenCount={this.props.ManuPenCount}
                                CatPenCount={this.props.CatPenCount}
                                minPrice={this.props.minPrice}
                                maxPrice={this.props.maxPrice}
                                priceCurrency={this.props.priceCurrency}
                                handleFilterSelection={
                                  this.props.handleFilterSelection
                                }
                              />
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* filters */}
                    {/* prods list */}
                    <div
                      className="col-xl-9 col-lg-9 view-all-products cusWhiteAlter white-card-right"
                      style={{
                        boxShadow: this.state.windowWidth <= 576 ? "none" : "",
                      }}
                    >
                      <div className="row">
                        <div className="col-12 productDisplaySection featuredItems">
                          <section className="row mobile-hide catTitle align-items-center px-3">
                            <nav
                              aria-label="breadcrumb"
                              className="col-12 px-0"
                            >
                              <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                  <a href="/">Home</a>
                                </li>
                                <li
                                  className="breadcrumb-item active"
                                  aria-current="page"
                                >
                                  <a onClick={this.Reload}>
                                    {this.props.heading}
                                  </a>
                                </li>
                                {this.props.currentLocation ? (
                                  <li
                                    className="breadcrumb-item active"
                                    aria-current="page"
                                  >
                                    <a onClick={this.Reload}>
                                      {this.props.currentLocation}
                                    </a>
                                  </li>
                                ) : (
                                  ""
                                )}
                                {this.props.categorySelected ? (
                                  <li
                                    className="breadcrumb-item active"
                                    aria-current="page"
                                  >
                                    <a
                                      onClick={() =>
                                        this.breadCumbsFilter(
                                          this.props.categorySelected,
                                          null,
                                          null
                                        )
                                      }
                                    >
                                      {this.props.categorySelected}{" "}
                                    </a>
                                  </li>
                                ) : (
                                  ""
                                )}
                                {this.props.subcategorySelected ? (
                                  <li
                                    className="breadcrumb-item active"
                                    aria-current="page"
                                  >
                                    <a
                                      onClick={() =>
                                        this.breadCumbsFilter(
                                          this.props.categorySelected,
                                          this.props.subcategorySelected,
                                          null
                                        )
                                      }
                                    >
                                      {this.props.subcategorySelected}
                                    </a>{" "}
                                  </li>
                                ) : (
                                  ""
                                )}
                                {this.props.subsubcategorySelected ? (
                                  <li
                                    className="breadcrumb-item active"
                                    aria-current="page"
                                  >
                                    <a
                                      onClick={() =>
                                        this.breadCumbsFilter(
                                          this.props.categorySelected,
                                          this.props.subcategorySelected,
                                          this.props.subsubcategorySelected
                                        )
                                      }
                                    >
                                      {this.props.subsubcategorySelected}
                                    </a>
                                  </li>
                                ) : (
                                  ""
                                )}
                              </ol>
                            </nav>
                            <div className="col-12 mobile-hide py-2">
                              <div className="row">
                                <div className="col-md px-0">
                                  <h3
                                    className="pb-2 pb-md-0"
                                    style={{
                                      fontSize: 24,
                                      marginBottom: "0px",
                                      paddingTop: "5px",
                                    }}
                                  >
                                    {/* { this.props.heading || this.props.categorySelected || this.props.subcategorySelected || this.props.subsubcategorySelected  } */}
                                    {this.props.subsubcategorySelected ||
                                      this.props.subcategorySelected ||
                                      this.props.categorySelected ||
                                      this.props.heading}
                                    {/* {this.props.currentLocation} */}
                                  </h3>
                                </div>
                                <div className="col-lg-3 col-lg-4  tab-hide col-md-4 customselectLayout d-none d-sm-block pr-lg-0">
                                  <div className="dropdown d-none">
                                    <button
                                      type="button"
                                      className="btn btn-default dropdown-toggle w-100 text-left"
                                      data-toggle="dropdown"
                                    >
                                      Sort By : {this.props.sortText}
                                    </button>
                                    <div className="dropdown-menu">
                                      <a
                                        onClick={() =>
                                          this.props.sortProducts(
                                            "sort1",
                                            "Newest"
                                          )
                                        }
                                        className={
                                          "dropdown-item " + this.props.sort1
                                        }
                                      >
                                        Newest
                                      </a>
                                      <a
                                        onClick={() =>
                                          this.props.sortProducts(
                                            "sort2",
                                            "Price Lowest"
                                          )
                                        }
                                        className={
                                          "dropdown-item " + this.props.sort2
                                        }
                                      >
                                        Price Lowest
                                      </a>
                                      <a
                                        onClick={() =>
                                          this.props.sortProducts(
                                            "sort3",
                                            "Price Highest"
                                          )
                                        }
                                        className={
                                          "dropdown-item " + this.props.sort3
                                        }
                                      >
                                        Price Highest
                                      </a>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-auto tab-show">
                                  <IconButton
                                    onClick={() => this.opendrawerTab()}
                                    style={{ height: "35px", padding: "6px" }}
                                  >
                                    <img
                                      src="/static/icons/Common/Filter.imageset/filter@3x.png"
                                      width="30"
                                    />
                                  </IconButton>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 px-0 tab-hide filterTabsCont">
                              {this.state.showSideFilter ? (
                                <Tab
                                  TabLabels={TabLabels}
                                  TabContent={TabContent}
                                  onTabChange={this.handleSortFilter}
                                  triggerOnChange={true}
                                  TabTitle="Sort By "
                                />
                              ) : (
                                ""
                              )}
                            </div>
                          </section>
                          <div className="row">
                            <div className="col-12 mobile-show tab-show">
                              <div className="row">
                                {this.props.list &&
                                this.props.list.data &&
                                this.props.list.data.length > 0 ? (
                                  this.props.list.data.map((post, index) => (
                                    // <div key={"cusWhiteAlterIndex" + index} className="col-6 col-sm-6 col-md-4 col-lg-4 col-xl-2 py-4 view-all-single-product fixed-width">
                                    <ProductListMView
                                      post={post}
                                      currency={
                                        post.currencySymbol ||
                                        this.props.currencySymbol
                                      }
                                      openProductDialog={this.openProductDialog}
                                      addToCart={this.props.addToCart}
                                      handleDetailToggle={
                                        this.handleDetailToggle
                                      }
                                      editCart={this.props.editCart}
                                      index={index}
                                      total={this.props.list.data.length}
                                      cartProducts={this.props.cartProducts}
                                    />
                                  ))
                                ) : this.props.loading ? (
                                  <ProductListShimmer />
                                ) : (
                                  this.printNormalEmpty()
                                )}
                              </div>
                            </div>
                          </div>
                          <CartFooter />
                        </div>
                      </div>
                    </div>
                    {/* prods list */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="catFooter col-12" style={{ float: "left" }}>
          <Footer lang={this.props.lang} />
        </div>

        {/* {this.state.loading ? <CircularProgressLoader /> : ""} */}

        <ProductDialog
          onRef={(ref) => (this.dialogRef = ref)}
          showLoginHandler={this.props.showLoginHandler}
        />
        <ProductDetails
          onRef={(ref) => (this.prodRef = ref)}
          width={this.state.SliderWidth}
          handleClose={this.handleClose}
          showLoginHandler={this.props.showLoginHandler}
        />

        <CustomSlider
          onRef={(ref) => (this.child = ref)}
          width={this.state.SliderWidth}
          handleClose={this.handleClose}
        >
          <MobileViewFilters
            classFloat={sideContainer}
            brandsList={this.props.brandsList}
            searchFilter={this.props.searchFilter}
            Categories={this.props.Categories}
            sortProducts={this.props.sortProducts}
            manufacturers={this.props.manufacturers}
            overFlow="unset"
            getFilters={this.props.getFilters}
            closeFilters={this.closeDrawer}
            minPrice={this.props.minPrice}
            maxPrice={this.props.maxPrice}
            priceCurrency={this.props.priceCurrency}
            hideCats={false}
            showSubCategory={false}
            heading={this.props.heading}
          />
        </CustomSlider>
      </Wrapper>
    );
  }
}
export default injectSheet(StyleSheet)(ProductsListComponent);
