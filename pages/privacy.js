import React from "react";
import { connect } from 'react-redux'
import { FontIcon, IconButton } from 'material-ui';
import Footer from "../components/footer/Footer";
import Header from '../components/header/innerPageHeader'
import Authmodals from '../components/authmodals/index'
import { getCookiees } from '../lib/session'
import { appConfig } from "../services/auth";
import redirect from "../lib/redirect";
import CircularProgressLoader from "../components/ui/loaders/circularLoader";
import * as actions from '../actions'
import { BLOG_LINK } from "../lib/envariables";


class Privacy extends React.Component {
    static async getInitialProps({ ctx }) {
        const isAuthorized = await getCookiees("authorized", ctx.req);
        let StoreName = getCookiees("storeName", ctx.req);
        const queries = ctx.query;
        // let lang = await (queries.lang || getCookiees("lang", ctx.req)) || "en";
        // ctx && ctx.store ? ctx.store.dispatch(actions.selectLocale(lang)) : ''
        return { isAuthorized, StoreName }
    }
    state = {
        isAuthorized: this.props.isAuthorized
    }
    constructor(props) {
        super(props);

        this.state = {
            isAuthorized: props.isAuthorized,
            privacyData: null,
            loading: false
        };
    }
    showLoginHandler = () => { this.handleRequestClose(); this.child.showLoginHandler() }
    showLocationHandler = () => { this.child.showLocationHandler() }
    showLocationMobileHandler = () => { this.child.showLocationMobileHandler() }
    showCart = () => { this.child.showCart() }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.reduxState.userName !== this.props.reduxState.userName) {
            this.setState({ username: this.props.reduxState.userName, isAuthorized: this.props.reduxState.authorized })
        }
    }
    componentDidMount = () => {
        this.setState({ loading: true })
      // to get privacy content from config 
        appConfig().then(async ({ data }) => {
        
            await this.setState({ privacyData: data.data.privacyPolicy, loading: false })
            let htmlTag;
            htmlTag = document.getElementById('privacyPart');
            // htmlTag.innerHTML = data.data.privacyPolicy.privacy[0];
            htmlTag.innerHTML = data.data.privacyPolicy;

        }).catch((err) => this.setState({ loading: false }))
    }
    deleteAllCookies() {
        document.cookie.split(';').forEach((c) => {
            document.cookie = c.trim().split('=')[0] + '=;' + 'expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        });
        redirect('/')
    }
    render() {

        const lang = this.props.lang
        return (
            <div className="termsPage">
                {/* Header */}
                <Header stickyHeader={true} showLoginHandler={this.showLoginHandler} isAuthorized={this.state.isAuthorized} staticPage={true} hideSearch={true} hideCategory={true}
                    showCart={this.showCart} showLocationHandler={this.showLocationHandler} showLocationMobileHandler={this.showLocationMobileHandler} hideBottom={true} deleteAllCookies={this.deleteAllCookies}>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-2 pl-0">
                                <IconButton href={this.props.StoreName ? `/stores/${this.props.StoreName.replace(/%20/g, '-').replace(/,/g, '').replace(/& /g, '').replace(/ /g, '-')}` : '/'} style={{ height: '35px', padding: '6px' }}>
                                    <img src='/static/icons/Common/BackIcon.imageset/back_btn@2x.png' width="24" />
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
              {/* main content of the privacy */}
                <div className="col-12">


                    {/* <div className="row termsHeaderH1Row">
                        <div className="col termsHeaderH1Layout">
                            <div id="temp1">
                            </div>
                            <h1 className="termsHeaderH1">Privacy Policy</h1>
                        </div>
                    </div> */}
                    <div className="row">
                        {/* <div className="col-12 privacyBannerSec">
                            <h5 className="contactUsBannerH6Title">Privacy Policy</h5>
                        </div> */}
                        <div class="col-12 d-flex align-items-center justify-content-center privacyBannerSec">
                            <div class="row align-items-center">
                                <div class="col-12">
                                    <h5 class="contactUsBannerH6Title align-item-self privacyBannerH6Title">{lang.Footer.footerPlcLnk||"Privacy Policy"}</h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* <div className="col-12 termsDescSection">
                            <div className="row justify-content-center">
                                <div className="col-xl-8 col-lg-10 termsDescLayout">
                                    <h3 className="termsH3">
                                        Last Updated: September 12, 2018
                                    </h3>
                                    <div class="termsDescDiv">
                                        <p>
                                            Thank you for using the Loopz Services! We are committed to providing you the best online shopping and delivery experience possible. This Privacy Policy explains what information we (Maplebear Inc. d/b/a Loopz) collect, how that information is used, under what circumstances we share information, and the choices you can make about that information. This Privacy Policy applies whether you access the Loopz Services (as defined in the Terms of Service) through a browser, a mobile application, or any other method.
                                    </p>
                                    </div>
                                </div>
                            </div>
                        </div> */}

                        <div className="col-12 py-4 termsDescSection">
                            <div className="row justify-content-center">
                                <div className="col-xl-8 col-lg-10 termsDescLayout">
                                    {/* <h3 className="termsH3">
                                        Information we collect
                                    </h3> */}
                                    <div class="termsDescDiv" id="privacyPart">

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {this.state.loading ? <CircularProgressLoader /> : ''}
                {/* Footer container */}
                <Authmodals onRef={ref => (this.child = ref)} editCart={this.editCart} />
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
        lang:state.locale
    };
};

export default connect(mapStateToProps)(Privacy);