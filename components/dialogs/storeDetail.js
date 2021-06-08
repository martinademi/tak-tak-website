import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { getCookie } from "../../lib/session";

class StoreDetail extends React.Component {
  state = {
    open: false,
  };

  constructor(props) {
    super(props);
    this.openProductDialog = this.openProductDialog.bind(this);
  }

  openProductDialog = () => {
    let getSelectedStore = this.props.stores
      ? this.props.stores.findIndex(
          (store) => store.storeId == getCookie("storeId")
        )
      : 0;
    this.setState({
      open: true,
      showDetails: true,
      selectedStore: this.props.selectedStore,
    });

    // this.props.stores
    //   ? this.setState({
    //       open: true,
    //       showDetails: true,
    //       selectedStore: this.props.stores[getSelectedStore],
    //     })
    //   : "";
  };

  // getFullDay = date => moment(date).add(moment().utcOffset(), 'm').format('dddd').toString()

  getStartDate = (start) =>
    moment(start, "YYYY-MM-DD HH:mm:ss").format("h:mm A");
  getEndDate = (end) => moment(end, "YYYY-MM-DD HH:mm:ss").format("h:mm A");

  closeProductDialog = () => {
    this.setState({ open: false });
    this.render();
  };

  getSlotsData = () => {
    let slotsHtmlData = "";
    this.props.stores &&
    this.props.storeInfo &&
    this.props.stores.findIndex(
      (item) => item.businessId == this.props.storeInfo.businessId
    ) >= 0
      ? this.props.stores[
          this.props.stores.findIndex(
            (item) => item.businessId == this.props.storeInfo.businessId
          )
        ] &&
        this.props.stores[
          this.props.stores.findIndex(
            (item) => item.businessId == this.props.storeInfo.businessId
          )
        ].availableSlots &&
        this.props.stores[
          this.props.stores.findIndex(
            (item) => item.businessId == this.props.storeInfo.businessId
          )
        ].availableSlots.map((slot, index) =>
          this.setState({ slotArray: slot.day })
        )
      : "";
  };
  componentWillReceiveProps = () => this.getSlotsData();
  componentDidMount() {
    this.props.onRef(this);
    // this.getSlotsData()
  }

