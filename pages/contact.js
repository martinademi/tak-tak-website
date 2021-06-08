import React from "react";
import { connect } from "react-redux";
import { FontIcon, IconButton } from "material-ui";
import Footer from "../components/footer/Footer";
import Header from "../components/header/innerPageHeader";
import Authmodals from "../components/authmodals/index";
import { getCookiees } from "../lib/session";
import { appConfig } from "../services/auth";
import redirect from "../lib/redirect";
import CircularProgressLoader from "../components/ui/loaders/circularLoader";
import * as actions from "../actions";

import "../assets/homepage.scss";
import CustomHead from "../components/html/head";
import { OG_LOGO, OG_DESC, OG_TITLE } from "../lib/envariables";

class Contact extends React.Component {
  static async getInitialProps({ ctx }) {
    const isAuthorized = await getCookiees("authorized", ctx.req);
    let StoreName = getCookiees("storeName", ctx.req);
    const queries = ctx.query;
    // let lang = (await (queries.lang || getCookiees("lang", ctx.req))) || "en";
    // ctx && ctx.store ? ctx.store.dispatch(actions.selectLocale(lang)) : "";
    return { isAuthorized, StoreName };
  }

  state = {
    isAuthorized: this.props.isAuthorized
  };

  constructor(props) {
    super(props);

    this.state = {
      isAuthorized: props.isAuthorized,
      contactUsData: null,
      loading: false
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
   
   // to get the contact page data
    appConfig()
      .then(async ({ data }) => {
       
        await this.setState({
          contactUsData: data.data.contactUs,
          loading: false
        });
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
    return (
      <div className="contactPage">
        <CustomHead description={OG_DESC} ogImage={OG_LOGO} title={OG_TITLE} />
        {/* header */}
        <Header
          stickyHeader={true}
          showLoginHandler={this.showLoginHandler}
          isAuthorized={this.state.isAuthorized}
          staticPage={true}
          selectedLang={this.props.lang}
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

        {/* <div className="col py-4 contactHeaderLayout">
                    <div className="row justify-content-center">
                        <div className="col-lg-10 col-xl-8 px-lg-0">

                            <div className="row">
                                <div className="col">
                                    <img src="../static/images/logo-loops.png" className="img-fluid mb-2 commonAppLogo" width="100px" />
                                    <img src="../static/images/loopsicon.svg" className="img-fluid mb-2 mobileAppLogo" width="45px" />
                                </div>
                                <div className="col">
                                </div>
                            </div>
                            <div className="row">
                                <div className="col py-lg-5 py-3 mb-3">
                                    <h1 className="contactHeaderH1">Contact us</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
{/* main content of the contact page  */}
        <div className="col-12 contactPageSection">
          <div className="row">
            {/* <div className="col-12 contactUsBannerSec">
                            <h5 className="contactUsBannerH6Title">Contact Us</h5>
                            <div className="">
                                <a className="contactUsBannerAnchEmail" href="#">help@appscrip.com</a>
                            </div>
                        </div> */}
            <div class="col-12 d-flex align-items-center justify-content-center contactUsBannerSec">
              <div class="row align-items-center">
                <div class="col-12">
                  <h5 class="contactUsBannerH6Title align-item-self">
                    {this.props.lang.contactUs || " Contact Us"}
                  </h5>
                  <div class="">
                    <a class="contactUsBannerAnchEmail" href="#">
                      help@appscrip.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row justify-content-center">
            {this.state.contactUsData &&
              this.state.contactUsData.map((cntData, index) => (
                <div className="col-xl-3 col-lg-4 col-md-5 col-8 mx-xl-2 my-5 py-5 contactUsOfficeAddressSec border">
                  <h5 className="contactUsOfficeAddressH5Title">
                    {cntData.city} Office
                  </h5>
                  <p className="contactUsOfficeAddressPTag">
                    {cntData.address}
                  </p>
                  <p className="contactUsOfficeAddressPTag">
                    {cntData.city} - {cntData.zipCode}
                  </p>
                  <p className="contactUsOfficeAddressPTag">
                    <a className="" href="#">
                      {cntData.phone}
                    </a>
                  </p>
                  {/* <p className="contactUsOfficeAddressPTag">{cntData.zipCode}</p> */}
                </div>
              ))}
          </div>
        </div>
        {this.state.loading ? <CircularProgressLoader /> : ""}
        <Authmodals
          onRef={ref => (this.child = ref)}
          editCart={this.editCart}
        />
        {/* Footer container */}
        <div className="container-fluid" id="footerContainer">
          <Footer lang={this.props.lang} />
        </div>
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

export default connect(mapStateToProps)(Contact);
