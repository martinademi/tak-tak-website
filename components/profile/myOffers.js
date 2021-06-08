import React from "react";
import { Component } from "react";
import Moment from "react-moment";
import $ from "jquery";
import Wrapper from "../../hoc/wrapperHoc";
import LeftSlider from "../ui/sliders/leftSlider";
import { getOffers } from "../../services/filterApis";
import { getCookie } from "../../lib/session";
import Link from "next/link";
import StoreRightSlider from "../store/StoreRightSlider";
import LanguageWrapper from "../../hoc/language";
class OfferSlider extends Component {
  state = {
    SliderWidth: 0,
    open: true,
    offersData: null,
    offerName: null
  };
  constructor(props) {
    super(props);
    this.handleLeftSliderOpen = this.handleLeftSliderOpen.bind(this);
  }

  handleLeftSliderOpen = () => this.OffersSliderRef.handleLeftSliderToggle();
  handleClose = () => this.OffersSliderRef.handleLeftSliderClose();
  handleOfferDetail = offerDetail => {
    this.setState({ offerName: offerDetail.description });
    this.OfferDetailRef.handleLeftSliderToggle();
  };
  handleChangeStore = store => {
    this.props.changeStore(store);
    this.StoreSlider.handleLeftSliderClose();
  };
  LeftSliderMobileHandler = () => {
    this.setState({ SliderWidth: "100%" });
    this.StoreSlider.handleLeftSliderToggle();
  };
  closeSlider = () => {};
  componentDidMount = () => {
    this.props.onRef(this);
    getOffers(getCookie("storeId"))
      .then(({ data }) => {
        data.error ? "" : this.setState({ offersData: data.data });
      })
      .catch(err =>{});
  };

  render() {
    const { lang } = this.props;
    return (
      <Wrapper>
        <LeftSlider
          onRef={ref => (this.OffersSliderRef = ref)}
          width={this.props.SliderWidth}
          handleClose={this.closeSlider}
          drawerTitle={lang.offers || "Offers"}
        >
          <div
            className="col-12  selected-store text-center py-3 storeSelector"
            style={{ background: "transparent", top: "42px" }}
            onClick={this.LeftSliderMobileHandler}
          >
            <span className="">Selected Store</span>
            <p className="mt-0" style={{ width: "100%" }}>
              {this.props.selectedStore}
            </p>
          </div>

          <div
            className="col-12"
            style={this.state.offersData ? { marginTop: "60px" } : {}}
          >
            <div className="row">
              {this.props.offerProducts &&
              this.props.offerProducts.length > 0 ? (
                this.props.offerProducts.map((post, index) => (
                  <Link
                    key={"offerIndexMobi" + index}
                    href={`/offers?offerId=${post._id || post.offerId}&store=${
                      this.props.selectedStoreId
                    }&type=2`}
                    as={`/offers/${post.name
                      .replace(/%/g, "percentage")
                      .replace(/,/g, "")
                      .replace(/& /g, "")
                      .replace(/ /g, "-")}`}
                  >
                    <div
                      className="col-12 my-1 p-2"
                      style={{ background: "#fff" }}
                    >
                      <div className="view zoom mobile-show offerlistview offerMVImg">
                        <div className="animated-fast" key={index}>
                          <img
                            src={post.images.image}
                            height="250"
                            className="img-fluid shine"
                            alt={post.description}
                            title={post.description}
                          />
                          <p
                            style={{ fontSize: "15px", fontWeight: 400 }}
                            className="text-left mt-2 py-1 px-3"
                          >
                            {post.name}
                          </p>
                          <p
                            style={{ fontSize: "13px", fontWeight: 300 }}
                            className="text-left mb-2 px-3"
                          >
                            {post.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="" style={{ height: "85vh", width: "100%" }}>
                  <div className="col-12 py-4 text-center">
                    <img
                      src="/static/icons/EmptyScreens/EmptyOffer.imageset/offers@3x.png"
                      style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)"
                      }}
                      width="150"
                      height="100"
                    />
                    <p
                      className="mt-2"
                      style={{
                        fontWeight: 700,
                        position: "fixed",
                        top: "60%",
                        left: "50%",
                        transform: "translate(-50%, -50%)"
                      }}
                    >
                      {lang.noOffer || "No offers found."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </LeftSlider>

        <LeftSlider
          onRef={ref => (this.OfferDetailRef = ref)}
          width={this.props.SliderWidth}
          handleClose={this.closeSlider}
          drawerTitle={this.state.offerName ? this.state.offerName : ""}
        ></LeftSlider>
        <StoreRightSlider
          onRef={ref => (this.StoreSlider = ref)}
          stores={this.props.stores}
          width={this.state.SliderWidth}
          changeStore={this.handleChangeStore}
        />
      </Wrapper>
    );
  }
}

export default LanguageWrapper(OfferSlider);
