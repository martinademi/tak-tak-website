import { Component } from 'react'
import { connect } from 'react-redux'
import Wrapper from '../hoc/wrapperHoc'
import Header from '../components/header/innerPageHeader'
import Authmodals from '../components/authmodals'
import * as actions from '../actions'
import Slider from 'react-slick'
import { setCookie, getCookie, getCookiees } from '../lib/session'

import { redirectIfNotAuthenticated } from "../lib/auth"
import CategoryProductsList from '../components/productList/categoryProductList'
import { getFilterParams, searchFilterParams, sortFilterParams } from '../services/filterApis'
import { IconButton } from 'material-ui';
import CircularProgressLoader from '../components/ui/loaders/circularLoader'
import redirect from '../lib/redirect';
import ProductDetails from '../components/sideBar/productDetails'
import ProductDialog from '../components/dialogs/productDialog'
import Footer from '../components/footer/Footer'
import * as enVariables from '../lib/envariables'
import Router from "next/router";
import ProductListMViewSlider from '../components/producthome/ProductList/ProductListMViewSlider';

import "../assets/login.scss";
import "../assets/style.scss";
import { RouteToDetails } from '../lib/navigation/navigation';

class ViewAllBrands extends Component {

    static async getInitialProps({ ctx }) {
        if (redirectIfNotAuthenticated(ctx)) {
            return {};
        }

        let getBrandsList = [];

        let token = getCookiees("token", ctx.req);

        let zoneId = getCookiees("zoneid", ctx.req);
        const storeId = await getCookiees("storeId", ctx.req);
        const isAuthorized = await getCookiees("authorized", ctx.req)
        const queries = ctx.query
        // const jwt = getJwt(ctx);

        let lang = await (queries.lang || getCookiees("lang", ctx.req)) || "en";
        ctx && ctx.store ? ctx.store.dispatch(actions.selectLocale(lang)) : ''

        const getCategory = await fetch(enVariables.API_HOST + '/business/subProducts/' + zoneId + '/' + storeId + '/' + 0 + '/' + 0, {
            method: "get",
            headers: {
                'language': 'en',
                'content-type': 'application/json',
                'authorization': token
            },
        });
        getBrandsList = await getCategory.json();
        let StoreName = getCookiees("storeName", ctx.req);
        return { getBrandsList, isAuthorized, token, queries, zoneId, StoreName, storeId, lang }
    }

    state = {
        username: '',
        isAuthorized: this.props.isAuthorized,
        loading: false,
        SliderWidth: "100%",
        open: false,
    }

    constructor(props) {
        super(props);
        this.showLoginHandler = this.showLoginHandler.bind(this);
        this.openProductDialog = this.openProductDialog.bind(this);
        this.handleDetailToggle = this.handleDetailToggle.bind(this)
    }

    componentDidMount() {
        this.state.isAuthorized ? this.props.dispatch(actions.getCart()) : '';
        let lat = getCookie("lat", '');
        let lng = getCookie("long", '');

        // get stores category wise
        let getStoresPayload = {
            lat: lat,
            long: lng,
            token: getCookie("token"),
            zoneId: getCookie("zoneid"),
            offset: 0,
            limit: 40,
            type: 2,
            categoryId: getCookie("categoryId")
        }
        // to get the all stores
        this.props.dispatch(actions.getStoresByType(getStoresPayload))

        setTimeout(() => {
            this.props.dispatch(actions.getZones(lat, lng)) // dispatching actions to get currecy symbol based on zone      
        }, 200);
        setTimeout(() => {
            // get the selected store details
            this.props.dispatch(actions.selectedStore(this.props.storeId))
        }, 2000)
    }


    openProductDialog(product) {
       
        this.handleDetailToggle(product);
    }
//to navigate to the product details page 
    handleDetailToggle = (product) => {
       
        // this.setState({ SliderWidth: "100%" })
        // this.prodRef.handleDetailToggle(post)
        RouteToDetails(product);
        // Router.push(`/details?id=${product.childProductId}&slug=${4}`).then(() => window.scrollTo(0, 0))
    }

    handleClose = () => {
        this.setState({ SliderWidth: 0 })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.reduxState.userName !== this.props.reduxState.userName) {
            this.setState({ username: this.props.reduxState.userName, isAuthorized: this.props.reduxState.authorized })
        }
    }
