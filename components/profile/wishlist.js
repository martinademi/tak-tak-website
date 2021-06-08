import React from "react";
import { Component } from "react";
import Moment from "react-moment";
import $ from "jquery";
import Wrapper from "../../hoc/wrapperHoc";
import LeftSlider from "../ui/sliders/leftSlider";
import Link from "next/link";
import WishlistProductSlider from "./wishlistProducts";
import { getCookie } from "../../lib/session";
import { getWishlist } from "../../services/cart";
import { BASE_COLOR } from "../../lib/envariables";
import LanguageWrapper from "../../hoc/language";
class WishlistSlider extends Component {
  state = {
    SliderWidth: 0,
    open: true
  };
  constructor(props) {
    super(props);
    this.handleLeftSliderOpen = this.handleLeftSliderOpen.bind(this);
  }
  getWishlist = listId => {
    let wishlistData = {
      listId: listId, // send 0 for all list, and send listId for products inside the list
      storeId: getCookie("storeId")||0 //if the store id is undefine then send 0   
    };
    this.ListProductSlider.handleClose();
    this.props.getWishlist(wishlistData);
  };
  handleLeftSliderOpen = () => {
    this.FavouriteSliderRef.handleLeftSliderToggle();
  };
  handleListProducts = listId => {
    this.ListProductSlider.handleLeftSliderOpen(listId);
  };
  handleClose = () => this.FavouriteSliderRef.handleLeftSliderClose();
  closeSlider = () => {
    
  };
  componentDidMount = () => this.props.onRef(this);

  render() {
    let lang = this.props.lang;
    return (
      <Wrapper>
        <LeftSlider
          onRef={ref => (this.FavouriteSliderRef = ref)}
          width={this.props.state.SliderWidth}
          handleClose={this.closeSlider}
          drawerTitle={lang.wishList || "Wish List"}
        >
          <div className="col-12" style={{ marginTop: "5%" }}>
            {this.props.state &&
            this.props.state.listArray &&
            this.props.state.listArray.length > 0 ? (
              this.props.state.listArray.map((listData, index) => (
                <div
                  className="row px-2"
                  key={"list" + index}
                  style={{ borderBottom: "1px solid #eee", background: "#fff" }}
                >
                  <div
                    className="col-12 py-3 text-left"
                    onClick={() => this.handleListProducts(listData.listId)}
                  >
                    <p className="" style={{ fontWeight: 400, color: "#999" }}>
                      {" "}
                      {listData.listName}{" "}
                      <i
                        class="fa fa-chevron-right float-right pt-1"
                        aria-hidden="true"
                      ></i>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="row">
                <div className="col-12 text-center">
                  <Link href="/">
                    <button
                      style={{
                        padding: "6px 90px",
                        border: "1px solid " + BASE_COLOR,
                        color: BASE_COLOR,
                        background: "transparent"
                      }}
                    >
                      {lang.startShopping || "Start Shopping"}
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </LeftSlider>

        <WishlistProductSlider
          onRef={ref => (this.ListProductSlider = ref)}
          addToCart={this.props.addToCart}
          editCart={this.props.editCart}
          getWishlist={this.getWishlist}
          cartProducts={this.props.cartProducts}
        />
      </Wrapper>
    );
  }
}
export default LanguageWrapper(WishlistSlider);
