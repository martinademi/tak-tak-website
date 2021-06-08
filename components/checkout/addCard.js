import React from "react";
import { Component } from "react";
import Link from "next/link";
import Moment from "react-moment";
import $ from "jquery";

import Wrapper from "../../hoc/wrapperHoc";
import LeftSlider from "../ui/sliders/leftSlider";
import { Creditly } from "../../lib/validation";
import { addCard } from "../../services/cart";
import {appConfig} from "../../services/auth"
import LinearProgress from "../ui/linearProgress";
import LanguageWrapper from "../../hoc/language";
class AddCardLeftSlider extends Component {
  state = {
    SliderWidth: 0,
    open: true,
    loading: false,
    error: null,

    settings: {
      merchantID: "molpaytech",
      orderID: "DEMO1045",
      amount: 1.1,
      bill_name: "MOLPay demo",
      bill_email: "satya@mobifyi.com",
      bill_mobile: "+919036445233",
      bill_desc: "testing by MOLPay",
      country: "MY",
      returnURL: "processing.php",
      vcode: "3d54cff83b89c5875fa9b86a166010ba",
      cur: "MYR",
      langcode: "en"
    },
    conf: {
      min_amount: 1.1,
      molpay_url: "https://www.onlinepayment.com.my/MOLPay/pay/"
    },
    returnURL: ""
  };

  stripe;

  constructor(props) {
    super(props);
    this.handleLeftSliderOpen = this.handleLeftSliderOpen.bind(this);
  }

  handleLeftSliderOpen = () => {
    this.CouponLeftSliderRef.handleLeftSliderToggle();
    document.getElementById("cardFormDesk").reset();
    setTimeout(() => {
      this.setControlFocus("inputCardNumDesk");
    }, 1000);
  };
  handleClose = () => {
    this.CouponLeftSliderRef.handleLeftSliderClose();
    this.setState({ error: "", loading: false });
  };
  closeSlider = () => {};
// to focus the card number input 
  setControlFocus = id => {
    document.getElementById(id).focus();
  };

  componentDidMount() {
    this.props.onRef(this);

    $(document).ready(function() {
      var options = {
        mp_username: "api_SB_5canale",
        mp_password: "api_ozpG197c",
        mp_merchant_ID: "SB_5canale",
        mp_app_name: "5canale",
        mp_verification_key: "3d54cff83b89c5875fa9b86a166010ba",
        mp_amount: "1.10",
        mp_order_ID: "orderid123",
        mp_currency: "MYR",
        mp_country: "MY",
        mp_channel: "multi",
        mp_bill_description: "billdesc",
        mp_bill_name: "billname",
        mp_bill_email: "satya@mobifyi.com",
        mp_bill_mobile: "9036445233"
      };
    });
// to validate the card filleds
    $(document).ready(() => {
      $(() => {
        var creditly = Creditly.initialize(
          ".expiration-month-and-year",
          ".credit-card-number",
          ".security-code",
          ".card-type",
          ".card-avtar"
        );

        $(".creditly-card-form .submit").click(e => {
          e.preventDefault();

          var output = creditly.validate();

          this.setState({ loading: true });
          if (output) {
            // Your validated credit card output

            this.addCard(output);
          } else {
            this.setState({
              loading: false,
              error: "Please fill details correctly!"
            });
          }
        });
      });

      // Stripe.setPublishableKey('pk_test_sp0gbTEyinY0KYOo4e3Jw0sM');
      // Stripe.setPublishableKey('pk_test_IBYk0hnidox7CDA3doY6KQGi')
      appConfig().then(data =>{
        this.setState({configData:data.data.data},()=>this.stripeHandler())
      })
      
    });

  }
  // stripe key 
stripeHandler=()=>{
  Stripe.setPublishableKey(`${this.state.configData&&this.state.configData.stripeKey}`);
}
// create token 
  addCard(result) {
    Stripe.card.createToken(
      {
        number: result.number,
        cvc: result.security_code,
        exp_month: result.expiration_month,
        exp_year: result.expiration_year
      },
      (status, response) => {
        if (response.error) {
          // Problem!
          this.setState({ loading: false, error: response.error.message });
        } else {
          // Token was created!

          // Get the token ID:
          var token = response.id;

          let cardData = {
            email: this.props.userProfile ? this.props.userProfile.email : "",
            cardToken: token
          };
// to add card 
          addCard(cardData).then(data => {
            data.error
              ? this.setState({
                  error: " Failed to Add Card ! ",
                  loading: false
                })
              : (this.props.getCustomerCards(),
                this.handleClose(),
                this.setState({ loading: false }),
                setTimeout(() => {
                  $(".creditly-card-form")
                    .find("input[type=text], textarea")
                    .val("");
                  $("#inputEmail4").val("");
                  $("#inputPassword4").val("");
                  $(".expiration-month-and-year").val("");
                  $(".credit-card-number").val("");
                  $(".security-code").val("");
                  $(".security-code").val("");
                }, 500));
          });
        }
      }
    );
  }

