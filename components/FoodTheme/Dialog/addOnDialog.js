import React from "react";
import Dialog from "material-ui/Dialog";
import { connect } from "react-redux";
import $ from "jquery";
import * as actions from "../../../actions/index";
import CircularProgress from "material-ui/CircularProgress";
import { getProductDetails } from "../../../services/category";
import { getCookie } from "../../../lib/session";
import { addToCartExFunc } from "../../../lib/cart/addToCart";
import { BASE_COLOR } from "../../../lib/envariables";
import { all } from "@redux-saga/core/effects";

const styles = {
  block: {
    maxWidth: 250,
  },
  checkbox: {
    marginBottom: 16,
    fontSize: "13px",
    fontWeight: 300,
    borderBottom: "0px solid #999",
    padding: "0px 10px",
  },
};

class AddOnDialog extends React.Component {
  state = {
    listOpen: false,
    addOnList: [],
    product: [],
    mandatoryAddOns: [],
    allAreMarked: false,
    selectedAddons: [],
    addOnArrayforCart: [],
    addOnPrice: 0,
    showAll: false,
    prodData: "",
    addOnIds: [],
    currentCheckedGrpLength: 0,
  };

  constructor(props) {
    super(props);
    this.openProductDialog = this.openProductDialog.bind(this);
  }

  openProductDialog = async (product) => {
    let lat = getCookie("lat", "");
    let lng = getCookie("long", "");
    let token = getCookie("token", "");

    getProductDetails(product.childProductId, lat, lng, token)
      .then((data) => {
        this.setState(
          {
            listOpen: true,
            addOnList: data.data.data.units[0].addOns,
            product: product,
            prodData: data.data.data,
          },
          () => {
            this.afterSetStateFinished();
          }
        );
      })
      .catch((err) => {
       
      });
    // this.setState({ listOpen: open, addOnList: product.addOns, product: product }, () => {
  };

  afterSetStateFinished = async () => {
    let mandatory = [];
    (await this.state.addOnList.length) > 0
      ? this.state.addOnList.map((item) => {
          item.mandatory == 1 ? mandatory.push(item) : "";
        })
      : "";

    await this.setState({ mandatoryAddOns: mandatory });
  };

  togleShowAll = () => {
    this.setState({ showAll: !this.state.showAll });
  };

