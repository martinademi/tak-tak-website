import React, { useContext, useEffect, useState } from "react";
import IntlTelInput from "react-intl-tel-input";
import LinearProgressBar from "../ui/linearProgress";
import Wrapper from "../../hoc/wrapperHoc";
import AuthInput from "../ui/auth/input";
import Intelinput from "../ui/intelinput";
import CircularProgressLoader from "../ui/loaders/circularLoader";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { BASE_COLOR } from "../../lib/envariables";
import LangContext from "../../context/languageContext";
import { getGeoInfo } from "../../lib/getip";

let isPhoneValid = false;

const ForgetPasswordModal = props => {
  let { lang } = useContext(LangContext);
  let [countryCode, setCountry] = useState([0]);
  useEffect(() => {
    let data = getGeoInfo().then(data => {
      setCountry(data.country_code);
     
    });
  }, []);
  return (
    <Wrapper>
      <div
        className="col-lg-11"
        id="forgotModalId"
        style={{ display: props.show ? "block" : "none" }}
      >
        <div className="row">
          <div className="col-12 modal-header">
            <button
              type="button"
              onClick={props.showLoginHandler}
              className="close"
            >
              {/* <i className="fa fa-long-arrow-left"></i> */}
              <img
                src="../static/images/backArrowAuthModal.png"
                className=""
                width="20"
                height="20"
                alt="backArrowAuthModal"
              />
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-7 my-lg-2">
            <h5 className="modal-title mb-2" id="loginModalLabel">
              {lang.forgotPassword || " Forgot password"}
            </h5>

            {props.resetEnable == false ? (
              <div>
                <p className="termsAndConditionsSignUpModalText">
                  {lang.verificationCode ||
                    "Please enter the verification code sent to"}{" "}
                  {props.loginPhone}
                </p>
                <div className="createAccountLayout">
                  <span className="orStatic">or </span>
                  <a
                    style={{ color: BASE_COLOR }}
                    className="createAccountStatic"
                    onClick={props.showLoginHandler}
                  >
                    {lang.loginToAcc || "login to your account"}
                  </a>
                </div>
              </div>
            ) : (
              <p className="termsAndConditionsSignUpModalText">
                {lang.enterNewPassword || "Please enter the New Password"}
              </p>
            )}
          </div>
          <div className="col-5">
            <img
              src="/static/images/loginRoll.png"
              className="img-fluid"
              width="100"
              height="100"
              alt="loginRoll"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-12 modal-body">
            {props.resetEnable == false ? (
              <form className="otpform">
                <div className="col-12 p-0 float-left">
                  <div className="outline-box p-0">
                    <div className="col-12">
                      <PhoneInput
                        disabled={true}
                        country={countryCode || ""}
                        placeholder={
                          lang.entPhoneNumber || "Enter phone number"
                        }
                        value={props.loginPhone}
                        onChange={props.updateLoginPhone}
                        error={
                          props.loginPhone && props.loginPhone.length > 0
                            ? isValidPhoneNumber(props.loginPhone)
                              ? ((isPhoneValid = true), undefined)
                              : ((isPhoneValid = false),
                                lang.invalidPhoneMsg || "Invalid phone number")
                            : ""
                        }
                      />
                    </div>
                    {/* <div className="col-3 p-0 float-left">
                                          <Intelinput id="forget-intel-input" /> 
                                      </div>
                                      <div className="col-9 px-2 float-left">
                                          <AuthInput
                                              type="text"
                                              label="Phone number"
                                              id="forgotMobileNumber"
                                              value={props.loginPhone}
                                          />
                                      </div> */}
                  </div>
                </div>
                <div className="col-12 p-0">
                  <div className="outline-box">
                    <AuthInput
                      type="number"
                      label={lang.oneTimePassword || "One time password"}
                      id="forgotPassword"
                      value={props.otp}
                      onChange={props.otpHandler}
                      otp={true}
                    />
                  </div>
                </div>
                <a
                  className="btn  form-control loginAndSignUpButton"
                  onClick={props.verifyForgotPasswordOtp}
                >
                  {lang.verify || "VERIFY AND PROCEED"}
                </a>
                <LinearProgressBar
                  error={props.error}
                  loading={props.loading}
                />
              </form>
            ) : (
              <form className="resetForm">
                <div className="col-12 p-0 float-left">
                  <div className="outline-box">
                    <AuthInput
                      type="password"
                      label={lang.newPass || "New Password"}
                      id="newpassword"
                      value={props.newPassword}
                      onChange={props.updateNewPassword}
                    />
                  </div>
                </div>
                <div className="col-12 p-0 float-left">
                  <div className="outline-box">
                    <AuthInput
                      type="password"
                      label={lang.confirmPass || "Confirm Password"}
                      id="confirmPassword"
                      value={props.confirmPassword}
                      onChange={props.updateConfirmPassword}
                    />
                  </div>
                </div>
                <a
                  className="btn  form-control loginAndSignUpButton"
                  onClick={props.resetPasswordHandler}
                >
                  {lang.resetPass || "Reset Password"}
                </a>
                <LinearProgressBar
                  error={props.error}
                  loading={props.loading}
                />

                {props.loading ? <CircularProgressLoader /> : ""}
              </form>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
export default ForgetPasswordModal;
