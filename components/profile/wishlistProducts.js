import React from "react";
import { Component } from "react";
import Moment from "react-moment";
import $ from "jquery";
import Wrapper from "../../hoc/wrapperHoc";
import LeftSlider from "../ui/sliders/leftSlider";
import Link from "next/link";
import { getWishlist, removeFromWishList } from "../../services/cart";
import { getCookie } from "../../lib/session";
import CircularProgressLoader from "../ui/loaders/circularLoader";
import Router from "next/router";
import ProductListMView from "../producthome/ProductList/ProductListMView";
import LanguageWrapper from "../../hoc/language";
class WishlistProductSlider extends Component {
  state = {
    SliderWidth: 0,
    open: true
  };
  constructor(props) {
    super(props);
    this.handleLeftSliderOpen = this.handleLeftSliderOpen.bind(this);
  }
  getWishlist = listId => {
    let wishlistData = {
      listId: listId, // send 0 for all list, and send listId for products inside the list
      storeId: getCookie("storeId")||0,
      zoneId : getCookie("zoneid")
    };
    getWishlist(wishlistData.listId, wishlistData.storeId).then(data => {
      data.error
        ? this.setState({ loading: false, listProducts: null })
        : this.setState({ listProducts: data.data.data, loading: false });
    });
  };
  handleLeftSliderOpen = listId => {
    this.getWishlist(listId);
    this.setState({ SliderWidth: "100%", loading: true, listId: listId });
    this.ListProductSlider.handleLeftSliderToggle();
  };
  handleDetailToggle = post => {
    Router.push(`/details?id=${post.childProductId}`).then(() =>
      window.scrollTo(0, 0)
    );
  };
  handleClose = () => this.ListProductSlider.handleLeftSliderClose();

  removeWishlist = (event, listId, post) => {
    event.stopPropagation();

    let data = {
      listId: this.state.listId,
      product: [
        {
          childProductId: post.childProductId,
          parentProductId: post.parentProductId
        }
      ]
    };
    removeFromWishList(data).then(res => {
      res.error ? "" : this.getWishlist(this.state.listId);
    });
  };
  closeSlider = () => this.setState({ SliderWidth: 0 });
  componentDidMount = () => this.props.onRef(this);

  render() {
    const delProduct = (
      <div
        className="remove-product mobile-show"
        style={{ right: 0, left: "inherit" }}
      >
        <a onClick={event => this.removeWishlist(event, null, post)}>
          <i class="fa fa-trash-o text-danger" aria-hidden="true"></i>
        </a>
      </div>
    );

    const lang = this.props.lang;
    return (
      <Wrapper>
        <LeftSlider
          onRef={ref => (this.ListProductSlider = ref)}
          width={this.state.SliderWidth}
          handleClose={this.closeSlider}
          drawerTitle={lang.wishListProduct || "Wish List Products"}
        >
          <div className="col-12">
            {this.state.listProducts && this.state.listProducts.length > 0 ? (
              <div className="row mb-4">
                {this.state.listProducts.map(
                  (post, index) => (
                    <ProductListMView
                      key={index}
                      post={post}
                      className="col-6 px-0"
                      currency={post.currencySymbol || this.props.currency}
                      openProductDialog={this.props.openProductDialog}
                      handleDetailToggle={this.handleDetailToggle}
                      cartProducts={this.props.cartProducts}
                      editCart={this.props.editCart}
                      addToCart={this.props.addToCart}
                      index={index}
                      removeWishlist={this.removeWishlist}
                      delProduct={delProduct}
                    />
                  )
                  // <div key={'product-container-favts' + index} className="col-6 col-sm-5 col-md-3 mx-sm-3 mx-md-4 mx-lg-1 col-lg-2 pl-4 py-2 view-all-single-product" >
                  //     <div className="card product-container p-1">
                  //         <div className="remove-product">
                  //             <a onClick={(event) => this.removeWishlist(event, null, post)} >
                  //                 <i class="fa fa-trash-o text-danger" aria-hidden="true"></i>
                  //             </a>
                  //         </div>
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
            ) : (
              <div
                className="col-12 popularSearchULLayout text-center align-items-center h-100"
                style={{ marginTop: "20vh" }}
              >
                <img
                  src="/static/images/luuk_assert/Ellipse.png"
                  width="150"
                  height="120"
                  className="img-fluid"
                  alt="search"
                />
                <p
                  className="text-danger text-center py-3"
                  style={{ width: "100%" }}
                >
                  {lang.noProductFound ||
                    "No Products Found for this List. try another"}
                </p>
              </div>
            )}
          </div>

          {this.state.loading ? <CircularProgressLoader /> : ""}
        </LeftSlider>
      </Wrapper>
    );
  }
}

export default LanguageWrapper(WishlistProductSlider);
