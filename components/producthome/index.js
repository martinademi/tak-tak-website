import React from 'react'
import { Component } from 'react'
import Category from './Category/Category'
import CategoryList from './Category/CategoryList'
import Offers from './Offers/Offers'
import RectSlider from './RectSlider/Rectslider'
import Footer from '../footer/Footer'
import Wrapper from '../../hoc/wrapperHoc'
import LabelBottomNavigation from '../footer/BottomNavigation'
import ProductDialog from '../dialogs/productDialog'
import ProductDetails from '../sideBar/productDetails'
import Slider from 'react-slick'
import Link from 'next/link'
import redirect from '../../lib/redirect';
import Router from "next/router";
import TopLoader from '../ui/loaders/TopBarLoader/TopBarLoader';
import "../../assets/storeList.scss";
import { getCookie } from '../../lib/session';
import { RouteToDetails } from '../../lib/navigation/navigation';

export default class ProductsHomeComponent extends Component {

    state = {
        SliderWidth: "100%"
    }

    constructor(props) {
        super(props);
        this.openProductDialog = this.openProductDialog.bind(this);
        this.handleDetailToggle = this.handleDetailToggle.bind(this);
    }


    openProductDialog(product, bType) {
        this.startTopLoader();

      
        // used to redirect page to detail page
        RouteToDetails(product, bType);

        // Router.push(`/details/${getCookie("cityReg")}/${getCookie("areaReg")}/${getCookie("storeName")}/${product.productName}?id=${product.childProductId}&slug=${bType}`.replace(/%20/g, '').replace(/,/g, '').replace(/ /g, '-')).then(() => window.scrollTo(0, 0))
        // Router.push(`/details?id=${product.childProductId}&slug=${bType}`).then(() => window.scrollTo(0, 0))
        // this.child.openProductDialog(product);
    }

    handleDetailToggle = (post, bType) => {
        this.startTopLoader();
        // Router.push(`/details?id=${post.childProductId}`).then(() => window.scrollTo(0, 0))
        RouteToDetails(post, bType);

    }
    startTopLoader = () => this.TopLoader.startLoader();
    handleClose = () => {
        this.setState({ SliderWidth: 0 })
    }

