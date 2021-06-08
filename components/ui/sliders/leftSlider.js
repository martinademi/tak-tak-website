import React from "react";
import Drawer from "material-ui/Drawer";
import MenuItem from "material-ui/MenuItem";
import RaisedButton from "material-ui/RaisedButton";
import { FontIcon, IconButton } from "material-ui";

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

const recentsIcon = (
  <FontIcon className="material-icons" style={{ fontSize: "15px" }}>
    {" "}
    <i className="fa fa-times"></i>
  </FontIcon>
);

export default class LeftSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  handleLeftSliderToggle = () => this.setState({ open: !this.state.open });
  handleLeftSliderClose = () => {
    this.setState({ open: false });
    // this.props.handleClose();
  };
  handleLeftClose = () => this.setState({ open: false });

  componentDidMount() {
    // passing ref to parent to call children functions
    this.props.onRef(this);
  }

  render() {
    const navHeader = (
      <div
        className="col-12 py-2 px-1"
        style={{
          zIndex: "9",
          top: "0px",
          background: "#fff",
          borderBottom: "1px solid #eee"
        }}
      >
        <div className="col-12">
          <div className="row align-items-center">
            <div className="col-2 pl-0">
              <IconButton
                onClick={this.handleLeftSliderClose}
                style={{ height: "30px", padding: "0px 12px" }}
              >
                <img
                  src="/static/icons/Common/BackIcon.imageset/back_btn@2x.png"
                  width="24"
                />
              </IconButton>
            </div>
            <div className="col-8 px-0 text-center">
              <h6 className="innerPage-heading lineSetter">
                {this.props.drawerTitle}
              </h6>
            </div>
            {this.props.showAdd ? (
              <div className="col-2 mt-2">
                <span
                  className="helpNewTktBtn"
                  onClick={() => this.props.addHandler()}
                >
                  {" "}
                  +{" "}
                </span>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    );
    const closeHeader = (
      <div
        className="col-12 py-2 px-1"
        style={{
          zIndex: "9",
          top: "0px",
          background: "rgb(40, 44, 63)",
          color: "#fff",
          borderBottom: "1px solid #eee"
        }}
      >
        <div className="col-12">
          <div className="row align-items-center">
            <div className="col-8 text-left">
              <h6 className="innerPage-heading lineSetter">
                {this.props.drawerTitle}
              </h6>
            </div>
            <div className="col-4 text-right pl-0">
              <IconButton
                onClick={this.handleLeftSliderClose}
                style={{ height: "30px", padding: "0px 12px" }}
              >
                <img src="/static/images/updated/close-white.svg" width="15" />
              </IconButton>
            </div>
            {this.props.showAdd ? (
              <div className="col-2 mt-2">
                <span
                  className="helpNewTktBtn"
                  onClick={() => this.props.addHandler()}
                >
                  {" "}
                  +{" "}
                </span>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    );
    return (
      <Drawer
        onRequestChange={open => this.setState({ open })}
        open={this.state.open}
        width={this.props.width}
        docked={false}
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        disableSwipeToOpen={true}
        openSecondary={true}
        containerStyle={{ overflowX: "hidden", background: "#f7f7f7" }}
        containerClassName="scroller"
      >
        {this.props.closeHeader ? closeHeader : navHeader}{" "}
        {/* switch beetwen the header types */}
        {this.props.children} {/* print the inner content */}
      </Drawer>
    );
  }
}
