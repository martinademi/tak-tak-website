import React from "react";
import { Component } from "react";
import Link from "next/link";
import Moment from "react-moment";
import $ from "jquery";

import Wrapper from "../../hoc/wrapperHoc";
import LeftSlider from "../ui/sliders/leftSlider";
import { Creditly } from "../../lib/validation";
import { addCard } from "../../services/cart";
import LinearProgress from "../ui/linearProgress";
import { APP_NAME } from "../../lib/envariables";
import LanguageWrapper from "../../hoc/language";
class WalletMobileSlider extends Component {
  lang = this.props.lang;
  state = {
    SliderWidth: 0,
    open: true,
    loading: false,
    error: null,
    readyToRender: false,
  };

  constructor(props) {
    super(props);
    this.handleLeftSliderOpen = this.handleLeftSliderOpen.bind(this);
  }

  setControlFocus = (id) => {
    document.getElementById(id) ? document.getElementById(id).focus() : "";
  };

  handleLeftSliderOpen = () => {
    this.CouponLeftSliderRef.handleLeftSliderToggle();
    setTimeout(() => {
      // this.props.showOnlyAdddUI ?
      this.setControlFocus("walletAmountWithout");
      this.setControlFocus("walletAmountWith");
    }, 1000);
  };
  handleClose = () => this.CouponLeftSliderRef.handleLeftSliderClose();
  closeSlider = () => {};
  handleAddCardMobile = () => {
    this.handleClose();
    this.props.handleAddCardMobileSlider();
  };
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.rechargeWallet();
  };
  componentDidMount() {
    this.props.onRef(this);
    this.setState({ readyToRender: true });
  }

  render() {
    const { currencySymbol, selectedCard } = this.props;
    const lang = this.props.lang;
    return this.state.readyToRender ? (
      <Wrapper>
        <LeftSlider
          onRef={(ref) => (this.CouponLeftSliderRef = ref)}
          width={this.props.width}
          handleClose={this.closeSlider}
          drawerTitle={this.lang.payment || "Payments"}
        >
          {this.props.showOnlyAdddUI ? (
            <div
              className="col-12 mt-lg-4 paymentsProfileSec"
              style={{ overflow: "hidden" }}
            >
              <form
                onSubmit={this.handleSubmit}
                role="form"
                className="paymentsCardForm"
                style={{ minHeight: "150px", overflow: "hidden" }}
              >
                <div className="form-group">
                  <input
                    type="text"
                    placeholder={this.lang.enterAmount || "Enter Amount"}
                    value={this.props.walletRechargeAmount}
                    className="form-control rechargeWalletInput"
                    onKeyDown={this.props.allowOnlyNumber}
                    onChange={this.props.setRechargeAmt}
                    id="walletAmountWithout-TEST"
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-block btn-default btnClsComm btnConfirmPayPayments"
                  data-toggle="modal"
                  data-target="#confirmPayModalMobi"
                  onClick={this.props.rechargeWallet}
                  title={
                    this.props.walletRechargeAmount
                      ? ""
                      : "Amount should be greater than 0"
                  }
                  disabled={this.props.walletRechargeAmount ? false : true}
                >
                  {this.lang.confirmPay || "Confirm and Pay"}
                </button>
              </form>
              {/* Modal */}
              <div
                className="modal fade"
                id="confirmPayModalMobi***"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="exampleModalCenterTitle"
                aria-hidden="true"
              >
                <div
                  className="modal-dialog modal-dialog-centered"
                  role="document"
                >
                  <div className="modal-content p-3">
                    <div className="modal-header py-0">
                      <h6 className="modal-title" id="exampleModalCenterTitle">
                        {APP_NAME}
                      </h6>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <p className="paraText">
                        {this.lang.clickOk || `Click on "Ok" to authorize`}{" "}
                        {APP_NAME}{" "}
                        {this.lang.toChargeWallateWith ||
                          "to recharge your wallet with"}{" "}
                        €{this.props.walletRechargeAmount}
                      </p>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-default"
                        data-dismiss="modal"
                      >
                        {this.lang.cancell || "CANCEL"}
                      </button>
                      <button
                        type="button"
                        data-dismiss="modal"
                        className="btn btn-default okBtnConfirmPayment"
                        onClick={this.props.rechargeWallet}
                      >
                        {this.lang.ok || "OK"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Modal */}
            </div>
          ) : (
            <div className="row">
              <div
                className="col-12 mt-lg-4 paymentsProfileSec mobile-show"
                style={{ paddingTop: "25px", background: "#fff" }}
              >
                <div className="row">
                  <div className="col-12 text-center pb-4">
                    <p className="priceCardTitle">
                      {this.lang.currentCredit || "CURRENT CREDIT"}
                    </p>
                    <h1 className="priceCardBold">
                      €{" "}
                      {this.props.walletDetail
                        ? parseFloat(
                            this.props.walletDetail.walletBalance
                          ).toFixed(2)
                        : 0.0}{" "}
                    </h1>
                    <div className="">
                      <span className="limitHolder">
                        {this.lang.softLimit || "Soft limit"} :
                        <span className="limitTitle">
                          €{" "}
                          {this.props.walletDetail
                            ? parseFloat(
                                this.props.walletDetail.walletSoftLimit
                              ).toFixed(2)
                            : 0.0}
                        </span>
                      </span>
                      <span className="limitHolder">
                        {this.lang.hardLimit || "Hard limit"} :
                        <span className="limitTitle hardLimit">
                          €{" "}
                          {this.props.walletDetail
                            ? parseFloat(
                                this.props.walletDetail.walletHardLimit
                              ).toFixed(2)
                            : 0.0}
                        </span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        this.props.handleWalletHistorySlider("100%")
                      }
                      className="btn btn-md btn-primary recTransBtnBt"
                    >
                      {this.lang.recentTrasaction || "Recent Transactions"}{" "}
                    </button>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 py-4">
                    <div className="row">
                      {this.props.customerCards ? (
                        <div className="col-md-6">
                          <div
                            className="p-4"
                            style={{ background: "#f5f5f5" }}
                          >
                            <h5 className="payCardBtTitle">
                              {this.lang.payUsingCard || "Pay using card"}
                            </h5>
                            <form
                              role="form"
                              className="paymentsCardForm scroller"
                              style={{
                                maxHeight: "150px",
                                overflowY: "scroll",
                              }}
                            >
                              {this.props.customerCards
                                ? this.props.customerCards.map(
                                    (card, index) => (
                                      <div
                                        className="col-12 cardPaymentsBt"
                                        key={"customdateRadio" + index}
                                      >
                                        <input
                                          id={"profile-mobi" + card.id}
                                          name="card_radio"
                                          onClick={() =>
                                            this.props.setDefaultCard(
                                              card.id,
                                              card
                                            )
                                          }
                                          className="customradioMedium"
                                          type="radio"
                                          style={{ cursor: "pointer" }}
                                        />

                                        <label
                                          className="col-12"
                                          style={{ cursor: "pointer" }}
                                          htmlFor={"profile-mobi" + card.id}
                                        >
                                          <div className="row align-items-center">
                                            <div className="col-2 p-0">
                                              <img
                                                width="30"
                                                src={this.props.determineCardTypeImage(
                                                  card.brand
                                                )}
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
                                                          fontWeight: "400",
                                                        }}
                                                      >
                                                        {card.expMonth +
                                                          "/" +
                                                          card.expYear}
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
                                                className="fa fa-trash-o text-danger"
                                                aria-hidden="true"
                                              ></i>
                                            </div>
                                          </div>
                                        </label>
                                      </div>
                                    )
                                  )
                                : ""}
                            </form>
                            {/*  <button type="button" style={{ width: "84%" }} onClick={() => this.props.handleAddCardMobileSlider()} className="btn btn-block btn-default btnClsComm btnAddNewCardPayments">
                                                    Add New Card
                                                </button> */}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="col-12 manageAddressWidth mobilePad my-3 text-center">
                        <div className="row align-items-center">
                          <div className="col-12 homeAddressIconLayout px-4">
                            <img
                              src="/static/icons/TabBar/ProfileTab/Payment/Add_new.imageset/credit-card (1).png"
                              width="25"
                              height="20"
                              style={{ marginRight: "10px" }}
                            />
                            <span
                              className="homeAddressInitial"
                              onClick={() => this.handleAddCardMobile()}
                            >
                              {this.lang.AddNewCard || "Add New Card"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div
                          className="px-4 pt-4 pb-0"
                          style={{ background: "#f5f5f5" }}
                        >
                          <h5 className="payCardBtTitle">
                            {this.lang.payAmount || "Pay amount"}
                          </h5>
                          <form
                            role="form"
                            className="paymentsCardForm"
                            style={{ minHeight: "150px" }}
                          >
                            <div className="form-group">
                              <input
                                type="text"
                                placeholder={
                                  this.lang.enterAmount || "Enter Amount"
                                }
                                value={this.props.walletRechargeAmount}
                                className="form-control rechargeWalletInput"
                                onKeyDown={this.props.allowOnlyNumber}
                                onChange={this.props.setRechargeAmt}
                                id="walletAmountWithout"
                              />
                            </div>
                            {this.props.walletRechargeAmount &&
                            !this.props.defaultCard ? (
                              <p className="text-info mb-1">
                                {this.lang.pleaseSelectCard ||
                                  "Please Select the card"}
                              </p>
                            ) : (
                              ""
                            )}
                            {this.props.defaultCard ? (
                              <button
                                type="button"
                                className="btn btn-block btn-default btnClsComm btnConfirmPayPayments"
                                data-toggle="modal"
                                data-target="#confirmPayModalMobi"
                                title={
                                  this.props.walletRechargeAmount
                                    ? ""
                                    : "Amount should be greater than 0"
                                }
                                disabled={
                                  this.props.walletRechargeAmount ? false : true
                                }
                              >
                                {lang.confirmPay || "Confirm and Pay"}
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-block btn-default btnClsComm btnConfirmPayPayments"
                                title="Please select the card to recharge the wallet"
                                style={{ background: "grey" }}
                                disabled
                              >
                                {this.lang.confirmPay || "Confirm and Pay"}
                              </button>
                            )}
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="col-12 paymentsProfileSec mobile-hide"
                style={{ paddingTop: "0", background: "#fff" }}
              >
                {/* current wallet balance section - hidden temp */}
                <div className="row d-none">
                  <div className="col-12 text-center pb-4">
                    <p className="priceCardTitle">
                      {this.lang.currentCredit || "CURRENT CREDIT"}
                    </p>
                    <h1 className="priceCardBold">
                      €{" "}
                      {this.props.walletDetail
                        ? parseFloat(
                            this.props.walletDetail.walletBalance
                          ).toFixed(2)
                        : 0.0}{" "}
                    </h1>
                    <div className="">
                      <span className="limitHolder">
                        {this.lang.softLimit || "Soft limit"} :
                        <span className="limitTitle">
                          €{" "}
                          {this.props.walletDetail
                            ? parseFloat(
                                this.props.walletDetail.walletSoftLimit
                              ).toFixed(2)
                            : 0.0}
                        </span>
                      </span>
                      <span className="limitHolder">
                        {this.lang.hardLimit || "Hard limit"} :
                        <span className="limitTitle hardLimit">
                          €{" "}
                          {this.props.walletDetail
                            ? parseFloat(
                                this.props.walletDetail.walletHardLimit
                              ).toFixed(2)
                            : 0.0}
                        </span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        this.props.handleWalletHistorySlider("100%")
                      }
                      className="btn btn-md btn-primary recTransBtnBt"
                    >
                      {this.lang.recentTrasaction || "Recent Transactions"}{" "}
                    </button>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 py-4">
                    <div className="row">
                      <div className="col-md-12">
                        <div
                          className="px-4 pt-4 pb-0"
                          // style={{ background: '#f5f5f5' }}
                        >
                          <h5 className="payCardBtTitle">
                            {this.lang.payAmount || "Pay amount"}
                          </h5>
                          <form
                            role="form"
                            className="paymentsCardForm"
                            style={{ minHeight: "150px" }}
                          >
                            <div className="form-group">
                              <span
                                style={{
                                  position: "absolute",
                                  top: "7px",
                                  fontSize: "18px",
                                }}
                              >
                                {currencySymbol}
                              </span>
                              <input
                                type="text"
                                placeholder={
                                  this.lang.enterAmount || "Enter Amount"
                                }
                                value={this.props.walletRechargeAmount}
                                className="form-control rechargeWalletInput"
                                onKeyDown={this.props.allowOnlyNumber}
                                onChange={this.props.setRechargeAmt}
                                id="walletAmountWith"
                              />
                            </div>
                            {this.props.walletRechargeAmount &&
                            !this.props.defaultCard ? (
                              <p className="text-info mb-1">
                                Please Select the card
                              </p>
                            ) : (
                              ""
                            )}
                            {/* {this.props.defaultCard ? */}
                            {selectedCard ? (
                              <button
                                type="button"
                                className="btn btn-block btn-default btnClsComm btnConfirmPayPayments"
                                onClick={this.props.rechargeWallet}
                                // data-toggle="modal" data-target="#confirmPayModalMobi"
                                title={
                                  this.props.walletRechargeAmount
                                    ? ""
                                    : this.lang.amounthGret ||
                                      "Amount should be greater than 0"
                                }
                                disabled={
                                  this.props.walletRechargeAmount ? false : true
                                }
                              >
                                {this.lang.confirmPay || "Confirm and Pay"}
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-block btn-default btnClsComm btnConfirmPayPayments"
                                title={
                                  this.lang.pselectCard ||
                                  "Please select the card to recharge the wallet"
                                }
                                style={{ background: "grey" }}
                                disabled
                              >
                                {this.lang.confirmPay || "Confirm and Pay"}
                              </button>
                            )}
                          </form>
                        </div>
                      </div>

                      {this.props.customerCards &&
                      this.props.customerCards.length > 0 ? (
                        <div className="col-md-12">
                          <div
                            className="p-4"
                            // style={{ background: '#f5f5f5' }}
                          >
                            <h5 className="payCardBtTitle">
                              {this.lang.sCard ||
                                "Select Card for wallet payment"}
                            </h5>
                            <form
                              role="form"
                              className="paymentsCardForm scroller"
                              style={{ maxHeight: "180px", overflowY: "auto" }}
                            >
                              {this.props.customerCards
                                ? this.props.customerCards.map(
                                    (card, index) => (
                                      <div
                                        className="col-12 cardPaymentsBt pl-0"
                                        key={"customdateRadio" + index}
                                      >
                                        <input
                                          id={"profile-desk" + card.id}
                                          name="card_radio"
                                          onClick={() =>
                                            this.props.setDefaultCard(
                                              card.id,
                                              card
                                            )
                                          }
                                          className="customradioMedium"
                                          type="radio"
                                          style={{ cursor: "pointer" }}
                                        />

                                        <label
                                          className="col-12"
                                          style={{ cursor: "pointer" }}
                                          htmlFor={"profile-desk" + card.id}
                                        >
                                          <div className="row align-items-center">
                                            <div className="col-2 p-0">
                                              <img
                                                width="30"
                                                src={this.props.determineCardTypeImage(
                                                  card.brand
                                                )}
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
                                                          fontWeight: "400",
                                                        }}
                                                      >
                                                        {card.expMonth +
                                                          "/" +
                                                          card.expYear}
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
                                                className="fa fa-trash-o text-danger"
                                                aria-hidden="true"
                                              ></i>
                                            </div>
                                          </div>
                                        </label>
                                      </div>
                                    )
                                  )
                                : ""}
                            </form>
                          </div>
                        </div>
                      ) : (
                        <div className="col-12">
                          <div className="col-12 px-4 ">
                            <p className="addCardLine">
                              {this.lang.noCard || "You have no Cards added! "}
                              <a onClick={this.props.handleAddCardSlider}>
                                <b>{this.lang.clickHear || "Click Here"}</b>
                              </a>{" "}
                              {this.lang.addNow || "to Add Now"}
                            </p>
                            {/* <button type="button" className="btn btn-block btn-default btnClsComm btnConfirmPayPayments" onClick={this.props.rechargeWallet}>
                                                                    Add New Card
					                                        </button> */}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal */}
          <div
            className="modal fade"
            id="confirmPayModalMobi"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content p-3">
                <div className="modal-header py-0">
                  <h6 className="modal-title" id="exampleModalCenterTitle">
                    {APP_NAME}
                  </h6>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <p className="paraText">
                    {this.lang.clickOk || `Click on "Ok" to authorize`}{" "}
                    {APP_NAME}{" "}
                    {this.lang.rechargeWallate ||
                      "to recharge your wallet with"}{" "}
                    {currencySymbol}
                    {this.props.walletRechargeAmount}
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-default"
                    data-dismiss="modal"
                  >
                    {this.lang.cancell || "CANCEL"}
                  </button>
                  <button
                    type="button"
                    data-dismiss="modal"
                    className="btn btn-default okBtnConfirmPayment"
                    onClick={this.props.rechargeWallet}
                  >
                    {this.lang.ok}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Modal */}
        </LeftSlider>
      </Wrapper>
    ) : (
      ""
    );
  }
}

export default LanguageWrapper(WalletMobileSlider);
