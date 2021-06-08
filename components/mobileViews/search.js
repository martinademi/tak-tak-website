import React from 'react'
import { connect } from 'react-redux'
import Link from 'next/link'

import BottomSlider from '../ui/sliders/bottomSlider';
import CartContent from '../cart/cartContent'
import * as actions from '../../actions/index'
import { getTopSearch, getSuggestions } from '../../services/filterApis';
import { getCookie } from '../../lib/session';
import redirect from '../../lib/redirect';

class SearchDrawer extends React.Component {

    state = {
        width: '100%',
        maxWidth: '100%',
        open: false,
        trendySearch: true,
        noTendySearch: false
    }

    constructor(props) {
        super(props);
        this.closeDrawer = this.closeDrawer.bind(this);
    }

    componentDidMount() {
        // passing ref to parent to call children functions
        this.props.onRef(this)
    }

    opendrawer() {
        this.getTopSearch();
        this.child.clickToggle();
    }

    closeDrawer() {
        this.child.closeDrawer()
    }

    setSearchFocus = () => {

        this.getTopSearch();
    }
    getSearchResult = (e) => {
        e.target.value.length < 1 ? this.getTopSearch() :
            getSuggestions(e.target.value, getCookie("storeId"))
                .then(({ data }) => { this.setState({ sugData: data.data, trendySearch: false }); })
                .catch(err => {
                    err.response.data.data.length < 1 ? this.setState({ noProductsError: "No Products Found !", sugData: null }) : this.setState({ sugData: null })
                })
    }
    getTopSearch = () => {
        getTopSearch(getCookie("storeId"))
            .then(({ data }) => { this.setState({ sugData: data.data, trendySearch: true, noTendySearch: false }); $(".overlay-dropdown-mobile").fadeIn(500); })
            .catch((err) => this.setState({ noTendySearch: true }))
    }

    handleSearch = () => {
        let serachVal = document.getElementById("searchBoxMV").value;

        const href = `/search?name=${serachVal.replace('&', '%26')}&store=${this.props.selectedStore._id || this.props.selectedStore.businessId}`;
        const as = `/search/${serachVal.replace(/,/g, '').replace(/& /g, '').replace(/ /g, '-')}`;

        redirect(href)
    }
    render() {
        let storeId;

        this.props.selectedStore ?
            storeId = this.props.selectedStore.businessId || this.props.selectedStore._id : ''



        return (
            <BottomSlider onRef={ref => (this.child = ref)}>
                <div className="col-12 py-3 cartHead" style={{ paddingTop: '15px', background: "#f2f2f2" }}>
                    <h5 className="text-center">
                        <a onClick={this.closeDrawer} style={{ float: "left" }}><img src='/static/icons/Common/BackIcon.imageset/back_btn@2x.png' width="18" /></a>
                        Search
                    </h5>
                </div>

                <div className="">
                    <div className="col-12 text-center px-0">
                        <input type="text" className="searchBoxMV" style={{ background: "white" }} id="searchBoxMV" onChange={this.getSearchResult} onFocus={() => this.setSearchFocus()} placeholder="Search products" />
                        <div style={{ position: "absolute", top: "15px", right: "12px" }} onClick={() => this.handleSearch()}><img src="/static/images/search.svg" width="22" className="img-fluid" alt="search" /></div>
                    </div>
                </div>

                {/* search list */}
                <div className="popularSearchSection" style={{ height: "84vh" }}>
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
                            <div className="row popularSearchULLayout text-center align-items-center h-100" style={{ maxHeight: "78vh", overflowY: "scroll" }}>
                                <ul className="col nav popularSearchUL">
                                    <div className="col-12 py-5 text-center">
                                        <img src="/static/icons/EmptyScreens/EmptySearch.imageset/empty_products.png" width="150" height="120" className="img-fluid" alt="search" />
                                        <p className="text-danger text-center py-3" style={{ width: "100%" }}>{this.state.noProductsError}</p>
                                    </div>
                                </ul>
                            </div>
                            :
                            this.state.noTendySearch ?
                                <div className="row popularSearchULLayout text-center align-items-center h-100" style={{ maxHeight: "78vh", overflowY: "scroll" }}>
                                    <ul className="col nav popularSearchUL">
                                        <div className="col-12 py-5 text-center">
                                            <img src="/static/icons/EmptyScreens/EmptySearch.imageset/empty_products.png" width="150" height="120" className="img-fluid" alt="search" />
                                        </div>
                                    </ul>
                                </div>
                            : ''
                    }
                </div>
                {/* search list */}

            </BottomSlider>
        )
    }
}


const mapStateToProps = state => {
    return {
        myCart: state.cartList,
    };
};

export default connect(mapStateToProps)(SearchDrawer);