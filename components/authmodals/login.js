import React, { useContext, useEffect, useState } from "react";
import IntlTelInput from "react-intl-tel-input";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import Wrapper from "../../hoc/wrapperHoc";
import AuthInput from "../ui/auth/input";
import Intelinput from "../ui/intelinput";
import LinearProgressBar from "../ui/linearProgress";
import CircularProgressLoader from "../ui/loaders/circularLoader";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { BASE_COLOR,GOOGLE_LOGIN_CLIENT_ID,FB_LOGIN_APP_ID } from "../../lib/envariables";
import languageContext from "../../context/languageContext";
let isPhoneValid = false;
import { getGeoInfo } from "../../lib/getip";
const LoginModal = props => {
  const context = useContext(languageContext);
  const locale = context.lang;

  let [countryCode, setCountry] = useState("");
  useEffect(() => {
    let data = getGeoInfo().then(data => {
      setCountry(data.country_code);
      
    });
  }, []);
  return (
    <Wrapper>
      <div
        className="col-lg-11"
        id="loginModalId"
        style={{ display: props.show ? "block" : "none" }}
      >
        <div className="row">
          <div className="col-12 modal-header">
            <button type="button" className="close" onClick={props.closeModal}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-7 my-lg-2">
            <h5 className="modal-title mb-2" id="loginModalLabel">
              {locale ? locale.auth.login : "login"}
            </h5>
            <div className="createAccountLayout">
              <span className="orStatic">
                {" "}
                {locale ? locale.auth.or : "or"}{" "}
              </span>
              <a
                style={{ color: BASE_COLOR }}
                className="createAccountStatic"
                onClick={props.showSignupHandler}
              >
                {" "}
                {locale ? locale.auth.createAcc : "create an account"}
              </a>
            </div>
          </div>
          <div className="col-5 text-center">
            <img
              src="/static/images/aaaaaaaaa3.png"
              className="img-fluid"
              width="60"
              alt="groceries bags"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-12 modal-body">
            <form onSubmit={props.handleLoginSubmit} className="loginForm">
                {/* phone number with contry code  */}
              <div className="col-12 p-0 float-left">
                <div className="outline-box p-0">
                  <div className="col-12">
                    <PhoneInput
                      country={countryCode || ""}
                      placeholder={
                        locale
                          ? locale.auth.entPhoneNumber
                          : "Enter phone number"
                      }
                      value={props.loginPhone}
                      onChange={props.updateLoginPhone}
                      id="loginPhone"
                      // onBlur={props.checkPhone}
                      error={
                        props.loginPhone && props.loginPhone.length > 0
                          ? isValidPhoneNumber(props.loginPhone)
                            ? ((isPhoneValid = true), undefined)
                            : ((isPhoneValid = false),
                              locale
                                ? locale.auth.invalidPhoneMsg
                                : "Invalid phone number")
                          : ""
                      }
                    />
                  </div>
                
                </div>
              </div>
                 {/* password */}
              {isPhoneValid && !props.phoneNotAvailable ? (
                <div className="col-12 p-0">
                  <div className="outline-box">
                    <AuthInput
                      type="password"
                      label={locale ? locale.auth.pwd : "Password"}
                      name="password"
                      id="loginPassword"
                      value={props.loginPassword}
                      onChange={props.updateLoginPassword}
                    />
                    <a
                      className="colorAnch loginForgetAndShowLink"
                      id="loginForgetLink"
                      onClick={props.showForgotPasswordHandler.bind(
                        this,
                        isPhoneValid
                      )}
                    >
                      {locale ? locale.auth.forgot : "forgot?"}
                    </a>
                  </div>
                </div>
              ) : (
                ""
              )}
              {props.loginPhone && isPhoneValid ? (
                <button type="submit" className="btn loginAndSignUpButton">
                  {locale ? locale.auth.login : "login"}
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn loginAndSignUpButton"
                  title={
                    locale
                      ? locale.auth.validFldMsg
                      : "Please Enter Valid Email and Password"
                  }
                  style={{ backgroundColor: "grey" }}
                  disabled
                >
                  {locale ? locale.auth.login : "login"}
                </button>
              )}
              <LinearProgressBar error={props.error} loading={props.loading} />

              {/* {props.loading ? <CircularProgressLoader /> : ''} */}
            </form>
          </div>
        </div>
        {/* social media login google and fb */}
        <div className="">
          <GoogleLogin
            clientId={GOOGLE_LOGIN_CLIENT_ID}
            buttonText={locale.SignInWithGoogle}
            onSuccess={props.responseGoogle}
            onFailure={props.responseGoogle}
            cookiePolicy={"single_host_origin"}
            className="loginWithGoogle"
          />
          <FacebookLogin
            appId={FB_LOGIN_APP_ID}
            autoLoad={false}
            fields="name,email,picture"
            disableMobileRedirect={true}
            callback={props.responseFacebook}
            textButton={
              <p style={{ display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "500",color:"white" }}>
                <i className="fa fa-facebook mr-2" style={{ color: "white" }} /> {locale? locale.LoginWithFacebook :"Login With Facebook"}
              </p>
            }
            cssClass={"loginWithFB"}
          />
        </div>
      </div>
    </Wrapper>
  );
};

export default LoginModal;