  onChangeRadio = async (parentArray, childArray) => {
    let allAreMarked = true;
    let index;
    let finalAddOns = await [...this.state.selectedAddons];

    let addOns = [...this.state.addOnList];

    // get all the checkbox inside particular addon group
    let $allInp = $(".addAdon" + parentArray.id + " .addAddonCB");

    //get selected items;

    

    // check if the addon maximum limit reaches, prevent checking more boxes
    // if ($allInp.filter(':checked').length >= parentArray.maximumLimit && parentArray.mandatory != 1) {

    let type;
    let selectionLimit = parentArray.maximumLimit;
    if (parentArray.multiple == "0" && parentArray.maximumLimit == "0") {
      
      selectionLimit = 1;
      type = 1;
    }
    if (parentArray.multiple == 1 && parentArray.maximumLimit == 0) {
     
      selectionLimit = "all";
      type = 2;
    }
    if (
      parentArray.minimumLimit > 0 &&
      parentArray.maximumLimit >= parentArray.minimumLimit
    ) {
     
      selectionLimit = parentArray.maximumLimit;
      type = 3;
    }

    addOns.map((item) => {
      if (parentArray.id == item.id) {
        if (type == 1) {
          if ($allInp.filter(":checked").length >= 1) {
            
            return (item.valid = true);
          } else {
         
            return (item.valid = false);
          }
        } else if (type == 2) {
          if ($allInp.filter(":checked").length == $allInp.length) {
           
            return (item.valid = true);
          } else {
           
            return (item.valid = false);
          }
        } else {
          if (
            $allInp.filter(":checked").length <= item.maximumLimit &&
            $allInp.filter(":checked").length >= item.minimumLimit
          ) {
           
            return (item.valid = true);
          } else {
           
            return (item.valid = false);
          }
        }
      }
    });

    if (
      $allInp &&
      $allInp.length > 0 &&
      $allInp[0].type === "checkbox" &&
      $allInp.filter(":checked").length > selectionLimit
    ) {
      $("#" + childArray.id).prop("checked", false); // uncheck the checkbox
    }

   
    // if ($allInp.filter(':checked').length >= parentArray.maximumLimit && parentArray.mandatory != 1) {
    //     $("#" + childArray.id).prop("checked", false);  // uncheck the checkbox
    // }

    let data = {
      addOn: childArray,
      id: parentArray.id,
    };

    if (
      $allInp &&
      $allInp.length > 0 &&
      $allInp[0].type === "checkbox" &&
      $("#" + childArray.id).prop("checked")
    ) {
      // finalAddOns.length > 0
      // await finalAddOns.length < 1 ?
      finalAddOns.push(data);
      // : (
      //     index = finalAddOns.findIndex((item) => item.id == parentArray.id),
      //     index >= 0 ?
      //         (
      //             finalAddOns[index] = data
      //         )
      //         :
      //         finalAddOns.push(data)
      // )
    } else if ($allInp && $allInp.length > 0 && $allInp[0].type === "radio") {
      let index = finalAddOns.findIndex((item) => item.id == parentArray.id);
    
      index > -1 ? finalAddOns.splice(index, 1) : "";
      finalAddOns.push(data);
     
    } else {
      let indexToRemove = finalAddOns.findIndex(
        (item) => item.addOn.id == childArray.id
      );
      indexToRemove >= 0 ? finalAddOns.splice(indexToRemove, 1) : "";
    }
    let mandatoryAddOns = [...this.state.mandatoryAddOns];
    await mandatoryAddOns.map((item) => {
      
      if (
        $(
          `input[name=${(item.name || item.name.en).replace(
            /[^A-Za-z]/g,
            ""
          )}]:checked`
        ).length >= item.minimumLimit
      ) {
        // do something here
      
      } else {
       
        return (allAreMarked = false);
      }
    });
    let valid = true;

    this.setState(
      {
        addOnList: addOns,
        mandatoryAddOns: mandatoryAddOns,
        currentCheckedGrpLength: $(
          ".addAdon" + parentArray.id + " .addAddonCB:checked"
        ).length,
      },
      () => {
        this.state.addOnList.map((item) => {
          if (!item.valid && item.mandatory != 0) {
            valid = false;
          }
        });
      }
    );
   
    this.setState({ allAreMarked: valid, addOnIds: [] }, () => {
      let tempStateAddonIds = this.state.addOnIds;
  
      finalAddOns &&
        finalAddOns.map((item) => {
          tempStateAddonIds.push({ id: item.id });
        });
      this.setState({});
    });

    await this.setState(
      { selectedAddons: finalAddOns },
      () => this.pushToAddonFinal(this.state.selectedAddons),
      this.calculateTotal(finalAddOns)
    );

    
  };

  pushToAddonFinal(selectedAddons) {
    let addOnArrayforCart = [];
    selectedAddons.map((item) => {
      addOnArrayforCart.push({
        addOnGroup: [item.addOn.id],
        id: item.id,
      });
    });
    this.setState({ addOnArrayforCart: addOnArrayforCart }, () =>
      {}
    );
  }

  calculateTotal(finalAddOns) {
 
    let addOnPrice = 0;
    finalAddOns.map((item) => {
      addOnPrice += item.addOn.price * 1;
    });
    this.setState({ addOnPrice: addOnPrice });
  }

  handleClose = () => {
    this.setState({
      listOpen: false,
      addOnList: [],
      product: [],
      mandatoryAddOns: [],
      allAreMarked: false,
      selectedAddons: [],
      addOnArrayforCart: [],
      addOnPrice: 0,
      showAll: false,
      addOnIds: [],
      currentCheckedGrpLength: 0,
    });
  };