// cart
    editCart = (cartDetail, product, type, event) => {
        event.stopPropagation();

        let editCartData = {
            cartId: this.props.reduxState.cartList.cartId,
            childProductId: cartDetail.childProductId,
            unitId: cartDetail.unitId,
        }

        type == 1 ? editCartData['quantity'] = cartDetail.quantity - 1 : editCartData['quantity'] = cartDetail.quantity + 1

        this.props.dispatch(actions.editCard(editCartData))
    }

    addToCart = (data, event) => {
        event.stopPropagation();
        let cartData;
        this.state.isAuthorized ?
            (cartData = {
                childProductId: data.childProductId,
                unitId: data.unitId,
                quantity: parseFloat(1).toFixed(1),
                storeType: getCookie("storeType"),                
                addOns: []
            },

                this.props.dispatch(actions.initAddCart(cartData)),

                setTimeout(() => {
                    this.props.dispatch(actions.getCart())
                }, 100)
            ) : this.showLoginHandler();
    }

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };


    showLoginHandler = () => { this.handleRequestClose(); this.authRef.showLoginHandler() }
    showLocationHandler = () => { this.authRef.showLocationHandler() }
    showLocationMobileHandler = () => { this.authRef.showLocationMobileHandler() }
    showCart = () => { this.authRef.showCart();  }

    render() {

        const settings = {
            arrows: true,
            infinite: false,
            speed: 500,
            slidesToShow: 5,
            slidesToScroll: 3,
            responsive: [{ breakpoint: 1600, settings: { slidesToShow: 6, slidesToScroll: 4 } }, { breakpoint: 1300, settings: { slidesToShow: 5, slidesToScroll: 4 } }, { breakpoint: 900, settings: { arrows: true, infinite: false, slidesToShow: 4, slidesToScroll: 3, } }, { breakpoint: 550, settings: { slidesToShow: 2, slidesToScroll: 2 } }, , { breakpoint: 420, settings: { slidesToShow: 2, slidesToScroll: 2 } }]
        };

       
        return (
            <Wrapper>
               {/* Header */}
                <Header
                    stickyHeader={this.state.stickyHeader} showLoginHandler={this.showLoginHandler} isAuthorized={this.state.isAuthorized}
                    showLocationHandler={this.showLocationHandler} showLocationMobileHandler={this.showLocationMobileHandler} stores={this.props.stores.data}
                    hideSideMenu={() => this.hideSideMenu()} selectedStore={this.props.selectedStore} showSideMenu={() => this.showSideMenu()} showCart={this.showCart} deleteAllCookies={this.deleteAllCookies}
                >

                    <div className="col-12">
                        <div className="row align-items-center">
                            <div className="col-2 pl-0">
                                <IconButton onClick={() => Router.back()} style={{ height: '30px', padding: '0px 12px' }}>
                                    <img src='/static/icons/Common/BackIcon.imageset/back_btn@2x.png' width="24" />
                                </IconButton>
                            </div>
                            <div className="col-8 px-0 text-center">
                                <h6 className="innerPage-heading lineSetter">All Brands</h6>
                            </div>
                        </div>
                    </div>
                </Header>
                {/* main content of the all the brands  */}
                <Wrapper>
                    <main className="main-full add-margin">
                        <div className="col-12 wrapper mb-4">
                            <div className="row justify-content-center">
                                <div className="col-12">
                                    <div className="row align-items-center align-items-md-start padLeftNRightMulti mt-4">
                                        {this.props.getBrandsList && this.props.getBrandsList.data && this.props.getBrandsList.data.length > 0 ?

                                            this.props.getBrandsList.data.map((brand, index) =>
                                                <Wrapper>
                                                    <section className="col-12 catTitle customBgWhiteSection">
                                                        {/* <div className="row px-3"> */}
                                                        <div className="row">
                                                            <h3 className="col-auto">{brand.brandName}</h3>
                                                            {/* <Link href={`/productList?type=${this.props.bType}&store=${this.props.selectedStore._id}`}>
                                                                    <span className="col-auto ml-auto mobile-show">View all</span>
                                                                </Link> */}
                                                        </div>
                                                    </section>
                                                    <section className="col-12 mb-sm-4 wrapLayout customBgWhiteSection">
                                                        <div className="row">
                                                            <div className="col-12 p-1 featuredItems product-card featuredItemsId">
                                                                <Slider {...settings}>
                                                                    {brand.childProduct ? brand.childProduct.map((post, index) =>
                                                                        <ProductListMViewSlider post={post} currency={this.props.currencySymbol || post.currencySymbol} openProductDialog={this.openProductDialog} handleDetailToggle={this.handleDetailToggle} cartProducts={this.props.cartProducts}
                                                                            editCart={this.editCart} addToCart={this.addToCart} index={index} selectedStore={this.props.selectedStore} />
                                                                    ) : ""}
                                                                    {brand.childProduct.length > 5 ?
                                                                        // <Link href={`/productList?type=${this.props.bType}&store=${this.props.selectedStore._id}`}>
                                                                        <div className="col d-flex align-items-center featuredProductsSection border">
                                                                            <div className="row">
                                                                                <div className="col">
                                                                                    <h5 className="featuredProductsSectionH5">See all the products</h5>
                                                                                    <div className="seeMoreLayout">
                                                                                        <i className="fa fa-angle-right"></i>
                                                                                        <span className="seeMoreSpan">see more</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        // </Link>
                                                                        : ''}


                                                                </Slider>
                                                                {/* <!--/.Card--> */}
                                                            </div>
                                                        </div>
                                                    </section>

                                                    <ProductDetails onRef={ref => (this.prodRef = ref)}
                                                        width={this.state.SliderWidth}
                                                        handleClose={this.handleClose}
                                                        showLoginHandler={this.showLoginHandler}
                                                    />
                                                </Wrapper>
                                            )

                                            : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Footer lang={this.props.lang} />
                    </main>
                </Wrapper>

                <ProductDialog onRef={ref => (this.child = ref)} showLoginHandler={this.showLoginHandler} />



                <Authmodals onRef={ref => (this.authRef = ref)} editCart={this.editCart} />

                {this.props.reduxState.loading ? <CircularProgressLoader /> : ''}

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
        selectedLang: state.selectedLang,
        currencySymbol: state.currencySymbol

    };
};

export default connect(mapStateToProps)(ViewAllBrands);