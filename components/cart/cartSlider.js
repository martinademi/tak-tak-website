import React from "react";
import { connect } from "react-redux";
// import Drawer from 'material-ui/Drawer';
import Drawer from "@material-ui/core/Drawer";
import * as actions from "../../actions/index";
import CartContent from "./cartContent";
import Router from "next/router";
import TopLoader from "../ui/loaders/TopBarLoader/TopBarLoader";
import { setCookie } from "../../lib/session";

import { withStyles } from "@material-ui/core/styles";
import { DRAWER_WIDTH_DESK, NOTES_VAR } from "../../lib/envariables";

const styles = {
  paper: {
    width: DRAWER_WIDTH_DESK
  },
  mobilePaper: {
    width: "100%"
  }
};

class CartSlider extends React.Component {
  state = {
    width: "100%",
    maxWidth: "480px",
    open: false,
    extraNote: {}
  };

  constructor(props) {
    super(props);
    this.setDeliveryType = this.setDeliveryType.bind(this);
  }

  handleToggle = () => {
    this.setState({ open: true, width: "100%" });
  };
  handleClose = () => {
    this.setState({ width: "0%", open: false });
  };

  componentDidMount() {
    // passing ref to parent to call children functions
    this.props.onRef(this);
    localStorage.getItem(NOTES_VAR)
      ? this.setState({
          extraNote: JSON.parse(localStorage.getItem(NOTES_VAR))
        })
      : "";
  }

  setDeliveryType(type) {
    this.props.dispatch(actions.deliveryType(type));
    localStorage.setItem(NOTES_VAR, JSON.stringify(this.state.extraNote));
    setCookie("deliveryType", type);
    this.verifyMinimuOrderCheck();
    // Router.push('/checkout').then(() => window.scrollTo(0, 0));
    // this.TopLoader.startLoader();
  }

  handleCartNotes = event => {
    let tempNotes = this.state.extraNote;
    let storeIdKey = event.target.id.split("-")[1];
    tempNotes[storeIdKey] = event.target.value;
    this.setState({ extraNote: tempNotes });
  };

  verifyMinimuOrderCheck = () => {
    let cartStoresData = this.props.myCart ? this.props.myCart.cart : [];
    let invalidStoreOrders = [];
    cartStoresData &&
      cartStoresData.map((item, storeIndex) => {
        let minAmount = item.minimumOrder;
        let storeCurrentTotal = item.storeTotalPrice;

        if (!item.minimumOrderSatisfied && minAmount - storeCurrentTotal > 0) {
          invalidStoreOrders.push(item);
        }
      });

    if (invalidStoreOrders && invalidStoreOrders.length > 0) {
      
      let minAmount = invalidStoreOrders[0].minimumOrder;
      let storeName = invalidStoreOrders[0].storeName;
      let storeCurrentTotal = invalidStoreOrders[0].storeTotalPrice;
      toastr.error(
        `The minimum order value is € ${minAmount} for ${storeName}. Add € ${minAmount -
          storeCurrentTotal} to be able to order.`
      );
      return;
    }

    Router.push("/checkout").then(() => window.scrollTo(0, 0));
  };

  render() {
    const { classes } = this.props;

    return (
      <Drawer
        onRequestChange={open => this.setState({ open })}
        open={this.state.open}
        openSecondary={true}
        width={this.state.width}
        anchor="right"
        // docked={false}
        containerStyle={{
          width: this.state.width,
          maxWidth: this.state.maxWidth
        }}
        classes={{
          paper:
            this.state.maxWidth == "100%" ? classes.mobilePaper : classes.paper
        }}
        onClose={this.handleClose}
        // containerClassName="scroller horizontal-scroll"
      >
        <CartContent
          myCart={this.props.myCart}
          handleClose={this.handleClose}
          handleCartNotes={this.handleCartNotes}
          setDeliveryType={this.setDeliveryType}
          editCart={this.props.editCart}
        />

        <TopLoader onRef={ref => (this.TopLoader = ref)} />
      </Drawer>
    );
  }
}

const mapStateToProps = state => {
  return {
    myCart: state.cartList
  };
};

// export default connect(mapStateToProps)(CartSlider);

export default connect(mapStateToProps)(withStyles(styles)(CartSlider));
