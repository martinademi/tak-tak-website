import React, { useContext } from "react";
import Router from "next/router";
import Wrapper from "../../../hoc/wrapperHoc";
import { totalmem } from "os";
import CartButtons from "../../cart/CartButtons";
import CartButtonsPID from "../../cart/CartButtons";
import LanguageContext from "../../../context/languageContext";
import {connect} from "react-redux"
// container used to render product list - (for mongo api data)

const getPrice = (post, currency) => {
  const lang = useContext(LanguageContext);
  if (post && post.finalPriceList) {
    return (
      <div className="itemPosCont">
        {post.finalPriceList &&
        post.finalPriceList.length > 0 &&
        post.finalPriceList[0].discount_value > 0 ? (
          <div className="product-price-before ">
            {post.finalPriceList &&
            post.finalPriceList.length > 0 &&
            post.finalPriceList[0].discount_value > 0 &&
            post.finalPriceList[0].unitPrice != post.mrp &&
            post.finalPriceList[0].finalPrice != post.mrp
              ? post.currencySymbol +
                " " +
                parseFloat(post.finalPriceList[0].unitPrice).toFixed(2)
              : ""}
          </div>
        ) : (
          ""
        )}

        <div className="product-price">
          {post.currencySymbol}{" "}
          {post.finalPriceList && post.finalPriceList.length > 0
            ? parseFloat(post.finalPriceList[0].finalPrice).toFixed(2)
            : ""}
        </div>
      </div>
    );
  }

  return (
    <div className="itemPosCont">
      <div className="product-price floatClass">
        {currency}
        {parseFloat(post.finalPrice).toFixed(2)}
      </div>
      <div className="product-price-before floatClass">
        {parseInt(post.appliedDiscount) > 0 && currency
          ? currency + parseFloat(post.priceValue).toFixed(2)
          : ""}
      </div>
    </div>
  );
};

