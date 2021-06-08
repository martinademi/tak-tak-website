import React from 'react'
import { Component } from 'react'
import Drawer from 'material-ui/Drawer'
import { connect } from 'react-redux'
import { FontIcon } from 'material-ui'
import { getProductDetails } from '../../services/category';
import { setCookie, getCookie, getCookiees, removeCookie } from '../../lib/session';
import { List, ListItem } from 'material-ui/List';
import * as actions from '../../actions/index'
import ProductImageSlider from '../dialogs/slider'
import { editFavtService, getFavtProducts } from '../../services/cart';
import { EditorBorderAll } from 'material-ui/svg-icons';

const recentsIcon = <FontIcon className="material-icons" style={{ fontSize: "15px" }}> <i className="fa fa-times"></i></FontIcon>;

class ProductDetails extends Component {

    state = {
        open: false,
        product: null,
        details: null,
        loader: false,
        selctedUnit: null,
        favtProducts: []
    };

    constructor(props) {
        super(props);
        this.state = { open: false };
        this.selctedUnit = this.selctedUnit.bind(this);
        this.addToCart = this.addToCart.bind(this);
    }

    handleDetailToggle = (product) => {
        this.setState({ open: !this.state.open, product: product })
        let lat = getCookie("lat", '');
        let lng = getCookie("long", '');
        let token = getCookie("token", '');

        getProductDetails(product.childProductId, lat, lng, token).then(({ data }) => {
            this.setState({ details: data.data, loader: false });
        })

    }
    handleDetailClose = () => {
        this.setState({ open: false, product: null, details: null, loader: false, selctedUnit: null });
        this.props.handleClose();
    };


    componentDidMount() {
        // passing ref to parent to call children functions
        this.props.onRef(this)
    }

    editCart = async (cartDetail, type) => {
        let allow = false;

        await this.state.selctedUnit ?
            (this.state.selctedUnit.availableQuantity <= cartDetail.quantity ? allow = false : allow = true)
            :
            (this.state.details.units[0].availableQuantity <= cartDetail.quantity ? allow = false : allow = true)

        let editCartData = {
            cartId: this.props.reduxState.cartList.cartId,
            childProductId: cartDetail.childProductId,
            unitId: cartDetail.unitId,
        }

        type == 1 ? editCartData['quantity'] = cartDetail.quantity - 1 : editCartData['quantity'] = cartDetail.quantity + 1

        allow ? this.props.dispatch(actions.editCard(editCartData)) : toastr.error("Cant process more")
    }

    addToCart = async (selectedUnit) => {
        let isAuthorized = await getCookie('authorized', '')
        let cartData;
        isAuthorized ?
            (cartData = {
                childProductId: this.state.product.childProductId,
                unitId: selectedUnit.unitId,
                quantity: parseFloat(1).toFixed(1)
            },

                this.props.dispatch(actions.initAddCart(cartData)),

                setTimeout(() => {
                    this.props.dispatch(actions.getCart())
                }, 100)
            ) :
            this.props.showLoginHandler()
            ;
    }

    selctedUnit = (unit) => {
        this.setState({ selctedUnit: unit })
    }

    getFavorites = () => {

        let favtdata = {
            storeID: getCookie("storeId"),
            zoneID: getCookie("zoneid"),
            type: 0
        }
        getFavtProducts(favtdata.storeID).then(({ data }) => {
            data.error ? '' : this.setState({ favtProducts: data.data })
        })
    }

    editFavorite = async () => {

        let isAuthorized = await getCookie('authorized', '')

        let data = {
            childProductId: this.state.product.childProductId,
            parentProductId: this.state.product.parentProductId
        }
        isAuthorized ?
            editFavtService(data)
                .then(({ data }) => {
                    data.error ? '' : (
                        // toastr.success(data.message),
                        this.getFavorites()
                    )
                })
            :
            this.props.showLoginHandler()
    }

    printAdditionalFacts = (facts) => {
        let factsObj = {}; let measure = '';
        factsObj[facts.name] = [];

        measure = facts.name == "Strain Effects" ? " %" : facts.name == "Nutrition Facts" ? " " : ""

        Object.keys(facts.data).map((key) => (
            facts.name == "Strain Effects" && facts.data[key] > 0 ?
                factsObj[facts.name].push({ "key": key, "value": facts.data[key] }) : '',
            facts.name == "Nutrition Facts" && facts.data[key].length > 0 ?
                factsObj[facts.name].push({ "key": key, "value": facts.data[key] }) : ''
        ))

        return (
            factsObj[facts.name] && factsObj[facts.name].length > 0 ?
                <div className="col-12">
                    <div className="row">
                        <div className="col-12 pdDescTitleCommSec">
                            <h6 className="pdDescTitleH6Comm">{facts.name}</h6>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 pdDescCommtxt border">
                            <ul class="nav flex-column">
                                <li class="nav-item">
                                    {
                                        factsObj[facts.name].map((item) =>
                                            <div className="row">
                                                <div className="col text-left">
                                                    <p className="pdPlistItems">{item.key}</p>
                                                </div>
                                                <div className="col text-right">
                                                    <p className="pdPlistItems">{item.value}  {measure}</p>
                                                </div>
                                            </div>
                                        )
                                    }   
                                </li>
                            </ul>
                        </div>
                    </div>
                </div> : ''
        )
    }

