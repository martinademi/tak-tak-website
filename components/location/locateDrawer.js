import React from "react";
// import Drawer from 'material-ui/Drawer'
import Drawer from "@material-ui/core/Drawer";
import MenuItem from "material-ui/MenuItem";
import RaisedButton from "material-ui/RaisedButton";
import { withStyles } from "@material-ui/core/styles";
import LocationSearchInput from "./map";
import LinearProgressBar from "../ui/linearProgress";
import { getCookie } from "../../lib/session";
import { getAddress } from "../../services/address";
import LanguageContext from "../../context/languageContext";
// css
import "../../assets/locationDrawer.scss";

const styles = {
  paper: {
    width: 450
  },
  mobilePaper: {
    width: "100%"
  }
};

export class LocationDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false, addressList: [] };
  }

  handleToggle = () => {
    if (
      (this.props.userProfile &&
        this.props.userProfile.mobile &&
        this.props.userProfile.mobile.length > 1) ||
      getCookie("authorized")
    ) {
      this.getAddress();
    }
    this.setState({ open: !this.state.open });
  };
  handleClose = () => {
    this.setState({ open: false });
    this.props.handleClose();
  };

  getAddress = () => {
    getAddress().then(data => {
      this.setState({ addressList: data.data.data });
    });
  };

  clearAddress = () => {
    this.LocSearchRef.clearAddress();
  };

  componentDidMount() {
    // passing ref to parent to call children functions
    this.props.onRef(this);
  }

  render() {
    const userLocation =
      this.props.userLocation && this.props.userLocation.length > 1
        ? this.props.userLocation
        : null;
    const { classes } = this.props;

    return (
      <LanguageContext.Consumer>
        {({ lang }) => {
          return (
            <Drawer
              // onRequestChange={(open) => this.setState({ open })}
              open={this.state.open}
              // openSecondary={true}
              // disableSwipeToOpen={true}
              width={this.props.width}
              // docked={true}
              // containerStyle={{ width: this.props.width, overflow: 'hidden' }}
              // containerClassName="scroller horizontal-scroll deliveryLocationSlider"
              anchor="right"
              onClose={this.handleClose}
              classes={{
                paper:
                  this.props.width == "100%"
                    ? classes.mobilePaper
                    : classes.paper
              }}
            >
              <div className="col" style={{ maxHeight: "80px" }}>
                <div className="row">
                  <div className="col p-0">
                    <div className="locationMobBack">
                      <a
                        className="align-middle pl-2"
                        onClick={this.handleClose}
                      >
                        <img
                          src="/static/img/svg/close.svg"
                          height="16"
                          width="14"
                          style={{ marginTop: "-5px" }}
                        />
                      </a>
                    </div>
                    <LocationSearchInput
                      updateLocation={this.props.updateLocation}
                      locErrStatus={this.props.locErrStatus}
                      inputClassName="form-control locationMobInput"
                      id="locMobiInput"
                      ref={ref => (this.LocSearchRef = ref)}
                      locale={lang}
                    />
                    <div className="lcnSearch-searchbttn lcnLeft">
                      <a className="align-middle">
                        <img
                          src="/static/img/svg/searchIcon.svg"
                          width="20"
                          height=""
                          className="img-fluid"
                          alt="search"
                        />
                      </a>
                    </div>
                    <div className="lcnSearch-searchbttn">
                      <a
                        className="align-middle clearBtn"
                        onClick={this.clearAddress}
                      >
                        {lang.clear || "clear"}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 _currentLocationSec">
                    <p className="_currentLocation">
                      {lang.currentLocation || "Current Location"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <LinearProgressBar loading={this.props.loading} />
              </div>

              {/* onClick={this.props.getGeoLocation} */}

              <div
                className={
                  userLocation
                    ? "col geoMobLocation py-4"
                    : "col geoMobLocation"
                }
              >
                {/* <div className="row d-block d-sm-none">
                                <div className="col greyBlushLayout">
        
                                </div>
                            </div> */}

                {/* temporairly hidden */}
                <div className="d-none">
                  {userLocation ? (
                    // <a><i className="fa fa-location-arrow locArrow" aria-hidden="true"></i> {this.props.userLocation}</a> :
                    <a>
                      <img
                        src="/static/img/svg/mapOutline.svg"
                        height="20"
                        width="20"
                      />{" "}
                      {this.props.userLocation}
                    </a>
                  ) : (
                    <a
                      style={{ width: "100%", display: "block" }}
                      onClick={this.props.getGeoLocation}
                    >
                      <div className="row align-items-center">
                        <div className="col-auto">
                          {/* <a> */}
                          <img
                            src="/static/images/gps.svg"
                            height="20"
                            width="20"
                          />
                          {/* </a> */}
                        </div>
                        <div className="col px-0 border-bottom py-3 curLocModalLayout">
                          <p
                            className="details-container-head"
                            style={{ fontSize: "13px !important" }}
                          >
                            {lang.enableLocation || "Enable Location Services"}
                          </p>
                          {/* <p className="details-container-head">Get Current Location</p> */}
                          {/* <p className="details-container-body">Using GPS</p> */}
                        </div>
                      </div>
                    </a>
                  )}
                </div>

                {userLocation ? (
                  <div className="row">
                    <div className="col-auto">
                      <a>
                        <img
                          src="/static/img/svg/mapOutline.svg"
                          height="20"
                          width="20"
                        />
                      </a>
                    </div>
                    <div className="col">{this.props.userLocation}</div>
                  </div>
                ) : (
                  <a
                    style={{ width: "100%", display: "block" }}
                    onClick={this.props.getGeoLocation}
                  >
                    <div className="row align-items-center">
                      <div className="col-auto">
                        <img
                          src="/static/img/svg/mapOutline.svg"
                          height="20"
                          width="20"
                        />
                      </div>
                      <div className="col border-bottom py-3 curLocModalLayoutl">
                        <p
                          className="details-container-head"
                          style={{ fontSize: "13px !important" }}
                        >
                          {lang.enableLocation || "Enable Location Services"}
                        </p>
                        {/* <p className="details-container-head">Get Current Location</p> */}
                        {/* <p className="details-container-body">Using GPS</p> */}
                      </div>
                    </div>
                  </a>
                )}

                {this.props.locErrMessage ? (
                  <div className="row align-items-center">
                    <div className="col-auto errorLocation-icon">
                      <i
                        className="fa fa-exclamation-triangle"
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div className="col px-0 border-bottom py-3 curLocModalLayout errorLocation-text">
                      <p className="error-login">{this.props.locErrMessage}</p>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {this.state.addressList && this.state.addressList.length > 0 ? (
                  <div className="col-12 my-5 addressListCont">
                    <p className="my-2 savedCaption">Saved Addresses</p>
                    {this.state.addressList.map((address, index) => (
                      <div
                        className="col-12"
                        onClick={() => this.props.setupUserByAddress(address)}
                        key={"locAddr-" + index}
                      >
                        <div className="row addressDataBox">
                          <div className="col-12 pt-2 locTypeCont">
                            <p className="locationType">
                              <span className="mr-3">
                                {address.taggedAs == "home" ? (
                                  <i
                                    className="fa fa-home"
                                    style={{ fontSize: "18px" }}
                                  ></i>
                                ) : (
                                  <i
                                    className="fa fa-briefcase"
                                    style={{
                                      fontSize: "16px",
                                      marginTop: "3px"
                                    }}
                                  ></i>
                                )}
                              </span>
                              {address.taggedAs}
                            </p>
                          </div>
                          <div className="col-12 pb-3 addressDrawerBox">
                            <p>{address.addLine1}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </Drawer>
          );
        }}
      </LanguageContext.Consumer>
    );
  }
}

export default withStyles(styles)(LocationDrawer);