  getAddonSelectMsg = (addOnData) => {
    
    switch (addOnData.multiple) {
      case 0:
        if (addOnData.maximumLimit == 0)
          return "You can choose upto " + 1 + " option";
        if (addOnData.minimumLimit > 0 && addOnData.maximumLimit > 0)
          return (
            "Select minimum of " +
            addOnData.minimumLimit +
            " and maximum of " +
            addOnData.maximumLimit +
            " option"
          );
      case 1:
        if (addOnData.maximumLimit == 0)
          return (
            "You can choose upto " + addOnData.addOnGroup.length + " option"
          );
        if (addOnData.minimumLimit > 0 && addOnData.maximumLimit > 0)
          return (
            "Select minimum of " +
            addOnData.minimumLimit +
            " and maximum of " +
            addOnData.maximumLimit +
            " option"
          );
    }
    return "You can choose upto " + addOnData.maximumLimit + " option";
  };

  handleChange = (name) => (e) => {
    e.target.checked
      ? this.selectedOptions(e, name)
      : this.removedOptions(e, name);
  };

  addToCart = () => {
   
    // || this.state.prodData && this.state.prodData.units ? this.state.prodData.units[0].unitId : ''
    let cartData;
    let unitId = this.state.product.unitId
      ? this.state.product.unitId
      : this.state.product.units
      ? this.state.product.units[0].unitId
      : "";
    this.props.isAuthorized
      ? ((cartData = {
          childProductId: this.state.product.childProductId,
          unitId: unitId,
          quantity: parseFloat(1).toFixed(1),
          addOns: this.state.addOnArrayforCart,
          storeType: getCookie("storeType"),
        }),
        addToCartExFunc(this.props.myCart)
          .then(() => {
            this.props.dispatch(actions.initAddCart(cartData));
            setTimeout(() => {
              this.props.dispatch(actions.getCart());
            }, 100);
          })
          .catch(() => {
            this.props.dispatch(actions.expireCart(true, cartData)); // expire cart action for opening cart option dialog
            this.setState({ listOpen: false });
          }))
      : (this.props.showLoginHandler(), this.handleClose());
  };

  componentDidMount() {
    this.props.onRef(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loading == true && this.props.loading == false) {
      this.handleClose();
    }
  }

  scrollTo(id) {
   
    let divId = "#" + id;
   
    $(document).ready(() => {
      $(".modal-body").animate({ scrollTop: $(divId).offset().top });
    });
    // $('.modal-body').animate({ 'scrollTop': $("#" + id).scrollTop() })
  }

