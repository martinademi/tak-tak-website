import React from 'react'
import { connect } from 'react-redux'
import Link from 'next/link'
import { setCookie, getCookiees, getCookie } from '../lib/session'
import Wrapper from '../hoc/wrapperHoc';
import Router from "next/router";
import * as actions from '../actions/index'
import { getTopSearch, getSuggestions } from '../services/filterApis';
import redirect from '../lib/redirect';
import LabelBottomNavigation from '../components/footer/BottomNavigation'
import { IconButton } from 'material-ui';
import "../assets/login.scss";
import "../assets/style.scss";
import { SEARCH_ICON } from '../lib/envariables';

class SearchPage extends React.Component {
    static async getInitialProps({ ctx }) {

        let storeId = await getCookiees("storeId", ctx.req);
        let authorized = await getCookiees("authorized", ctx.req);

        return { storeId, authorized }
    }
    state = {
        width: '100%',
        maxWidth: '100%',
        open: false,
        trendySearch: true,
        noTendySearch: false,
        authorized: ''
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        setTimeout(() => {
            this.props.dispatch(actions.getCart())
        }, 100)
        this.setState({ authorized: getCookie("authorized", '') })
        this.getTopSearch();

        // setting up the content margin from top
        let header = document.getElementById("searchMainHeader");
        let mainContent = document.getElementById("serachContent");

        mainContent.style.marginTop = header.clientHeight + "px";

        setTimeout(() => {
            this.setControlFocus("searchBoxMvPage");
        }, 1000);

    }

    setControlFocus = (id) => {
        document.getElementById(id) ? document.getElementById(id).focus() : '';
    }

    opendrawer() {
        this.getTopSearch();
        this.child.clickToggle();
    }

    closeDrawer() {
        Router.back();
    }

