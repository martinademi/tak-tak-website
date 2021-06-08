// import React from 'react'
// import { Component } from 'react'
// import Moment from 'react-moment';
// import $ from 'jquery'
// import Wrapper from '../../hoc/wrapperHoc'
// import LeftSlider from '../ui/sliders/leftSlider'

// export default class OfferSlider extends Component {
//     state = {
//         SliderWidth: 0,
//         open: true
//     }
//     constructor(props) {
//         super(props);
//         this.handleLeftSliderOpen = this.handleLeftSliderOpen.bind(this);
//     }

//     handleLeftSliderOpen = () => this.FavouriteSliderRef.handleLeftSliderToggle();
//     handleClose = () => this.FavouriteSliderRef.handleLeftSliderClose();
//     closeSlider = () => { }
//     componentDidMount = () => this.props.onRef(this)

//     render() {
//         return (
//             <Wrapper>
//                 <LeftSlider onRef={ref => (this.FavouriteSliderRef = ref)}
//                     width={this.props.state.SliderWidth}
//                     handleClose={this.closeSlider}
//                     drawerTitle="Offers"
//                 >
//                     <div className="col-12 mt-lg-4">
//                         {this.props.offerProducts && this.props.offerProducts.length > 0 ?
//                             <div className="row">
//                                 {this.props.offerProducts.map((post, index) =>
//                                     <div key={'product-container-' + index} className="col-6 p-0 view-all-single-product" >
//                                         <div className="card product-container p-1">
//                                             <div className="view zoom mobile-hide" onClick={() => this.openProductDialog(post)}>
//                                                 {parseInt(post.appliedDiscount) > 0 ?
//                                                     <div className="promo-discount">-{parseInt(post.appliedDiscount)}%</div> :
//                                                     ''
//                                                 }

//                                                 <img style={{ height: '140px' }} src={post.mobileImage[0].image} width="140" height="140" className="img-fluid shine" alt="" />
//                                                 <a >
//                                                     <div className="mask rgba-white-slight"></div>
//                                                 </a>
//                                             </div>
//                                             <div className="view zoom mobile-show" onClick={() => this.handleDetailToggle(post)}>
//                                                 {parseInt(post.appliedDiscount) > 0 ?
//                                                     <div className="promo-discount">-{parseInt(post.appliedDiscount)}%</div> :
//                                                     ''
//                                                 }

//                                                 <img src={post.mobileImage[0].image} width="140" height="140" className="img-fluid shine" alt="" />
//                                                 <a >
//                                                     <div className="mask rgba-white-slight"></div>
//                                                 </a>
//                                             </div>
//                                             <div className="card-body px-lg-2 px-0">
//                                                 <div className="product-saving">Save $ {parseFloat(post.appliedDiscount).toFixed(2) || 0}</div>
//                                                 <div className="product-prices">
//                                                     <div className="product-price">$ {parseFloat(post.finalPrice).toFixed(2)}</div>
//                                                     <div className="product-price-before ">$ {parseFloat(post.priceValue).toFixed(2)}</div>
//                                                 </div>
//                                                 <div className="product-name" title={post.productName} >{post.productName}</div>
//                                                 <div className="product-description mobile-hide" style={{ width: '100%' }}>
//                                                     <span className='product-units' title={post.unitName}>{post.unitName}</span>
//                                                     {this.props.cartProducts && this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId) >= 0 &&
//                                                         this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId)].quantity > 0
//                                                         ?
//                                                         <div className="text-right">
//                                                             <button onClick={() => this.props.editCart(this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId)], post, 1)} className="btn-qnty">-</button>
//                                                             <span className="prod-qnty">{this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId)].quantity}</span>
//                                                             <button onClick={() => this.props.editCart(this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId)], post, 2)} className="btn-qnty">+</button>
//                                                         </div> : post.outOfStock ? <span className="alert-red"> **Out Of Stock </span> :
//                                                             <span onClick={() => this.props.addToCart(post)} className="product-add-button" style={{ float: 'right' }}> add </span>
//                                                     }
//                                                 </div>
//                                                 {this.props.cartProducts && this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId) >= 0 &&
//                                                     this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId)].quantity > 0
//                                                     ?
//                                                     <div className="text-right">
//                                                         <button onClick={() => this.props.editCart(this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId)], post, 1)} className="btn-qnty">-</button>
//                                                         <span className="prod-qnty">{this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId)].quantity}</span>
//                                                         <button onClick={() => this.props.editCart(this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.childProductId == post.childProductId)], post, 2)} className="btn-qnty">+</button>
//                                                     </div> : post.outOfStock ? <span className="alert-red"> **Out Of Stock </span> :
//                                                         <div className="product-description mobile-show">
//                                                             <p>{post.unitName}</p>
//                                                             <p className="product-add-button" onClick={() => this.props.addToCart(post)}> Add </p>
//                                                         </div>
//                                                 }

//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                             :
//                             <div className="row">
//                                 <div className="col-12 py-4 text-center">
//                                     <img src="/static/icons/EmptyScreens/EmptyOffer.imageset/offers@3x.png" width="150" height="100" />
//                                     <p className="mt-2" style={{ fontWeight: 700 }}>No offers found.</p>
//                                 </div>
//                             </div>
//                         }
//                     </div>
//                 </LeftSlider>
//             </Wrapper>
//         )
//     }
// }