    render() {
        let dialogImage;
        this.state.product != null ? this.state.product.mobileImage ? dialogImage = this.state.product.mobileImage[0].image : "" : ''
        let data;
        return (
            this.state.product != null ?

                <Drawer
                    onRequestChange={(open) => this.setState({ open })} open={this.state.open}
                    width={this.props.width}
                    docked={false}
                    openSecondary={false}
                    containerStyle={{ overflowX: 'hidden', background: "#f7f7f7" }}
                    // containerClassName="scroller">
                    containerClassName="">
 

                    <div className="row align-items-center py-3 px-4" style={{ right: '0px', backgroundColor: "white" }}>
                        <div className="col-2 pt-1">
                            <a onClick={this.handleDetailClose}>
                                <img src='/static/icons/Common/BackIcon.imageset/back_btn@2x.png' width="18" />
                            </a>
                        </div>
                        <div className="col-8 pt-2 text-center">
                            <h6 style={{ fontSize: '16px', fontWeight: '700', color: '#333' }}>{this.state.product ? this.state.product.productName : ''}</h6>
                        </div>
                        {/* {this.props.showAdd ?
                            <div className="col-2 mt-2">
                                <span className="helpNewTktBtn" onClick={() => this.props.addHandler()}> + </span>
                            </div> : ''
                        } */}
                    </div>


                    <div className="col-12 productDetaildDialogBt">

                        <div className="row">
                            <div className="col-12 mb-2">
                                <ProductImageSlider product={this.state.product}></ProductImageSlider>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12 favAddListSecMView mt-4 py-3">
                                <div className="row">
                                    <div className="col-6 text-center">
                                        <div onClick={this.editFavorite}>
                                            {this.state.product && this.state.favtProducts &&
                                                this.state.favtProducts.findIndex((item) => item.childProductId == this.state.product.childProductId) >= 0 ?
                                                <p className="wishFavBtP"><img src="/static/images/solid-heart.png" className="" width="23" alt="addFavIcon" /> <br />Favorited</p> :
                                                <p className="wishFavBtP"><img src="/static/images/addFavIconSelect.png" className="" width="23" alt="addFavIcon" /> <br />Add to Favorite</p>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-6 text-center">
                                        <img src="/static/images/addWishIconSelect.png" className="" width="20" alt="addWishIcon" />
                                        <p className="favAddListCommMView">Add To List</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* fixedBottom */}
                        <div className="row">
                            <div className="col-12 addCartSecBtFB ">
                                <div className="row p-3 justify-content-center text-center">
                                    {this.state.loader == false ?
                                        (
                                            this.state.details && this.state.details.units && this.state.details.units.length > 0 ?
                                                this.state.details.units.map((unit, index) =>
                                                    <div className="col-auto" style={{maxWidth:'100%'}} key={"customRadio" + index}>

                                                        <input id={unit.unitId} name="should_be_same" onChange={() => this.selctedUnit(unit)} class="customradio" type="radio" />
                                                        <label for={unit.unitId}>{unit.title}</label>

                                                    </div>
                                                )
                                                : ''
                                        ) : ''
                                    }
                                </div>
                                <div className="clearfix"></div>

                                <div className="row">
                                    <div className="col-12 ">
                                        <div className="row">
                                            <div className="col-12">
                                                {this.state.selctedUnit ?
                                                    <div>
                                    
                                                        <div class="buttons-product text-center px-3 pb-3 pt-0">

                                                            {this.state.product ?
                                                                this.props.cartProducts.findIndex((item) => item.unitId == this.state.selctedUnit.unitId) < 0 ?
                                                                    this.state.selctedUnit.outOfStock ?
                                                                        <button style={{ backgroundColor: '#aaa', float: 'none' }} > Out of stock</button> :
                                                                        <button style={{ float: 'none' }} onClick={() => this.addToCart(this.state.selctedUnit)}> Add To Cart</button>
                                                                    :
                                                                    <div class="calculator-market shadow" style={{ float: 'none', margin: '0px auto', width: '140px' }}>
                                                                        <button onClick={() => this.editCart(this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.unitId == this.state.selctedUnit.unitId)], 1)} class="subtract" >-</button><div>
                                                                            {this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.unitId == this.state.selctedUnit.unitId)].quantity}
                                                                        </div>
                                                                        <button onClick={() => this.editCart(this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.unitId == this.state.selctedUnit.unitId)], 2)}>+</button>
                                                                    </div>
                                                                : ''
                                                            }
                                                        </div>
                                                    </div>
                                                    :
                                                    this.state.loader == false && this.state.details ?
                                                        <div>

                                                            {this.state.details.units && this.state.details.units[0].outOfStock ? '' :
                                                                <div >
                                                                    {/* <p key="info-1" class="product-price product-real-price"> ${parseFloat(this.state.details.units[0].finalPrice).toFixed(2)}
                                                                        <span class="product-price-before"> ${parseFloat(this.state.details.units[0].value).toFixed(2)} </span></p> */}
                                                                    {/* <p class="product-saving"> Save $ {parseFloat(this.state.details.units[0].appliedDiscount).toFixed(2) || 0} </p> */}
                                                                </div>
                                                            }
                                                            <div class="buttons-product text-center px-3 pb-3 pt-0">

                                                                {this.state.details && this.state.details.units && this.state.details.units.length > 0 ?
                                                                    this.props.cartProducts.findIndex((item) => item.unitId == this.state.details.units[0].unitId) < 0 ?
                                                                        this.state.details.units[0].outOfStock ?
                                                                            <button style={{ float: 'none', cursor: 'not-allowed' }} >Out of stock</button> :
                                                                            <button onClick={() => this.addToCart(this.state.details.units[0])} style={{ float: 'none' }}> Add To Cart</button>
                                                                        :
                                                                        <div class="calculator-market shadow" style={{ float: 'none', margin: '0px auto', width: '140px' }}>
                                                                            <button onClick={() => this.editCart(this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.unitId == this.state.details.units[0].unitId)], 1)} class="subtract" >-</button><div>
                                                                                {this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.unitId == this.state.details.units[0].unitId)].quantity}
                                                                            </div>
                                                                            <button onClick={() => this.editCart(this.props.cartProducts[this.props.cartProducts.findIndex((item) => item.unitId == this.state.details.units[0].unitId)], 2)}>+</button>
                                                                        </div>
                                                                    : ''
                                                                }
                                                            </div>
                                                        </div>
                                                        : ''
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* fixedBottom */}




                        <div className="row">
                            <div className="col-12 pdTitleBtSec py-3">
                                <h6 className="pdH6Title">{this.state.product ? this.state.product.productName : ''}</h6>
                                <p className="pdPTitle">{this.state.details ? this.state.details.catName.en : ''}</p>
                                <div className="pdPriceSec">
                                    <span className="">
                                        {this.state.product ? this.state.product.currencySymbol : ''}
                                    </span>
                                    <span className="">
                                        {this.state.product ? this.state.product.finalPrice : ''}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {this.state.details && this.state.details.shortDescription && this.state.details.shortDescription.length > 0 ?
                            <div className="row">
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-12 pdDescTitleCommSec">
                                            <h6 className="pdDescTitleH6Comm">Description</h6>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 pdDescCommtxt">
                                            <p className="pdPTitle">
                                                {this.state.details.shortDescription}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div> : ''
                        }
                        {this.state.details && this.state.details.ingredients && this.state.details.ingredients.length > 0 ?
                            <div className="row">
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-12 pdDescTitleCommSec">
                                            <h6 className="pdDescTitleH6Comm">Ingredients</h6>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 pdDescCommtxt">
                                            <p className="pdPTitle">
                                                {this.state.details.ingredients}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div> : ''
                        }

                        <div className="row">

                            {
                                this.state.details && this.state.details.additionalEffects && this.state.details.additionalEffects.length > 0 ?
                                    this.state.details.additionalEffects.map((item) =>
                                        this.printAdditionalFacts(item)
                                    ) : ''
                            }

                        </div>

                        <div className="row">
                            <div className="col-12">
                                <div className="row">
                                    <div className="col-12 pdDescTitleCommSec">
                                        <h6 className="pdDescTitleH6Comm">Disclaimer</h6>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 pdDescCommtxt">
                                        <p className="pdPTitle">
                                            Productinformation or packaging displayed may not be current or complete. Always refer to the physical product for the most accurate information and warnings. For additional information, contact the retailer or manufacturer. *Some item weights
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </Drawer> : ''

        );
    }
}


const mapStateToProps = state => {
    return {
        reduxState: state,
        myCart: state.cartList,
        cartProducts: state.cartProducts
    };
};

export default connect(mapStateToProps)(ProductDetails);