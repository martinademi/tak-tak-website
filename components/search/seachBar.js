import Link from "next/link";
import Router from "next/router";
import { connect } from "react-redux";

import Wrapper from "../../hoc/wrapperHoc";
import {
  getSuggestions,
  getTopSearch,
  searchFilterParams,
} from "../../services/filterApis";
import redirect from "../../lib/redirect";
import { getCookie } from "../../lib/session";
import "../../assets/search.scss";

class SearchBar extends React.Component {
  state = {
    sugData: null,
    noProductsError: null,
    showClearBtn: false,
    trendySearch: false,
  };
  setSearchFocus = () => {
    $(".overlay-parent").show();
    $(".overlay-div").show();
    $(".overlay-dropdown").fadeIn(500);
    this.getTopSearch();
  };
  setSearchFocusForStickey = () => {
    $(".overlay-parent").show();
    $(".overlay-div").show();
    $(".overlay-dropdown-stickey").fadeIn(500);
    // this.getTopSearch();
  };
  setSearchFocus = () => {
    $(".overlay-parent").show();
    $(".overlay-div").show();
    $(".overlay-dropdown-stickey").fadeIn(500);
  };
  setStickySearchFocus = () => {
    $(".overlay-parent").show();
    $(".overlay-div").show();
    $(".overlay-dropdown").fadeIn(500);
  };
  getTopSearch = () => {
    getTopSearch(getCookie("storeId"))
      .then(({ data }) =>
        this.setState({ sugData: data.data, trendySearch: true })
      )
      .catch((err) => {});
  };
  getProducts(qname) {
    let storeId = getCookie("storeId");
    let zoneID = getCookie("zoneid");

    let queryName = qname || getCookie("catQuery", "");
    let query = { match_phrase_prefix: { "productname.en": queryName } };
    searchFilterParams(0, 0, 10, storeId, zoneID, false, query)
      .then(
        ({ data }) => {
          this.setState({ sugData: data.data.products, trendySearch: false });
      
        },
        (error) => {
       
          this.setState({ categoryList: [], loading: false, showEmpty: true });
        }
      )
      .catch((err) => {});
  }
  getSearchResult = (e) => {
    if (e.target.value.length < 1) {
      this.setState({ showClearBtn: false });
      // this.getTopSearch();
      this.closeOverlay();
 
    } else {
      this.setState({ showClearBtn: true });
      this.props.view == "normal"
        ? this.setStickySearchFocus()
        : this.setSearchFocus();
      this.getProducts(e.target.value);

      // getSuggestions(e.target.value, getCookie("storeId"))
      //     .then(({ data }) => this.setState({ sugData: data.data, trendySearch: false }))
      //     .catch(err => {
      //         err.response.data.data.length < 1 ? this.setState({ noProductsError: "No Products Found !", sugData: null }) : this.setState({ sugData: null })
      //     })
    }
  };

  clearSearch = () => {
    document.getElementById("searchBox").value = "";
    this.setState({ sugData: null });
    this.closeOverlay();
  };

  handleSearch = (e) => {
    e.preventDefault();
    let serachVal = document.getElementById("searchBox").value;
    const href = `/search?name=${serachVal.replace("&", "%26")}&store=${
      this.props.selectedStore._id || this.props.selectedStore.businessId
    }`;
    const as = `/search/${serachVal
      .replace(/,/g, "")
      .replace(/& /g, "")
      .replace(/ /g, "-")}`;
    // Router.push(href);
    this.closeOverlay();
    // window.location.href =  href;
    // Router.replace(href);
    // redirect(href)
    Router.push(href, as);
  };

  handleSearchClick = (searchItem) => {
    redirect("/search?" + searchItem);
  };

  componentWillReceiveProps = () => {
    let searchBox = document.getElementById("searchBox");
    Router.pathname == "/search"
      ? searchBox
        ? (searchBox.value = getCookie("catQuery"))
        : searchBox
        ? (searchBox.value = "")
        : ""
      : "";
  };

