import { Component } from 'react'
import { connect } from 'react-redux'
import Wrapper from '../hoc/wrapperHoc'
import Header from '../components/header/innerPageHeader'
import Authmodals from '../components/authmodals'
import * as actions from '../actions'
import { setCookie, getCookie, getCookiees } from '../lib/session'

import { redirectIfNotAuthenticated } from "../lib/auth"
import { IconButton } from 'material-ui';
import Footer from '../components/footer/BottomNavigation'
import * as enVariables from '../lib/envariables'
import Router from "next/router";
import CartFooter from '../components/cart/cartFooter';

import MobileViewFilters from '../components/sideBar/mobileViewFilter'
import CustomSlider from '../components/ui/sliders/customSlider';
import { getAllStoreList } from "../services/category";

import "../assets/login.scss";
import "../assets/style.scss";
import "../assets/storeList.scss";
import "../assets/emptyScreens.scss";
import redirect from '../lib/redirect';
import BottomDrawer from '../components/ui/sliders/bottomDrawer';
import { storeSearchFilter } from '../services/filterApis';
import StoreListMobile from '../components/store/StoreListMobile/storeListMobile';
import LabelBottomNavigation from '../components/footer/BottomNavigation';
import cardLoader from '../components/FoodTheme/Loaders/cardLoader';
import ListLoader from '../components/FoodTheme/Loaders/listLoader';
import TopLoader from '../components/ui/loaders/TopBarLoader/TopBarLoader';
import SwitchStoreDialog from '../components/dialogs/switchStoreDialog';
// this component is for the store list in mobile view 
class StoreListHome extends Component {

    static async getInitialProps({ ctx }) {
        if (redirectIfNotAuthenticated(ctx)) {
            return {};
        }

        let productsList = [];

        let token = getCookiees("token", ctx.req);

        let zoneId = getCookiees("zoneid", ctx.req);
        const storeId = await getCookiees("storeId", ctx.req);
        // const catId = await getCookiees("catId", ctx.req);
        // const subCatId = await getCookiees("subCatID", ctx.req);
        const lat = await getCookiees("lat", ctx.req);
        const lng = await getCookiees("long", ctx.req);
        const isAuthorized = await getCookiees("authorized", ctx.req)
        const subCatName = await decodeURIComponent(getCookiees("subCatName", ctx.req));
        const catName = await decodeURIComponent(getCookiees("catName", ctx.req));
        const queries = ctx.query
        // const jwt = getJwt(ctx);


        // const getCategory = await fetch(enVariables.API_HOST + '/business/products/' + zoneId + '/' + catId + '/' + subCatId + '/' + storeId + '/' + parseFloat(lat) + '/' + parseFloat(lng), {
        //     method: "get",
        //     headers: {
        //         'language': 'en',
        //         'content-type': 'application/json',
        //         'authorization': token
        //     },
        // });
        // productsList = await getCategory.json();
        let lang = await (queries.lang || getCookiees("lang", ctx.req)) || "en";
        // ctx && ctx.store ? ctx.store.dispatch(actions.selectLocale(lang)) : ''
        // let StoreName = getCookiees("storeName", ctx.req);
        return { productsList, isAuthorized, token, queries, zoneId, storeId, catName, subCatName, lang, lat, lng }
    }

    state = {
        username: '',
        isAuthorized: this.props.isAuthorized,
        loading: false,
        SliderWidth: "100%",
        filterWidth: 0,
        open: false,
        brandsList: [],
        Categories: [],
        manufacturers: [],
        maxPrice: '',
        priceCurrency: '',
        sort1: '',
        sort2: '',
        sort3: '',
        sortQuery: [],
        filterList: [],
        appliedFilters: false,
        loading: false,
        showStickyHeader: false,
        noStores: false,
        isStoresLoading: true
    }

    constructor(props) {
        super(props);
        this.showLoginHandler = this.showLoginHandler.bind(this);
        this.openBottomSearch = this.openBottomSearch.bind(this);
    }

