import FoodCartButtons from "../Cart/CartButtons";
import React, { useState, useEffect, useContext } from "react";
// import languageContext from "../../../context/languageContext";
import PdpDalog from "../../../components/pdp-dialog/pdp-dialog";
import { productDetails } from "../../../services/address";
import {connect} from "react-redux"
const inCart = (cart, product) => {
  if (cart) {
    let index = findCartIndex(cart, product);
    if (index >= 0 && cart[index].quantity > 0) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const findCartIndex = (cart, product) => {
  return cart.findIndex(
    (item) => item.childProductId == product.childProductId
  );
};

const findQuantity = (cart, product) => {
  let index = findCartIndex(cart, product);
  return cart[index].quantity;
};

const handleCartAdd = (props) => {
  props.product.addOnAvailable == 1
    ? props.openAddOnDialog(props.product)
    : props.addToCart(props.product);
};

const FoodCard = (props) => {
  const openDialogonetwo = async (flag, event) => {
   
    try {
      if (flag) {
        let data = await productDetails(props.product.childProductId);
       
        setDialogData(data.data.data);
      }
    } catch (e) {
    
    }

    let copy = { ...open };
    copy.dialog = flag;
   
    toggle(copy);
    event.stopPropagation();
  };

  const [open, toggle] = useState({ dialog: false });
  const [dialogData, setDialogData] = useState({});
  const lang = {
    starters: "starters",
    add: "add",
    customisable: "customisable",
  };

  return (
    <div
      className="col-6 col-sm-6 pb-3 pb-sm-5  mb-3 mb-sm-0 productDetailSrlSpyItemBxShdw"
      onClick={openDialogonetwo.bind(null, true)}
    >
      <img
        src={
          props.product &&
          props.product.mobileImage &&
          props.product.mobileImage.length > 0
            ? props.product.mobileImage[0].image
            : "/static/images/new_imgs/foodDummy.png"
        }
        width="244"
        height="160"
        className="popularBrandItemImgRep productDetailrecomItemImg"
        alt={props.product.productName}
      />
      {/* <img src={props.product.mobileImage[0].image} width="244" height="160" className="popularBrandItemImgRep productDetailrecomItemImg" alt={props.product.productName} /> */}
      <h6
        className="productDetailSrlSpyH6Name"
        title={props.product.productName}
      >
        {/* <i className="fa fa-adjust"></i> */}
        <img src="/static/images/grocer/veg.png" className="vegIcon" />
        {props.product.productName}{" "}
      </h6>
      <p className="productDetailSrlSpyNameCat">{lang.starters}</p>
      <div className="row align-items-start">
        {props.product.priceValue == props.product.finalPrice ? (
          <div className="col-lg py-1">
            <h5 className="productDetailSrlSpyNamePrice">
              {" "}
              {props.currencySymbol || "$"}
              {props.product.priceValue}{" "}
            </h5>
          </div>
        ) : (
          <div className="col-lg py-1">
            <span className="scratch">
              {props.currencySymbol || "$"}
              {props.product.priceValue}
            </span>
            <span className="productDetailSrlSpyNamePrice">
              {" "}
              {props.currencySymbol || "$"}
              {props.product.finalPrice}{" "}
            </span>
          </div>
        )}

        {inCart(props.cartProducts, props.product) ? (
          <FoodCartButtons
            product={props.product}
            cartLoadProdId={props.cartLoadProdId}
            cartProducts={props.cartProducts}
            editCart={props.editCart}
            openOptionsDialog={props.openOptionsDialog}
          />
        ) : props.product.addOnAvailable == 1 ? (
          <div className="col-xl-4 col-lg-5 pl-0">
            <a
              onClick={(e) => {
                e.preventDefault(),
                  e.stopPropagation(),
                  props.openAddOnDialog(props.product);
              }}
            >
              <span className="addOnBtnDV">+</span>
              <button className="btn btn-default prodetailsRecomItemAddBtnDV">
              {props.locale.add}
              </button>
            </a>
            <p className="customisableReminder">{lang.customisable}</p>
          </div>
        ) : (
          <div className="col-xl-4 col-lg-5 pl-0" style={{ zIndex: 1 }}>
            <div className="addCartBtnCont">
              <button
                className="btn btn-default prodetailsRecomItemAddBtnDV"
                onClick={(e) => {
                  props.addToCart(props.product);
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {props.locale.add}
              </button>
              {props.cartLoadProdId == props.product.childProductId ? (
                <span className="cartProg"></span>
              ) : (
                ""
              )}
            </div>
          </div>
        )}
      </div>
      <PdpDalog
        open={open.dialog}
        lang={lang}
        addToCart={props.addToCart}
        addToCartt={props.addToCartt}
        cartLoadProdId={props.cartLoadProdId}
        cartProducts={props.cartProducts}
        editCart={props.editCart}
        addOnAvailable={props.product.addOnAvailable}
        openAddOnDialog={props.openAddOnDialog}
        openOptionsDialog={props.openOptionsDialog}
        inCart={inCart(props.cartProducts, props.product)}
        product={props.product}
        dialogData={dialogData}
        closeDialog={openDialogonetwo}
      ></PdpDalog>
    </div>
  );
};

// export default FoodCard;
const mapStateToProps = (state) => {
  return {
   locale:state.locale
  };
};

export default connect(mapStateToProps)(FoodCard);