    render() {
        let sideNavClass; let mainClass; let sideContainer; let store;

        const settings = {
            arrows: true,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
        };
        const { selStore } = this.props;

        // getting the index of selected store from the array collection
        let storeIndex = this.props.stores && this.props.stores.length > 0 ? this.props.stores.findIndex((store) => store.storeId == selStore.businessId) : -1
        // select the store from array collection based on index
        store = storeIndex >= 0 ? this.props.stores[storeIndex] : selStore

        this.props.height > 70 ? sideContainer = "sticky" : sideContainer = ""
        this.props.width == "80%" ?
            (sideNavClass = 'side-show',
                mainClass = 'main-compressed') :
            (sideNavClass = 'side-hide', mainClass = 'main-full')

        return (
            <Wrapper>
                {this.props.width == '80%' ?
                    <section className={"side-nav mobile-hide " + sideNavClass}>
                        <div className={sideContainer} style={{ height: '100vh', zIndex: '9', background: '#f7f7f7', width: '100%', transition: 'top 0.2s ease-out' }} > </div>
                    </section> : ''
                }
                <main className={"main-div " + mainClass + " " + this.props.RTL} style={{ direction: this.props.RTL }}>
                    <div className="col-12 wrapper mb-4">

                        <div className="row justify-content-center">
                            <div className="col-12">


                                <div className="col-xl-12 col-lg-12 my-4 categorySlider mainPageOfferList mobile-hide">
                                    {/* offerList */}

                                    {
                                        <Slider {...settings}>
                                            {this.props.offers.map((offer, index) => (
                                                <Link key={"offerIndex" + index} href={`/offers?offerId=${offer.offerId}&store=${this.props.store._id}&type=2`} as={`/offers/${offer.offerName.replace(/%/g, 'percentage').replace(/,/g, '').replace(/& /g, '').replace(/ /g, '-')}`}>
                                                    <a
                                                        className="d-block"
                                                        onClick={this.startTopLoader}>

                                                        {/* <div key={"offer" + index} title={offer.name} className="offerImages" style={{ backgroundImage: `url(/static/images/new_imgs/offerDummy.png)` }}> */}
                                                        <div key={"offer" + index} title={offer.name} className="offerImages" style={{ backgroundImage: `url(${offer.images.image})` }}>
                                                            {/* <div key={"offer" + index} title={offer.name} className="offerImages" style={{ backgroundImage: `url(https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_520,h_520/marketing-dashboard/carousel/vop86ndkxtu5ql3tkzlj)` }}> */}
                                                            {/* <img
                                          // width="240"
                                          // height="240"
                                          src={offer.images.image}
                                          alt="Beverages"
                                          title={offer.name}
                                        /> */}
                                                        </div>
                                                    </a>
                                                </Link>
                                            ))}
                                        </Slider>
                                    }
                                </div>


                                {/* {this.props.offers && this.props.offers.length > 0 ?
                                    <div className="row mt-4 padLeftNRightSolo mobile-hide">
                                        <div className="col-12  mb-4">
                                            <Slider {...settings}>
                                                {this.props.offers.map((offers, index) =>
                                                    <Link key={"offerIndex" + index} href={`/offers?offerId=${offers.offerId}&store=${this.props.store._id}&type=2`} as={`/offers/${offers.offerName.replace(/%/g, 'percentage').replace(/,/g, '').replace(/& /g, '').replace(/ /g, '-')}`}>
                                                        <a>
                                                            <div className="animated-fast slider-Image pl-0 pr-3">
                                                                <img src={offers.images.image} height='250' className="img-fluid shine" alt={offers.offerName} title={offers.offerName} />
                                                            </div>
                                                        </a>
                                                    </Link>
                                                )}
                                            </Slider>
                                        </div>
                                    </div>
                                    : ""
                                } */}


                                {/* mobile view - store name, rating, offers */}
                                <div className="row mt-2 text-center mobile-show">

                                    <div className="col-12 py-2" style={{ background: "#fff" }}>
                                        <div className="row align-items-start">
                                            <div className="col-3 pr-0">
                                                <img src={store.bannerImage} height="60px" width="90%" alt={store.storeName} />
                                            </div>
                                            <div className="col-9 pl-2 text-left">
                                                <p className="storeName" style={{ fontSize: "16px", fontWeight: 500 }}>{store.storeName || store.businessName}</p>
                                                <p className="storeName" style={{ fontSize: "12px", marginBottom: "3px", fontWeight: "400", color: "#aaa", letterSpacing: "0.2px" }}>{store.storeSubCategory}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12 pb-3 px-0 storeDetail">
                                        {/* {store.offer && store.offer.length > 0 ? */}
                                        <div className="row py-2 offerSection">
                                            <div className="col-12">
                                                <p className="offerTitle text-left px-4">{store.offerTitle}</p>
                                            </div>
                                        </div>
                                        {/* : ''
                                        } */}
                                        <div className="row storeListing storeListingHome align-items-center">
                                            <div className="col-3 pl-0 storeDetailTags">
                                                <span><i className="fa fa-star" /></span> <span className="storeTagValue">{parseFloat(store.averageRating || store.businessRating || 0).toFixed(2)}</span>
                                                <p className="storeName">{this.props.locale.rate}</p>
                                            </div>
                                            <div className="col-3 storeDetailTags">
                                                <span className="storeTagValue">{parseFloat(store.distanceKm || 0).toFixed(2)} </span><span>Km</span>
                                                <p className="storeName">{this.props.locale.distance}</p>
                                            </div>
                                            <div className="col-3 pr-0 storeDetailTags">
                                                <span className="storeTagValue">{store.currencySymbol}{store.minimumOrder}</span>
                                                <p className="storeName">{this.props.locale.minOrder}</p>
                                            </div>
                                            <div className="col-3 pr-0 storeDetailTags">
                                                <span className="storeTagValue">{store.avgDeliveryTime} mins</span>
                                                <p className="storeName">{this.props.locale.Average}</p>
                                            </div>
                                            <div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mx-4 mobile-show">
                                        <Offers {...this.props} />
                                    </div>

                                </div>
                                 {/* Favorite products */}
                                {this.props.favProducts && this.props.favProducts.length > 0 ?
                                    <RectSlider currency={this.props.selectedStore.currencySymbol || ''} rowId="favlist" cartProducts={this.props.cartProducts} editCart={this.props.editCart} addToCart={this.props.addToCart} openProductDialog={this.openProductDialog} handleDetailToggle={this.handleDetailToggle} startTopLoader={this.startTopLoader} products={this.props.favProducts} header={this.props.locale.FavoriteProducts|| "Favorite Products"} type="items" bType={0} selectedStore={this.props.selectedStore} />
                                    : ''
                                }
                               {/* treding product list */}
                                <RectSlider currency={this.props.selectedStore.currencySymbol || ''} rowId="tredingList" cartProducts={this.props.cartProducts} editCart={this.props.editCart} addToCart={this.props.addToCart} openProductDialog={this.openProductDialog} handleDetailToggle={this.handleDetailToggle} products={this.props.products} startTopLoader={this.startTopLoader} header={this.props.locale.TrendingProducts||"Trending Products"} type="items" bType={1} selectedStore={this.props.selectedStore} />

                               {/* offer product list */}
                                {this.props.lowestPrice ?
                                    <RectSlider currency={this.props.selectedStore.currencySymbol || ''} rowId="offerList" cartProducts={this.props.cartProducts} editCart={this.props.editCart} addToCart={this.props.addToCart} openProductDialog={this.openProductDialog} handleDetailToggle={this.handleDetailToggle} products={this.props.lowestPrice} startTopLoader={this.startTopLoader} header={this.props.locale.nav2||"Everyday Lowest Price"} type="items" bType={2} selectedStore={this.props.selectedStore} />
                                    : ''}
                                 {/* top brand  */}
                                <RectSlider {...this.props} header={this.props.locale.nav3||"Top Brands"} startTopLoader={this.startTopLoader} type="brands" rowId="brandList" />
                             {/* all the categoryList */}
                                <CategoryList {...this.props} startTopLoader={this.startTopLoader} startTopLoader={this.startTopLoader} selectedStore={this.props.selectedStore} rowId="categoryList" locale={this.props.locale}/>
                                {/* <RectSlider {...this.props} header="Under 99 Store" type="items"  bType=3 /> */}

                            </div>
                        </div>
                    </div>
                   {/* footer for web view */}
                    <Footer lang={this.props.lang} locale={this.props.locale} />
                    {/* footer for the mobile view */}
                    <div className="row fixed-bottom mobile-show z-top">
                        <LabelBottomNavigation index={1} count={this.props.cartProducts ? this.props.cartProducts.length : 0} showCart={this.props.showCart} userProfileDetail={this.props.userProfileDetail} showLoginHandler={this.props.showLoginHandler} isAuthorized={this.props.isAuthorized} selectedStore={this.props.selectedStore} />
                    </div>
                </main>

                <ProductDialog onRef={ref => (this.child = ref)} showLoginHandler={this.props.showLoginHandler} getFavtData={this.props.getFavtData} />
                <TopLoader onRef={ref => (this.TopLoader = ref)} />
                <ProductDetails onRef={ref => (this.prodRef = ref)}
                    width={this.state.SliderWidth}
                    handleClose={this.handleClose}
                    showLoginHandler={this.props.showLoginHandler}
                />
            </Wrapper>
        )
    }
}