    componentDidMount() {
        this.state.isAuthorized ? this.props.dispatch(actions.getCart()) : '';
        let lat = getCookie("lat", '');
        let lng = getCookie("long", '');
        let zoneId = getCookie("zoneid");
        let token = getCookie("token");

        // get stores category wise
        let getStoresPayload = {
            lat: lat,
            long: lng,
            token: token,
            zoneId: zoneId,
            offset: 0,
            limit: 40,
            type: 2,
            categoryId: getCookie("categoryId")
        }
        // toget store 
        this.props.dispatch(actions.getStoresByType(getStoresPayload))
        setTimeout(() => {
            // to get selected Store details 
            this.props.dispatch(actions.selectedStore(this.props.storeId))
        }, 2000)

        this.getStores(lat, lng, token, zoneId);
        this.handleScroll();
        window.addEventListener("scroll", this.handleScroll);
        this.setState({ storeType: getCookie("categoryName") })
    }

    componentWillUnmount = () => {
        window.removeEventListener("scroll", this.handleScroll);
    }

    startTopLoader = () => this.TopLoader.startLoader();

    handleScroll = () => {
        // get the target DOM elements
        let storeListHeader = document.getElementById("storeHeaderMV");  // header
        let storeListMainTag = document.getElementById("storeListMainTag"); // storeList main

        // add margin - y to "storeList main" based on header height
        storeListMainTag.style.marginTop = storeListHeader.clientHeight + "px";
        storeListMainTag.style.marginBottom = storeListHeader.clientHeight + "px";

        // toogle header content, based on the scroll position
        if (window.scrollY > storeListHeader.clientHeight && !this.state.showStickyHeader) {
            this.setState({ showStickyHeader: true })
        } else {
            if (window.scrollY < storeListHeader.clientHeight && this.state.showStickyHeader) {
                this.setState({ showStickyHeader: false })
            }
        }
    }
// to get stores
    getStores = (lat, lng, token, zoneId) => {

        let query = {
            lat: lat,
            long: lng,
            token: token,
            zoneId: zoneId,
            offset: 0,
            limit: 40,
            type: getCookie("categoryType"),
            categoryId: getCookie("categoryId")
        };

        getAllStoreList(query).then(({ data }) => {
           
            this.setState({ storeList: data.data, offerList: data.offerData, offerListLoading: false, isStoresLoading: false });
        });

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.reduxState.userName !== this.props.reduxState.userName) {
            this.setState({ isAuthorized: this.props.reduxState.authorized });
        }
    }


    showLoginHandler = (isMobile = true) => { this.authRef.showLoginHandler(true) }
    showLocationHandler = () => { this.authRef.showLocationHandler() }
    showLocationMobileHandler = () => { this.authRef.showLocationMobileHandler() }
    showCart = () => { this.authRef.showCart();  }
// cart expire 
    expireCart = (storeData, type, categoryId) => {
        this.switchStoreRef.openDialog(storeData, type, categoryId);
    }

// navigation to the resturant page 
    handleStoreRoute = (store) => {
        this.startTopLoader();

        // check if the category is different, clear the old cart
        if (this.props.myCart && this.props.myCart.cart && this.props.myCart.cart.length > 0 && getCookie("storeType") != store.storeType) {
            this.expireCart(store, store.storeType ? "restaurant" : "store"); // calling the parent function to open cart reset dialog
            return;
        }

        if (store.storeType == 1) {
            setCookie("storeId", store.storeId);
            setCookie("dlvxCartLmt", store.cartsAllowed);
            setCookie("storeType", store.storeType);
            setCookie("storeName", store.storeName || store.businessName);

            Router.push(
                `/restofront?id=${store.storeId}`,
                `/restaurant/${(store.storeName || store.businessName)
                    .replace(/%20/g, "")
                    .replace(/,/g, "")
                    .replace(/&/g, "")
                    .replace(/ /g, "-")}`
            ).then(() => window.scrollTo(0, 0));

        } else {
            setCookie("storeId", store.storeId);
            setCookie("dlvxCartLmt", store.cartsAllowed);
            setCookie("storeType", store.storeType);
            setCookie("storeName", store.storeName || store.businessName);

            redirect(`/stores/${store.storeName.replace(/,/g, '').replace(/& /g, '').replace(/ /g, '-')}?lang=${getCookie("lang")}`)
        }
    }
    openBottomSearch = () => {
        this.clearStoreSearchResult();
        this.BottomSearch.openDrawer();
        setTimeout(() => {
            document.getElementById("searchBoxMV").focus();
        }, 200);
    }

    closeBottomSearch = () => {
        this.clearStoreSearchResult();
        this.BottomSearch.closeDrawer();
    }

    clearStoreSearchResult = () => this.setState({ storeSearchList: null })
