import React from "react";
import { connect } from "react-redux";
import moment from "moment";

import * as $ from "jquery";

class ActionResponse extends React.Component {
  state = {
    open: false
  };

  constructor(props) {
    super(props);
    this.openDialog = this.openDialog.bind(this);
  }

  openDialog = () => {
    this.setState({ open: true });

    $(".loading-message").show();
    $(".circle-loader").show();
    // $('.success-message').hide()
    // $('.loading-message').hide()
    // $('.circle-loader').addClass('load-complete'), $('.checkmark').show()
    // $('.success-message').fadeIn('slow')
  };

  closeDialog = () => {
    // this.setState({ open: false });
    // this.render()
    this.props.handleResponseActions();
  };
  closeDialogWithError = () => {
    this.setState({ open: false });
    this.render();
    this.props.handleErrResponseActions();
  };

  componentDidMount() {
    this.props.onRef(this);
  }

  render() {
    let databox;
    this.state.open ? (databox = "block") : (databox = "none");
    let actionToCatch = null;

    let { lang } = this.props;
    return (
      <div
        className="popup-Box-Overlay scroller"
        style={{ display: databox, top: "0px" }}
      >
        <div
          className="popup-Box popUpBoxBtSpl popUpBoxStore"
          style={{ display: databox }}
        >
          <div className="py-4 popUpBoxBtLayout">
            <div className="popUpBoxCloseLayout">
              <a onClick={this.closeDialog}>
                <img
                  src="/static/images/popUpBoxClose.svg"
                  height="20"
                  width="24"
                />
              </a>
            </div>

            <div
              className="text-center"
              id="LoaderDiv"
              role="tabpanel"
              style={{ paddingTop: "25vh" }}
            >
              {this.props.loadingMsg ? (
                <div className="circle-loader mb-3"></div>
              ) : (
                ""
              )}
              {this.props.successMsg ? (
                <div className="circle-loader load-complete mb-3">
                  <div className="checkmark draw"></div>
                </div>
              ) : (
                ""
              )}
              {this.props.actionErrMsg ? (
                <div className="circle-loader load-complete mb-3">
                  <img
                    src="/static/icons/cancel.svg"
                    height="50px"
                    style={{ margin: "20px" }}
                  ></img>
                </div>
              ) : (
                ""
              )}
              <div className="loading-message"> {this.props.loadingMsg} </div>
              <div className="loading-message"> {this.props.actionErrMsg} </div>
              <div className="success-message">{this.props.successMsg}</div>

              {/* {actionToCatch = this.props.successMsg ? true : this.props.actionErrMsg ? false : ''} */}
              {this.props.successMsg ? (
                <button
                  className="btn btn-primary my-3"
                  onClick={this.closeDialog}
                  style={{
                    padding: "5px 25px",
                    background: "#00cec5",
                    color: "white",
                    border: "none"
                  }}
                >
                  {lang.ok || "OK"}
                </button>
              ) : (
                ""
              )}
              {this.props.actionErrMsg ? (
                <button
                  className="btn btn-primary my-3"
                  onClick={this.closeDialogWithError}
                  style={{
                    padding: "5px 25px",
                    background: "#00cec5",
                    color: "white",
                    border: "none"
                  }}
                >
                  {lang.ok || "OK"}
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    reduxState: state,
    myCart: state.cartList,
    cartProducts: state.cartProducts,
    lang: state.locale
  };
};

export default connect(mapStateToProps)(ActionResponse);