  render() {
   
    let { lang } = this.props;
    let databox;
    this.state.open ? (databox = "block") : (databox = "none");
    // this.getSlotsData();
    return this.props.storeInfo ? (
      <div
        className="popup-Box-Overlay scroller"
        style={{ display: databox, top: "0px" }}
      >
        <div
          className="popup-Box popUpBoxBtSpl"
          style={{ display: databox, margin: "10px auto" }}
        >
          {/* <div className="col"> */}
          {/* <div className="row"> */}
          <div className="py-4 popUpBoxBtLayout">
            {/* popUpBoxCloseLayout */}
            <div className="productBoxCloseLayout">
              <a onClick={this.closeProductDialog}>
                <img
                  src="/static/images/popUpBoxClose.svg"
                  height="20"
                  width="24"
                />
              </a>
            </div>
            {/* popUpBoxCloseLayout */}

            {/* <div className="row"> */}
            <div className="col text-center storeDetailsTitleLayout">
              <div className="storeDetailsTitleImgLayout">
                <img
                  src={this.props.storeInfo.businessImage}
                  width="70"
                  height="70"
                  className="rounded-circle"
                  alt="Capitalhypermarket"
                />
              </div>
              <h2 className="storeDetailsTitleH2">
                {this.props.storeInfo.businessName}
              </h2>
              <h4 className="storeDetailsTitleH4">
                {this.props.storeInfo.storeTypeMsg}
              </h4>
            </div>
            <div className="col-12">
              <div className="row pt-3 align-items-center">
                <div className="col-4 text-center">
                  <p className="description py-1">
                    {" "}
                    <b>
                      {this.state.selectedStore
                        ? parseFloat(
                            this.state.selectedStore.distanceKm
                          ).toFixed(2)
                        : ""}
                    </b>{" "}
                  </p>
                  <p className="description">{lang.kmAway || "KM AWAY"}</p>
                </div>
                <div className="col-4 text-center">
                  <p className="description py-1">
                    {" "}
                    <i className="fa fa-star" aria-hidden="true"></i>{" "}
                    <strong>
                      {this.state.selectedStore
                        ? parseFloat(
                            this.state.selectedStore.averageRating || 0.0
                          ).toFixed(2)
                        : ""}
                    </strong>{" "}
                  </p>
                  <p className="description">{lang.ratingC || "RATING"}</p>
                </div>
                <div className="col-4 text-center px-0 px-sm-2">
                  <p className="description py-1">
                    {" "}
                    <strong>
                      {this.state.selectedStore
                        ? this.state.selectedStore.estimatedTime
                        : ""}
                    </strong>
                  </p>
                  <p className="description">
                    {lang.estimateTime || "ESTIMATED TIME"}
                  </p>
                </div>
              </div>
            </div>
            {/* </div> */}
            <div className="storePillsLayout">
              <ul
                className="nav nav-pills justify-content-center storePillsPillsUL"
                id="pills-tab"
                role="tablist"
              >
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    id="pills-home-tab"
                    data-toggle="pill"
                    href="#pills-home"
                    role="tab"
                    aria-controls="pills-home"
                    aria-selected="true"
                  >
                    {lang.info || "Info"}
                  </a>
                </li>
                {/* <li className="nav-item">
                                    <a className="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-profile" role="tab" aria-controls="pills-profile" aria-selected="false">Delivery times</a>
                                </li> */}
              </ul>
              <div className="tab-content" id="pills-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="pills-home"
                  role="tabpanel"
                  aria-labelledby="pills-home-tab"
                >
                  {this.props.storeInfo &&
                  this.props.storeInfo.length > 0 &&
                  this.props.storeInfo.availableSlots &&
                  this.props.storeInfo.availableSlots.length > 0 &&
                  this.props.selectedStore.availableSlots[0].startTime &&
                  this.props.selectedStore.availableSlots[0].endTime ? (
                    <div className="storePillsBgWhiteCustom">
                      <h5 className="storePillsLayoutH4">
                        {lang.deliveryTime || "Delivery time"}
                      </h5>
                      <h2 className="storePillsLayoutH2">
                        Today, &nbsp;
                        {this.props.storeInfo.availableSlots[0].startTime
                          ? this.getStartDate(
                              this.props.storeInfo.availableSlots[0].startTime
                            )
                          : ""}{" "}
                        - &nbsp;
                        {this.props.storeInfo.availableSlots[0].endTime
                          ? this.getEndDate(
                              this.props.storeInfo.availableSlots[0].endTime
                            )
                          : ""}
                      </h2>
                      {/* <button className="btn btn-default storePillsDeliveryBtn">
                                            <span>All delivery times</span>
                                            <i className="fa fa-angle-right"></i>
                                        </button> */}
                    </div>
                  ) : (
                    ""
                  )}
                  {this.props.storeInfo.storeDescription && (
                    <div className="storePillsBgWhiteCustom">
                      <h6 className="storePillsLayoutH6">
                        {lang.about || "About"}
                      </h6>
                      <div className="col">
                        <div className="row">
                          <div className="col-auto px-0">
                            <img
                              src="/static/images/infoAboutIcon.png"
                              width="25"
                              height="25"
                              className=""
                              alt="infoAboutIcon"
                            />
                          </div>
                          <div className="col">
                            <p className="storePillsLayoutP">
                              {this.props.storeInfo.storeDescription}
                              {/* <button className="btn btn-default storePillsMoreBtn">
                                                            ...more
                                                        </button> */}
                            </p>
                            {/* <p className="storePillsLayoutP border-top pt-2 mt-3">
                                                        Delivery
                                                    </p> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {this.props.storeInfo &&
                  this.props.storeInfo.businessAddress ? (
                    <div className="storePillsBgWhiteCustom">
                      <h6 className="storePillsLayoutH6">
                        {lang.storeAddress || "Store Address"}
                      </h6>
                      <div className="col">
                        <div className="row">
                          <div className="col-auto px-0">
                            <img
                              src="/static/icons/location_outline.png"
                              width="25"
                              height="25"
                              className=""
                              alt="infoAboutIcon"
                            />
                            {/* <i className="fas fa-map-marked-alt"></i> */}
                          </div>
                          <div className="col">
                            <p className="storePillsLayoutP">
                              {this.props.storeInfo.businessAddress}
                            </p>
                            {/* <p className="storePillsLayoutP border-top pt-2 mt-3">
                                                        Delivery
                                                    </p> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  {this.state.slotArray ? (
                    <div className="storePillsBgWhiteCustom">
                      <div className="row">
                        <div className="col-6">
                          <h6 className="storePillsLayoutH6">
                            {lang.days || "Days"}
                          </h6>
                        </div>
                        <div className="col-6">
                          <h6 className="storePillsLayoutH6 float-right">
                            {lang.hour || "Hours"}
                          </h6>
                        </div>
                      </div>

                      <ul className="nav flex-column storePillsHoursUL">
                        {this.state.slotArray.map((day, dayInd) => (
                          <li className="nav-item" key={"day" + dayInd}>
                            <a className="nav-link" href="#">
                              {day}
                            </a>
                            <a className="nav-link float-right" href="#">
                              {this.props.storeInfo &&
                              this.props.storeInfo.length > 0 &&
                              this.props.storeInfo.availableSlots &&
                              this.props.storeInfo.availableSlots.length > 0 &&
                              this.props.selectedStore.availableSlots[0]
                                .startTime &&
                              this.props.selectedStore.availableSlots[0].endTime
                                ? this.getStartDate(
                                    this.props.storeInfo.availableSlots[0]
                                      .startTime
                                  )
                                : ""}{" "}
                              -
                              {this.props.storeInfo &&
                              this.props.storeInfo.length > 0 &&
                              this.props.storeInfo.availableSlots &&
                              this.props.storeInfo.availableSlots.length > 0 &&
                              this.props.selectedStore.availableSlots[0]
                                .startTime &&
                              this.props.selectedStore.availableSlots[0].endTime
                                ? this.getEndDate(
                                    this.props.storeInfo.availableSlots[0]
                                      .endTime
                                  )
                                : ""}
                            </a>
                          </li>
                        ))}
                        {/* <li className="nav-item">
                                                <a className="nav-link" href="#">Monday</a>
                                                <a className="nav-link float-right" href="#">10:00 AM - 9:00 PM</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" href="#">Tuesday</a>
                                                <a className="nav-link float-right" href="#">10:00 AM - 9:00 PM</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" href="#">Wednesday</a>
                                                <a className="nav-link float-right" href="#">10:00 AM - 9:00 PM</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" href="#">Thursday</a>
                                                <a className="nav-link float-right" href="#">10:00 AM - 9:00 PM</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" href="#">Friday</a>
                                                <a className="nav-link float-right" href="#">10:00 AM - 9:00 PM</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" href="#">Saturday</a>
                                                <a className="nav-link float-right" href="#">10:00 AM - 9:00 PM</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" href="#">Sunday</a>
                                                <a className="nav-link float-right" href="#">10:00 AM - 9:00 PM</a>
                                            </li> */}
                      </ul>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-profile"
                  role="tabpanel"
                  aria-labelledby="pills-profile-tab"
                >
                  <div className="deliveryTimesLayout">
                    <div className="col py-3 border-bottom">
                      <div className="row">
                        <div className="col-auto">
                          <img
                            src="/static/images/infoAboutIcon.png"
                            width="25"
                            height="25"
                            className=""
                            alt="infoAboutIcon"
                          />
                        </div>
                        <div className="col">
                          <p className="storePillsLayoutP">
                            {lang.priceListed ||
                              " Prices listed for orders above $35 per store"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col py-4 bgWhiteWhiteOnly">
                      <h6 className="storePillsLayoutH6">
                        {lang.today || "Today"}
                      </h6>
                      <ul className="nav flex-column storePillsDeliveryTimesUL">
                        <li className="nav-item">
                          <a className="nav-link" href="#">
                            10am - 11am
                          </a>
                          <a className="nav-link float-right" href="#">
                            $5.99
                          </a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" href="#">
                            11am - Noon
                          </a>
                          <a className="nav-link float-right" href="#">
                            $5.99
                          </a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" href="#">
                            Noon - 1pm
                          </a>
                          <a className="nav-link float-right" href="#">
                            $5.99
                          </a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" href="#">
                            10am - 11am
                          </a>
                          <a className="nav-link float-right" href="#">
                            $5.99
                          </a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" href="#">
                            11am - Noon
                          </a>
                          <a className="nav-link float-right" href="#">
                            $5.99
                          </a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" href="#">
                            Noon - 1pm
                          </a>
                          <a className="nav-link float-right" href="#">
                            $5.99
                          </a>
                        </li>
                      </ul>
                      <div className="text-center">
                        <button className="btn btn-default storePillsDeliveryBtn">
                          <span>{lang.moreTime || "More times"}</span>
                          <i className="fa fa-angle-down"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="row">
                                    <div className="col">
                                    </div>
                                </div> */}
          </div>
          {/* </div> */}
          {/* </div> */}
        </div>
      </div>
    ) : (
      ""
    );
  }
}

const mapStateToProps = (state) => {
  return {
    reduxState: state,
    myCart: state.cartList,
    cartProducts: state.cartProducts,
    lang: state.locale,
  };
};

export default connect(mapStateToProps)(StoreDetail);
