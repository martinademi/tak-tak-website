import React from "react";
import { connect } from "react-redux";
import { FontIcon, IconButton } from "material-ui";
import Footer from "../components/footer/Footer";
import Header from "../components/header/innerPageHeader";
import Authmodals from "../components/authmodals/index";
import { getCookiees } from "../lib/session";
import { appConfig } from "../services/auth";
import Wrapper from "../hoc/wrapperHoc";
import redirect from "../lib/redirect";
import CircularProgressLoader from "../components/ui/loaders/circularLoader";
import * as actions from "../actions";
import CustomHead from "../components/html/head";
import {
  OG_LOGO,
  OG_TITLE,
  OG_DESC,
  APP_NAME,
  APP_STORE,
  PLAY_STORE
} from "../lib/envariables";

class About extends React.Component {
  lang = this.props.lang;
  static async getInitialProps({ ctx }) {
    const isAuthorized = await getCookiees("authorized", ctx.req);
    let StoreName = getCookiees("storeName", ctx.req);
    const queries = ctx.query;
    // let lang = (await (queries.lang || getCookiees("lang", ctx.req))) || "en";
    // ctx && ctx.store ? ctx.store.dispatch(actions.selectLocale(lang)) : "";
    return { isAuthorized, StoreName };
  }

  state = {
    aboutUs: null,
    loading: false
  };

