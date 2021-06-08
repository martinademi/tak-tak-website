import React from "react";
import { Component } from "react";
import Link from "next/link";
import Moment from "react-moment";
import $ from "jquery";
import * as moment from "moment";

import Wrapper from "../../hoc/wrapperHoc";
import LeftSlider from "../ui/sliders/leftSlider";
import { Creditly } from "../../lib/validation";
import { addCard } from "../../services/cart";
import LinearProgress from "../ui/linearProgress";
import LanguageWrapper from "../../hoc/language";
class WalletHistorySlider extends Component {
  state = {
    SliderWidth: 0,
    open: true,
    loading: false,
    error: null
  };

  constructor(props) {
    super(props);
    this.handleLeftSliderOpen = this.handleLeftSliderOpen.bind(this);
  }

  handleLeftSliderOpen = () =>
    this.CouponLeftSliderRef.handleLeftSliderToggle();
  handleClose = () => this.CouponLeftSliderRef.handleLeftSliderClose();
  closeSlider = () => {};
  componentDidMount() {
    this.props.onRef(this);
  }

  render() {
    let { lang } = this.props;
    return (
      <Wrapper>
        <LeftSlider
          onRef={ref => (this.CouponLeftSliderRef = ref)}
          width={this.props.width}
          handleClose={this.closeSlider}
          drawerTitle="Payments"
        >
          <div
            className="col-12 addCardSection"
            style={{ background: "#fff", borderBottom: "1px solid #e5e5e5" }}
          >
            {/*  */}
            <div className="row justify-content-center">
              <div className="col-12 walletHistory">
                {/* <!-- Nav pills --> */}
                <ul className="nav nav-pills">
                  <li className="nav-item">
                    <a
                      className="nav-link active"
                      data-toggle="pill"
                      href="#All"
                    >
                      {lang.all || "All"}
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" data-toggle="pill" href="#Debit">
                      {lang.debit || "Debit"}
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" data-toggle="pill" href="#Credit">
                      {lang.credit || "Credit"}
                    </a>
                  </li>
                </ul>

                {/* <!-- Tab panes --> */}
                <div className="tab-content">
                  <div className="tab-pane container active" id="All">
                    {this.props.walletHistory &&
                    this.props.walletHistory.creditDebitTransctions &&
                    this.props.walletHistory.creditDebitTransctions.length >
                      0 ? (
                      this.props.walletHistory.creditDebitTransctions.map(
                        transData => (
                          // parseFloat(transData.amount).toFixed(2) > 0 ?
                          <div className="row my-1">
                            <div className="col-12 py-2">
                              <p className="walletTransId">
                                <span>Trans ID:</span>
                                <span>{transData.txnId}</span>
                              </p>
                              <p className="walletBookingId">
                                <span>{lang.bookingId || "Booking ID"}:</span>
                                <span>
                                  {transData.bookingId
                                    ? transData.bookingId
                                    : "N/A"}
                                </span>
                              </p>
                            </div>
                            <hr />
                            <div className="col-12">
                              <div className="row">
                                <div className="col-2">
                                  <i className="fa fa-arrow-down walletDownArrow"></i>
                                </div>
                                <div className="col-6">
                                  <p className="walletTransName">
                                    {transData.trigger}
                                  </p>
                                  <p className="walletTransDate">
                                    {moment
                                      .unix(transData.txnDate)
                                      .format("DD-MM-YYYY HH:mm:a")}
                                  </p>
                                </div>
                                <div className="col-4 text-right">
                                  <p className="walletTransAmt">
                                    {transData.currencySymbol || "€"}{" "}
                                    {parseFloat(transData.amount).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                        // : ''
                      )
                    ) : (
                      <div className="col-12 my-3">
                        <p className="text-center">
                          {lang.noTransaction || "No Transactions Available"}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="tab-pane container fade" id="Debit">
                    {this.props.walletHistory &&
                    this.props.walletHistory.debitTransctions &&
                    this.props.walletHistory.debitTransctions.length > 0 ? (
                      this.props.walletHistory.debitTransctions.map(
                        transData => (
                          <div className="row my-1">
                            <div className="col-12 py-2">
                              <p className="walletTransId">
                                <span>{lang.transId || "Trans ID"}:</span>
                                <span>{transData.txnId}</span>
                              </p>
                              <p className="walletBookingId">
                                <span>{lang.bookingId || "Booking ID"}:</span>
                                <span>
                                  {transData.bookingId
                                    ? transData.bookingId
                                    : "N/A"}
                                </span>
                              </p>
                            </div>
                            <hr />
                            <div className="col-12">
                              <div className="row">
                                <div className="col-2">
                                  <i className="fa fa-arrow-down walletDownArrow"></i>
                                </div>
                                <div className="col-6">
                                  <p className="walletTransName">
                                    {transData.trigger}
                                  </p>
                                  <p className="walletTransDate">
                                    {moment
                                      .unix(transData.txnDate)
                                      .format("DD-MM-YYYY HH:mm:a")}
                                  </p>
                                </div>
                                <div className="col-4 text-right">
                                  <p className="walletTransAmt">
                                    {transData.currencySymbol || "€"}{" "}
                                    {parseFloat(transData.amount).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <div className="col-12 my-3">
                        <p className="text-center">No Transactions Available</p>
                      </div>
                    )}
                  </div>
                  <div className="tab-pane container fade" id="Credit">
                    {this.props.walletHistory &&
                    this.props.walletHistory.creditTransctions &&
                    this.props.walletHistory.creditTransctions.length > 0 ? (
                      this.props.walletHistory.creditTransctions.map(
                        transData => (
                          <div className="row my-1">
                            <div className="col-12 py-2">
                              <p className="walletTransId">
                                <span>{lang.transId || "Trans ID"}:</span>
                                <span>{transData.txnId}</span>
                              </p>
                              <p className="walletBookingId">
                                <span>{lang.bookingId || "Booking ID"}:</span>
                                <span>
                                  {transData.bookingId
                                    ? transData.bookingId
                                    : "N/A"}
                                </span>
                              </p>
                            </div>
                            <hr />
                            <div className="col-12">
                              <div className="row">
                                <div className="col-2">
                                  <i className="fa fa-arrow-down walletDownArrow"></i>
                                </div>
                                <div className="col-6">
                                  <p className="walletTransName">
                                    {transData.trigger}
                                  </p>
                                  <p className="walletTransDate">
                                    {moment
                                      .unix(transData.txnDate)
                                      .format("DD-MM-YYYY HH:mm:a")}
                                  </p>
                                </div>
                                <div className="col-4 text-right">
                                  <p className="walletTransAmt">
                                    {transData.currencySymbol || "€"}{" "}
                                    {parseFloat(transData.amount).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <div className="col-12 my-3">
                        <p className="text-center">{lang.noTransaction||"No Transactions Available"}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="my-2">
                  <LinearProgress
                    error={this.state.error}
                    loading={this.state.loading}
                  />
                </div>
                {/* <button type="button" id="myPay" className="btn btn-primary btn-lg" data-toggle="molpayseamless" data-mpsmerchantid="molpaymerchant" data-mpschannel="maybank2u" data-mpsamount="1.20" data-mpsorderid="TEST1139669863" data-mpsbill_name="MOLPay Technical" >Pay by Maybank2u</button> */}
              </div>
            </div>
          </div>
        </LeftSlider>
      </Wrapper>
    );
  }
}

export default LanguageWrapper(WalletHistorySlider);
