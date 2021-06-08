import React from "react";
import { Component } from "react";
import Link from "next/link";
import Moment from "react-moment";
import $ from "jquery";

import Wrapper from "../../hoc/wrapperHoc";
import LeftSlider from "../ui/sliders/leftSlider";
import { Creditly } from "../../lib/validation";
import { addCard, deleteCard } from "../../services/cart";
import LinearProgress from "../ui/linearProgress";
import LanguageWrapper from "../../hoc/language";

class CardSlider extends Component {
  state = {
    SliderWidth: 0,
    open: true,
    loading: false,
    error: null,
    readyToRender: false
  };
  lang = this.props.lang;
  constructor(props) {
    super(props);
    this.handleLeftSliderOpen = this.handleLeftSliderOpen.bind(this);
  }

  handleLeftSliderOpen = () => this.ViewAllCardRef.handleLeftSliderToggle();
  handleClose = () => this.ViewAllCardRef.handleLeftSliderClose();
  closeSlider = () => {};
  componentDidMount() {
    this.props.onRef(this);
    this.setState({ readyToRender: true });
  }

  determineCardTypeImage = value => {
    switch (value) {
      case "MasterCard":
        return "/static/images/master-card.png";
        break;
      case "Visa":
        return "/static/images/visa.png";
        break;
      case "Discover":
        return "/static/images/discover.png";
        break;
      case "American Express":
        return "/static/images/ae.png";
        break;
      default:
        return "/static/images/cc-icon.png";
        break;
    }
  };

  handleDeleteCard = card => {
    deleteCard(card.id).then(data => {
      data.error ? "" : this.props.getCustomerCards();
    });
  };

  printCards = () => {
    return (
      <div className="px-3 py-3">
        <h5 className="mb-3 addPaymentCard">
          {this.lang.selectCard || "Select Card"}
        </h5>
        {/* <div className="row srlHidClsBt" style={{ maxHeight: "300px", overflow: "auto" }}> */}
        <div className="row mobile-show">
          {this.props.customerCards && this.props.customerCards.length > 0 ? (
            <Wrapper>
              {this.props.customerCards.map((card, index) => (
                <div
                  className="col-12 cardPaymentsBt"
                  key={"customdateRadio" + index}
                >
                  <input
                    id={card.id}
                    name="card_radio"
                    className="customradioMedium"
                    onClick={() => this.props.setDefaultCard(card.id, card)}
                    type="radio"
                    style={{ cursor: "pointer" }}
                  />

                  <label
                    className="col-12"
                    style={{ cursor: "pointer" }}
                    htmlFor={card.id}
                  >
                    <div className="row align-items-center">
                      <div className="col-2 p-0">
                        <img
                          width="30"
                          src={this.determineCardTypeImage(card.brand)}
                        ></img>
                      </div>

                      <div className="col">
                        <div className="row align-items-center">
                          <div className="col-12">
                            <div className="row align-items-center">
                              <div className="col-6 text-left">
                                <span className="cardNumbersComm">
                                  {"**** " + card.last4}
                                </span>
                              </div>
                              <div className="col-6 text-right">
                                <span
                                  style={{
                                    fontSize: "10px",
                                    fontWeight: "400"
                                  }}
                                >
                                  {card.expMonth + "/" + card.expYear}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className="col-2 p-0 delete"
                        data-toggle="modal"
                        data-target="#deleteCard"
                      >
                        <i
                          class="fa fa-trash-o text-danger"
                          aria-hidden="true"
                        ></i>
                      </div>
                    </div>
                  </label>
                </div>
              ))}
              <div className="col-12 addCardSection">
                <div className="row">
                  <div className="col-12">
                    <button
                      onClick={() => this.props.handleAddCardMobileSlider()}
                      type="submit"
                      class="btn btn-default submit w-100 addCardBtn"
                    >
                      {this.lang.addNewCardC || "ADD NEW CARD"}
                    </button>
                  </div>
                </div>
              </div>
            </Wrapper>
          ) : (
            <div className="col-12">
              <button
                className="noCardsBtn"
                onClick={() => this.props.handleAddCardMobileSlider()}
              >
                {this.lang.AddNewCard || "Add New Card"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  render() {
    return this.state.readyToRender ? (
      <Wrapper>
        <LeftSlider
          onRef={ref => (this.ViewAllCardRef = ref)}
          width={this.props.width}
          handleClose={this.closeSlider}
          drawerTitle={this.lang.savedCard || "Saved Cards"}
        >
          <div className="col-12 mt-lg-4 paymentsProfileSec">
            <div className="row">
              <div className="col-12" style={{ marginBottom: "64px" }}>
                {this.props.width ? this.printCards() : ""}
              </div>
              {/* <div className="col-12" style={{ height: "93vh" }}>
                                    <div className="border p-4">
                                        
                                        <form role="form" className="paymentsCardForm scroller" style={{ maxHeight: "450px", overflowY: "scroll" }}>
                                            {this.props.customerCards ? this.props.customerCards.map((card, index) =>
                                                <div className="input-group my-2" key={"card" + index}>
                                                    <div className="input-group-prepend">
                                                        <div class="input-group-text">
                                                            <div class="custom-control custom-radio">
                                                                <input type="radio" className="custom-control-input" id={"cardRadio" + index} name="example1" />
                                                                <label className="custom-control-label d-none" for={"cardRadio" + index}></label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <input type="text" className="form-control" value={"XXXX XXXX XXXX" + card.expYear} aria-label="Text input with radio button" disabled />
                                                </div>) : ''
                                            }


                                        </form>

                                        <button type="button" style={{ width: "84%", bottom: "10px" }} onClick={() => this.props.handleAddCardMobileSlider()} className="btn btn-block btn-default btnClsComm btnAddNewCardPayments">
                                            Add New Card
                                        </button>
                                    </div>
                                </div> */}
            </div>
          </div>
        </LeftSlider>
      </Wrapper>
    ) : (
      ""
    );
  }
}
export default LanguageWrapper(CardSlider);