const ProductListMView = props => {
  const { post, index, className, currency,lang } = props;
  return (
    <Wrapper>
      <div
        key={"product-container-" + index}
        className={
          index == totalmem.length - 1
            ? "col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 py-2 py-sm-4 view-all-single-product fixed-width border-right" +
              " " +
              className
            : "col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 py-2 py-sm-4 view-all-single-product fixed-width border-right" +
              " " +
              className
        }
      >
        <a onClick={() => props.openProductDialog(post, props.bType)}>
          <div className="card product-container">
            <div className="view zoom mobile-hide">
              {parseInt(post.appliedDiscount) > 0 ? (
                <div className="promo-discount">
                  {parseFloat(
                    (parseInt(post.appliedDiscount) * 100) / post.priceValue
                  ).toFixed(0)}
                  % {lang.off || "OFF"}
                </div>
              ) : (
                ""
              )}
              <img
                src={post.mobileImage[0].image}
                width="140"
                height="140"
                className="img-fluid shine"
                alt=""
              />
              <a>
                <div className="mask rgba-white-slight" />
              </a>
            </div>
            {props.delProduct ? (
              <div
                className="remove-product"
                style={{ right: 0, left: "inherit" }}
              >
                <a onClick={event => props.removeWishlist(event, null, post)}>
                  <i class="fa fa-trash-o text-danger" aria-hidden="true"></i>
                </a>
              </div>
            ) : (
              ""
            )}{" "}
            {/* show delete icons in case -> wishlist products  */}
            <div
              className="view zoom mobile-show"
              onClick={() => props.handleDetailToggle(post)}
            >
              {parseInt(post.appliedDiscount) > 0 ? (
                <div className="promo-discount">
                  {parseFloat(
                    (parseInt(post.appliedDiscount) * 100) / post.priceValue
                  ).toFixed(0)}
                  %{lang.off || " OFF"}
                </div>
              ) : (
                ""
              )}

              <img
                src={post.mobileImage[0].image}
                width="140"
                height="140"
                className="img-fluid shine"
                alt=""
              />
              <a>
                <div className="mask rgba-white-slight" />
              </a>
            </div>
            <div className="card-body" style={{ ...props.cardStyle }}>
              <div className="product-name" title={post.productName}>
                {post.productName}
              </div>
              <div
                className="product-description mobile-hide"
                style={{ width: "100%" }}
              >
                <div className="row py-1 align-items-center">
                  <div className="col-12 pb-2">
                    <span
                      className="product-units floatClass"
                      title={post.unitName}
                    >
                      {post.unitName}
                    </span>
                  </div>

                  <div className="col-6 col-sm-12 col-md-5 col-lg-4 col-xl-5">
                    {/* <span className='product-units floatClass' title={post.unitName}>{post.unitName}</span> */}
                    <div className="product-prices floatClass">
                      {/* {getPrice(post, currency)} */}
                      <div className="itemPosCont">
                        <div className="product-price floatClass">
                          {currency}
                          {parseFloat(post.finalPrice).toFixed(2)}
                        </div>
                        <div className="product-price-before floatClass">
                          {parseInt(post.appliedDiscount) > 0 && currency
                            ? currency + parseFloat(post.priceValue).toFixed(2)
                            : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-sm-12 col-md-7 col-lg-8 col-xl-7">
                    {props.cartProducts &&
                    props.cartProducts.findIndex(
                      item => item.childProductId == post.childProductId
                    ) >= 0 &&
                    props.cartProducts[
                      props.cartProducts.findIndex(
                        item => item.childProductId == post.childProductId
                      )
                    ].quantity > 0 ? (
                      <CartButtons
                        cartProducts={props.cartProducts}
                        editCart={props.editCart}
                        addToCart={props.addToCart}
                        post={post}
                      />
                    ) : post.outOfStock ? (
                      <span className="alert-red"> **Out Of Stock </span>
                    ) : (
                      <button
                        onClick={event => props.addToCart(post, event)}
                        className="product-add-button"
                        style={{ float: "right" }}
                      >
                        {" "}
                        {lang.addTocart || "add to cart"}{" "}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* mobile-show -> unitName, cart buttons */}
              <div
                className="mobile-show"
                key={"mobileView-Product-" + index}
                style={{ margin: "0%" }}
              >
                {/* <div className="card product-container p-1">
              <div className="card-body px-lg-3 px-3"> */}
                <div className="row px-3">
                  <div className="col-12 px-0">
                    <span
                      className="product-units floatClass"
                      title={post.unitName}
                    >
                      {post.unitName}
                    </span>
                  </div>
                  <div className="col-12 px-0">
                    <div className="product-prices">
                      <div className="product-price">
                        {props.currency}{" "}
                        {parseFloat(post.finalPrice).toFixed(2)}
                      </div>
                      <div className="product-price-before ">
                        {parseInt(post.appliedDiscount) > 0
                          ? props.currency +
                            " " +
                            parseFloat(post.priceValue).toFixed(2)
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="product-description mobile-hide"
                  style={{ width: "100%" }}
                >
                  <span className="product-units" title={post.unitName}>
                    {post.unitName}
                  </span>
                  <button
                    onClick={event => props.addToCart(post, event)}
                    className="product-add-button"
                    style={{ float: "right" }}
                  >
                    {" "}
                    {lang.addTocart || " add to cart"}{" "}
                  </button>
                </div>

                <div className="product-description mobile-show">
                  {/* <p className="productQuantity">{post.unitName}</p> */}
                  {props.cartProducts &&
                  props.cartProducts.findIndex(
                    item => item.childProductId == post.childProductId
                  ) >= 0 &&
                  props.cartProducts[
                    props.cartProducts.findIndex(
                      item => item.childProductId == post.childProductId
                    )
                  ].quantity > 0 ? (
                    <CartButtonsPID
                      cartProducts={props.cartProducts}
                      editCart={props.editCart}
                      className="my-2"
                      addToCart={props.addToCart}
                      post={post}
                    />
                  ) : post.outOfStock ? (
                    <p
                      style={{
                        width: "100%",
                        paddingTop: "15px",
                        float: "unset",
                        paddingTop: "18px",
                        paddingBottom: "18px"
                      }}
                      className="alert-red"
                    >
                      {" "}
                      **{lang.outOfStock || "Out Of Stock"}{" "}
                    </p>
                  ) : (
                    <p
                      onClick={event => props.addToCart(post, event)}
                      className="product-add-button"
                    >
                      {" "}
                      {lang.addTocart || "add to cart"}{" "}
                    </p>
                  )}
                </div>
                {/* </div>
            </div> */}
              </div>
            </div>
          </div>
        </a>
      </div>
    </Wrapper>
  );
};

// export default ProductListMView;
const mapStateToProps = state => {
  return {
    reduxState: state,
    selectedLang: state.selectedLang,
    lang: state.locale
  };
};

export default connect(mapStateToProps)(ProductListMView);
