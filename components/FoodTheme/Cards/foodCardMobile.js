import FoodCartButtons from "../Cart/CartButtons";
import { RouteToDetails } from "../../../lib/navigation/navigation";
import {connect} from "react-redux";
const inCart = (cart, product) => {
    if (cart) {
        let index = findCartIndex(cart, product);
        if (index >= 0 && cart[index].quantity > 0) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

const findCartIndex = (cart, product) => {
    return cart.findIndex((item) => item.childProductId == product.childProductId);
}

const findQuantity = (cart, product) => {
    let index = findCartIndex(cart, product);
    return cart[index].quantity
}

const handleDetailsRoute = (product) => {
    RouteToDetails(product);
}

const FoodCardMobile = (props) => (
    <div className="col-6 prodetailsRecomItem">
        <a onClick={() => handleDetailsRoute(props.product)}>
            <div className="prodetailsRecomItemInner">
                <div className="prodetailsRecomItemInnerImgSec">
                    <img src={props.product.mobileImage && props.product.mobileImage.length > 0 ? props.product.mobileImage[0].image : ''} className="prodetailsRecomItemImg" alt={props.product.productName} />
                </div>
                <div className="prodetailsRecomItemInnerDescSec">
                    <div className="prodetailsRecomItemTitle">
                        {/* <i className={"fa fa-star " + props.product.subCatName.en}></i> */}
                        <span className="prodetailsRecomItemSpanTitle">{props.product.productName}</span>
                    </div>

                    <div className="row mt-2">
                        <div className="col-12 posAbsSplSec">
                            <div className="row align-items-center">
                                <div className="col-auto col-sm-8">
                                    {parseFloat(props.product.appliedDiscount).toFixed(2) > 0 ?
                                        <p className="product-price-before">
                                            {props.currencySymbol}{parseFloat(props.product.priceValue).toFixed(2)}
                                        </p>
                                        : ''
                                    }
                                    <p className="prodetailsRecomItemPrice">{props.currencySymbol}{parseFloat(props.product.priceValue).toFixed(2)}</p>
                                </div>


                                {inCart(props.cartProducts, props.product) ?
                                    <FoodCartButtons product={props.product} cartLoadProdId={props.cartLoadProdId} cartProducts={props.cartProducts} editCart={props.editCart} openOptionsDialog={props.openOptionsDialog} />
                                    :
                                    (

                                        props.product.addOnAvailable == 1 ?
                                            <div className="col-auto col-sm-4 initAddBtn" id="">
                                                <button onClick={(event) => props.openAddOnDialog(props.product, event)} className="btn btn-default prodetailsRecomItemAddBtn" >
                                                    <span className="addOnBtnDV">+</span>
                                                    {props.lang.add||"add"}
                                                 <p className="customisableReminder">{props.lang.Customisable||"Customisable"}</p>
                                                </button>
                                            </div>
                                            :
                                            <div className="col-auto col-sm-4 initAddBtn" id="">
                                                <button onClick={(event) => props.addToCart(props.product, event)} className="btn btn-default prodetailsRecomItemAddBtn" >  {props.lang.add||"add"} </button>
                                            </div>
                                    )}



                                <div className="col-auto afterAddBtn d-none border" id="">
                                    <div className="row">
                                        <div className="col-auto px-0">
                                            <button className="btn btn-default prodetailsRecomItemAddBtn prodetailsRecomItemAddBtnSpl">-</button>
                                        </div>
                                        <div className="col-auto px-0">
                                            <span className="prodetailsRecomItemCount">10</span>
                                        </div>
                                        <div className="col-auto px-0">
                                            <button className="btn btn-default prodetailsRecomItemAddBtn prodetailsRecomItemAddBtnSpl">+</button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    </div>
)

// export default FoodCardMobile;

const mapStateToProps = state => {
    return {
      lang: state.locale
    };
  };
  
  export default connect(mapStateToProps)(FoodCardMobile);