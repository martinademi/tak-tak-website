import React from "react";
import Dialog from "material-ui/Dialog";
import { connect } from "react-redux";
import { getCookie, getCookiees, setCookie } from "../../lib/session";
import redirect from "../../lib/redirect";
import RaisedButton from "material-ui/RaisedButton";

const buttonRed = {
  backgroundColor: "#fff",
  height: "35px",
  lineHeight: "35px"
};
const overlayStyle = {
  height: "35px"
};

const lableFill = {
  fontSize: "13px",
  fontWeight: "700",
  color: "#fc7800"
};

class LogOutDialog extends React.Component {
  state = {
    open: false,
    product: [],
    type: ""
  };

  openOptionsDialog = type => {
    this.setState({ open: true, type: type });
  };

  handleClose = () => {
    this.setState({
      open: false
    });
  };

  componentDidMount() {
    this.props.onRef(this);
  }

  deleteAllCookies = async () => {
    this.setState({
      open: false
    });
    await setCookie("locAuthenticated", false);
    await setCookie("authenticatedZone", "");
    await setCookie("authorized", "");
    await setCookie("username", "");
    await setCookie("storeId", "");
    await setCookie("storeName", "");
    await setCookie("token", null);
    await setCookie("locAuthenticated", "");
    // window.location.href('/')
    await window.location.replace("/");
  };

  componentDidUpdate(prevProps, prevState) {
    // if (prevProps.sessionExpired !== this.props.sessionExpired && this.props.sessionExpired == true) {
    //     this.openOptionsDialog(1)
    // }
  }

  render() {
    const { lang } = this.props;
    return (
      <div style={{ marginTop: "0px" }}>
        <Dialog
          // modal={true}
          open={this.state.open}
          autoDetectWindowHeight={false}
          bodyStyle={{ maxHeight: "550px" }}
          onRequestClose={this.handleClose}
          contentStyle={{ marginTop: "0px", width: "100%", maxWidth: "350px" }}
        >
          <div className="col-12 text-center">
            {this.state.type == 1 ? (
              <p className="my-3">
                {" "}
                {lang.sessionExpire ||
                  "Your session is expired , please login again"}{" "}
              </p>
            ) : (
              <p className="my-3">
                {" "}
                {lang.areYouSure || "Are you sure , you want to Log out ?"}{" "}
              </p>
            )}

            <div className="row">
              <div className="col-6">
                <RaisedButton
                  className="customRaisedBtn"
                  label={lang.ok || "OK"}
                  secondary={true}
                  buttonStyle={buttonRed}
                  overlayStyle={overlayStyle}
                  labelStyle={lableFill}
                  onClick={this.deleteAllCookies}
                />
              </div>

              {this.state.type == 1 ? (
                ""
              ) : (
                <div className="col-6">
                  <RaisedButton
                    className="customRaisedBtn"
                    label={lang.cancel || "Cancel"}
                    secondary={true}
                    buttonStyle={buttonRed}
                    overlayStyle={overlayStyle}
                    labelStyle={lableFill}
                    onClick={this.handleClose}
                  />
                </div>
              )}
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    sessionExpired: state.sessionExpired,
    lang: state.locale
  };
};

export default connect(mapStateToProps)(LogOutDialog);
