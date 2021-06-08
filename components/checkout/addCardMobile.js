import React from "react";
import { Component } from "react";
import Link from "next/link";
import Moment from "react-moment";
import $ from "jquery";
import {appConfig} from "../../services/auth"
import Wrapper from "../../hoc/wrapperHoc";
import LeftSlider from "../ui/sliders/leftSlider";
import { CreditlyMobi } from "../../lib/validation";
import { addCard } from "../../services/cart";
import LinearProgress from "../ui/linearProgress";
import LanguageWrapper from "../../hoc/language";
class AddCardLeftSliderMobile extends Component {
  lang = this.props.lang;
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
    returnURL: "",
    readyToRender: false,

    cardNum: "",
    cardExp: "",
    cardCvc: ""
  };

  stripe;

  constructor(props) {
    super(props);
    this.handleLeftSliderOpen = this.handleLeftSliderOpen.bind(this);
    this.allowOnlyNumber = this.allowOnlyNumber.bind(this);
  }

  handleLeftSliderOpen = () => {
    this.CouponLeftSliderRef.handleLeftSliderToggle();
    document.getElementById("inputCardNumMobi").reset();

    setTimeout(() => {
      this.setControlFocus("cardNumMobi");
    }, 1000);
  };
  // to focus card number input filled 
  setControlFocus = id => {
    document.getElementById(id) ? document.getElementById(id).focus() : "";
  };

  handleClose = () => this.CouponLeftSliderRef.handleLeftSliderClose();
  closeSlider = () => {};
  componentDidMount() {
    this.props.onRef(this);
    this.setState({ readyToRender: true });
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
        // mpsreturnurl:this.state.returnURL,
        // mpscancelurl:this.state.returnURL
      };

      // $('#myPay').MOLPaySeamless(options)
    });
// to validate the input filleds
    $(document).ready(() => {
      // this.setState({ returnURL: location.href })
      $(() => {
        var creditly = CreditlyMobi.initialize(
          ".expiration-month-and-year-mobi",
          ".credit-card-number-mobi",
          ".security-code-mobi",
          ".card-type-mobi",
          ".card-avtar-mobi"
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
              error: this.lang.pleaseFill || "Please fill details correctly!"
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
  clearError = () => {
    this.setState({ error: "" });
  };
// to create token
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
                  error: this.lang.failTo || " Failed to Add Card ! "
                })
              : (this.props.getCustomerCards(), this.handleClose());
            this.setState({ loading: false });
          });
        }
      }
    );
  }
// allow only number 
  allowOnlyNumber = (e, name) => {
    const re = /[0-9]+/g;

    if (name == "cardNum") {
      let cardNum = e.target.value.replace(/ /g, "");

      if (re.test(e.target.value) && cardNum.length <= 16) {
        switch (e.target.value.length) {
          default:
            this.setState({ [name]: e.target.value });
            break;
          case 4:
            let case4 = e.target.value;

            if (this.state.cardNum.charAt(4) == " ") {
              case4 = e.target.value;
            } else {
              case4 += " ";
            }
            this.setState({ [name]: case4 });
            break;
          case 9:
            let case8 = e.target.value;
            if (this.state.cardNum.charAt(9) == " ") {
              case8 = e.target.value;
            } else {
              case8 += " ";
            }
            this.setState({ [name]: case8 });
            break;
          case 14:
            let case12 = e.target.value;
            if (this.state.cardNum.charAt(14) == " ") {
              case12 = e.target.value;
            } else {
              case12 += " ";
            }
            this.setState({ [name]: case12 });
            break;
          case 19:
            let case16 = e.target.value;
            if (this.state.cardNum.charAt(19) == " ") {
              case16 = e.target.value;
            } else {
              case16 += " ";
            }
            this.setState({ [name]: case16 });
            break;
        }
      } else if (e.target.value === "") {
        this.setState({ [name]: e.target.value });
      }
    } else if (name == "cardExp") {
      if (
        (e.target.value === "" || re.test(e.target.value)) &&
        e.target.value.length <= 7
      ) {
        if (e.target.value.length === 2) {
          let thisVal = e.target.value;
          if (this.state.cardExp.includes("/")) {
            thisVal = thisVal.split("/").join("");
          } else {
            thisVal += "/";
          }
          this.setState({ [name]: thisVal });
        } else {
          this.setState({ [name]: e.target.value });
        }
      }
    } else if (name == "cardCvc") {
      if (
        (e.target.value === "" || re.test(e.target.value)) &&
        e.target.value.length <= 5
      ) {
        this.setState({ [name]: e.target.value });
      }
    }
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
    return this.state.readyToRender ? (
      <Wrapper>
        <LeftSlider
          onRef={ref => (this.CouponLeftSliderRef = ref)}
          width={this.props.width}
          handleClose={this.closeSlider}
          drawerTitle={this.lang.addCard || "Add Card"}
        >
          <div className="col-12 py-3 addCardSection mobile-show">
            {/*  */}
            <div className="row justify-content-center">
              <div className="col-11 my-4">
                {/* <h5 className="addCardH5Title">Enter your card details</h5>
                                    <p className="addCardPTitle">Card Details will be saved securely, based of the industry standard</p> */}
                <form className="creditly-card-form" id="inputCardNumMobi">
                  {/* card number input filled  */}
                  <div className="form-group">
                    <input
                      type="text"
                      onFocus={this.clearError}
                      value={this.state.cardNum}
                      onKeyPress={e => this.allowOnlyNumber(e, "cardNum")}
                      onChange={e => this.allowOnlyNumber(e, "cardNum")}
                      className="form-control credit-card-number-mobi"
                      id="cardNumMobi"
                      placeholder={
                        this.lang.cardNo || "Enter your 15/16 digit card no."
                      }
                    />
                    <div className="card-type-image">
                      <img
                        className="card-avtar-mobi"
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
                        value={this.state.cardExp}
                        onKeyPress={e => this.allowOnlyNumber(e, "cardExp")}
                        onChange={e => this.allowOnlyNumber(e, "cardExp")}
                        className="form-control expiration-month-and-year-mobi"
                        id="inputEmail4"
                        placeholder={
                          this.lang.validymonth || "Valid through (MM/YY)"
                        }
                        autoComplete="off"
                      />
                    </div>
                    {/* cvv */}
                    <div className="form-group col-4">
                      <input
                        type="password"
                        onFocus={this.clearError}
                        value={this.state.cardCvc}
                        onKeyPress={e => this.allowOnlyNumber(e, "cardCvc")}
                        onChange={e => this.allowOnlyNumber(e, "cardCvc")}
                        className="form-control security-code-mobi"
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
                    {this.lang.addCardC || "ADD CARD"}
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
    ) : (
      ""
    );
  }
}

export default LanguageWrapper(AddCardLeftSliderMobile);
