import Wrapper from "../../hoc/wrapperHoc";
import AuthInput from "../ui/auth/input";
import Intelinput from "../ui/intelinput";
import LinearProgressBar from "../ui/linearProgress";
import LocationSearchInput from "../location/map";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import "../../assets/storeList.scss";
import Swiches from "../../components/swich/swich";
let isPhoneValid = false;
import React, { useState, useEffect } from "react";
import { symbal, WHITE_BASE_COLOR } from "../../lib/envariables";
import RadioButton from "./radio-button";
import CheckBoxButton from "./checkbox-button";
const StoreDetailInPuts = (props) => {
  let initialState = {
    countryCode: "",
    phoneNo: "",
    valid: true,
  };
  const [state, setstate] = useState(initialState);

  const [BusinessPhoneNo, setNumber] = useState({
    countryCode: "",
    phoneNo: "",
    valid: true,
  });
  const [focus, setFocus] = useState({});
  const [inputValue, setInputValue] = useState({});
// update login phone
  const updateLoginPhone = (phone) => {
    const phoneNumber = phone
      ? parsePhoneNumberFromString(phone.toString())
      : "";
    const countryIntl = phoneNumber ? phoneNumber.country : "IN";
    const re = /[0-9]+/g;
   
    let valid = isValidPhoneNumber(phone);
    // if ((e.target.value === '' || re.test(e.target.value)) && e.target.value.length <= 10) {
    setstate({
      phoneNo: phone,
      cc: phoneNumber ? "+" + phoneNumber.countryCallingCode : "+91",
      lgPhone: phoneNumber ? phoneNumber.nationalNumber : "",
      countryIntl: countryIntl,
      valid: valid,
    });
    let e = {
      target: {
        value: phoneNumber ? "+" + phoneNumber.countryCallingCode : "+91",
      },
    };
    props.updateForm(e, "countryCode");
    e = {
      target: {
        value: phoneNumber ? phoneNumber.nationalNumber : "",
      },
    };

    props.updateForm(e, "ownerPhone");
    let inputObject = { ...inputValue };

    inputObject["ownerPhone"] = {
      phoneNo: phoneNumber ? "+" + phoneNumber.countryCallingCode : "+91",
      countryIntl: phoneNumber ? phoneNumber.nationalNumber : "",
    };
    setInputValue(inputObject);
    // ownerPhone
    // countryId
    // }
  };

  const updateLoginPhone1 = (phone) => {
    const phoneNumber = phone
      ? parsePhoneNumberFromString(phone.toString())
      : "";
    const countryIntl = phoneNumber ? phoneNumber.country : "IN";
    const re = /[0-9]+/g;
   
    // if ((e.target.value === '' || re.test(e.target.value)) && e.target.value.length <= 10) {
    setNumber({
      phoneNo: phone,
      cc: phoneNumber ? "+" + phoneNumber.countryCallingCode : "+91",
      lgPhone: phoneNumber ? phoneNumber.nationalNumber : "",
      countryIntl: countryIntl,
      valid: isValidPhoneNumber(phone),
    });
    let e = {
      target: {
        value: phoneNumber ? "+" + phoneNumber.countryCallingCode : "+91",
      },
    };
    // props.updateForm(e, "countryCode");
    e = {
      target: {
        value: phoneNumber ? phoneNumber.nationalNumber : "",
      },
    };

    setInputValue(inputObject);
    let inputObject = { ...inputValue };
    inputObject["BusinessPhoneNo"] = {
      countryIntl: phoneNumber ? "+" + phoneNumber.countryCallingCode : "+91",
      phoneNo: phoneNumber ? phoneNumber.nationalNumber : "",
    };
    setInputValue(inputObject);
    // props.updateForm(e, "ownerPhone");

    // ownerPhone
    // countryId
    // }
  };
// handle address
  const handlerAddress = (data) => {
    let focusObject = { ...focus };
    focusObject["address"] = true;
    let inputObject = { ...inputValue };
    inputObject["address"] = data.address;
    setFocus(focusObject);
    setInputValue(inputObject);
    props.updateLocation(data);
    setTimeout(() => {
     
    }, 1000);
  };

  const onInputHandler = (e) => {
    let focusObject = { ...focus };
    focusObject[e.target.name] = true;
    let inputObject = { ...inputValue };
    inputObject[e.target.name] = e.target.value;
    setFocus(focusObject);
    setInputValue(inputObject);

    setTimeout(() => {
     
    }, 1000);
  };
  function validateNumber(event) {
    var key = window.event ? event.keyCode : event.which;
    if (event.keyCode === 8 || event.keyCode === 46) {
      return true;
    } else if (key < 48 || key > 57) {
      return false;
    } else {
      return true;
    }
  }

  useEffect(() => {
    $("[type=number]").keypress(validateNumber);
  }, []);
// handle file select
  const onFileSelect = (e) => {
   

    let focusObject = { ...focus };
    focusObject[e.target.name] = true;
    let inputObject = { ...inputValue };
    inputObject[e.target.name] = e.target.files[0];
    setFocus(focusObject);
    setInputValue(inputObject);

    setTimeout(() => {
   
    }, 1000);
  };

  const onCheckBoxHanlder = (e) => {
    

    let target = e.target;
    let check = false;
    if (target.checked) {
      target.removeAttribute("checked");
      target.parentNode.style.textDecoration = "";
      check = true;
    } else {
      target.setAttribute("checked", true);
      target.parentNode.style.textDecoration = "line-through";
      check = false;
    }

    let focusObject = { ...focus };
    focusObject[e.target.name] = true;
    let inputObject = { ...inputValue };

    inputObject[e.target.name] = check;
    setFocus(focusObject);
    setInputValue(inputObject);
  };

  return (
    <Wrapper>
      <div className="col store-details">
        <div className="row">
          <div className="col-12 mt-3">
            <div className="row">
              <div
                className="col-12 d-flex align-items-center"
                style={{ height: "60px" }}
              >
                <h5 className="registerStoreFormH5Title">GENERAL SETTINGS</h5>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <label className="mr-2">
                  PROFILE IMAGES
                  <span style={{ color: "#00cec5" }}>
                    {" "}
                    <sup>*</sup>{" "}
                  </span>
                </label>
                <div className="outline-box">
                  {/* <AuthInput
                    type="text"
                    label="Name*"
                    name="storename"
                    id="storename"
                    dynamic={true}
                    onChange={props.updateForm}
                    value={props.state.storeName}
                    dynamicValue={"storeName"}
                  /> */}
                  <div className="form-group mt-3">
                    <input
                      onChange={onFileSelect}
                      type="file"
                      name="profileImage"
                    />
                  </div>
                </div>
              </div>
              <div className="col-12">
                <label className="mr-2 mt-3">
                  BANNER IMAGES
                  <span style={{ color: "#00cec5" }}>
                    {" "}
                    <sup>*</sup>{" "}
                  </span>
                </label>
                <div className="outline-box">
                  {/* <AuthInput
                    type="text"
                    label="Name*"
                    name="storename"
                    id="storename"
                    dynamic={true}
                    onChange={props.updateForm}
                    value={props.state.storeName}
                    dynamicValue={"storeName"}
                  /> */}
                  <div className="form-group mt-3">
                    <input
                      onChange={onFileSelect}
                      type="file"
                      name="bannerImage"
                    />
                  </div>
                </div>
              </div>
              <div className="col-12">
                <label className="mr-2 mt-3">
                  STORE NAME
                  <span style={{ color: "#00cec5" }}>
                    {" "}
                    <sup>*</sup>{" "}
                  </span>
                </label>
                <div className="outline-box">
                  {/* <AuthInput
                    type="text"
                    label="Name*"
                    name="storename"
                    id="storename"
                    dynamic={true}
                    onChange={props.updateForm}
                    value={props.state.storeName}
                    dynamicValue={"storeName"}
                  /> */}
                  <div className="form-group mt-3">
                    <input
                      mendatory="true"
                      onChange={onInputHandler.bind(true)}
                      type="text"
                      name="storeName"
                      className="input_container"
                      placeholder="Enter Store Name"
                    />
                  </div>
                </div>
                {!inputValue.storeName && focus.storeName && (
                  <div className="text-danger">Store name required !</div>
                )}
              </div>
              <div className="col-12">
                <label className="mr-2 mt-3">
                  OWNER NAME
                  <span style={{ color: "#00cec5" }}>
                    {" "}
                    <sup>*</sup>{" "}
                  </span>
                </label>
                <div className="outline-box">
                  {/* <AuthInput
                    type="text"
                    label="Name*"
                    name="storename"
                    id="storename"
                    dynamic={true}
                    onChange={props.updateForm}
                    value={props.state.storeName}
                    dynamicValue={"storeName"}
                  /> */}
                  <div className="form-group mt-3">
                    <input
                      onChange={onInputHandler}
                      type="text"
                      name="ownerName"
                      className="input_container"
                      placeholder="Enter Owner Name"
                    />
                  </div>
                </div>
                {!inputValue.ownerName && focus.ownerName && (
                  <div className="text-danger">Owner name required !</div>
                )}
              </div>

              <div className="col-xl-6">
                <label className="mr-2 mt-3">OWNER NUMBER</label>
                <div className="outline-box p-0 ownerNumber">
                  {/* <div className="col-xl-3 col-3 p-0 float-left mobInputWidth"> */}
                  {/* <Intelinput id="login-intel-input" /> */}
                  {/* </div> */}
                  <div className="col-xl-9 col-9 pl-3 pl-sm-0 pl-xl-3 float-left">
                    <PhoneInput
                      countrySelectProps={{ disabled: true }}
                      country="IN"
                      //country={"IN"}
                      placeholder="Enter phone number"
                      value={state.phoneNo}
                      onChange={updateLoginPhone}
                    />
                    {/* <AuthInput
                      type="text"
                      label="Phone*"
                      id="OwnerNumber"
                      name="Ownerphone"
                      dynamic={true}
                      onChange={props.updateForm}
                      value={props.state.ownerNumber}
                      allowNumber={props.allowOnlyNumber}
                      dynamicValue={"ownerNumber"} */}
                    {/* /> */}
                  </div>
                </div>

                {inputValue.ownerPhone &&
                  state.phoneNo != "" &&
                  !state.valid && (
                    <div className="text-danger">Enter valid phone no!</div>
                  )}
              </div>
              <div className="col-12">
                <label className="mr-2 mt-3">
                  OWNER EMAIL
                  <span style={{ color: "#00cec5" }}>
                    {" "}
                    <sup>*</sup>{" "}
                  </span>
                </label>
                <div className="outline-box">
                  {/* <AuthInput
                    type="text"
                    label="Name*"
                    name="storename"
                    id="storename"
                    dynamic={true}
                    onChange={props.updateForm}
                    value={props.state.storeName}
                    dynamicValue={"storeName"}
                  /> */}
                  <div className="form-group mt-3">
                    <input
                      onChange={onInputHandler}
                      type="text"
                      name="ownerEmail"
                      className="input_container"
                      placeholder="Enter Owner Email"
                    />
                  </div>
                </div>
                {!inputValue.ownerEmail && focus.ownerEmail && (
                  <div className="text-danger">Owner email required !</div>
                )}
              </div>
              <div className="col-12">
                <label className="mr-2 mt-3">
                  PASSWORD
                  <span style={{ color: "#00cec5" }}>
                    {" "}
                    <sup>*</sup>{" "}
                  </span>
                </label>
                <div className="outline-box">
                  {/* <AuthInput
                    type="text"
                    label="Name*"
                    name="storename"
                    id="storename"
                    dynamic={true}
                    onChange={props.updateForm}
                    value={props.state.storeName}
                    dynamicValue={"storeName"}
                  /> */}
                  <div className="form-group mt-3">
                    <input
                      onChange={onInputHandler}
                      type="password"
                      name="password"
                      className="input_container"
                      placeholder="Enter Owner Password"
                    />
                  </div>
                </div>
                {!inputValue.password && focus.password && (
                  <div className="text-danger">Password required !</div>
                )}
              </div>
              <div className="col-xl-6">
                <label className="mr-2 mt-3">
                  BUSINESS PHONE
                  <span style={{ color: "#00cec5" }}>
                    {" "}
                    <sup>*</sup>{" "}
                  </span>
                </label>
                <div className="outline-box p-0 ownerNumber">
                  {/* <div className="col-xl-3 col-3 p-0 float-left mobInputWidth"> */}
                  {/* <Intelinput id="login-intel-input" /> */}
                  {/* </div> */}
                  <div className="col-xl-9 col-9 pl-3 pl-sm-0 pl-xl-3 float-left">
                    <PhoneInput
                      countrySelectProps={{ disabled: true }}
                      country="IN"
                      //country={"IN"}
                      placeholder="Enter phone number"
                      value={BusinessPhoneNo.phoneNo}
                      onChange={updateLoginPhone1}
                    />
                    {/* <AuthInput
                      type="text"
                      label="Phone*"
                      id="OwnerNumber"
                      name="Ownerphone"
                      dynamic={true}
                      onChange={props.updateForm}
                      value={props.state.ownerNumber}
                      allowNumber={props.allowOnlyNumber}
                      dynamicValue={"ownerNumber"} */}
                    {/* /> */}
                  </div>
                </div>
                {inputValue.BusinessPhoneNo && !BusinessPhoneNo.valid && (
                  <div className="text-danger">Enter valid phone no!</div>
                )}
              </div>
              <div className="col-12">
                <label className="mr-2 mt-3">WEBSITE</label>
                <div className="outline-box" id="businessEmail">
                  <div className="form-group mt-3">
                    <input
                      onChange={onInputHandler}
                      type="text"
                      name="website"
                      className="input_container"
                      placeholder="Website"
                    />
                  </div>
                  {/* <span className="error" style={{right:'-122px', display:'none'}} id="businessEmailError">You have entered invalid URL. Please try again.</span> */}
                </div>
              </div>
              <div className="col-12">
                <label className="mr-2 mt-3">DESCRIPTION</label>
                <div className="outline-box">
                  {/* <AuthInput
                    type="text"
                    label="Name*"
                    name="storename"
                    id="storename"
                    dynamic={true}
                    onChange={props.updateForm}
                    value={props.state.storeName}
                    dynamicValue={"storeName"}
                  /> */}
                  <div className="form-group mt-3">
                    <input
                      onChange={onInputHandler}
                      type="text"
                      name="storedescription"
                      className="input_container"
                      placeholder="Description"
                    />
                  </div>
                </div>
              </div>
              {/* <div className="col-12"> */}
              {/* <label className="mr-2 mt-2">CATEGORY<span style={{color:"red"}}> <sup>*</sup> </span></label> */}

              {/* <div class="form-group"> */}
              {/* <select class="form-control" id="exampleFormControlSelect1" name="platform" required="required">
              <option>CATEGORY</option>
              <option>Home supplies</option>

            </select> */}
              {/* </div> */}

              {/* </div> */}
              {/* <div className="col-12">
              <label className="mr-2 mt-2">SUB CATEGORY<span style={{color:"red"}}> <sup>*</sup> </span></label>
               
                <div class="form-group">
            <select class="form-control" id="exampleFormControlSelect1" name="platform" required="required">
              <option>SUB CATEGORY</option>
              <option>Home supplies</option>

            </select>
          </div>
                
              </div> */}
              {/* <div className="col-12">
                <label className="mr-2 mt-2">
                  COUNTRY
                  <span style={{ color: "#00cec5" }}>
                    {" "}
                    <sup>*</sup>{" "}
                  </span>
                </label>

                <div class="form-group">
                  <select
                    onChange={onInputHandler}
                    class="form-control"
                    id="exampleFormControlSelect1"
                    name="country"
                    required="required"
                  >
                    <option value="india">india</option>
                  </select>
                </div>
              </div> */}
              {/* <div className="col-12">
                <label className="mr-2 mt-2">
                  CITY
                  <span style={{ color: "#00cec5" }}>
                    {" "}
                    <sup>*</sup>{" "}
                  </span>
                </label>

                <div class="form-group">
                  <select
                    class="form-control"
                    id="exampleFormControlSelect1"
                    name="platform"
                    required="required"
                  >
                    <option>Select City</option>
                    <option>keshod</option>
                  </select>
                </div>
              </div> */}
              <div className="col-12">
                <label className="mr-2 mt-3">
                  ADDRESS
                  <span style={{ color: "#00cec5" }}>
                    {" "}
                    <sup>*</sup>{" "}
                  </span>
                </label>

                <div className="form-group mt-3">
                  <LocationSearchInput
                    placeHolder="Address*"
                    updateLocation={handlerAddress}
                    locale={props.locale}
                    inputClassName="form-control py-lg-3 rounded-0 selectAddress overflow-ellipsis"
                    // ref={ref => this.LocSearchRef = ref}
                  />
                </div>
                {!inputValue.address && focus.address && (
                  <div className="text-danger">Address name required !</div>
                )}
                {/* {!inputValue.address && focus.ownerName && (
                    <div className="text-danger">Owner email required !</div>
                  )} */}
              </div>
              <div className="col-12">
                <label className="mr-2 mt-3">BILLING ADDRESS</label>
                <div className="form-group mt-3">
                  <LocationSearchInput
                    placeHolder="Address*"
                    updateLocation={props.updateLocation1}
                    locale={props.locale}
                    inputClassName="form-control py-lg-3 rounded-0 selectAddress overflow-ellipsis"
                    // ref={ref => this.LocSearchRef = ref}
                  />
                </div>
              </div>
              <div className="col-12">
                <label className="mr-2 mt-3">
                  STREET NAME
                  <span style={{ color: "#00cec5" }}>
                    {" "}
                    <sup>*</sup>{" "}
                  </span>
                </label>
                <div className="outline-box">
                  <div className="form-group mt-3">
                    <input
                      onChange={onInputHandler}
                      type="text"
                      name="streetName"
                      className="input_container"
                    />
                  </div>
                </div>
                {!inputValue.streetName && focus.streetName && (
                  <div className="text-danger">Street name required !</div>
                )}
              </div>
              <div className="col-12">
                <label className="mr-2 mt-3">
                  LOCALITY
                  <span style={{ color: "#00cec5" }}>
                    {" "}
                    <sup>*</sup>{" "}
                  </span>
                </label>
                <div className="outline-box">
                  <div className="form-group mt-3">
                    <input
                      onChange={onInputHandler}
                      type="text"
                      name="localityName"
                      className="input_container"
                    />
                  </div>
                </div>
                {!inputValue.localityName && focus.localityName && (
                  <div className="text-danger">Locality name required !</div>
                )}
              </div>
              <div className="col-12">
                <label className="mr-2 mt-3">
                  AREA NAME
                  <span style={{ color: "#00cec5" }}>
                    {" "}
                    <sup>*</sup>{" "}
                  </span>
                </label>
                <div className="outline-box">
                  <div className="form-group mt-3">
                    <input
                      onChange={onInputHandler}
                      type="text"
                      name="areaName"
                      className="input_container"
                    />
                  </div>
                </div>
                {!inputValue.areaName && focus.areaName && (
                  <div className="text-danger">Area name required !</div>
                )}
              </div>
              {/* <div className="col-12"> */}
              {/* <label className="mr-2 mt-3">SERVICE ZONES</label> */}
              {/* <div className="form-group mt-3">
                  <textarea
                    id="w3mission"
                    rows="3"
                    cols="50"
                    placeholder="Business Address"
                  ></textarea>
                </div>
              </div> */}
              <div className="swicth_button col-12 mt-3">
                <div className="col-4 p-0">
                  <p style={{ margin: "0" }}>AUTO APPROVAL</p>
                </div>
                <div className="col-4">
                  <Swiches name="autoApproval" onChange={onInputHandler} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 mt-3">
            <div className="row">
              <div
                className="col-12 d-flex align-items-center"
                style={{ height: "60px" }}
              >
                <h5 className="registerStoreFormH5Title">DRIVER SETTINGS</h5>
              </div>
            </div>
            <div className="row">
              {/* <div className="col-xl-6" style={{ paddingRight: '5px' }}> */}
              <div className="col-12 ">
                <div className="col-12 p-0 d-flex">
                  <div className="col-4 p-0">
                    <p style={{ margin: "0" }}>
                      DRIVERS TYPE
                      <span style={{ color: "#00cec5" }}>
                        {" "}
                        <sup>*</sup>{" "}
                      </span>
                    </p>
                  </div>
                  <div className="col-8 p-0 row m-0">
                    <RadioButton
                      type="radio"
                      id="driverType"
                      onChange={onInputHandler}
                      name="driverType"
                      value="2"
                      label=" Store Drivers"
                    ></RadioButton>
                    <RadioButton
                      type="radio"
                      id="driverType1"
                      onChange={onInputHandler}
                      name="driverType"
                      value="1"
                      label="Freelance"
                    ></RadioButton>
                  </div>
                </div>
              </div>
              <div className="swicth_button col-12">
                <div className="col-4 p-0">
                  <p style={{ margin: "0" }}>FORCED ACCEPT</p>
                </div>
                <div className="col-4">
                  <Swiches name="forcedAccept" onChange={onInputHandler} />
                </div>
              </div>
              <div className="swicth_button col-12">
                <div className="col-4 p-0">
                  <p style={{ margin: "0" }}>AUTO DISPATCH</p>
                </div>
                <div className="col-4">
                  <Swiches name="autoDispatch" onChange={onInputHandler} />
                </div>
              </div>
              {/* <div className="col-xl-6">
                <div className="outline-box">
                  <AuthInput
                    type="text"
                    label="Name*"
                    name="ownername"
                    id="ownername"
                    dynamic={true}
                    onChange={props.updateForm}
                    value={props.state.ownerName}
                    dynamicValue={"ownerName"}
                  />
                </div>
              </div> */}
              {/* <div className="col-xl-6" style={{ paddingLeft: '5px' }}> */}

              {/* <div className="col-xl-6" style={{ paddingRight: '5px' }}> */}
              {/* <div className="col-xl-6">
                <div className="outline-box" id="ownerEmail">
                  <AuthInput
                    type="text"
                    label="Email*"
                    name="owneremail"
                    id="owneremail"
                    dynamic={true}
                    onChange={props.updateForm}
                    value={props.state.ownerEmail}
                    dynamicValue={"ownerEmail"}
                    focusOut={props.validateEmail}
                    focusIn={props.focusedIn}
                  />
                  <span
                    className="error"
                    style={{ left: "-122px", top: "0px", display: "none" }}
                    id="ownerEmailError"
                  >
                    You have entered invalid E-mail. Please try again.
                  </span>
                </div>
              </div> */}
              {/* <div className="col-xl-6" style={{ paddingLeft: '5px' }}> */}
              {/* <div className="col-xl-6">
                <div className="outline-box">
                  <AuthInput
                    type="password"
                    label="Password*"
                    name="ownerpassword"
                    id="ownerpassword"
                    dynamic={true}
                    onChange={props.updateForm}
                    value={props.state.ownerPassword}
                    dynamicValue={"ownerPassword"}
                  />
                </div>
              </div> */}
            </div>
          </div>
          <div className="col-12 mt-3">
            <div className="row">
              <div
                className="col-12 d-flex align-items-center"
                style={{ height: "60px" }}
              >
                <h5 className="registerStoreFormH5Title">PRICE SETTINGS</h5>
              </div>
            </div>
            <div className="row">
              <div className="col-12 ">
                <div className="col-12 p-0 d-flex align-items-center">
                  <div className="col-4 p-0">
                    <p style={{ margin: "0" }}>
                      PRICING MODEL
                      <span style={{ color: "#00cec5" }}>
                        {" "}
                        <sup>*</sup>{" "}
                      </span>
                    </p>
                  </div>
                  <div className="col-8 p-0 row m-0">
                    <RadioButton
                      type="radio"
                      id="pricingModel1"
                      onChange={onInputHandler}
                      name="pricingModel"
                      value="0"
                      label="Zonal Pricing"
                    ></RadioButton>
                    {/* <label style={{ margin: "0px 20px 0px 5px" }}>
                      Zonal Pricing
                    </label> */}
                    <RadioButton
                      type="radio"
                      id="pricingMode2"
                      onChange={onInputHandler}
                      name="pricingModel"
                      value="1"
                      label="  Mileage Pricing"
                    ></RadioButton>
                  </div>
                </div>
              </div>
              <div className="col-12 d-flex align-items-center mt-3">
                <div className="col-4 p-0">
                  <p style={{ margin: "0" }}>
                    MINIMUM ORDER VALUE({symbal})
                    <span style={{ color: "#00cec5" }}>
                      {" "}
                      <sup>*</sup>{" "}
                    </span>
                  </p>
                </div>
                <div className="col-8 p-0 d-flex align-items-center">
                  <input
                    type="number"
                    onChange={onInputHandler}
                    name="minOrderValue"
                    placeholder="Minimum Order Value"
                    className="input_box"
                  />
                  <div className="corrency">{symbal}</div>
                  {!inputValue.minOrderValue && focus.minOrderValue && (
                    <div className="text-danger">Minimum Order required !</div>
                  )}
                </div>
              </div>
              <div className="col-12 d-flex align-items-center mt-3">
                <div className="col-4 p-0">
                  <p style={{ margin: "0" }}>
                    THRESHOLD VALUE ({symbal})
                    <span style={{ color: "#00cec5" }}>
                      {" "}
                      <sup>*</sup>{" "}
                    </span>
                  </p>
                </div>
                <div className="col-8 p-0 d-flex align-items-center">
                  <input
                    type="number"
                    name="freeDeliveryAbove"
                    onChange={onInputHandler}
                    placeholder="Threshold value"
                    className="input_box"
                  />
                  <div className="corrency">{symbal}</div>
                  {!inputValue.thresoldValue && focus.thresoldValue && (
                    <div className="text-danger">Thresold order required !</div>
                  )}
                </div>
              </div>
              <div className="col-12 d-flex align-items-center mt-3">
                <div className="col-4 p-0">
                  <p style={{ margin: "0" }}>AVG DELIVERY TIME</p>
                </div>
                <div className="col-8 p-0 d-flex">
                  <input
                    type="number"
                    onChange={onInputHandler}
                    name="avgDeliveryTime"
                    placeholder="Avg Delivery Time"
                    className="input_box"
                  />
                  <div className="minutes">minutes</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 mt-3">
            <div className="row">
              <div
                className="col-12 d-flex align-items-center"
                style={{ height: "60px" }}
              >
                <h5 className="registerStoreFormH5Title">SERVICE SETTINGS</h5>
              </div>
            </div>
            <div className="row">
              <div className="col-12 d-flex align-items-center mt-3">
                <div className="col-4 p-0">
                  <p style={{ margin: "0" }}>
                    COST FOR TWO
                    <span style={{ color: "#00cec5" }}>
                      {" "}
                      <sup>*</sup>{" "}
                    </span>
                  </p>
                </div>
                <div className="col-8 p-0 d-flex align-items-center">
                  <input
                    type="number"
                    name="costForTwo"
                    onChange={onInputHandler}
                    placeholder="cost for two"
                    className="input_box"
                  />
                  <div className="corrency">{symbal}</div>
                  {!inputValue.costForTwo && focus.costForTwo && (
                    <div className="text-danger">Cost for two required !</div>
                  )}
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 p-0 d-flex align-items-center">
                  <div className="col-4 p-0">
                    <p style={{ margin: "0" }}>
                      ORDER TYPE
                      <span style={{ color: "#00cec5" }}>
                        {" "}
                        <sup>*</sup>{" "}
                      </span>
                    </p>
                  </div>
                  <div className="col-8 p-0 row m-0">
                    <RadioButton
                      type="radio"
                      id="orderType1"
                      onChange={onInputHandler}
                      name="orderType"
                      value="1"
                      label="Pickup"
                    ></RadioButton>
                    <RadioButton
                      type="radio"
                      id="orderType2"
                      onChange={onInputHandler}
                      name="orderType"
                      value="2"
                      label="Delivery"
                    ></RadioButton>
                    <RadioButton
                      type="radio"
                      onChange={onInputHandler}
                      id="orderType3"
                      name="orderType"
                      value="3"
                      label="Both"
                    ></RadioButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 mt-3">
            <div className="row">
              <div
                className="col-12 d-flex align-items-center"
                style={{ height: "60px" }}
              >
                <h5 className="registerStoreFormH5Title">PAYMENT SETTINGS</h5>
              </div>
            </div>
            {(!inputValue.orderType ||
              inputValue.orderType == "1" ||
              inputValue.orderType == "3") && (
              <div className="row">
                <div className="col-12 ">
                  <div className="col-12 p-0 d-flex align-items-center">
                    <div className="col-4 p-0">
                      <p style={{ margin: "0" }}>
                        PAYMENT METHOD FOR PICKUP
                        <span style={{ color: "#00cec5" }}>
                          {" "}
                          <sup>*</sup>{" "}
                        </span>
                      </p>
                    </div>
                    <div className="col-8 p-0 row m-0">
                      <CheckBoxButton
                        type="checkbox"
                        id="male"
                        name="cash"
                        onChange={onCheckBoxHanlder}
                        value="Zonal Pricing"
                        label="Cash"
                      ></CheckBoxButton>
                      {/* <input />
                      <label style={{ margin: "0px 20px 0px 5px" }}>Cash</label> */}
                      <CheckBoxButton
                        type="checkbox"
                        id="female"
                        onChange={onCheckBoxHanlder}
                        name="creditCard"
                        value="Mileage Pricing"
                        label=" Credit Card"
                      ></CheckBoxButton>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {(inputValue.orderType == "2" || inputValue.orderType == "3") && (
              <div className="row">
                <div className="col-12 ">
                  <div className="col-12 p-0 d-flex align-items-center">
                    <div className="col-4 p-0">
                      <p style={{ margin: "0" }}>
                        DELIVERY METHOD FOR PICKUP
                        <span style={{ color: "#00cec5" }}>
                          {" "}
                          <sup>*</sup>{" "}
                        </span>
                      </p>
                    </div>
                    <div className="col-8 p-0 row m-0">
                      <CheckBoxButton
                        type="checkbox"
                        id="male"
                        name="dcash"
                        onChange={onCheckBoxHanlder}
                        value="Zonal Pricing"
                        label="Cash"
                      ></CheckBoxButton>
                      <CheckBoxButton
                        type="checkbox"
                        id="female"
                        onChange={onCheckBoxHanlder}
                        name="dcreditCard"
                        value="Mileage Pricing"
                        label="Credit Card"
                      ></CheckBoxButton>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="col-12 mt-3">
            <div className="row">
              <div
                className="col-12 d-flex align-items-center"
                style={{ height: "60px" }}
              >
                <h5 className="registerStoreFormH5Title">MILEAGE SETTINGS</h5>
              </div>
            </div>
            <div className="row">
              <div className="col-12 d-flex align-items-center mt-3">
                <div className="col-4 p-0">
                  <p style={{ margin: "0" }}>Base Fare</p>
                </div>
                <div className="col-8 p-0 d-flex">
                  <input
                    type="number"
                    onChange={onInputHandler}
                    name="baseFare"
                    placeholder="Enter Base Fee"
                    className="input_box"
                  />
                  <div className="corrency">{symbal}</div>
                </div>
              </div>
              <div className="col-12 d-flex align-items-center mt-3">
                <div className="col-4 p-0">
                  <p style={{ margin: "0" }}>Mileage Price</p>
                </div>
                <div className="col-4 p-0 d-flex">
                  <input
                    type="number"
                    onChange={onInputHandler}
                    name="mileagePrice"
                    placeholder="Enter Mileage price"
                    className="input_box"
                  />
                  <div className="corrency">{symbal}</div>
                </div>
                <div className="col-4 d-flex">
                  <div className="after">after</div>
                  <input
                    type="number"
                    onChange={onInputHandler}
                    name="mileagePriceAfterMinutes"
                    className="input_number"
                    style={{ width: "70px", padding: "0px 10px" }}
                  />
                  <div className="minutes">minutes</div>
                </div>
              </div>
              <div className="col-12 d-flex align-items-center mt-3">
                <div className="col-4 p-0">
                  <p style={{ margin: "0" }}>Time Fee</p>
                </div>
                <div className="col-4 p-0 d-flex">
                  <input
                    type="number"
                    onChange={onInputHandler}
                    name="timeFee"
                    placeholder="Time Fee"
                    className="input_box"
                  />
                  <div className="corrency">{symbal}</div>
                </div>
                <div className="col-4 d-flex">
                  <div className="after">after</div>
                  <input
                    type="numer"
                    onChange={onInputHandler}
                    name="timeFeeAfterMinutes"
                    className="input_number"
                    style={{ width: "70px", padding: "0px 10px" }}
                  />
                  <div className="minutes">minutes</div>
                </div>
              </div>
              <div className="col-12 d-flex align-items-center mt-3">
                <div className="col-4 p-0">
                  <p style={{ margin: "0" }}>Waiting Fee</p>
                </div>
                <div className="col-4 p-0 d-flex">
                  <input
                    type="number"
                    name="waitingFee"
                    onChange={onInputHandler}
                    placeholder="Waiting Fee"
                    className="input_box"
                  />
                  <div className="corrency">{symbal}</div>
                </div>
                <div className="col-4 d-flex">
                  <div className="after">after</div>
                  <input
                    onChange={onInputHandler}
                    name="waitingFeeAfterMinutes"
                    type="number"
                    className="input_number"
                    style={{ width: "70px", padding: "0px 10px" }}
                  />
                  <div className="minutes">minutes</div>
                </div>
              </div>
              <div className="col-12 d-flex align-items-center mt-3">
                <div className="col-4 p-0">
                  <p style={{ margin: "0" }}>Minimum Fare</p>
                </div>
                <div className="col-8 p-0 d-flex">
                  <input
                    onChange={onInputHandler}
                    type="number"
                    name="minimumFare"
                    placeholder="Minimum Fere"
                    className="input_box"
                  />
                  <div className="corrency">{symbal}</div>
                </div>
              </div>
              <div className="col-12 d-flex align-items-center mt-3">
                <div className="col-4 p-0">
                  <p style={{ margin: "0" }}>
                    On-Demand Bookings Cancellation Fee
                  </p>
                </div>
                <div className="col-4 p-0 d-flex">
                  <input
                    type="number"
                    onChange={onInputHandler}
                    name="onDemandBookingsCancellationFee"
                    placeholder="On-Demand Bookings Cancellation Fee"
                    className="input_box"
                  />
                  <div className="corrency">{symbal}</div>
                </div>
                <div className="col-4 d-flex">
                  <div className="after">after</div>
                  <input
                    onChange={onInputHandler}
                    type="number"
                    name="onDemandBookingsCancellationFeeAfterMinutes"
                    className="input_number"
                    style={{ width: "70px", padding: "0px 10px" }}
                  />
                  <div className="minutes">minutes</div>
                </div>
              </div>
              <div className="col-12 d-flex align-items-center mt-3">
                <div className="col-4 p-0">
                  <p style={{ margin: "0" }}>
                    Scheduled Bookings Cancellation Fee
                  </p>
                </div>
                <div className="col-4 p-0 d-flex">
                  <input
                    onChange={onInputHandler}
                    type="number"
                    name="scheduledBookingsCancellationFee"
                    placeholder="Scheduled Bookings Cancellation Fee"
                    className="input_box"
                  />
                  <div className="corrency">{symbal}</div>
                </div>
                <div className="col-4 d-flex">
                  <div className="after">after</div>
                  <input
                    type="number"
                    onChange={onInputHandler}
                    name="scheduledBookingsCancellationFeeAfterMinutes"
                    className="input_number"
                    style={{ width: "70px", padding: "0px 10px" }}
                  />
                  <div className="minutes">minutes</div>
                </div>
              </div>
              <div className="col-12 d-flex align-items-center mt-3">
                <div className="col-4 p-0">
                  <p style={{ margin: "0" }}>Convenience Fee</p>
                </div>
                <div className="col-8 p-0 d-flex">
                  <input
                    type="text"
                    onChange={onInputHandler}
                    name="convenienceFee"
                    placeholder="Convenience Fee"
                    className="input_box"
                  />
                  <div className="corrency">{symbal}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 mt-3">
            <div className="row">
              <div
                className="col-12 d-flex align-items-center"
                style={{ height: "60px" }}
              >
                <h5 className="registerStoreFormH5Title">Social Media Links</h5>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <label className="mr-2 mt-3">FACEBOOK</label>
                <div className="outline-box">
                  <div className="form-group mt-3">
                    <input
                      type="text"
                      name="file"
                      onChange={onInputHandler}
                      className="input_container"
                      placeholder="Enter Facebook link"
                    />
                  </div>
                </div>
              </div>
              <div className="col-12">
                <label className="mr-2 mt-3">TWITTER</label>
                <div className="outline-box">
                  <div className="form-group mt-3">
                    <input
                      type="text"
                      name="twitter"
                      onChange={onInputHandler}
                      className="input_container"
                      placeholder="Enter twitter link"
                    />
                  </div>
                </div>
              </div>
              <div className="col-12">
                <label className="mr-2 mt-3">INSTAGRAM</label>
                <div className="outline-box">
                  <div className="form-group mt-3">
                    <input
                      type="text"
                      name="instagram"
                      onChange={onInputHandler}
                      className="input_container"
                      placeholder="Enter instagram link"
                    />
                  </div>
                </div>
              </div>
              <div className="col-12">
                <label className="mr-2 mt-3">LINKEDIN</label>
                <div className="outline-box">
                  <div className="form-group mt-3">
                    <input
                      type="text"
                      name="linkedin"
                      onChange={onInputHandler}
                      className="input_container"
                      placeholder="Enter linkedin link"
                    />
                  </div>
                </div>
              </div>
              <div className="col-12">
                <label className="mr-2 mt-3">GOOGLE</label>
                <div className="outline-box">
                  <div className="form-group mt-3">
                    <input
                      type="text"
                      name="google"
                      onChange={onInputHandler}
                      className="input_container"
                      placeholder="Enter google + link"
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 mt-3 px-5">
                {inputValue.profileImage &&
                inputValue.bannerImage &&
                inputValue.storeName &&
                inputValue.ownerName &&
                inputValue.ownerEmail &&
                inputValue.streetName &&
                inputValue.areaName &&
                inputValue.pricingModel &&
                inputValue.costForTwo &&
                inputValue.orderType &&
                inputValue.address &&
                BusinessPhoneNo.valid &&
                inputValue.localityName ? (
                  <div className="btn-group btn-group-lg w-100 mt-4 registerEnabled">
                    <button
                      type="button"
                      onClick={() => props.submitStoreData(inputValue)}
                      className="btn btn-primary w-100 nextBtnCustom"
                    >
                      Next
                      {/* Register Store */}
                    </button>
                  </div>
                ) : (
                  <div className="col-12 btn-group btn-group-lg w-100">
                    <button
                      className="btn  w-100"
                      type="button"
                      style={{
                        background: "#aaa !important",
                        backgroundColor: "#aaa !important",
                        borderColor: "#aaa !important",
                        cursor: "not-allowed",
                        fontSize: "16px",
                      }}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .store-details .corrency {
          color: ${WHITE_BASE_COLOR};
          background-color: #00cec5;
        }
        .store-details .after {
          color: ${WHITE_BASE_COLOR};
          background-color: #00cec5;
        }

        .store-details .minutes {
          color: ${WHITE_BASE_COLOR};
          background-color: #00cec5;
        }
      `}</style>
    </Wrapper>
  );
};

export default StoreDetailInPuts;
