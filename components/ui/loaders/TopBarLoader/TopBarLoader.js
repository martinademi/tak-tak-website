import React, { Component } from "react";

import LoadingBar from "react-top-loading-bar";
import { BASE_COLOR } from "../../../../lib/envariables";

export default class TopLoader extends Component {
  state = {
    loadingBarProgress: 0
  };

  add = value => {
    this.setState({
      loadingBarProgress: this.state.loadingBarProgress + value
    });
  };

  onLoaderFinished = () => {
    this.setState({ loadingBarProgress: 0 });
  };

  startLoader = () => {
    this.add(10);
    this.sInt = setInterval(() => {
      this.add(30);
      this.state.loadingBarProgress > 95 ? clearInterval(this.sInt) : "";
    }, 500);
  };
  componentDidMount = () => {
    this.props.onRef(this);
  };

  render() {
    return (
      <div>
        <LoadingBar
          progress={this.state.loadingBarProgress}
          height={3}
          color={BASE_COLOR}
          onLoaderFinished={() => this.onLoaderFinished()}
          onRef={ref => (this.LoadingBar = ref)}
        />
      </div>
    );
  }
}