    setSearchFocus = () => {
        this.getTopSearch();
    }
//  to get search suggestions 
    getSearchResult = (e) => {
        e.target.value.length < 1 ? this.getTopSearch() :
            getSuggestions(e.target.value, getCookie("storeId"))
                .then(({ data }) => { this.setState({ sugData: data.data, trendySearch: false }); })
                .catch(err => {
                    err.response.data.data.length < 1 ? this.setState({ noProductsError: "No Products Found !", sugData: null }) : this.setState({ sugData: null })
                })
    }
// to get top searches 
    getTopSearch = () => {
        getTopSearch(getCookie("storeId"))
            .then(({ data }) => { this.setState({ sugData: data.data, trendySearch: true, noTendySearch: false }); $(".overlay-dropdown-mobile").fadeIn(500); })
            .catch((err) => this.setState({ noTendySearch: true }))
    }
// handle search
    handleSearch = () => {
        let serachVal = document.getElementById("searchBoxMvPage").value;

        const href = `/search?name=${serachVal.replace('&', '%26')}&store=${this.props.storeId}`;
        const as = `/search/${serachVal.replace(/,/g, '').replace(/& /g, '').replace(/ /g, '-')}`;

        if (serachVal.length > 0)
            redirect(href)
    }
    render() {
        let storeId;

        storeId = this.props.storeId

        return (
            <Wrapper>

                <div className="col-12 py-2 header" id="searchMainHeader" style={{ position: 'fixed', zIndex: '9', top: '0px', background: '#fff', borderBottom: "1px solid #eee" }}>
                    <div className="row">
                        <div className="col-12">
                            <div className="totalSec">
                                <div className="row align-items-center">
                                    <div className="col-2 text-center pr-0">
                                        {/* onClick={this.closeDrawer} */}
                                        <IconButton style={{ height: '30px', padding: '0px 12px', width: "24px" }}>
                                            {/* <img src='/static/icons/Common/BackIcon.imageset/back_btn@2x.png' width="24" /> */}
                                            <img src='/static/img/svg/searchIcon.svg' width="20" />
                                        </IconButton>
                                    </div>
                                    <div className="col text-center pl-0">
                                        {/* <h6 className="innerPage-heading lineSetter">Search</h6> */}
                                        <input type="text" className="searchBoxMV" style={{}} id="searchBoxMvPage" onChange={this.getSearchResult} onFocus={() => this.setSearchFocus()} placeholder="Search products" />
                                        <div style={{ position: "absolute", top: "8px", right: "20px" }} onClick={() => this.handleSearch()}>
                                            {/* <img src={SEARCH_ICON} width="20" className="img-fluid" alt="search" /> */}
                                            {/* <i className="fa fa-search mt-1" style={{ fontSize: "18px" }} aria-hidden="true"></i> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="col-12 text-center px-0" style={{ marginTop: "50px" }}>
                    <input type="text" className="searchBoxMV" style={{ background: "white" }} id="searchBoxMvPage" onChange={this.getSearchResult} onFocus={() => this.setSearchFocus()} placeholder="Search products" />
                    <div style={{ position: "absolute", top: "7px", right: "12px" }} onClick={() => this.handleSearch()}><img src="/static/images/search.svg" width="22" className="img-fluid" alt="search" /></div>
                </div> */}


                {/* search list */}
                <div className="popularSearchSection" id="serachContent" style={{ height: "84vh" }}>
                    {
                        this.state.trendySearch ?
                            <div className="col-12 popularSearchTitleLayout">
                                <h6 className="popularSearchH6">Popular searches</h6>
                            </div> : ''
                    }

                    {this.state.sugData ?
                        <div className="row popularSearchULLayout text-left">
                            <ul className="nav popularSearchUL w-100 px-4">
                                {this.state.sugData.map((item, index) =>
                                    item.length > 0 ?
                                        <Link key={"searchRes" + index} as={`/search/${item.replace(/,/g, '').replace(/& /g, '').replace(/ /g, '-')}`} href={`/search?name=${item.replace('&', '%26')}&store=${storeId}`} key={"searchItem" + index} >
                                            <li className="nav-item">
                                                <a className="nav-link" href="#">
                                                    <img src="/static/images/search.svg" width="10" height="10" className="img-fluid popularSearchImage" alt="search" />
                                                    <span className="popularSearchSuggestion">{item}</span>
                                                    <i className="fa fa-angle-right popularSearchRightIcon"></i>
                                                </a>
                                            </li>
                                        </Link>
                                        : '')}
                            </ul>
                        </div>
                        :

                        this.state.noProductsError ?
                            <div className="row popularSearchULLayout text-center align-items-center" >
                                <ul className="col nav popularSearchUL">
                                    <div className="col-12 py-5 text-center">
                                        <img src="/static/icons/EmptyScreens/EmptySearch.imageset/empty_products.png" width="150" height="120" className="img-fluid" alt="search" />
                                        <p className="text-danger text-center py-3" style={{ width: "100%" }}>{this.state.noProductsError}</p>
                                    </div>
                                </ul>
                            </div>
                            :
                            this.state.noTendySearch ?
                                <div className="row popularSearchULLayout text-center align-items-center">
                                    <ul className="col nav popularSearchUL">
                                        <div className="col-12 py-5 text-center">
                                            <img src="/static/icons/EmptyScreens/EmptySearch.imageset/empty_products.png" width="150" height="120" className="img-fluid" alt="search" />
                                        </div>
                                    </ul>
                                </div>
                                : ''
                    }
                </div>
                <div className="row fixed-bottom mobile-show z-top">
                    <LabelBottomNavigation index={2} isAuthorized={this.state.authorized} count={this.props.cartProducts ? this.props.cartProducts.length : 0} />
                </div>

            </Wrapper>
        )
    }
}


const mapStateToProps = state => {
    return {
        myCart: state.cartList,
        cartProducts: state.cartProducts
    };
};

export default connect(mapStateToProps)(SearchPage);