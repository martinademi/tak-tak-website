// absolute imports
import React from "react";
import TextField from "material-ui/TextField";
import GoogleMapReact from "google-map-react";
import { FontIcon, IconButton } from "material-ui";
import RaisedButton from "material-ui/RaisedButton";
// relative imports
import CustomSlider from "../ui/sliders/customSlider";
import LocationSearchInput from "../location/map";
import MapMarker from "../location/marker";
import { addAddress, getAddress, patchAddress } from "../../services/address";
import { getLocation } from "../../lib/auth";
import { getCookie } from "../../lib/session";
import CircularProgressLoader from "../ui/loaders/circularLoader";
import { BASE_COLOR } from "../../lib/envariables";
import LanguageWrapper from "../../hoc/language";
const officeIconActive = (
  <FontIcon className="material-icons">
    {" "}
    <i
      className="fa fa-building activeCustomFaComm checkoutcustomFaComm"
      aria-hidden="true"
    ></i>
  </FontIcon>
);
const officeIcon = (
  <FontIcon className="material-icons">
    {" "}
    <i className="fa fa-building" aria-hidden="true"></i>
  </FontIcon>
);

const homeIconActive = (
  <FontIcon className="material-icons">
    {" "}
    <i
      className="fa fa-home activeCustomFaComm checkoutcustomFaComm"
      aria-hidden="true"
    ></i>
  </FontIcon>
);
const homeIcon = (
  <FontIcon className="material-icons">
    {" "}
    <i className="fa fa-home" aria-hidden="true"></i>
  </FontIcon>
);

const button = {
  root: {
    color: "#fff !important",
    border: "1px solid #999",
    background: "#fff",
    height: "46px",
    width: "178px"
  },
  label: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#333",
    margin: "0px 18px"
  },
  overlayStyle: {
    height: "46px",
    padding: "5px"
  }
};

const buttonActive = {
  root: {
    color: "#fff !important",
    border: "1px solid #444",
    background: "#444",
    height: "46px",
    width: "178px"
  },
  label: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#fff",
    margin: "0px 18px"
  },
  overlayStyle: {
    height: "46px",
    padding: "5px"
  }
};
class NewAddressSlider extends React.Component {
  state = {
    stepIndex: 0,
    open: false,
    SliderWidth: 450,
    flatNumber: "",
    landmark: "",
    home: this.props.home,
    office: this.props.office,
    draggable: true,
    zoom: 15,
    lat: "",
    lng: "",
    loading: false
  };

  lang = this.props.lang;
  constructor(props) {
    super(props);
    this.saveAddressHandler = this.saveAddressHandler.bind(this);
  }

  onCircleInteraction(childKey, childProps, mouse) {
    // function is just a stub to test callback
    this.setState({
      draggable: false
    });
    let data = {
      lat: mouse.lat,
      lng: mouse.lng
    };
    this.props.updateCoords(data);
  }

  onCircleInteraction3(childKey, childProps, mouse) {
    // function is just a stub to test callback
    this.setState({
      draggable: true
    });
  }

  _onChange = ({ center, zoom }) => {
    this.setState({ zoom: zoom });
    this.getAddress(center.lat, center.lng);
  };