  clearError = () => {
    this.setState({ error: "" });
  };
  stripeResponseHandler(status, response) {
    if (response.error) {
      // Problem!
      this.setState({ loading: false, error: response.error.message });
    } else {
      // Token was created!

      // Get the token ID:
      var token = response.id;
    }
  }

  render() {

    let lang = this.props.lang;
    return (
      <Wrapper>
        <LeftSlider
          onRef={ref => (this.CouponLeftSliderRef = ref)}
          width={this.props.width}
          handleClose={this.closeSlider}
          drawerTitle={lang.addCard || "Add Card"}
        >
          <div
            className="col-12 py-3 addCardSection mobile-hide"
            style={{ background: "#fff", borderBottom: "1px solid #e5e5e5" }}
          >
            {/*  */}
            <div className="row justify-content-center">
              <div className="col-11 my-4">
                {/* <h5 className="addCardH5Title">Enter your card details</h5>
                                <p className="addCardPTitle">Card Details will be saved securely, based of the industry standard</p> */}
                <form
                  className="creditly-card-form"
                  id="cardFormDesk"
                  autoComplete="off"
                  autocomplete="off"
                >
                   {/* credit-card-number */}
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control credit-card-number"
                      id="inputCardNumDesk"
                      onFocus={this.clearError}
                      placeholder={
                        lang.cardNo || "Enter your 15/16 digit card no."
                      }
                    />
                    <div className="card-type-image">
                      <img
                        className="card-avtar"
                        src="/static/images/cc-icon.png"
                      ></img>
                    </div>
                  </div>
                  {/* expiration-month-and-year */}
                  <div className="form-row">
                    <div className="form-group col-8">
                      <input
                        type="email"
                        onFocus={this.clearError}
                        className="form-control expiration-month-and-year"
                        id="inputEmail4"
                        placeholder={
                          lang.validymonth || "Valid through (MM/YY)"
                        }
                        autocomplete="off"
                        autoComplete="off"
                      />
                    </div>
                    {/* cvv */}
                    <div className="form-group col-4">
                      <input
                        type="password"
                        onFocus={this.clearError}
                        autoComplete="off"
                        autocomplete={"off"}
                        className="form-control security-code"
                        id="inputPassword4"
                        placeholder="CVV"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                   {/* submit button */}
                  <button
                    type="submit"
                    disabled={this.state.loading}
                    className="btn btn-default submit w-100 addCardBtn"
                  >
                    {lang.addCardC || "ADD CARD"}
                  </button>
                </form>

                <div className="my-2">
                  <LinearProgress
                    error={this.state.error}
                    loading={this.state.loading}
                  />
                </div>
                {/* <button type="button" id="myPay" class="btn btn-primary btn-lg" data-toggle="molpayseamless" data-mpsmerchantid="molpaymerchant" data-mpschannel="maybank2u" data-mpsamount="1.20" data-mpsorderid="TEST1139669863" data-mpsbill_name="MOLPay Technical" >Pay by Maybank2u</button> */}
              </div>
            </div>
          </div>
        </LeftSlider>
      </Wrapper>
    );
  }
}

export default LanguageWrapper(AddCardLeftSlider);
