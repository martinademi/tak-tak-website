import React from "react";
import { connect } from "react-redux";
import { FontIcon, IconButton } from "material-ui";

import "../assets/cityPage.scss";
import "../assets/style.scss";
import "../assets/login.scss";

import { APP_NAME, OG_DESC, OG_LOGO, OG_TITLE } from "../lib/envariables";
import { getCities } from "../services/auth";
import CustomHead from "../components/html/head";
import Header from "../components/header/innerPageHeader";
import Authmodals from "../components/authmodals";
import * as actions from "../actions";
import { getCookiees } from "../lib/session";

const STORE_IMAGE =
  "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_508,h_320,c_fill/ndvkl8xtmggwaxrp8c8j";
const CITY = "Bangalore";
class CityPage extends React.Component {
  static async getInitialProps({ ctx }) {
    const isAuthorized = await getCookiees("authorized", ctx.req);
    let StoreName = getCookiees("storeName", ctx.req);
    const queries = ctx.query;
    let lang = (await (queries.lang || getCookiees("lang", ctx.req))) || "en";
    ctx && ctx.store ? ctx.store.dispatch(actions.selectLocale(lang)) : "";
    return { isAuthorized, StoreName, lang };
  }

  state = {
    topPicks: [1, 2, 3, 4, 5, 6],
    stores: [1, 2, 3, 4, 5, 6, 7, 8],
    cityRows: [1, 2, 3, 4],
    cityData: [],
    isAuthorized: this.props.isAuthorized
  };

  componentDidMount = () => {
    this.getCities();
  };

  showLoginHandler = () => {
    this.child.showLoginHandler();
  };
  showCart = () => {
    this.child.showCart();
  };
  showLocationHandler = () => {
    this.child.showLocationHandler();
  };
  showLocationMobileHandler = () => {
    this.child.showLocationMobileHandler();
  };

