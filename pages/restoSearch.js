import React from 'react'
import { Component } from 'react'
import { connect } from 'react-redux'
import Link from "next/link";
import $ from 'jquery'
import * as actions from '../actions'
import { setCookie, getCookiees, getCookie } from '../lib/session'
import { storeWiseProductSuggestions, searchProductFromZone } from '../services/filterApis'
import Header from '../components/FoodTheme/Header/header';
import Wrapper from '../hoc/wrapperHoc';
import AddOnDialog from '../components/FoodTheme/Dialog/addOnDialog';
import EditAddOns from '../components/FoodTheme/Dialog/editAddOn';
import AddOnSlider from '../components/FoodTheme/Dialog/addOnSlider';
// import Footer from '../components/FoodTheme/Footer/footer';
import StoreCard from '../components/FoodTheme/Cards/storeCard';
import DishList from '../components/FoodTheme/Search/zoneDishSuggestion';
import { v4 } from 'uuid';
import FoodListCard from '../components/FoodTheme/Cards/foodListCard';
import CircularProgressLoader from '../components/ui/loaders/circularLoader'
import Router from "next/router";
import { IconButton } from 'material-ui';
import { getTopSearch, getSuggestions } from '../services/filterApis';
import Authmodals from '../components/authmodals';
import Footer from '../components/footer/Footer';
import OptionsDialog from '../components/FoodTheme/Dialog/optionsDialog';
import OptionsDialogMobile from '../components/FoodTheme/Dialog/optionsDialogMobile';
import ExpireCartDialog from '../components/dialogs/expireCart';
import TopLoader from '../components/ui/loaders/TopBarLoader/TopBarLoader';
import "../assets/about.scss";
import "../assets/login.scss";

const RouteToRestaurant = (store) => {
    setCookie("storeId", store.storeId)
    Router.push(`/restofront?id=${store.storeId}`, `/restaurant/${(store.storeName).replace(/%20/g, '').replace(/,/g, '').replace(/&/g, '').replace(/ /g, '-')}`).then(() => window.scrollTo(0, 0))
}

const RouteToStore = (store, categoryId) => {
    setCookie("storeId", store.storeId)
    setCookie("storeType", store.type);
    setCookie("stroeCategoryId", categoryId);
    Router.push(`/stores/${store.storeName.replace(/,/g, '').replace(/& /g, '').replace(/ /g, '-')}`)
}

class SearchRestaurant extends React.Component {

    static async getInitialProps({ ctx }) {
        let token = getCookiees("token", ctx.req);
        let lat = getCookiees("lat", ctx.req);
        let lng = getCookiees("long", ctx.req);
        let zoneID = getCookiees("zoneid", ctx.req);
        let categoryId = getCookiees("categoryId", ctx.req);
        let categoryType = getCookiees("categoryType", ctx.req);
        const isAuthorized = await getCookiees("authorized", ctx.req);
        return { isAuthorized, zoneID, categoryId, categoryType, lat, lng, token }
    }

    state = {
        componentMounted: false,
        isAuthorized: false,
        searchingValue: '',
        searchData: [],
        products: [],
        stores: [],
        selectedDish: '',
        loading: false,
        trendingList: [],
        trendySearch: false
    }

    // constructor(props){
    //     super(props)
    //     this.openAddOnDialog = this.openAddOnDialog.bind(this)
    // }

    searchProducts = (e) => {
        this.setState({ searchingValue: e.target.value, trendySearch: false }, () => {
            this.getSearchResult(this.state.searchingValue)
        })
    }

    getSearchResult = (searchString) => {
        storeWiseProductSuggestions(0, 50, this.props.zoneID, searchString, this.props.categoryId, this.props.categoryType, this.props.lat, this.props.lng).then(({ data }) => {
            this.setState({ searchData: data }, () => {
               
            })
        }, (error) => {
         
            this.setState({ searchData: [] })
        }).catch((err) => {})
    }

    selectFromTrending = (trendingSearch) => {
        this.setState({ searchingValue: trendingSearch, trendySearch: false }, () => {
            this.getSearchResult(this.state.searchingValue)
        })
    }


    searchProductFromZone = (searchString) => {
        this.setState({ selectedDish: searchString, loading: true })
        searchProductFromZone(0, 50, this.props.zoneID, searchString).then(({ data }) => {
           
            this.renderData(data.data.products)
        }).catch((err) => this.setState({ loading: false }))
    }

