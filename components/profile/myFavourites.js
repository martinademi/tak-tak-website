import React from 'react'
import { Component } from 'react'
import Link from 'next/link';
import Moment from 'react-moment';
import $ from 'jquery'
import Wrapper from '../../hoc/wrapperHoc'
import LeftSlider from '../ui/sliders/leftSlider'
import Router from "next/router";
import ProductListMView from '../producthome/ProductList/ProductListMView';
import StoreRightSlider from '../store/StoreRightSlider';
import { BASE_COLOR } from '../../lib/envariables';
import LanguageWrapper from "../../hoc/language"
import { lang } from 'moment';

 class FavouriteSlider extends Component {
    state = {
        SliderWidth: 0,
        open: true
    }
    constructor(props) {
        super(props);
        this.handleLeftSliderOpen = this.handleLeftSliderOpen.bind(this);
    }

    handleLeftSliderOpen = () => this.FavouriteSliderRef.handleLeftSliderToggle();
    LeftSliderMobileHandler = () => {
        this.setState({ SliderWidth: "100%" })
        this.StoreSlider.handleLeftSliderToggle()
    }
    handleChangeStore = (store) => {
        this.props.changeStore(store);
        this.StoreSlider.handleLeftSliderClose();
    }
    handleClose = () => this.FavouriteSliderRef.handleLeftSliderClose();
    closeSlider = () => { }
    handleDetailToggle = (post) => {
        Router.push(`/details?id=${post.childProductId}`).then(() => window.scrollTo(0, 0))
    }
    componentDidMount = () => this.props.onRef(this)

    render() {
        let {lang} = this.props
        return (
            <Wrapper>
                <LeftSlider onRef={ref => (this.FavouriteSliderRef = ref)}
                    width={this.props.state.SliderWidth}
                    handleClose={this.closeSlider}
                    drawerTitle={lang.fav||"Favourites"}
                >
                    <div className="col-12 selected-store text-center py-1" style={{ cursor: 'pointer' }} onClick={this.LeftSliderMobileHandler}>
                        <span className="">Selected Store</span>
                        <p className="mt-0" style={{ width: "100%" }}>{this.props.selectedStore}</p>
                    </div>

                    <div className="col-12 mt-lg-4">
                        {/* <div className="row">
                            <div className="col-12">
                                <h4 className="mb-lg-4 mb-2 manageAddressHeader">Favourites</h4>
                            </div>
                        </div> */}

                        {this.props.favtProducts && this.props.favtProducts.length > 0 ?
                            <div className="row">
                                {this.props.favtProducts.map((post, index) =>
                                    <ProductListMView post={post} className="col-6 px-0" key={"plmFav" + index} currency={this.props.currencySymbol || post.currencySymbol || this.props.currency} openProductDialog={this.props.openProductDialog} handleDetailToggle={this.handleDetailToggle} cartProducts={this.props.cartProducts}
                                        editCart={this.props.editCart} addToCart={this.props.addToCart} index={index} />
                                    // <div key={'product-container-favts' + index} className="col-6 col-sm-5 col-md-3 mx-sm-3 mx-md-4 mx-lg-1 col-lg-2 p-0 view-all-single-product" >
                                    //     <div className="card product-container p-1">

                                    //         <div className="view zoom mobile-hide" onClick={() => this.openProductDialog(post)}>
                                    //             {parseInt(post.appliedDiscount) > 0 ?
                                    //                 <div className="promo-discount">{parseFloat(parseInt(post.appliedDiscount) * 100 / (post.priceValue)).toFixed(1)}%</div> : ''
                                    //             }

                                    //             {/* <img src={post.mobileImage[0].image} width="140" height="140" className="img-fluid shine" alt="" /> */}
                                    //             <a>
                                    //                 <div className="mask rgba-white-slight"></div>
                                    //             </a>
                                    //         </div>
                                    //         <div className="view zoom mobile-show" onClick={() => this.handleDetailToggle(post)}>
                                    //             {parseInt(post.appliedDiscount) > 0 ?
                                    //                 <div className="promo-discount">{parseFloat(parseInt(post.appliedDiscount) * 100 / (post.priceValue)).toFixed(1)}%</div> : ''
                                    //             }

                                    //             <img src={post.mobileImage[0].image} width="140" height="140" className="img-fluid shine" alt="" />
                                    //             <a>
                                    //                 <div className="mask rgba-white-slight"></div>
                                    //             </a>
                                    //         </div>

                                    //         <div className="card-body px-lg-2 px-0">
                                    //             {/* <div className="product-saving">{parseInt(post.appliedDiscount) > 0 ? "Save $ " + post.finalPriceList ? parseFloat(post.finalPriceList[0].discount_value).toFixed(2) : 0 : ''}</div> */}
                                    //             <div className="product-prices">
                                    //                 <div className="product-price">{post.currencySymbol} {parseFloat(post.finalPrice).toFixed(2)}</div>
                                    //                 {/* <div className="product-price-before ">{parseInt(post.appliedDiscount) > 0 ? "$ " + post.finalPriceList ? parseFloat(post.finalPriceList[0].finalPrice).toFixed(2) : parseFloat(post.units[0].floatunitPrice).toFixed(2) : ''}</div> */}
                                    //             </div>
                                    //             <div className="product-name" title={post.productName} >{post.productName}</div>
                                    //             <div className="product-description mobile-hide" style={{ width: '100%' }}>
                                    //                 <span className='product-units' title={post.unitName}>{post.unitName}</span>


                                    //                 {
                                    //                     this.props.cartProducts && this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId) >= 0 &&
                                    //                         this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId)].quantity > 0
                                    //                         ?
                                    //                         <div className="text-center pt-2">
                                    //                             <button onClick={() => this.props.editCart(this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId)], post, 1)} className="btn-qnty">-</button>
                                    //                             <span className="prod-qnty" style={{ fontSize: '16px' }}>{this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId)].quantity}</span>
                                    //                             <button onClick={() => this.props.editCart(this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId)], post, 2)} className="btn-qnty">+</button>
                                    //                         </div>
                                    //                         :
                                    //                         post.outOfStock ? <p className="alert-red" style={{ width: '100%', paddingTop: '15px', float: 'unset', paddingTop: '18px', paddingBottom: '18px' }}> **Out Of Stock </p> :
                                    //                             <a onClick={() => this.props.addToCart(post)} className="product-add-button"> add </a>
                                    //                 }


                                    //                 {/* <span className="product-add-button" style={{ float: 'right' }} onClick={() => this.props.addToCart(post)}> add </span> */}
                                    //             </div>

                                    //             <div className="product-description mobile-show">
                                    //                 <p>{post.unitName}</p>
                                    //                 {
                                    //                     this.props.cartProducts && this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId) >= 0 &&
                                    //                         this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId)].quantity > 0
                                    //                         ?
                                    //                         <div className="text-center pt-2">
                                    //                             <button onClick={() => this.props.editCart(this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId)], post, 1)} className="btn-qnty">-</button>
                                    //                             <span className="prod-qnty" style={{ fontSize: '16px' }}>{this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId)].quantity}</span>
                                    //                             <button onClick={() => this.props.editCart(this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId)], post, 2)} className="btn-qnty">+</button>
                                    //                         </div>
                                    //                         :
                                    //                         post.outOfStock ? <p className="alert-red" style={{ width: '100%', paddingTop: '15px', float: 'unset', paddingTop: '18px', paddingBottom: '18px' }}> **Out Of Stock </p> :
                                    //                             <p className="product-add-button" onClick={() => this.props.addToCart(post)}> Add </p>
                                    //                     // <a onClick={() => this.props.addToCart(post)} className="product-add-button"> add </a>
                                    //                 }

                                    //             </div>

                                    //         </div>
                                    //     </div>
                                    // </div>
                                )}
                            </div>
                            :
                            <div className="row" style={{ marginTop: "50%" }}>
                                <div className="col-12 py-4 text-center">
                                    <img src="/static/icons/EmptyScreens/EmptyFavourite.imageset/favourite@3x.png" width="150" height="100" />
                                    <p className="mt-2" style={{ fontWeight: 400, color: "#999" }}> {lang.noFavItem||"No favourite items"}</p>
                                </div>
                                <div className="col-12 py-4 text-center">
                                    <Link href="/">
                                        <button style={{ padding: "6px 90px", border: "1px solid " + BASE_COLOR, color: BASE_COLOR, background: "transparent" }}>{lang.startShopping||"Start Shopping"}</button>
                                    </Link>
                                </div>
                            </div>
                        }
                    </div>
                </LeftSlider>
                <StoreRightSlider onRef={ref => (this.StoreSlider = ref)} stores={this.props.stores} width={this.state.SliderWidth} changeStore={this.handleChangeStore} />
            </Wrapper>
        )
    }
}


export default LanguageWrapper(FavouriteSlider)