  constructor(props) {
    super(props);

    this.state = {
      isAuthorized: props.isAuthorized
    };
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
  showCart = () => {
    this.child.showCart();
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.reduxState.userName !== this.props.reduxState.userName) {
      this.setState({
        username: this.props.reduxState.userName,
        isAuthorized: this.props.reduxState.authorized
      });
    }
  }
  componentDidMount = () => {
    this.setState({ loading: true });

    // to get about from the config
    appConfig()
      .then(async ({ data }) => {
       
        await this.setState({ aboutUs: data.data.aboutUs, loading: false });

        let htmlTag = document.getElementById("whtDesc");
        htmlTag.innerHTML = data.data.aboutUs.question[0].description;

        htmlTag = document.getElementById("whyDesc");
        htmlTag.innerHTML = data.data.aboutUs.question[1].description;
      })
      .catch(err => this.setState({ loading: false }));
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
  render() {
    let lang = this.props.lang;
    return (
      <div>
        <CustomHead
          description={"About DelivX App, I can sya it's all in one" || OG_DESC}
          ogImage={OG_LOGO}
          title={OG_TITLE}
        />
{/* Header */}
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

        {/* Main About Us Content Part */}
        <div className="col aboutUsTitleSection">
          <div className="row">
            <div className="container p-3 py-sm-5" id="aboutUsContainer">
              {/* Discover New Content Row */}
              <div className="row px-3 pt-3">
                <div className="col-12 text-center">
                  <h2 data-text="About Us" className="aboutUsTitle">
                    {this.lang.aboutUs || "About Us"}
                  </h2>
                </div>
              </div>
              {/* <div className="row p-3">
                        <div className="col-12 text-center aboutUsContent">
                            <p className="mt-0">Save more with Grocers! We give you the lowest prices on all your grocery needs.</p>
                            <p>Grocers is a low-price online supermarket that gets products across categories like grocery, fruits & vegetables, beauty & wellness, household care, baby care, pet care and meats &
                                seafood delivered to your doorstep.</p>
                            <ul className="aboutUsListContent">
                                <li>Choose from over 5,000 products at prices lower than supermarkets every day!</li>
                                <li>Schedule delivery as per your convenience.</li>
                                <li>Flat 20% cashback on your first order with coupon code Grocers20. Max cashback is Rs.250.</li>
                            </ul>
                            <p>It is hereby clarified that Grocers India Private Limited does not have any relation with the mark GROFFR, which (we are given to understand) is used by
                                Redstone Consultancy Services Pvt Ltd for its real estate services business, which is not related to Grocers India Private Limited in any manner.</p>
                        </div>
                    </div> */}
            </div>
          </div>
        </div>
        {this.state.aboutUs ? (
          <Wrapper>
            <div className="container aboutSecLayout">
              <h4 className="aboutSecH2">
                {this.state.aboutUs &&
                  this.state.aboutUs.question &&
                  this.state.aboutUs.question[0].title}
              </h4>
              {/* <p className="aboutSecP">Grocers is a Product of 3Embed software technologies , It aims at providing&nbsp;one stop destination for all urban lifestyle services. We help you hire taskers&nbsp;to get your daily requirement done just by a few clicks. It allows you to create categories and services as per the nature of your market . Caters for on- Demand , Market place&nbsp; On hourly basis and at a fixed cost for services.</p> */}
              <p className="aboutSecP" id="whtDesc"></p>
            </div>
            {/* <div className="col" id="whyGoTasker">
                                <div className="row">
                                    <div className="container aboutSecLayout">
                                        <h4 className="aboutSecH2">{this.state.aboutUs.question[1].title}</h4>
                                        <p className="aboutSecP" id="whyDesc"></p>
                                    </div>
                                </div>
                            </div> */}
          </Wrapper>
        ) : (
          ""
        )}

        {/* Mobile Icons Container */}
        {/* <div className="container p-3 p-sm-5" id="mobiIconsContainer"> */}
        <div className="container py-5" id="mobiIconsContainer">
          {/* Discover New Content Row */}
          {/* <div className="row mt-5"> */}
          <div className="row">
            <div className="col-12 text-center">
              <h4 className="mainAreaTitle">
                {APP_NAME}{" "}
                {this.lang.aboutText ||
                  "is the place for you to discover and buy amazing things curated by our global community"}
                .
              </h4>
            </div>
          </div>
          {/* <div className="row mt-5">
                        <div className="col-12 col-xs-12 col-sm-6 px-5  text-right">
                            <img src="../static/images/about-mobile-icons.png" className="img-fluid" />
                        </div>
                        <div className="col-12 col-xs-12 col-sm-6 px-5 text-left responsiveInfo">
                            <h3 className="mt-5">Web, mobile and beyond</h3>
                            <p className="mt-2 appAvailabilityContent">Grocers is available on iOS, Android & Web.</p>
                            <p className="mt-2"><a href="#">Download the Grocers app</a></p>
                        </div>
                    </div> */}
          <div className="row">
            <div className="col-md-6">
              <img
                src="../static/images/about-mobile-icons.png"
                className="img-fluid"
              />
            </div>
            <div className="col-md-6 py-md-5 aboutUsSocialIconsSecBt align-self-center">
              <div className="row justify-content-center">
                <div className="col-md-10">
                  <h3 className="">
                    {lang.webMobile || "Web, mobile and beyond"}
                  </h3>
                  <p className="aboutUsSocialIconPTag">
                    {APP_NAME}{" "}
                    {lang.avalable || "is available on iOS, Android & Web."}
                  </p>
                  <p className="aboutUsSocialIconPTag">
                    {lang.downloadThe || "Download the"} {APP_NAME}{" "}
                    {lang.app || "app"}
                  </p>
                  <div className="row mt-3">
                    <div className="col-xl-4 col-lg-5 col-md-6 col-4">
                      <a href={APP_STORE} target="_blank">
                        <img
                          alt="App store"
                          src="https://d2qb2fbt5wuzik.cloudfront.net/iserve_goTasker/images/appStore.svg"
                          width=""
                          height=""
                          className=""
                        />
                      </a>
                    </div>
                    <div className="col-xl-4 col-lg-5 col-md-6 col-4">
                      <a href={PLAY_STORE} target="_blank">
                        <img
                          alt="App store"
                          src="https://d2qb2fbt5wuzik.cloudfront.net/iserve_goTasker/images/playStore.svg"
                          width=""
                          height=""
                          className=""
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {this.state.aboutUs &&
        this.state.aboutUs.visinor &&
        this.state.aboutUs.visinor.length > 0 ? (
          <div className="container">
            <h4 className="aboutSecH2">
              {lang.meetTheTeam || "Meet the team"}
            </h4>
            {
              <div className="row">
                {this.state.aboutUs.visinor &&
                  this.state.aboutUs.visinor.map((vsnData, index) => (
                    <div
                      className="col-lg-4 col-md-6 mb-3 mb-md-0"
                      key={"member" + index}
                      style={{ display: "flex", alignItems: "stretch" }}
                    >
                      <div className="meetTeamSection px-4">
                        <div className="row mb-3">
                          <div className="col-auto meetTeamImgLayout">
                            <img
                              className=""
                              src={vsnData.visinorImages}
                              width="100"
                              height="100"
                              alt={vsnData.visinorName}
                            />
                          </div>
                          <div className="col">
                            <h4 className="meetTeamH4">
                              {vsnData.visinorName}
                            </h4>
                            <p className="meetTeamP">
                              {vsnData.visinorDesignation}
                            </p>
                            <div className="meetTeamSocialLinksLayout">
                              {vsnData.visinorFacebook &&
                              vsnData.visinorFacebook.length > 0 ? (
                                <a
                                  className="socialLink"
                                  href={vsnData.visinorFacebook}
                                >
                                  <img
                                    className="socialLinkImg"
                                    src="https://d2qb2fbt5wuzik.cloudfront.net/iserve_goTasker/images/Ffacebook.svg"
                                    width="24"
                                    height="24"
                                  />
                                </a>
                              ) : (
                                ""
                              )}
                              {vsnData.visinorLinkedin &&
                              vsnData.visinorLinkedin.length > 0 ? (
                                <a
                                  className="socialLink"
                                  href={vsnData.visinorLinkedin}
                                >
                                  <img
                                    className="socialLinkImg"
                                    src="https://d2qb2fbt5wuzik.cloudfront.net/iserve_goTasker/images/Flinkedin.svg"
                                    width="24"
                                    height="24"
                                  />
                                </a>
                              ) : (
                                ""
                              )}
                              {vsnData.visinorTwitter &&
                              vsnData.visinorTwitter.length > 0 ? (
                                <a
                                  className="socialLink"
                                  href={vsnData.visinorTwitter}
                                >
                                  <img
                                    className="socialLinkImg"
                                    src="https://d2qb2fbt5wuzik.cloudfront.net/iserve_goTasker/images/Ftwitter.svg"
                                    width="24"
                                    height="24"
                                  />
                                </a>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col">
                            <p className="meetTeamDesc">
                              {vsnData.visinorDescription}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            }
          </div>
        ) : (
          ""
        )}
        {/* footer */}
        <div className=" mt-5" id="footerContainer">
          <Footer lang={this.props.lang} />
        </div>
        {this.state.loading ? <CircularProgressLoader /> : ""}
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
    selectedLang: state.selectedLang,
    lang: state.locale
  };
};

export default connect(mapStateToProps)(About);