    getTopSearch = () => {
        getTopSearch(getCookie("storeId"))
            .then(({ data }) => { this.setState({ trendingList: data.data, trendySearch: true }); $(".overlay-dropdown-mobile").fadeIn(500); })
            .catch((err) => this.setState({ noTendySearch: true }))
    }

    renderData = (productList) => {
     

        let Category = {};
        let CatArray = [];

        for (let i = 0; i < productList.length; i++) {
            let item = productList[i];
            if (typeof Category[item.storeId] == 'undefined') {
                Category[item.storeId] = {
                    storeId: item.storeId,
                    storeName: item.storeName,
                    storeLogo: item.storeLogo,
                    products: []
                }
            }

            Category[item.storeId]['products'].push(item);
        }
        CatArray = Object.keys(Category).map((item) => {
            return Category[item];
        });

        this.setState({ stores: CatArray, loading: false }, () => {
           
        })
    }

    clearSearchForSuggestion = () => {
        this.setState({ stores: [], selectedDish: '' })
    }
    startTopLoader = () => this.TopLoader.startLoader();

    closeDrawer() {
        Router.back();
    }
    RouteToHome = () => {
        Router.replace("/restaurants")
    }
    componentDidMount() {
        this.setState({ componentMounted: true })
        this.getTopSearch()

        setTimeout(() => {
            this.props.isAuthorized ? (this.props.dispatch(actions.getCart()), this.props.dispatch(actions.getProfile())) : '';
        }, 2000);
    }

    clearSearch = () => {
        this.setState({ searchingValue: '', searchData: [], trendySearch: true })
    }

    addToCart = (data) => {
        let cartData;
        this.state.isAuthorized ?
            (cartData = {
                childProductId: data.childProductId,
                unitId: data.unitId,
                quantity: parseFloat(1).toFixed(1),
                storeType: getCookie("storeType"),                
                addOns: []
            },
                this.checkForMultipleStore(data.storeId) ?
                    this.props.dispatch(actions.expireCart(true, cartData))
                    : this.props.dispatch(actions.initAddCart(cartData))
            )
            : this.showLoginHandler();
    }

    checkForMultipleStore(store) {
        if (this.props.myCart && this.props.myCart.cart && this.props.myCart.cart[0].storeId) {
            if (this.props.myCart.cart[0].storeId == store) {
                return false
            } else {
                return true
            }
        } else {
            return false
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.reduxState.userName !== this.props.reduxState.userName) {
            this.setState({ isAuthorized: this.props.reduxState.authorized });
        }
    }

    componentWillMount() {
        this.setState({ isAuthorized: (this.props.isAuthorized || this.props.reduxState.authorized) || false })
    }

    editCart = (cartDetail, type) => {
        let editCartData = {
            cartId: this.props.reduxState.cartList.cartId,
            childProductId: cartDetail.childProductId,
            unitId: cartDetail.unitId,
        }
        type == 1 ? editCartData['quantity'] = cartDetail.quantity - 1 : editCartData['quantity'] = cartDetail.quantity + 1
        this.props.dispatch(actions.editCard(editCartData))
    }

    openAddOnDialog = (addons) => {
       
        this.dialogRef.openProductDialog(addons)
    }

    openOptionsDialog = (product) => {
        this.optionRef.openOptionsDialog(product)
    }

    showLoginHandler = () => { this.child.showLoginHandler() }
    showLocationHandler = () => { this.child.showLocationHandler() }
    showLocationMobileHandler = () => { this.child.showLocationMobileHandler() }
    showSignUpHandler = () => { this.child.showSignUpHandler() }
    showCart = () => { this.child.showCart() }
    RouteBack = () => { Router.back() }



