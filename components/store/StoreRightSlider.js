import React from "react";
import { connect } from "react-redux";
import Link from "next/link";

import BottomSlider from "../ui/sliders/bottomSlider";
import CartContent from "../cart/cartContent";
import * as actions from "../../actions/index";
import { getTopSearch, getSuggestions } from "../../services/filterApis";
import { getCookie } from "../../lib/session";
import redirect from "../../lib/redirect";
import LeftSlider from "../ui/sliders/leftSlider";
import { EmptyScreen } from "../ui/emptyScreen/emptyScreen";

class StoreDrawer extends React.Component {
  state = {
    width: "100%",
    maxWidth: "100%",
    open: false
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // passing ref to parent to call children functions
    this.props.onRef(this);
  }

  handleLeftSliderToggle() {
    this.setState({ SliderWidth: 450 });
    this.StoreSlider.handleLeftSliderToggle();
  }

  handleLeftClose() {
    this.StoreSlider.handleLeftClose();
  }

  render() {
    console.log("Storedata", this.props.stores);
    const { lang } = this.props;
    return (
      <LeftSlider
        onRef={ref => (this.StoreSlider = ref)}
        width={this.props.width}
        closeHeader={true}
        handleClose={this.handleClose}
        drawerTitle="Stores around you"
      >
        <ul className="nav flex-column storesAroundUL">
          {this.props.stores && this.props.stores.length > 0 ? (
            this.props.stores.map((store, index) => (
              <li
                className={`nav-item ${!store.storeIsOpen && "storeClosed12"}`}
                key={index}
                onClick={store.storeIsOpen ?
                  () => this.props.changeStore(store):""}
              >
                 
                <div className="row justify-content-center">
                  <div className="col-10 px-0">
                    <div className="row align-items-center">
                      <div className="col-auto">
                        <span
                          className="substore-image shadow"
                          style={{ backgroundImage: `url(${store.logoImage})` }}
                        ></span>
                      </div>
                      <div className="col">
                        {/* <span className=""> */}
                        <h4 className="title">{store.storeName}</h4>
                        <p className="description">{store.storeAddr}</p>
                        {/* </span> */}
                      </div>
                    </div>
                  </div>
                 
              
                  <div className="col-10 px-0">
                    <div className="row pt-3 align-items-center">
                      <div className="col-4 text-center">
                        <p className="description py-1">
                          {" "}
                          <b>{parseFloat(store.distanceKm).toFixed(2)}</b>{" "}
                        </p>
                        <p className="description">
                          {lang.kmAway || "KM AWAY"}
                        </p>
                      </div>
                      <div className="col-4 text-center">
                        <p className="description py-1">
                          {" "}
                          <i className="fa fa-star" aria-hidden="true"></i>{" "}
                          <strong>
                            {parseFloat(store.averageRating).toFixed(2)}
                          </strong>{" "}
                        </p>
                        <p className="description">
                          {lang.ratingC || "RATING"}
                        </p>
                      </div>
                      <div className="col-4 text-center px-0 px-sm-2">
                        <p className="description py-1">
                          {" "}
                          <strong>{store.currencySymbol}{store.minimumOrder}</strong>
                        </p>
                        <p className="description">
                          { "MINIMUM ORDER"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-10">
                  {!store.storeIsOpen && (
          <div className="storeClosed12" style={{ color: "red",fontWeight:"500"}}>
            Store closed
          </div>
        )}
                  </div>
                </div>
              </li>
            ))
          ) : (
            <EmptyScreen />
          )}
        </ul>
      </LeftSlider>
    );
  }
}

const mapStateToProps = state => {
  return {
    myCart: state.cartList,
    lang: state.locale
  };
};

export default connect(mapStateToProps)(StoreDrawer);