  getAddress(lat, lng) {
    let geocoder = new google.maps.Geocoder();
    let latlng = new google.maps.LatLng(lat, lng);
    let data = {
      lat: lat,
      lng: lng
    };

    geocoder.geocode({ latLng: latlng }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        data["address"] = results[0].formatted_address;
        this.props.updateLocation(data);
        this.child.handleChange(results[0].formatted_address);
      }
    });
  }

  printMap(center) {
    return (
      <GoogleMapReact
        panControl={false}
        onChange={this._onChange}
        draggable={this.state.draggable}
        streetViewControl={false}
        fullscreenControl={false}
        resetBoundsOnResize={true}
        zoom={this.state.zoom}
        bootstrapURLKeys={{ key: "AIzaSyBJ2LWIMnZNdsoYmUREgbN_4VEksPnoW8w" }}
        defaultCenter={{
          lat: parseFloat(center.lat),
          lng: parseFloat(center.lng)
        }}
        defaultZoom={this.state.zoom}
        onChildClick={() => {}}
        onChildMouseDown={(childKey, childProps, mouse) =>
          this.onCircleInteraction(childKey, childProps, mouse)
        }
        onChildMouseUp={(childKey, childProps, mouse) =>
          this.onCircleInteraction3(childKey, childProps, mouse)
        }
        onChildMouseMove={(childKey, childProps, mouse) =>
          this.onCircleInteraction(childKey, childProps, mouse)
        }
        onClick={() => {}}
        center={{ lat: parseFloat(center.lat), lng: parseFloat(center.lng) }}
        zoom={this.state.zoom}
      >
        <MapMarker
          lat={parseFloat(center.lat)}
          lng={parseFloat(center.lng)}
          text={"Me"}
        />
      </GoogleMapReact>
    );
  }

  inputForm(data) {
    return (
      <TextField
        type="text"
        floatingLabelText={data.label}
        floatingLabelFocusStyle={{
          color: BASE_COLOR,
          transform: "scale(0.75) translate(0px, -20px)"
        }}
        floatingLabelShrinkStyle={{
          transform: "scale(0.75) translate(0px, -20px)"
        }}
        floatingLabelStyle={{
          top: "20px",
          transition: "all 750ms cubic-bezier(0.23, 1, 0.32, 1) 0ms"
        }}
        inputStyle={{ marginTop: "3px", marginLeft: "5px" }}
        style={{ height: "60px" }}
        underlineShow={false}
        margin="normal"
        value={data.value}
        onChange={data.onChange}
        autoComplete="off"
      />
    );
  }

  saveAddressHandler() {
    if (this.props.center && this.props.center.place) {
      let splitAdd = this.props.center.place.split(",");
      let country = splitAdd[splitAdd.length - 1];
      let state = splitAdd[splitAdd.length - 2];

      let city = splitAdd[splitAdd.length - 3];

      let data = {
        addLine1: this.props.center.place,
        country: country,
        city: city,
        state: state,
        latitude: this.props.center.lat,
        longitude: this.props.center.lng
      };

      this.props.taggedAs
        ? (data["taggedAs"] = this.props.taggedAs)
        : (data["taggedAs"] = "home");
      this.state.flatNumber ? (data["flatNumber"] = this.state.flatNumber) : "";
      this.state.landmark ? (data["landmark"] = this.state.landmark) : "";

      this.setState({ loading: true });

      addAddress(data).then(({ data }) => {
        this.setState({ loading: false });
        data.error
          ? ""
          : (this.props.updateAdress(data.data),
            this.clearAddressForm(),
            this.closeDrawer());
      });
    }
  }

  clearAddressForm() {
    this.setState({
      home: true,
      office: false,
      others: false,
      landmark: "",
      flatNumber: ""
    });
    this.props.clearAddressForm();
    this.props.getGeoLocation();
  }

  createMapOptions = maps => {
    return {
      panControl: false,
      mapTypeControl: false,
      scrollwheel: false,
      styles: [
        {
          stylers: [
            { saturation: -100 },
            { gamma: 0.8 },
            { lightness: 4 },
            { visibility: "on" }
          ]
        }
      ]
    };
  };

  closeDrawer = () => {
    this.CustomRef.handleLeftSliderClose();
    this.clearAddressForm();
  };
  handleClose = () => {
    this.setState({ SliderWidth: 0 });
  };
  updateLandMark = e => {
    this.setState({ landmark: e.target.value });
  };
  updateFlatNo = e => {
    this.setState({ flatNumber: e.target.value });
  };

  handleLeftSliderToggle = () => {
    this.getCurrentLocation();
    this.setState({ SliderWidth: 450 });
    this.CustomRef.handleLeftSliderToggle();
  };

  handleLeftSliderToggleForMobile = () => {
    this.getCurrentLocation();
    this.setState({ SliderWidth: "100%" });
    this.CustomRef.handleLeftSliderToggle();
  };

  getCurrentLocation = async () => {
    let lat = await getCookie("lat");
    let long = await getCookie("long");
    // this.getAddress(lat, long);
  };

  componentDidMount() {
    this.props.onRef(this);
    // this.getAddress(this.props.center.lat, this.props.center.lng);
  }

  render() {
    let homeSelectButton;
    let officeSlectButton;
    let othersSelectButton;
    const { home, office, others } = this.props;

    home == true || (office == false && others == false)
      ? (homeSelectButton = "active")
      : (homeSelectButton = "");
    office == true ? (officeSlectButton = "active") : (officeSlectButton = "");
    others == true
      ? (othersSelectButton = "active")
      : (othersSelectButton = "");

    return (
      <CustomSlider
        onRef={ref => (this.CustomRef = ref)}
        width={this.state.SliderWidth}
        handleClose={this.handleClose}
      >
        <div className="col-12 px-3 px-sm-5 addNewAddressModalBtSec">
          <div
            className="col-12 py-3 px-1"
            style={{
              position: "sticky",
              zIndex: "9",
              top: "0px",
              background: "#fff",
              borderBottom: "1px solid #eee"
            }}
          >
            <div className="col-12">
              <div className="row align-items-center">
                <div className="col-2 pt-1 pl-0">
                  <IconButton
                    onClick={this.closeDrawer}
                    style={{ height: "30px", padding: "0px", width: "20px" }}
                  >
                    <img
                      src="/static/icons/Common/BackIcon.imageset/back_btn@2x.png"
                      width="20"
                    />
                  </IconButton>
                </div>
                <div className="col-8 px-0 text-left">
                  <h6 className="innerPage-heading lineSetter">
                    {this.lang.saveDeliveryAddress || "Save Delivery Address"}
                  </h6>
                </div>
              </div>
            </div>
          </div>

          <div className="row" style={{ marginTop: "0px" }}>
            <div
              style={{ height: "200px", width: "100%" }}
              className="col-12 text-center py-0 addressBar"
            >
              {/* <img src="/static/icons/save_address.png" width="250" /> */}
              {this.printMap(this.props.center)}
            </div>
            <div className="col-12 addressBar check-out-address mb-3">
              <LocationSearchInput
                onRef={ref => (this.child = ref)}
                updateLocation={this.props.updateLocation}
                inputClassName="form-control py-lg-3 rounded-0 selectAddress overflow-ellipsis"
                id="locSearch"
                ref={ref => (this.LocSearchRef = ref)}
              />
            </div>
            <div className="col-12">
              <div className="outline-box">
                {this.inputForm({
                  label: "Door / Flat no.",
                  value: this.state.flatNumber,
                  onChange: this.updateFlatNo
                })}
              </div>
            </div>
            <div className="col-12">
              <div
                className="outline-box"
                style={{ marginTop: "0px", borderTop: "0px" }}
              >
                {this.inputForm({
                  label: "Landmark",
                  value: this.state.landmark,
                  onChange: this.updateLandMark
                })}
              </div>
            </div>

            <div className="col-12 addAddressLandMarkSec">
              <div
                className="outline-box"
                style={{ marginTop: "0px", borderTop: "0px" }}
              >
                <div className="row">
                  <div className="col-4 text-center addAddressLandMark">
                    <a
                      className={homeSelectButton}
                      onClick={() => this.props.updateTaggedAs("home")}
                    >
                      <i className="fa fa-home"></i>
                      <span className="addAddressLandMark">
                        {this.lang.home || "Home"}
                      </span>
                    </a>
                  </div>
                  <div className="col-4 text-center border-left border-right addAddressLandMark">
                    <a
                      className={officeSlectButton}
                      onClick={() => this.props.updateTaggedAs("office")}
                    >
                      <i className="fa fa-briefcase"></i>
                      <span className="addAddressLandMark">
                        {this.lang.work || "Work"}
                      </span>
                    </a>
                  </div>
                  <div className="col-4 text-center addAddressLandMark">
                    <a
                      className={othersSelectButton}
                      onClick={() => this.props.updateTaggedAs("others")}
                    >
                      <i className="fa fa-map-pin"></i>
                      <span className="addAddressLandMark">
                        {this.lang.other || "Other"}
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 pt-0">
              <button
                onClick={this.saveAddressHandler}
                type="submit"
                className="btn loginAndSignUpButton"
              >
                {this.lang.saveAndPro || "SAVE ADDRESS & PROCEED"}
              </button>
            </div>
          </div>
        </div>

        {this.state.loading ? <CircularProgressLoader /> : ""}
      </CustomSlider>
    );
  }
}

export default LanguageWrapper(NewAddressSlider);
