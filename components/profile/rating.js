import React from "react";
import { Component } from "react";
import Moment from "react-moment";
import $ from "jquery";
import Wrapper from "../../hoc/wrapperHoc";
import DoneIcon from "../ui/done";
import CustomSlider from "../ui/sliders/customSlider";
import RaisedButton from "material-ui/RaisedButton";
import axios from "axios";
import Rating from "react-rating";

import Dialog from "material-ui/Dialog";
import { getRatingQuest, saveRatings } from "../../services/profileApi";
import { BASE_COLOR } from "../../lib/envariables";
import LanguageWrapper from "../../hoc/language";
let delRating = 0;

const style = {
  margin: "0"
};

const buttonGreen = {
  width: "100%",
  backgroundColor: "#fff",
  border: "1px solid " + BASE_COLOR
};

const lableFill = {
  fontSize: "13px",
  fontWeight: "700",
  color: BASE_COLOR
};
const customContentStyle = {
  width: "35%",
  maxWidth: "none"
};

class RatingSlider extends Component {
  state = {
    open: false,
    orderData: null,
    ratingData: null,
    deliveryRate: 0,
    userResponse: []
  };
  constructor(props) {
    super(props);
    this.handleLeftSliderOpen = this.handleLeftSliderOpen.bind(this);
  }

  handleOpen = async (orderData, screen) => {
    screen ? (customContentStyle.width = "95%") : "35%";

    await this.setState({ open: true, orderData: orderData });
    getRatingQuest(orderData.orderId).then(async data => {
      let allData = [];
      data.error
        ? ""
        : (this.setState({ ratingData: data.data.data }),
          (await data.data.data) &&
            data.data.data.ratings &&
            data.data.data.ratings.map(questData => {
              allData.push({
                id: questData._id,
                associated: questData.associated
              });
            }),
          this.setState({ userResponse: allData }));
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  handleLeftSliderOpen = async orderData => {
    await this.setState({ orderData: orderData });
    this.OrderSliderRef.handleLeftSliderToggle();
  };
  setDeliveryRate = async (value, questData, key) => {
    let allData = this.state.userResponse;

    (await this.state.userResponse.findIndex(
      item => item.id == questData._id
    )) >= 0
      ? ((allData[
          this.state.userResponse.findIndex(item => item.id == questData._id)
        ]["name"] = questData.name),
        (allData[
          this.state.userResponse.findIndex(item => item.id == questData._id)
        ]["rating"] = value))
      : "";

    this.setState({ ["rating" + key]: value, userResponse: allData });
  };
  setQuestAnswer = async (value, questData) => {
    let allData = this.state.userResponse;

    (await this.state.userResponse.findIndex(
      item => item.id == questData._id
    )) >= 0
      ? (allData[
          this.state.userResponse.findIndex(item => item.id == questData._id)
        ]["message"] = value)
      : "";

    this.setState({ userResponse: allData });
  };
  getLength = data => Object.keys(data).length;
  componentDidMount = () => this.props.onRef(this);
  saveUserRating = () => {
    let finalData = [];
    let apiData = {};
    this.state.userResponse.map(obj => {
      // finalData.push(JSON.parse(obj))
    });
    apiData["orderId"] = this.state.orderData.orderId.toString();
    apiData["paymentType"] = 2;
    apiData["review"] = this.state.userResponse;

    this.handleClose();
    saveRatings(JSON.stringify(apiData)).then(data => {});
  };
  render() {
    let orderDetail = this.state.orderData;
    let { lang } = this.props;
    return (
      <Wrapper>
        <Dialog
          title={lang.rateYOurOrder || "Rate Your Order"}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          contentStyle={customContentStyle}
        >
          <div>
            <div className="col-12 orderRating text-center">
              <h6>{lang.totalBillAmount || "Total Bill Amount"}</h6>
              <p className="totalBillAmt">
                {this.state.orderData
                  ? orderDetail.currencySymbol +
                    parseFloat(orderDetail.totalAmount).toFixed(2)
                  : ""}
              </p>
            </div>

            <div className="col-12 orderRating text-left my-4 d-none">
              <p>{lang.delivery || "Delivery"}</p>
              <Rating
                emptySymbol="fa fa-star-o fa-2x"
                initialRating={this.state.deliveryRate}
                fullSymbol="fa fa-star fa-2x"
                fractions={1}
                onChange={this.setDeliveryRate}
              />
            </div>

            <div
              className="col-12 text-left scroller"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              {this.state.ratingData &&
              this.state.ratingData.ratings &&
              this.state.ratingData.ratings.length > 0
                ? this.state.ratingData.ratings.map((questData, key) =>
                    this.getLength(questData.attributes) > 0 ? (
                      <div className="col-12 px-0" key={"quest" + key}>
                        {questData.name}
                        <div className="col-12 orderRating text-left px-0">
                          <Rating
                            emptySymbol="fa fa-star-o fa-2x"
                            initialRating={this.state["rating" + key]}
                            fullSymbol="fa fa-star fa-2x"
                            fractions={1}
                            onChange={value =>
                              this.setDeliveryRate(value, questData, key)
                            }
                          />
                        </div>
                        <div className="col-12">
                          {questData.attributes[this.state["rating" + key]] &&
                            questData.attributes[
                              this.state["rating" + key]
                            ].map((optionData, index) => (
                              <label class="ratingCustomRadio">
                                <p
                                  className="mb-2"
                                  style={{
                                    color: "#444",
                                    fontSize: "15px",
                                    fontWeight: 400
                                  }}
                                >
                                  {optionData}
                                </p>
                                <input
                                  type="radio"
                                  name={"radio" + key}
                                  value={optionData}
                                  onClick={() =>
                                    this.setQuestAnswer(optionData, questData)
                                  }
                                />
                                <span class="ratingCustomRadioMark"></span>
                              </label>
                            ))}
                        </div>
                      </div>
                    ) : (
                      ""
                    )
                  )
                : ""}
            </div>

            <div className="col-12 text-center px-5 mt-4">
              <button
                className="rateSubmitBtn"
                onClick={() => this.saveUserRating()}
              >
                {lang.submit || "Submit"}
              </button>
            </div>
          </div>
        </Dialog>

        {/* <CustomSlider onRef={ref => (this.OrderSliderRef = ref)}
                    // width={this.state.loginSliderWidth}
                    width={this.props.RightSliderWidth}
                    handleClose={this.handleClose}
                >

                    {this.state.orderData ?
                        <div className="col-12 p-0">
                            <div className="col-12 px-4 py-3" style={{ background: '#fff', borderBottom: "1px solid #eee" }}>
                                <div className="row">
                                    <div className="col p-1 pt-2 cartHead text-center">
                                        
                                        <h6>Thanks for shopping with Loopz</h6>
                                    </div>
                                    <div className="closeDrawer">
                                        <a onClick={this.handleClose}><img src="static/images/cross.svg" height="15" width="20" /></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 orderRating text-center">
                                <p>Rate your Order</p>
                                <Rating emptySymbol="fa fa-star-o fa-2x"
                                    fullSymbol="fa fa-star fa-2x"
                                    fractions={2} onClick={this.props.setOrderRatings} />
                            </div>

                        </div> : ''
                    }


                </CustomSlider> */}
      </Wrapper>
    );
  }
}

export default LanguageWrapper(RatingSlider);