    render() {
        return (
            <Wrapper>

                <Header
                    className="lapNDeskView" id="prodDetHeaderNav"
                    hammburger={false} componentMounted={this.state.componentMounted}
                    headerMobile={false} isAuthorized={this.state.isAuthorized}
                    showLoginHandler={this.showLoginHandler}
                    showLocationHandler={this.showLocationHandler}
                    showLocationMobileHandler={this.showLocationMobileHandler}
                    showCart={this.showCart}
                    showSignUpHandler={this.showSignupHandler}
                />


                <div className="container" style={{ minHeight: '100vh' }}>
                    <div className="lapNDeskView d-none d-lg-block">
                        <div className="col-12 search-container">
                            <div className="_3eNnq">
                                <div className="_38pEg">
                                    <i className="fa fa-search icon-magnifier _1F77L"></i>
                                    <input autoFocus type="text" value={this.state.searchingValue} onChange={this.searchProducts} className="_2BJMh" placeholder="Search for restaurants or dishes" autocomplete="off" />
                                    {/* onClick={this.RouteToHome} */}
                                    <Link href="/restaurants" prefetch>
                                        <a className="_2Tyn1"><img src="/static/icons/Common/CloseIcon.imageset/close_btn@3x.png" className="icon-close-thin _3pIVC" />
                                            {/* <span className="py3n3">ESC</span> */}
                                        </a>
                                    </Link>
                                    {this.state.searchingValue ?
                                        <div className="restosearch bttn-top-right d-flex align-items-center justify-content-center">
                                            <a onClick={this.clearSearch} className="mobile-hide"> Clear </a>
                                            <a onClick={this.clearSearch} className="mobile-show">
                                                <i className="fa fa-times-circle" aria-hidden="true"></i>
                                            </a>
                                        </div>
                                        : ''}
                                </div>

                            </div>
                        </div>

                    </div>

                    <div className="mobNTabView prodDetailsWrapper d-block d-lg-none">

                        <div className="row py-3 px-1" style={{ position: 'fixed', width: '100%', zIndex: '9', top: '0px', background: '#fff', borderBottom: "1px solid #eee" }}>
                            <div className="col-12">
                                <div className="row align-items-center">
                                    <div className="col-2 pl-0">
                                        <IconButton onClick={this.closeDrawer} style={{ height: '30px', padding: '0px 12px' }}>
                                            <img src='/static/icons/Common/BackIcon.imageset/back_btn@2x.png' width="24" />
                                        </IconButton>
                                    </div>
                                    <div className="col-8 px-0 text-center">
                                        <h6 className="innerPage-heading lineSetter">Search</h6>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row py-2 px-1">
                            <div className="col-12 text-center px-0" style={{ marginTop: "50px" }}>
                                <input type="text" className="searchBoxMV" style={{ background: "white" }} id="searchBoxMV" value={this.state.searchingValue} onChange={this.searchProducts} placeholder="Search products" />
                                <div style={{ position: "absolute", top: "15px", right: "12px" }}><img src="/static/images/search.svg" width="22" className="img-fluid" alt="search" /></div>
                            </div>
                        </div>


                    </div>

                    {this.state.trendySearch && this.state.trendingList.length > 1 ?


                        <div className="restosearch popularSearchSection">

                            <div className="col-12 popularSearchTitleLayout">
                                <h6 className="popularSearchH6">Popular searches</h6>
                            </div>

                            {this.state.trendingList.length > 1 ?
                                <div className="row popularSearchULLayout text-left">
                                    <ul className="nav popularSearchUL w-100 px-4">
                                        {this.state.trendingList.map((item, index) =>
                                            item.length > 0 ?
                                                <li onClick={() => this.selectFromTrending(item)} className="nav-item">
                                                    <a className="nav-link" href="#">
                                                        <img src="/static/images/search.svg" width="10" height="10" className="img-fluid popularSearchImage" alt="search" />
                                                        <span className="popularSearchSuggestion">{item}</span>
                                                        <i className="fa fa-angle-right popularSearchRightIcon"></i>
                                                    </a>
                                                </li>
                                                : '')}
                                    </ul>
                                </div>
                                : ''}

                        </div>

                        : ''}


                    <div className='row'>

                        <div className="col-12 pt-0 search-container">
                            {(this.state.searchData.resturantData) || (this.state.searchData.data && this.state.searchData.data.length > 0) ?

                                <div className="col-12 px-0 totLayoutResCom">
                                    <ul className="nav nav-pills" id="resto-search" role="tablist">
                                        <li className="nav-item">
                                            <a className="nav-link active" data-toggle="pill" href="#Restaurants" role="tab" aria-controls="pills-profile"
                                                aria-selected="false">Restaurants</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link " data-toggle="pill" href="#Dishes" role="tab" aria-controls="pills-home"
                                                aria-selected="true">Dishes</a>
                                        </li>
                                    </ul>



                                    <div className="tab-content EiD4d">
                                        <div className="tab-pane in active" id="Restaurants">

                                            {this.state.searchingValue ? <div className="_27-i_">Related to "<span className="_1qtJs">{this.state.searchingValue}</span>"</div> : ''}

                                            <div className="row EiD4d">
                                                <div className="col-12 popularBrandsSec">
                                                    <div className="row">
                                                        {this.state.searchData.resturantData && this.state.searchData.resturantData.length > 0 ?
                                                            this.state.searchData.resturantData.map((restaurant, index) =>
                                                                <StoreCard id={v4()} className={"col-md-4 col-xl-4"} key={"StoreCard" + index}
                                                                    restaurant={restaurant} categoryId={this.props.categoryId} startTopLoader={this.startTopLoader} />
                                                            )
                                                            :
                                                            <div className="noDataFound">
                                                                <p className="my-3 text-center">No restaurant found !</p>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="tab-pane fade" id="Dishes">

                                            <div className="search-breadcrumb">
                                                <a onClick={this.clearSearchForSuggestion} > SUGGESTIONS </a>

                                                {this.state.stores.length > 0 ? <span>  <i className="fa fa-angle-right" aria-hidden="true"></i> {this.state.selectedDish}</span> : ''}

                                            </div>

                                            <div className="row EiD4d">
                                                <div className="col-12 popularBrandsSec" style={{ borderBottom: '0px' }}>
                                                    <div className="row">
                                                        {this.state.stores && this.state.stores.length > 0 ?
                                                            this.state.stores.map((store) =>
                                                                <div className="zone-search-stores">
                                                                    {/* onClick={props.type == 2 ? (() => RouteToStore(store, props.categoryId)) : (() => RouteToRestaurant(store))} */}
                                                                    <div className="zone-search-store-header">
                                                                        <h2 className="zone-search-store-title">{store.storeName}
                                                                            {/* <a className="_2H8LW"> See more </a> */}
                                                                        </h2>
                                                                        <p className="fxt3y">
                                                                            Chinese, South Indian, North Indian, Desserts, Kerala, Beverages, Mughlai, Seafood, Pan-Asian, Thai
                                                                        </p>
                                                                    </div>
                                                                    <div className="zone-search-product-container productDetailSrlSpySec">
                                                                        {store.products && store.products.length > 0 ? store.products.map((product) =>
                                                                            <FoodListCard product={product} addToCart={this.addToCart}
                                                                                openAddOnDialog={this.openAddOnDialog} cartProducts={this.props.cartProducts}
                                                                                openOptionsDialog={this.openOptionsDialog}
                                                                            />
                                                                        ) :
                                                                            ''
                                                                        }
                                                                    </div>
                                                                </div>

                                                            )

                                                            : this.state.searchData.data && this.state.searchData.data.length > 0 ?
                                                                this.state.searchData.data.map((dishes) =>
                                                                    <DishList key={v4()} id={v4()} searchProductFromZone={this.searchProductFromZone} zoneID={this.props.zoneID} query={dishes} />
                                                                )
                                                                :
                                                                <div className="noDataFound">
                                                                    <p className="my-3 text-center">No dishes found !</p>
                                                                </div>
                                                        }

                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                </div>

                                : ''
                            }

                        </div>
                    </div>


                    {this.state.loading ? <CircularProgressLoader /> : ''}


                </div>

                <Footer />
                <TopLoader onRef={ref => (this.TopLoader = ref)} />
                <Authmodals key={"restSearch" + Math.random()} onRef={ref => (this.child = ref)} />
                <OptionsDialog onRef={ref => (this.optionRef = ref)} showLoginHandler={this.showLoginHandler} openAddOnDialog={this.openAddOnDialog} isAuthorized={this.state.isAuthorized} />
                <AddOnDialog onRef={ref => (this.dialogRef = ref)} showLoginHandler={this.showLoginHandler} isAuthorized={this.state.isAuthorized} />
                <AddOnSlider onRef={ref => (this.sliderRef = ref)} showLoginHandler={this.showLoginHandler} isAuthorized={this.state.isAuthorized} />
                <ExpireCartDialog onRef={ref => (this.expRef = ref)} />
            </Wrapper >
        )
    }
}

const mapStateToProps = state => {
    return {
        reduxState: state,
        myCart: state.cartList,
        locErrStatus: state.locErrStatus,
        locErrMessage: state.locErrMessage,
        userProfileDetail: state.userProfile,
        notifications: state.notifications,
        cartProducts: state.cartProducts,
        stateLat: state.lat,
        stateLong: state.long
    };
};

export default connect(mapStateToProps)(SearchRestaurant);