  render() {
    let addOnArr = [];
   
    return this.state.listOpen ? (
      <div style={{ marginTop: "20px" }}>
        <Dialog
          modal={false}
          open={this.state.listOpen}
          autoDetectWindowHeight={false}
          overlayStyle={{ zIndex: "800" }}
          bodyStyle={{ minHeight: "80vh" }}
          onRequestClose={this.handleClose}
          contentStyle={{
            marginTop: "-50px",
            width: "45%",
            maxWidth: "none",
            zIndex: "900",
          }}
        >
          <div className="col-12 addOnsModalSec addOnsModal">
            <div className="row">
              <div className="col-12  addOnsModalTitleSec">
                <div className="addOnsModalTitleSecInner">
                  <h4 className="modal-title">
                    <img
                      src="/static/images/grocer/veg.png"
                      className="vegIcon"
                    />
                    {this.state.product
                      ? this.state.product.itemName ||
                        this.state.product.productName
                      : ""}
                  </h4>
                  <p className="addOnsModalSecTitlePrice">
                    {this.props.currencySymbol || "₹"}
                    {parseFloat(
                      this.state.product.priceValue ||
                        this.state.product.unitPrice ||
                        this.state.product.units[0].finalPrice
                    ).toFixed(2)}
                  </p>
                  <button
                    type="button"
                    onClick={this.handleClose}
                    className="close-bttn"
                    data-dismiss="modal"
                  >
                    ×
                  </button>
                </div>

                <nav
                  id="navbarExample1"
                  className="addons-nav navbar navbar-default navbar-static"
                >
                  <ul className="nav nav-pills">
                    {this.state.addOnList.length > 0
                      ? this.state.addOnList.map((addonItem) => (
                          <li className="nav-links">
                            <a
                              href={
                                "#" +
                                (addonItem.name || addonItem.name.en).replace(
                                  /[^A-Za-z]/g,
                                  ""
                                )
                              }
                            >
                              {addonItem.name || addonItem.name.en}
                            </a>
                          </li>
                        ))
                      : ""}
                  </ul>
                </nav>
              </div>
            </div>

            <div className="modal-body scroller" id="scrollId">
              <div className="row">
                <div
                  data-spy="scroll"
                  data-target="#navbarExample1"
                  data-offset="0"
                  className="col-12 addonsULSec"
                >
                  {this.state.addOnList.length > 0
                    ? this.state.addOnList.map((addonItem) => (
                        <ul
                          id={(addonItem.name || addonItem.name.en).replace(
                            /[^A-Za-z]/g,
                            ""
                          )}
                          className={
                            "nav flex-column radioUL " +
                            "addAdon" +
                            addonItem.id
                          }
                        >
                          <h5 className="addonsULSecH5Title">
                            {addonItem.name || addonItem.name.en}
                            {/* {addonItem.mandatory == 1 ? '**' : ''} */}
                            {/* {addonItem.mandatory == 1 ? <span className={this.state.addOnIds && this.state.addOnIds.findIndex((newSelection) => newSelection.id === addonItem.id) > -1 ? "addOnRequired done" : "addOnRequired active"}>Required</span> : ''} */}
                            {addonItem.mandatory == 1 ? (
                              <span
                                className={
                                  addonItem.valid
                                    ? "addOnRequired done"
                                    : "addOnRequired active"
                                }
                              >
                                Required
                              </span>
                            ) : (
                              ""
                            )}
                            <p style={{ fontSize: "12px", margin: "10px 0 0" }}>
                              {this.getAddonSelectMsg(addonItem)}
                            </p>
                          </h5>

                          {/* {addOnArr = addonItem.addOnGroup || addonItem.addOns} */}

                          {addonItem.addOnGroup.map((addonSubItem) => (
                            <div className="col-12">
                              {/* <Checkbox
                                                            label={addonSubItem.name.en}
                                                            labelPosition="right"
                                                            style={styles.checkbox}
                                                        /> */}
                              {/* parentArray.multiple == 1 && parentArray.maximumLimit == 0 */}
                              <li className="nav-item">
                                {/* <img src="/static/images/grocer/veg.png" className="vegIcon" /> */}
                                <label
                                  className="addOnLabel"
                                  for={addonSubItem.id}
                                >
                                  <span className="actualAddonName">
                                    {addonSubItem.name}
                                  </span>
                                  <input
                                    type={
                                      (addonItem.multiple == 1 &&
                                        addonItem.maximumLimit == 0) ||
                                      (addonItem.minimumLimit > 0 &&
                                        addonItem.maximumLimit >=
                                          addonItem.minimumLimit)
                                        ? "checkbox"
                                        : "radio"
                                    }
                                    data-price={parseFloat(
                                      addonSubItem.price
                                    ).toFixed(2)}
                                    id={addonSubItem.id}
                                    className="addAddonCB"
                                    data-value={parseFloat(
                                      addonSubItem.price
                                    ).toFixed(2)}
                                    onChange={() =>
                                      this.onChangeRadio(
                                        addonItem,
                                        addonSubItem
                                      )
                                    }
                                    name={(
                                      addonItem.name || addonItem.name.en
                                    ).replace(/[^A-Za-z]/g, "")}
                                  />
                                  <span className="checkmark"></span>
                                  <span className="addOnItemPrice">
                                    {this.props.currencySymbol || "₹"}
                                    {parseFloat(addonSubItem.price).toFixed(2)}
                                  </span>
                                </label>
                              </li>
                            </div>
                          ))}
                        </ul>
                      ))
                    : ""}
                </div>
              </div>
            </div>

            <div className="row fixed-bottom mx-0">
              <div className="col-12 cartBottomSec  mt-2">
                <div className="row">
                  <div className="col-12">
                    <div className="row">
                      <div className="col-9 mb-2 setTwoLines">
                        {this.state.allAreMarked ? (
                          this.state.showAll ? (
                            this.state.selectedAddons.map((item, index) => (
                              <span className="addonsDyna">
                                {index > 0 ? "," : ""}
                                {item.addOn.name}
                              </span>
                            ))
                          ) : this.state.selectedAddons.length < 3 ? (
                            this.state.selectedAddons.map((item, index) => (
                              <span className="addonsDyna">
                                {index > 0 ? "," : ""}
                                {item.addOn.name}
                              </span>
                            ))
                          ) : (
                            this.state.selectedAddons.map((item, index) =>
                              index < 2 ? (
                                <span className="addonsDyna">
                                  {index > 0 ? "," : ""}
                                  {item.addOn.name}
                                </span>
                              ) : (
                                ""
                              )
                            )
                          )
                        ) : (
                          <span className="addonsDyna">
                            {" "}
                            All required addons should be selected{" "}
                          </span>
                        )}
                        {/* } */}
                      </div>
                      <div className="col-3">
                        {this.state.allAreMarked ? (
                          this.state.showAll ? (
                            <a
                              onClick={this.togleShowAll}
                              className="float-right pt-1 addonsDyna"
                            >
                              Hide
                            </a>
                          ) : this.state.selectedAddons.length >= 3 ? (
                            <a
                              onClick={this.togleShowAll}
                              className="float-right pt-1 addonsDyna"
                            >
                              +{this.state.selectedAddons.length - 2} Add On
                            </a>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 cartTotalPriceSec">
                    {this.state.allAreMarked ? (
                      <div
                        className="cartTotalPriceSecInner"
                        onClick={this.addToCart}
                      >
                        <div className="row">
                          <div className="col-6">
                            <span className="cartTotalStaticPrice">total</span>
                            <span className="cartTotalDynaPrice">
                              {" "}
                              {this.props.currencySymbol || "₹"}
                              {parseFloat(
                                (this.state.product.priceValue ||
                                  this.state.prodData.units[0].finalPrice) +
                                  this.state.addOnPrice
                              ).toFixed(2)}
                            </span>
                          </div>
                          <div className="col-6 text-right">
                            <span className="cartTotalDynaPrice">add item</span>
                          </div>
                        </div>
                        {this.props.loading ? (
                          <div className="bttnLoader">
                            <div className="">
                              <CircularProgress
                                color={BASE_COLOR}
                                size={30}
                                thickness={3}
                              />
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    ) : (
                      <div className="cartTotalPriceSecInnerDeactive">
                        <div className="row">
                          <div className="col-6">
                            <span className="cartTotalStaticPrice">total</span>
                            {/* <span className="cartTotalDynaPrice"> {this.props.currencySymbol || "₹"}{parseFloat((this.state.product.priceValue || this.state.product.units[0].finalPrice) + this.state.addOnPrice).toFixed(2)}</span> */}
                          </div>
                          <div className="col-6 text-right">
                            <span className="cartTotalDynaPrice">add item</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="text-center pt-3 py-2">
                            <button type="button" style={{ width: "50%", color: "white", background: "orange" }} className="wishListModalBtn">
                                Confirm
                            </button>
                        </div> */}
          </div>
        </Dialog>
      </div>
    ) : (
      ""
    );
  }
}

const mapStateToProps = (state) => {
  return {
    reduxState: state,
    myCart: state.cartList,
    cartProducts: state.cartProducts,
    loading: state.loading,
  };
};

export default connect(mapStateToProps)(AddOnDialog);
