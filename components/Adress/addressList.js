import React, { useContext } from "react";
import { BASE_COLOR, BLUE_BASE_COLOR } from "../../lib/envariables";
import languageContext from "../../context/languageContext";
const AddressList = props => {
  const { lang } = useContext(languageContext);
  return props.addressList
    ? props.addressList.map((addressDetail, index) => (
        <div
          key={"addressDetail" + index}
          onClick={event =>
            props.selectAddress
              ? props.selectAddress(addressDetail, event)
              : ""
          }
          className="col-6"
        >
          <div className="addNewnDeliverInner p-sm-3 p-xl-3 p-lg-3 border">
            <div className="row">
              <div className="col-auto pr-0 homeAddressIconLayout">
                {addressDetail.taggedAs == "home" ? (
                  <i className="fa fa-home"></i>
                ) : (
                  <i
                    className="fa fa-briefcase"
                    style={{ fontSize: "16px", marginTop: "3px" }}
                  ></i>
                )}
              </div>
              <div className="col pt-1 homeAddressInitialLayout">
                <h6 className="homeAddressInitial">{addressDetail.taggedAs}</h6>
                <p className="addressBox">
                  {addressDetail.flatNumber}{" "}
                  {addressDetail.flatNumber.length > 0 ? ", " : ""}
                  {addressDetail.addLine1}
                  {/* {addressDetail.addLine2} */}
                  <br />
                  {/* <br /> */}
                  {addressDetail.landmark &&
                  addressDetail.landmark.length > 0 ? (
                    <span>
                      <span>Landmark:</span> {addressDetail.landmark}
                    </span>
                  ) : (
                    ""
                  )}
                </p>
                <div className="editDeleteButtonLayout">
                  <a
                    className="addressEditAndDeleteButton"
                    onClick={event =>
                      props.handleEditAdrSliderOpen(event, addressDetail)
                    }
                  >
                    <span style={{ color: BLUE_BASE_COLOR }}>
                      {lang.edit || "edit"}
                    </span>
                  </a>
                  <a
                    className="addressEditAndDeleteButton"
                    onClick={event => props.deleteAddress(event, addressDetail)}
                  >
                    <span style={{ color: "#e94125" }}>
                      {lang.delete || "delete"}
                    </span>
                  </a>
                  {props.isCheckout ? (
                    <a
                      className="addressEditAndDeleteButton"
                      onClick={event =>
                        props.selectAddress
                          ? props.selectAddress(addressDetail, event)
                          : ""
                      }
                    >
                      <span style={{ color: BASE_COLOR }}>
                        {lang.deliverHear || "deliver here "}
                      </span>
                    </a>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))
    : "";
};

export default AddressList;