  closeOverlay = () => {
    $(".overlay-div").hide();
    $(".overlay-parent").hide();
    $(".overlay-dropdown").hide();
    $(".overlay-dropdown-stickey").hide();
    document.getElementById("searchBox").value = "";
    this.setState({ showClearBtn: false });
  };

  getProdUI = (item, index, storeId) => {
    return (
      <Link
        key={"pSearch-" + index}
        as={`/search/${item.productName
          .replace(/,/g, "")
          .replace(/& /g, "")
          .replace(/ /g, "-")}`}
        href={`/search?name=${item.productName.replace(
          "&",
          "%26"
        )}&store=${storeId}`}
        key={"searchItem" + index}
      >
        <div className="row align-items-center px-3 mainSearchRes">
          <div className="col-3">
            <img
              src={item.mobileImage[0].thumbnail}
              height="70px"
              alt={item.productName}
            />
          </div>
          <div className="col-9">
            <div className="row">
              <div className="col-8 prodName">
                <p>{item.productName}</p>
              </div>
              <div className="col-4 prodPrice">
                <p>
                  {item.currencySymbol}{" "}
                  {parseFloat(item.finalPriceList[0].finalPrice).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  componentDidMount = () => {
    let searchBox = document.getElementById("searchBox");
    setTimeout(() => {
      Router.pathname == "/search"
        ? searchBox
          ? (searchBox.value = getCookie("catQuery"))
          : searchBox
          ? (searchBox.value = "")
          : ""
        : "";
    }, 1000);
  };

  render() {

    let marginTop = "-1px";

    this.props.view == "normal" ? "" : (marginTop = "46px");

    // this.props.innerPage ? marginTop = '75px' : '';
    this.props.innerPage ? (marginTop = "47px") : "";

    let storeId;
    let storeName = null;

    this.props.selectedStore
      ? ((storeId = this.props.selectedStore.businessId),
        (storeName = this.props.selectedStore.businessName)) ||
        this.props.selectedStore._id
      : "";

    return (
      <Wrapper>
        {this.props.view == "normal" ? (
          this.props.selectedStore ? (
            <div className="row pb-2">
              <div className="col-12 pt-4 text-center">
                <div className="header-title">
                  <img
                    onClick={this.props.openStoreDetail}
                    className="shine"
                    src={
                      this.props.selectedStore.businessImage ||
                      this.props.selectedStore.bannerImage
                    }
                  />
                  <h2
                    onClick={this.props.openStoreDetail}
                    className="color-white oneLineSetter"
                    title={this.props.selectedStore.businessName}
                  >
                    <a> {this.props.selectedStore.businessName}</a>
                  </h2>
                  <div className="change-store">
                    <span
                      className="change-store-span color-white"
                      title="Select Stores"
                      onClick={this.props.LeftSliderHandler}
                      style={{ cursor: "pointer" }}
                    >
                      {this.props.locale.ChangeStore}
                    </span>
                    <span
                      className="change-store-span color-white"
                      title="Select Stores"
                      onClick={this.props.openStoreDetail}
                      style={{ cursor: "pointer" }}
                    >
                      {this.props.locale.StoreInfo}
                    </span>
                  </div>
                </div>
                <div className="header-form" style={{ position: "relative" }}>
                  <form onSubmit={this.handleSearch}>
                    <div className="input-group product-search">
                      <input
                        className="text-center"
                        name="searchBox"
                        autoComplete="off"
                        type="text"
                        id="searchBox"
                        onChange={this.getSearchResult}
                        style={{ padding: "10px" }}
                        onFocus={() => this.setSearchFocus()}
                        placeholder={
                          storeName
                            ? this.props.locale.searchProductsin +
                              " " +
                              storeName
                            : this.props.locale.searchProducts
                        }
                        aria-label="Search"
                      />
                      {this.state.showClearBtn ? (
                        <i
                          className="fa fa-times clearSearchBtn"
                          aria-hidden="true"
                          onClick={() => this.clearSearch()}
                        ></i>
                      ) : (
                        ""
                      )}
                    </div>
                  </form>

                  <div
                    className="overlay-dropdown scroller"
                    style={{
                      display: "none",
                      width: "100%",
                      position: "absolute",
                      zIndex: "9999",
                      marginTop: "0px",
                    }}
                  >
                    <div className="row px-3">
                      <div className="col-12 px-0">
                        {this.state.trendySearch ? (
                          <p className="px-4 my-2" style={{ fontWeight: 600 }}>
                            Trending
                          </p>
                        ) : (
                          ""
                        )}
                        {this.state.sugData ? (
                          this.state.sugData.map((item, index) =>
                            item.productName.length > 0
                              ? this.getProdUI(item, index, storeId)
                              : ""
                          )
                        ) : this.state.noProductsError ? (
                          <div className="py-3 px-2">
                            <p className="text-danger text-center">
                              <b>{this.state.noProductsError}</b>
                            </p>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )
        ) : (
          <div className="col-8 col-sm-12 col-xl-12 ml-3">
            <form className="w-100" onSubmit={this.handleSearch}>
              <div className="input-group product-search">
                <input
                  type="text"
                  autoComplete="off"
                  name="searchBox"
                  placeholder={
                    storeName
                      ? this.props.locale.searchProductsin + " " + storeName
                      : this.props.locale.searchProducts
                  }
                  id="searchBox"
                  onChange={this.getSearchResult}
                  onFocus={() => this.setSearchFocusForStickey()}
                  placeholder={
                    storeName
                      ? this.props.locale.searchProductsin + " " + storeName
                      : this.props.locale.searchProducts
                  }
                  aria-label="Search"
                />
                {this.state.showClearBtn ? (
                  <i
                    className="fa fa-times clearSearchBtn"
                    aria-hidden="true"
                    onClick={() => this.clearSearch()}
                  ></i>
                ) : (
                  ""
                )}
                {!this.state.showClearBtn ? (
                  <div className="product-search-img">
                    <img
                      src="/static/images/search.svg"
                      width="14"
                      height="15"
                      className="img-fluid"
                      alt="search"
                    />
                  </div>
                ) : (
                  ""
                )}
                <div
                  className="overlay-dropdown-stickey scroller"
                  style={{
                    display: "none",
                    width: "100%",
                    position: "absolute",
                    zIndex: "9999",
                    marginTop: "40px",
                  }}
                >
                  <div className="row px-3">
                    <div className="col-12 px-0">
                      {this.state.trendySearch ? (
                        <p className="px-4 my-2" style={{ fontWeight: 600 }}>
                          Trending
                        </p>
                      ) : (
                        ""
                      )}
                      {this.state.sugData ? (
                        this.state.sugData.map((item, index) =>
                          item.productName.length > 0
                            ? this.getProdUI(item, index, storeId)
                            : ""
                        )
                      ) : this.state.noProductsError ? (
                        <div className="py-3 px-2">
                          <p className="text-danger text-center">
                            {" "}
                            <b>{this.state.noProductsError}</b>
                          </p>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        <div
          className="overlay-parent"
          style={{ display: "none", marginTop: marginTop }}
        >
          <div className="overlay-div" onClick={this.closeOverlay}>
            {" "}
          </div>
        </div>

        <style jsx>
          {`
                
                :global(.header-with-background){
                    background-image:url('${
                      this.props.selectedStore &&
                      this.props.selectedStore.bannerImage
                        ? this.props.selectedStore.bannerImage
                        : ""
                    }') !important;
                    background-size: cover;
                    background-position: center center;
                    background-repeat: repeat;
                }
                `}
        </style>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    locale: state.locale,
    selectedLang: state.selectedLang,
  };
};

export default connect(mapStateToProps)(SearchBar);
