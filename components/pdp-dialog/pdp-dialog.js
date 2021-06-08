import React from "react";
import { withStyles } from "@material-ui/core/styles";
import FoodCartButtons from "./addtoCartButton";
import Dialog from "@material-ui/core/Dialog";
import "./pdp-dialog.scss";
class pdpDialog extends React.Component {
  state = {
    selected: 0,
    units:
      (this.props.dialogData &&
        this.props.dialogData.units && { ...this.props.dialogData.units[0] }) ||
      [],
  };

  inCart = (cart, product) => {
    return this.props.cartProducts.findIndex((item) => {
      return (
        item.unitId ==
        (this.state.units.unitId
          ? this.state.units.unitId
          : this.props.dialogData &&
            this.props.dialogData.units &&
            this.props.dialogData.units[0].unitId)
      );
    });
  };
  selectProduct = (index) => {
    let stateObject = { ...this.state };

    stateObject.selected = index;
    stateObject.units = { ...this.props.dialogData.units[index] };
    stateObject.u = 1;
  
    this.setState(stateObject, () => {
     
    });
  };
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (!prevState.units) {
  //     return {
  //       ...prevState,
  //       units:
  //         nextProps.dialogData &&
  //         nextProps.dialogData.units &&
  //         nextProps.dialogData.units[0]
  //     };
  //   }
  //   // Return null to indicate no change to state.
  //   return null;
  // }
  render() {
    
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.closeDialog.bind(null, false)}
        aria-labelledby="simple-dialog-title"
      >
        <div className="col-12 pdp-dialog w-100">
          <div className="row">
            <div className="col-12  addOnsModalTitleSec">
              <div className="pdp-close-button">
                <button
                  type="button"
                  onClick={this.props.closeDialog.bind(null, false)}
                  className="close-bttn"
                  data-dismiss="modal"
                >
                  x
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="product-images d-flex justify-content-center ">
          <img
            src={
              this.props.dialogData &&
              this.props.dialogData.mobileImage &&
              this.props.dialogData.mobileImage[0] &&
              this.props.dialogData.mobileImage[0].image
            }
            height="200px"
          ></img>
        </div>
        <div>
          <div className="product-name">
            {(this.props.dialogData &&
              this.props.dialogData.productName &&
              this.props.dialogData.productName) ||
              "Product name"}
          </div>
          <div className="product-desc">
            {this.props.dialogData &&
              this.props.dialogData.detailedDescription &&
              this.props.dialogData.detailedDescription}
          </div>
          <div>
            <div className="product-name">
              {"$"}
              {this.state.units.finalPrice
                ? this.state.units.finalPrice
                : this.props.dialogData &&
                  this.props.dialogData.units &&
                  this.props.dialogData.units[0].finalPrice}
            </div>
          </div>
        </div>

        <div className="cart-detais px-3 d-flex justify-content-between align-items-center my-2">
          <div className="items-ingradiance">
            {this.props.dialogData &&
              this.props.dialogData.units &&
              this.props.dialogData.units.map((units, index) => {
                return (
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={this.selectProduct.bind(this, index)}
                    className={`initss  ${
                      this.state.selected == index && "selected-units"
                    }`}
                    key={index}
                  >
                    {units.title}
                  </div>
                );
              })}
          </div>
          <div>
            {this.inCart() != -1 ? (
              <FoodCartButtons
                unitId={
                  this.state.units.unitId != undefined
                    ? this.state.units.unitId
                    : this.props.dialogData.units &&
                      this.props.dialogData.units[0].unitId
                }
                product={this.props.product}
                cartLoadProdId={this.props.cartLoadProdId}
                cartProducts={this.props.cartProducts}
                editCart={this.props.editCart}
                openOptionsDialog={this.props.openOptionsDialog}
              />
            ) : this.props.product.addOnAvailable == 1 ? (
              <div className="col-12" style={{ zIndex: 1 }}>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    this.props.openAddOnDialog(this.props.product);
                  }}
                >
                  {/* <span className="addOnBtnDV">+</span> */}
                  <button className="btn btn-default prodetailsRecomItemAddBtnDV">
                    {this.props.lang.add}
                  </button>
                </a>
                {/* <p className="customisableReminder">
                  {this.props.lang.customisable}
                </p> */}
              </div>
            ) : (
              <div className="col-12 pl-0" style={{ zIndex: 1 }}>
                <a
                  onClick={(e) => {
                    e.stopPropagation();
                    this.props.addToCart(
                      this.props.product,
                      this.state.units.unitId
                    );
                  }}
                >
                  <div className="addCartBtnCont">
                    <button className="btn btn-default prodetailsRecomItemAddBtnDV">
                      {this.props.lang.add}
                    </button>
                    {this.props.cartLoadProdId ==
                    this.props.product.childProductId ? (
                      <span className="cartProg"></span>
                    ) : (
                      ""
                    )}
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>
        <style jsx>{`
          .pdp-dialog {
            width: 420px;addOnsModalTitleSec
          }
          .selected-units {
            background-color: red;
            color: white;
          }
          .product-desc {
            font-size: 12px;
            font-weight: 300;
            padding-left: 27px;
            margin-bottom: 10px;
          }
          .items-ingradiance {
            display: flex;
            padding-left: 8px;
          }
          .initss {
            padding: 3px 10px;
            border: 1px solid red;
            border-radius: 5px;
            width: fit-content;
            margin: 3px;
          }
          .product-name {
            font-size: 18px;
            font-weight: 500;
            padding-left: 27px;
          }
          .pdp-close-button {
            float: right;
            font-size: 20px;
          }
          .close-bttn {
            background-color: white;
            font-weight: 500;
            border: none;
          }
        `}</style>
      </Dialog>
    );
  }
}

export default pdpDialog;
