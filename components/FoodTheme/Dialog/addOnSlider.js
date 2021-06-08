import React from "react";
import Drawer from "material-ui/Drawer";
import { connect } from "react-redux";
import $ from "jquery";
import * as actions from "../../../actions/index";
import CircularProgress from "material-ui/CircularProgress";
const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
import { FontIcon, IconButton } from "material-ui";
import { v4 } from "uuid";
import { BASE_COLOR } from "../../../lib/envariables";
import { getCookie } from "../../../lib/session";
import { addToCartExFunc } from "../../../lib/cart/addToCart";
import { getProductDetails } from "../../../services/category";
import { withStyles } from "@material-ui/core";

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
  root: {
    position: "fixed",
    background: "red",
  },
};

class AddOnSlider extends React.Component {
  state = {
    open: false,
    addOnList: [],
    product: [],
    mandatoryAddOns: [],
    allAreMarked: false,
    selectedAddons: [],
    addOnArrayforCart: [],
    addOnPrice: 0,
    showAll: false,
    addOnIds: [],
  };

  constructor(props) {
    super(props);
    this.openProductDialog = this.openProductDialog.bind(this);
  }

  openProductDialog = async (product) => {
    
    // this.setState({ open: true, addOnList: product.addOns, product: product }, () => {
    //     this.afterSetStateFinished()
    // })

    let lat = getCookie("lat", "");
    let lng = getCookie("long", "");
    let token = getCookie("token", "");
   
    getProductDetails(
      product.childProductId || product.productId,
      lat,
      lng,
      token
    )
      .then((data) => {
        
        this.setState(
          {
            open: true,
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

  onChangeRadio = async (parentArray, childArray) => {
    let allAreMarked = true;
    let index;
    let finalAddOns = await [...this.state.selectedAddons];

    // get all the checkbox inside particular addon group
    let $allInp = $(".addAdon" + parentArray.id + " .addAddonCB");

    

    // check if the addon maximum limit reaches, prevent checking more boxes
    // if ($allInp.filter(':checked').length >= parentArray.maximumLimit && parentArray.mandatory != 1) {

    
    let selectionLimit = parentArray.maximumLimit;
    if (parentArray.multiple == "0" && parentArray.maximumLimit == "0") {
     
      selectionLimit = 1;
    }
    if (parentArray.multiple == 1 && parentArray.maximumLimit == 0) {
    
      selectionLimit = "all";
    }
    if (
      parentArray.minimumLimit > 0 &&
      parentArray.maximumLimit >= parentArray.minimumLimit
    ) {
     
      selectionLimit = parentArray.maximumLimit;
    }


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

    await this.state.mandatoryAddOns.map((item) => {
     
      if (
        $(
          `input[name=${(item.name.en || item.name).replace(
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

    this.setState({
      currentCheckedGrpLength: $(
        ".addAdon" + parentArray.id + " .addAddonCB:checked"
      ).length,
    });

    this.setState({ addOnIds: [] }, () => {
      let tempStateAddonIds = this.state.addOnIds;
      
      finalAddOns &&
        finalAddOns.map((item) => {
          tempStateAddonIds.push({ id: item.id });
        });
      this.setState({});
    });

    await this.setState(
      { allAreMarked: allAreMarked, selectedAddons: finalAddOns },
      () => this.pushToAddonFinal(this.state.selectedAddons),
      this.calculateTotal(finalAddOns)
    );

    
  };

  // onChangeRadio = async (parentArray, childArray) => {
  //     let allAreMarked = true; let index;
  //     let finalAddOns = await [...this.state.selectedAddons];

  //     let data = {
  //         addOn: childArray,
  //         id: parentArray.id
  //     }

  //     finalAddOns.length > 0
  //     await finalAddOns.length < 1 ?
  //         finalAddOns.push(data)
  //         : (
  //             index = finalAddOns.findIndex((item) => item.id == parentArray.id),
  //             index >= 0 ?
  //                 (
  //                     finalAddOns[index] = data
  //                 )
  //                 :
  //                 finalAddOns.push(data)
  //         )

  //     await this.state.mandatoryAddOns.map((item) => {
  //         if ($(`input[name=${(item.name.en).replace(/[^A-Za-z]/g, "")}]:checked`).length > 0) {
  //             // do something here
  //         } else {
  //             return (allAreMarked = false)
  //         }
  //     }
  //     )
  //     await this.setState({ allAreMarked: allAreMarked, selectedAddons: finalAddOns }, () =>
  //         this.pushToAddonFinal(this.state.selectedAddons), this.calculateTotal(finalAddOns)
  //     )
  // }

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

  handleClose = () => {};

  handleChange = (name) => (e) => {
    e.target.checked
      ? this.selectedOptions(e, name)
      : this.removedOptions(e, name);
  };

  // addToCart = () => {
  //     let cartData;
  //     this.props.isAuthorized ?
  //         (cartData = {
  //             childProductId: this.state.product.childProductId,
  //             unitId: this.state.product.unitId,
  //             quantity: parseFloat(1).toFixed(1),
  //             addOns: this.state.addOnArrayforCart,
  //             storeType: getCookie("storeType")
  //         },
  //             this.props.dispatch(actions.initAddCart(cartData)),
  //             setTimeout(() => {
  //                 this.props.dispatch(actions.getCart())
  //             }, 100)
  //         ) : this.props.showLoginHandler();
  // }

  addToCart = () => {
  
    // || this.state.prodData && this.state.prodData.units ? this.state.prodData.units[0].unitId : ''
    let cartData;
    // this.props.isAuthorized ?
    // (
    (cartData = {
      childProductId:
        this.state.product.childProductId || this.state.product.productId,
      unitId: this.state.product.unitId,
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
        });
    // )
    // :
    // (
    //     this.props.showLoginHandler(),
    //     this.handleClose()
    // )
  };

  componentDidMount() {
    this.props.onRef(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loading == true && this.props.loading == false) {
      this.handleLeftSliderClose();
    }
  }

  getAddonSelectMsg = (addOnData) => {
    
    // switch(addOnData.maximumLimit){

    // }
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

  togleShowAll = () => {
    this.setState({ showAll: !this.state.showAll });
  };

  scrollTo(id) {
    let divId = "#" + id;
    $(document).ready(() => {
      $(".modal-body").animate({ scrollTop: $(divId).offset().top });
    });
  }

  handleLeftSliderClose = () => {
    this.setState({
      open: false,
      addOnList: [],
      product: [],
      mandatoryAddOns: [],
      allAreMarked: false,
      selectedAddons: [],
      addOnArrayforCart: [],
      addOnPrice: 0,
      showAll: false,
    });
  };

  getAddOnInput = (addonItem, addonSubItem) => {
    return (
      <li className="nav-item">
        {/* <img src="/static/images/grocer/veg.png" className="vegIcon" /> */}
        <label className="addOnLabel" for={addonSubItem.id}>
          <span className="actualAddonName">
            {addonSubItem.name.en || addonSubItem.name}
          </span>
          <input
            type={
              (addonItem.multiple == 1 && addonItem.maximumLimit >= 0) ||
              (addonItem.minimumLimit > 0 &&
                addonItem.maximumLimit >= addonItem.minimumLimit)
                ? "checkbox"
                : "radio"
            }
            data-price={parseFloat(addonSubItem.price).toFixed(2)}
            id={addonSubItem.id}
            className="addAddonCB"
            data-value={parseFloat(addonSubItem.price).toFixed(2)}
            // onChange={() => this.onChangeRadio(addonItem, addonSubItem)} name={(addonItem.name || addonItem.name.en).replace(/[^A-Za-z]/g, "")}
            onChange={() => this.onChangeRadio(addonItem, addonSubItem)}
            name={(addonItem.name.en || addonItem.name).replace(
              /[^A-Za-z]/g,
              ""
            )}
          />
          <span className="checkmark"></span>
          <span className="addOnItemPrice">
            {this.props.currencySymbol || "₹"}
            {parseFloat(addonSubItem.price).toFixed(2)}
          </span>
        </label>
      </li>
    );
  };
  render() {
    const { classes } = this.props;

   
    return this.state.open ? (
      <div style={{ marginTop: "20px" }}>
        <Drawer
          docked={false}
          open={this.state.open}
          onRequestChange={(open) => this.setState({ open })}
          width={"100%"}
          disableBackdropTransition={!iOS}
          disableDiscovery={iOS}
          disableSwipeToOpen={true}
          openSecondary={true}
          className={"addOnMuiSliderMobi"}
          containerStyle={{
            overflowX: "hidden",
            background: "#fff",
            width: "100%",
            position: "fixed",
          }}
          // containerClassName="scroller"
          onRequestClose={this.handleClose}
        >
          <div
            className="col-12 py-2 px-1 fixed-top"
            style={{
              zIndex: "9",
              top: 0,
              background: "#fff",
              borderBottom: "1px solid #eee",
            }}
          >
            <div className="col-12">
              <div className="row align-items-center">
                <div className="col-2 pl-0">
                  <IconButton
                    onClick={this.handleLeftSliderClose}
                    style={{ height: "30px", padding: "0px 12px" }}
                  >
                    <img
                      src="/static/icons/Common/BackIcon.imageset/back_btn@2x.png"
                      width="24"
                    />
                  </IconButton>
                </div>
                <div className="col-8 px-0 text-center">
                  <h6 className="innerPage-heading lineSetter">
                    {this.state.product ? this.state.product.productName : ""}
                  </h6>
                </div>
              </div>
            </div>
          </div>

          <div
            className="col-12 addOnsModalSec addOnsModal"
            style={{ overflowY: "auto", height: "100vh" }}
          >
            <div className="row">
              <div
                className="col-12 addonsULSec"
                style={{ margin: "50px 0 175px" }}
              >
                {this.state.addOnList.length > 0
                  ? this.state.addOnList.map((addonItem) => (
                      <ul
                        key={addonItem.id}
                        id={(addonItem.name && addonItem.name.en
                          ? addonItem.name.en
                          : addonItem.name
                        ).replace(/[^A-Za-z]/g, "")}
                        className={
                          "nav flex-column radioUL " + "addAdon" + addonItem.id
                        }
                      >
                        <h5 className="addonsULSecH5Title">
                          {addonItem.name.en || addonItem.name}
                          {/* {addonItem.mandatory == 1 ? '**' : ''} */}
                          {/* {addonItem.mandatory == 1 ? <span className={this.state.addOnIds && this.state.addOnIds.findIndex((newSelection) => newSelection.id === addonItem.id) > -1 ? "addOnRequired done" : "addOnRequired active"}>Required</span> : ''} */}
                          {addonItem.mandatory == 1 ? (
                            <span
                              className={
                                this.state.currentCheckedGrpLength >=
                                  addonItem.minimumLimit &&
                                this.state.addOnIds.findIndex(
                                  (newSelection) =>
                                    newSelection.id === addonItem.id
                                ) > -1
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

                        {addonItem.addOns
                          ? addonItem.addOns.map((addonSubItem) => (
                              <div key={addonSubItem.id} className="col-12">
                                {this.getAddOnInput(addonItem, addonSubItem)}
                              </div>
                            ))
                          : addonItem.addOnGroup.map((addonSubItem) => (
                              <div key={addonSubItem.id} className="col-12">
                                {this.getAddOnInput(addonItem, addonSubItem)}
                              </div>
                            ))}
                      </ul>
                    ))
                  : ""}
              </div>
            </div>
          </div>

          <div className="addOnsModal">
            <div className="col-12 cartBottomSec px-2 fixed-bottom  mt-2">
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
                <div className="col-12 cartTotalPriceSec ">
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
                            ₹
                            {parseFloat(
                              (this.state.product.priceValue ||
                                this.state.product.units[0].finalPrice) +
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
                          <span className="cartTotalDynaPrice">
                            {" "}
                            ₹
                            {parseFloat(
                              (this.state.product.priceValue ||
                                this.state.product.units[0].finalPrice) +
                                this.state.addOnPrice
                            ).toFixed(2)}
                          </span>
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
        </Drawer>
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

export default connect(mapStateToProps)(AddOnSlider);