// get search results
    getSearchResult = (e) => {

        e.target.value && e.target.value.length > 0 ?
            storeSearchFilter(getCookie("zoneid"), getCookie("categoryId"), getCookie("categoryType"), e.target.value, getCookie("lat"), getCookie("long"))
                .then((data) => {
                    this.setState({ storeSearchList: data.data.data, noStores: false });
                })
                .catch((err) => {
                    this.setState({ noStores: true })
                }) : this.clearStoreSearchResult()
    }
    render() {

        const storeType = this.state.storeList && this.state.storeList.length > 0 ? this.state.storeList[0].storeTypeMsg : "Stores";
        const { showStickyHeader } = this.state;

        return (
            <Wrapper>
                {/* Header */}
                <Header
                    stickyHeader={this.state.stickyHeader} showLoginHandler={this.showLoginHandler} isAuthorized={this.state.isAuthorized} showChildren={true}
                    showLocationHandler={this.showLocationHandler} showLocationMobileHandler={this.showLocationMobileHandler} stores={this.props.stores.data} showStickyHeader={showStickyHeader}
                    hideSideMenu={() => this.hideSideMenu()} selectedStore={this.props.selectedStore} showSideMenu={() => this.showSideMenu()} showCart={this.showCart} deleteAllCookies={this.deleteAllCookies}
                >
                    <div className="col-12 py-1">
                        <div className="row align-items-center">
                            <div className="col-1 px-0">
                                <a onClick={() => Router.push("/")}>
                                    <IconButton style={{ height: '30px', width: '20px', padding: '6px', paddingLeft: 0, marginTop: "-2px" }}>
                                        <img src='/static/icons/Common/BackIcon.imageset/back_btn@2x.png' width="24" />
                                    </IconButton>
                                </a>
                            </div>
                            <div className="col-9 text-left">
                                {showStickyHeader ?
                                    <h6 className="innerPage-heading lineSetter" style={{ transition: "0.5s" }}>{this.state.storeType || "Store"}</h6> : ''
                                }
                            </div>

                            <div className="col-2 pr-0 text-center">
                                {/* <IconButton onClick={() => this.opendrawer()} style={{ height: '30px', padding: '6px' }}> */}
                                {showStickyHeader ?
                                    // <i className="fa fa-search mt-1" onClick={this.openBottomSearch} style={{ fontSize: "18px" }} aria-hidden="true"></i> : ''
                                    <img onClick={this.openBottomSearch} src={enVariables.SEARCH_ICON} width="20" /> : ''
                                }
                                {/* </IconButton> */}
                            </div>
                        </div>
                    </div>
                </Header>
               {/* main store content */}
                <Wrapper>
                    <main className="" id="storeListMainTag">
                        <div className="col-12 wrapper mb-4">
                            <div className="row justify-content-center">
                                <div className="col-12">
                                    <div className="row align-items-center align-items-md-start padLeftNRightMulti pt-3" style={{ background: "#fff" }} id="storeListMobileSection">
                                        <div className="col-12">
                                            <div className="row">
                                                <div className="col-12 mobileStoreListHeader">
                                                    {/* <div className="row pt-1 pb-3 w-100 align-items-center mobileStoreListHeader mx-3"> */}
                                                    <div className="row align-items-center">
                                                        {/* <div className="col-10 text-left px-0"> */}
                                                        <div className="col-10 text-left">
                                                            {/* {this.props.selectedStore ? */}
                                                            <h6 className="innerPage-heading lineSetter">{this.state.storeType}</h6>
                                                            {/* : '' */}
                                                            {/* } */}
                                                        </div>

                                                        {/* <div className="col-2 pr-0 text-center"> */}
                                                        <div className="col-2 text-center">
                                                            <IconButton onClick={() => this.openBottomSearch()} style={{ height: '30px', padding: '6px' }}>
                                                                {/* <i className="fa fa-search storeSearchIcon" aria-hidden="true"></i> */}
                                                                <img src={enVariables.SEARCH_ICON} width="20" />
                                                            </IconButton>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            this.state.storeList && !this.state.isStoresLoading && this.state.storeList.map((store, index) =>
                                                <StoreListMobile store={store} handleStoreRoute={this.handleStoreRoute} index={index} />
                                            )
                                        }
                                        {this.state.isStoresLoading ?
                                            <div className="w-100 my-4">{ListLoader()}</div> : ''}

                                    </div>

                                    <div className="row" >
                                        <div className="col-12" >
                                            <CartFooter />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <Footer lang={this.props.lang} /> */}
                        <div className="row fixed-bottom mobile-show z-top">
                            <LabelBottomNavigation index={1} count={this.props.cartProducts ? this.props.cartProducts.length : 0} showCart={this.props.showCart} userProfileDetail={this.props.userProfileDetail} showLoginHandler={this.showLoginHandler}
                                isAuthorized={this.state.isAuthorized} selectedStore={this.props.selectedStore} isFromStoreList={true} />
                        </div>
                    </main>
                </Wrapper>

                <Authmodals onRef={ref => (this.authRef = ref)} />

                <TopLoader onRef={ref => (this.TopLoader = ref)} />

                <CustomSlider onRef={ref => (this.customChild = ref)}
                    width={this.state.filterWidth}
                    handleClose={this.handleClose}
                >
                    <MobileViewFilters
                        brandsList={this.state.brandsList}
                        searchFilter={this.state.searchFilter}
                        Categories={this.state.Categories}
                        manufacturers={this.state.manufacturers}
                        searchFilter={this.searchFilter}
                        sortProducts={this.sortProducts}
                        hideCats={true}
                        overFlow='unset'
                        catName={this.props.catName}
                        subCatName={this.props.subCatName}
                        closeFilters={this.handleLeftSliderToggle}
                        minPrice={this.state.minPrice}
                        maxPrice={this.state.maxPrice}
                        priceCurrency={this.state.priceCurrency}
                    />
                </CustomSlider>

                <SwitchStoreDialog onRef={ref => (this.switchStoreRef = ref)} />


                <BottomDrawer onRef={ref => (this.BottomSearch = ref)}>
                    <div className="col-12 headerShadow">
                        <div className="row align-items-center py-3 header">
                            <div className="col-1 pr-0">
                                <a onClick={this.closeBottomSearch}>
                                    <img src='/static/icons/Common/BackIcon.imageset/back_btn@2x.png' width="18" />
                                </a>
                            </div>
                            <div className="col-11">
                                {/* <i className="fa fa-search mobiHeaderSearchIcon mt-1" style={{ fontSize: "18px" }} aria-hidden="true"></i> */}
                                <img src='/static/img/svg/searchIcon.svg' className="mobiHeaderSearchIcon" width="20" />
                                <input type="text" className="searchBoxMV" id="searchBoxMV" style={{ paddingLeft: "45px" }}
                                    onChange={this.getSearchResult} placeholder="Search Stores" />
                            </div>
                        </div>
                    </div>
                    <div style={{ height: "100vh" }}>
                        {/* <div className="col-12">
                            <input type="text" className="searchBoxMV" id="searchBoxMV"
                                onChange={this.getSearchResult} placeholder="Search Stores" />
                        </div> */}
                        <div className="col-12">
                            <div className="row py-3 align-items-center align-items-md-start padLeftNRightMulti" style={{ background: "#fff" }}>
                                {
                                    !this.state.noStores && this.state.storeSearchList && this.state.storeSearchList.length > 0 && this.state.storeSearchList.map((store, index) =>
                                        <StoreListMobile store={store} handleStoreRoute={this.handleStoreRoute} index={index} />
                                    )
                                }
                                {
                                    this.state.noStores ?
                                        <div className="emptyScreen">
                                            <img className="emptyStore" src={enVariables.EMPTY_STORE} />
                                            <br />
                                            <p className="text-danger">No Stores found! Try another keyword</p>
                                        </div> : ''
                                }
                            </div>
                        </div>
                    </div>
                </BottomDrawer>
            </Wrapper>
        )
    }
}


const mapStateToProps = state => {
    return {
        reduxState: state,
        cartProducts: state.cartProducts,
        stores: state.stores,
        locErrStatus: state.locErrStatus,
        locErrMessage: state.locErrMessage,
        selectedStore: state.selectedStore,
        myCart: state.cartList
    };
};

export default connect(mapStateToProps)(StoreListHome); 