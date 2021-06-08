import FoodCartButtons from "../Cart/CartButtons";
import {connect} from "react-redux"
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

const FoodListCard = (props) => {
   

    let imagesForProduct =props.product && props.product.mobileImage &&props.product.mobileImage[0] &&props.product.mobileImage[0].image &&props.product.mobileImage[0].image.length > 0 ?props.product.mobileImage[0].image:""
    return(
    <div className="row productDetailSrlSpyItemsListInnerSpl">

        {/* items  */}
        <div className="col-md col-7">
            <h6 className="productDetailSrlSpyH6Name" title={props.product.productName}>
                <img src="/static/images/grocer/veg.png" className="vegIcon" />
                {props.product.productName}
            </h6>
            <h5 className="productDetailSrlSpyNamePrice">
                ${props.product.units ? props.product.units[0].unitPrice : props.product.priceValue}
            </h5>
            {inCart(props.cartProducts, props.product) ?
            <div className="col-md-2 col-6 productDetailSrlSpyH6Name cartAfterAddBtn" id="afterAddBtnID">
                <FoodCartButtons product={props.product} cartProducts={props.cartProducts} editCart={props.editCart} openOptionsDialog={props.openOptionsDialog} />
            </div>
            :
            (
                props.product.addOnAvailable == 1 ?
                    <div className="col-md-2 col-6 productDetailSrlSpyH6Name pl-0">
                        <span className="addOnBtnDV">+</span>
                        <button onClick={() => props.openAddOnDialog(props.product)} className="btn btn-default prodetailsRecomItemAddBtnDV">
                        {props.locale.add}
                        {props.cartLoadProdId == props.product.childProductId ? <span className="cartProg"></span> : ''}
                        </button>
                        <p className="customisableReminder">Customisable</p>
                    </div>
                    :
                    <div className="col-md-2 col-6 productDetailSrlSpyH6Name pl-0">
                        <button onClick={(event) => props.addToCart(props.product, event)} className="btn btn-default prodetailsRecomItemAddBtnDV">
                        {props.locale.add}
                        {props.cartLoadProdId == props.product.childProductId ? <span className="cartProg"></span> : ''}
                        </button>
                    </div>
            )}
          
        </div>
        <img src={imagesForProduct} alt={props.product.productName} width="120px" height="120px"/>
        
    </div>
)}

// export default FoodListCard;

const mapStateToProps = (state) => {
    return {
     locale:state.locale
    };
  };
  
  export default connect(mapStateToProps)(FoodListCard);