  deleteAllCookies() {
    document.cookie.split(";").forEach(c => {
      document.cookie =
        c.trim().split("=")[0] +
        "=;" +
        "expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    });
    redirect("/");
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.reduxState.userName !== this.props.reduxState.userName) {
      this.setState({ isAuthorized: this.props.reduxState.authorized });
    }
  }

  showLocationHandler = () => this.child.showLocationHandler();

  getCities = () => {
    getCities()
      .then(data => {
        this.setState({ cityData: data.data });
      })
      .catch(err => {
        
      });
  };
  render() {
    return (
      <div className="cityPage">
        <CustomHead
          description={OG_DESC}
          ogImage={OG_LOGO}
          title={`Order Food Online in ${CITY} from ${APP_NAME}` || OG_TITLE}
        />

        <Header
          stickyHeader={true}
          showLoginHandler={this.showLoginHandler}
          isAuthorized={this.state.isAuthorized}
          staticPage={true}
          hideSearch={true}
          hideCategory={true}
          showCart={this.showCart}
          showLocationHandler={this.showLocationHandler}
          showLocationMobileHandler={this.showLocationMobileHandler}
          hideBottom={true}
          deleteAllCookies={this.deleteAllCookies}
        >
          <div className="col-12">
            <div className="row">
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
                {/* <h6 className="innerPage-heading">Contact Us</h6> */}
              </div>
            </div>
          </div>
        </Header>

        {/* location setup section */}
        <section style={{ marginTop: "75px" }}>
          <div className="row">
            <div className="col-12 header-main-bloc d-flex align-items-center">
              <div className="header-sub-main-bloc w-md-100 pl-2 leftPadding">
                <h1 className="city-header-title  pb-xl-3 pb-lg-1 pb-md-1 pt-4">
                  Great restaurants in {CITY}, delivering to you
                </h1>
                <div className="header-sub-title desktop pb-3">
                  Set exact location to find the right restaurants near you.
                </div>
                <div className="header-sub-title mobile">
                  Set location to find restaurants near you.
                </div>
                <a className="locationLink" onClick={this.showLocationHandler}>
                  <div className="header-input-button col-xl-8 col-md-12 col-sm-12 col-12 col-lg-12 d-flex align-items-center justify-content-around">
                    <div className="button-first-block  d-flex  align-items-center h-100 pl-2 m-0 desktop">
                      <span className="desktop">
                        {" "}
                        Enter street name , area etc....
                      </span>
                      <span className="mobile"> Enter delivery location</span>
                    </div>
                    <div className="button-second-block h-100 d-flex align-items-center pl-2">
                      <span className="desktop">FIND FOOD</span>
                      <span
                        className="fa fa-search mobile"
                        style={{ color: "#786B84", fontSize: "20px" }}
                      />
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>
        {/* location setup section */}

        {/* about the place section */}
        <section>
          {/* text block start */}
          <div className="row d-flex align-items-center">
            <div className="col-12">
              <div className="leftPadding">
                <h1 className="title pb-md-1  pb-lg-1 pb-xl-3 pt-md-2  pt-sm-2 pt-lg-2 pt-md-2 pt-xl-5 pt-3 pr-sm-5 pr-5 mt-2">
                  <span className="desktop">
                    About the food culture in {CITY}
                  </span>
                  <span className="mobile">
                    About the food culture in the {CITY}
                  </span>
                </h1>
                <div className="about-discription pr-md-2 pr-lg-2 pr-xl-5 mr-md-2  mr-sm-2 mr-lg-2 mr-xl-5 mr-2">
                  Order food &amp; beverages online from restaurants near &amp;
                  around you. We deliver food from your neighborhood local
                  joints, your favorite cafes, luxurious &amp; elite restaurants
                  in your area, and also from chains like Dominos, KFC, Burger
                  King, Pizza Hut, FreshMenu, Mc Donald's, Subway, Faasos, Cafe
                  Coffee Day, Taco Bell, and more. Exciting bit? We place no
                  minimum order restrictions! Order in as little (or as much) as
                  you'd like. We'll {APP_NAME} it to you!
                </div>
              </div>
            </div>
          </div>
          {/* text block end */}

          {/* our picks for you block start */}
          <div className="row d-flex align-items-center">
            <div className="col-12">
              <div className="leftPadding">
                <h1 className="title mt-md-2 mt-sm-2 mt-3 mt-lg-2 mt-xl-2 pt-md-2 pt-lg-2 pt-xl-5 pb-xl-3  pb-md-2 pb-lg-2">
                  Our picks for you
                </h1>
                <div className="row offer-bloc">
                  {/* block 1 start */}
                  {this.state.topPicks.map((item, index) => (
                    <div
                      key={"main-card-" + index}
                      className="card col-md-12 col-xl-4 col-sm-12 col-lg-12 p-lg-1 pr-xl-3 my-3 p-md-1 p-sm-1 p-1 pt-sm-2 pt-2 item storeCard"
                    >
                      <div className="hover-bloc">
                        <img
                          className="card-img-top offer-image"
                          src="https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/Offers_yqoiuk"
                          alt="Card image"
                        />
                        <div className="card-img-overlay hover d-flex align-items-end overlay">
                          <h4 className="card-title overlay-text">
                            OFFERS NEAR YOU
                          </h4>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* block 1 end*/}
                </div>
              </div>
            </div>
          </div>
          {/* our picks for you block end  */}

          {/* city service area block start */}
          <div className="d-sm-flex d-lg-flex d-md-flex d-flex flex-column">
            <div className="row d-flex align-items-center order-xl-1 order-lg-2 order-md-2 order-sm-2 order-2">
              <div className="col-12">
                <div className="leftPadding">
                  <h1 className="title pb-3 pt-xl-5 mt-2">
                    About the food culture in {CITY}
                  </h1>
                  <div className="row">
                    <div className="col-md-12 col-xs-12 col-sm-12 col-xl-4 col-lg-12 px-0">
                      <div className="about-discription">Yeshwanthpur</div>
                      <div className="about-discription">Yeshwanthpur</div>
                      <div className="about-discription">Yeshwanthpur</div>
                      <div className="about-discription">Yeshwanthpur</div>
                      <div className="about-discription">Yeshwanthpur</div>
                      <div className="about-discription">Yeshwanthpur</div>
                      <div className="about-discription">Yeshwanthpur</div>
                      <div className="about-discription">Yeshwanthpur</div>
                      <div className="about-discription">Yeshwanthpur</div>
                      <div className="about-discription">Yeshwanthpur</div>
                    </div>
                    <div className="col-md-12 col-xs-12 col-sm-12 col-xl-4 col-lg-12 px-0">
                      <div className="about-discription">Yeshwanthpur</div>
                      <div className="about-discription">Yeshwanthpur</div>
                      <div className="about-discription">Yeshwanthpur</div>
                      <div className="about-discription">Yeshwanthpur</div>
                      <div className="about-discription">Yeshwanthpur</div>
                      <div className="about-discription">Yeshwanthpur</div>
                      <div className="about-discription">Yeshwanthpur</div>
                      <div className="about-discription">Yeshwanthpur</div>
                      <div className="about-discription">Yeshwanthpur</div>
                      <div className="about-discription">Yeshwanthpur</div>
                    </div>
                    <div className="col-md-12 col-xs-12 col-sm-12 col-xl-4 col-lg-12 px-0">
                      <div className="about-discription">Yeshwanthpur</div>
                      <div className="about-discription">Yeshwanthpur</div>
                      <div className="about-discription">Yeshwanthpur</div>
                      <div className="about-discription">Yeshwanthpur</div>
                      <div className="about-discription">Yeshwanthpur</div>
                      <div className="about-discription">Yeshwanthpur</div>
                      <div className="about-discription">Yeshwanthpur</div>
                      <div className="about-discription">Yeshwanthpur</div>
                      <div className="about-discription">Yeshwanthpur</div>
                      <div className="about-discription">Yeshwanthpur</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* city service area block end */}

            {/* popular restaurants block start */}
            <div className="row d-flex align-items-center order-xl-2 order-lg-1 order-md-1  order-sm-1 order-1">
              <div className="col-12">
                <div className="leftPadding">
                  <h1 className="title pb-3 mt-2 pt-md-1  pt-sm-1 pt-lg-1 pt-md-1 pt-xl-5 pt-1">
                    Popular restaurants in and around {CITY}
                  </h1>
                </div>
              </div>
              <div className="row leftPadding">
                {/* restaurants block start  */}
                {this.state.stores.map((item, index) => (
                  <div
                    key={"store-card-" + index}
                    className="card-block col-md-12 col-sm-12 col-xl-3 col-lg-12 col-12 pt-md-1 pt-sm-1 pt-lg-1 pt-md-1 pt-1 px-0"
                  >
                    <div className={"card border-0 custom-card"}>
                      {/* image block */}
                      <div className="image-block">
                        <img
                          className="card-img-top custom-image"
                          src={
                            STORE_IMAGE ||
                            "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_508,h_320,c_fill/zsvjvfmqsuviu584ha7l"
                          }
                          alt="Card image"
                        />
                      </div>
                      {/* item name */}
                      <div
                        className="card-body border-0"
                        style={{ padding: "0px 0px 0px 10px" }}
                      >
                        <h4 className="card-title custom-card-title">
                          Burgor King
                        </h4>
                        <p className="card-text custom-card-text">
                          American,Fast Food
                        </p>
                        {/* rating block */}
                        <div className="d-sm-flex d-md-flex d-flex d-lg-flex flex-column">
                          <div
                            className="row d-flex justify-content-xl-between order-xl-1 order-sm-2 order-lg-2 order-md-2 order-2 card-rating-block"
                            style={{ margin: 0 }}
                          >
                            <div>
                              <div className="star-icon pl-2 pr-2 small">
                                <i className="fa fa-star" aria-hidden="true" />
                                &nbsp;4.2
                              </div>
                            </div>
                            <div
                              className="small mobile pl-md-3 pl-lg-3"
                              style={{ color: "#686b78" }}
                            >
                              200 FOR TWO
                            </div>
                            <div className="small desktop">.</div>
                            <div className="small desktop">27 MINS</div>
                            <div className="small desktop">.</div>
                            <div className="small">
                              <span className="desktop">€ 200</span>
                            </div>
                          </div>
                          {/* offer block */}
                          <div className="offer-block order-sm-1 order-lg-1 order-1 order-md-1 order-xs-1">
                            <span className="offer-text">
                              %50 off | Use coupon SWIGGYIT50
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* restaurants block end  */}
              </div>
            </div>
            {/* popular restaurants block end */}
          </div>
        </section>

        {/* footer section start */}
        <footer className="mt-5 pt-5" style={{ backgroundColor: "black" }}>
          <div className="row d-flex align-items-center">
            <div className="col-12">
              <div className="pl-2 pl-md-5 pl-sm-2 pl-lg-5 pl-xl-5">
                <h1 className="footer-title pt-2 mb-5">WE DELIVER TO</h1>
                <div className="row mb-3">
                  {this.state.cityData &&
                    this.state.cityData.map((city, index) => (
                      <div
                        className="col-sm-3 footer-text"
                        key={"footer-city-" + index}
                      >
                        {city.cityName}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </footer>
        {/* footer section start */}

        <Authmodals
          onRef={ref => (this.child = ref)}
          editCart={this.editCart}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    reduxState: state,
    selectedLang: state.selectedLang
  };
};

export default connect(mapStateToProps)(CityPage);
