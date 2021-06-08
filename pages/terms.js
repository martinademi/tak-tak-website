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
import { BLOG_LINK } from "../lib/envariables";

class Terms extends React.Component {
  static async getInitialProps({ ctx }) {
    const isAuthorized = await getCookiees("authorized", ctx.req);
    let StoreName = getCookiees("storeName", ctx.req);
    const queries = ctx.query;
    // let lang = (await (queries.lang || getCookiees("lang", ctx.req))) || "en";
    // ctx && ctx.store ? ctx.store.dispatch(actions.selectLocale(lang)) : "";
    return { isAuthorized, StoreName };
  }
  state = {
    isAuthorized: this.props.isAuthorized,
    termsData: null,
    loading: false
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
   // to get term and condition content 
    appConfig()
      .then(async ({ data }) => {
       
        await this.setState({
          terms: data.data.termsCondition,
          loading: false
        });
        let htmlTag;
        htmlTag = document.getElementById("termsCond");
        // htmlTag.innerHTML = data.data.termsCondition.terms[0];
        htmlTag.innerHTML = data.data.termsCondition;

        // htmlTag = document.getElementById('temp2');
        // htmlTag.innerHTML = data.data.termsCondition.termsObj[1].description;
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
    let { lang } = this.props;
    return (
      <div className="termsPage">
      {/* header */}
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

        {/* <nav class="navbar navbar-expand-sm navbar-light">
                    <a class="navbar-brand" href="/">
                        <img src="../static/images/logo-loops.png" className="img-fluid mb-2 commonAppLogo" width="100px" />
                        <img src="../static/images/loopsicon.svg" className="img-fluid mb-2 mobileAppLogo" width="45px" />
                    </a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
                        <ul class="navbar-nav ml-auto mt-2 mt-lg-0 termsNav">
                            <li class="nav-item active">
                                <a class="nav-link" href="#">store <span class="sr-only">(current)</span></a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">help</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href={BLOG_LINK}>blog</a>
                            </li>
                            <li class="nav-item" id="becomeShopperLi">
                                <i class="fa fa-shopping-bag"></i>
                                <a class="nav-link" href="#" id="becomeShopper">become a shopper</a>
                            </li>
                        </ul>
                    </div>
                </nav> */}

        {/* <div className="col">
                    <div className="row">
                        <div className="col border">
                           
                        </div>
                    </div>
                </div> */}
        {/* main content of the term and condition */}
        <div className="col">
          <div className="row">
            <div class="col-12 d-flex align-items-center justify-content-center termsBannerSec">
              <div class="row align-items-center">
                <div class="col-12">
                  <h5 class="contactUsBannerH6Title align-item-self">
                    {lang.tearmOfService || "Terms of Service"}
                  </h5>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="row termsHeaderH1Row">
                        <div className="col termsHeaderH1Layout">
                            <h1 className="termsHeaderH1">Terms of Service</h1>
                        </div>
                        <div id="temp1">

                        </div>
                    </div> */}

          <div className="row">
            <div className="col-12 termsDescSection">
              <div className="row justify-content-center">
                <div className="col-xl-8 col-lg-10 termsDescLayout">
                  {/* <h3 className="termsH3">
                                        Last updated: September 12, 2018
                                    </h3> */}
                  <div class="termsDescDiv" id="termsCond"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {this.state.loading ? <CircularProgressLoader /> : ""}
        {/* Footer container */}
        <Authmodals
          onRef={ref => (this.child = ref)}
          editCart={this.editCart}
        />
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

export default connect(mapStateToProps)(Terms);
