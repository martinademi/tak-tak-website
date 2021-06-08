import React from "react";
import { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import ManufacturerFilter from "./mobileFilterList/manufacturerFilterList";

class ManufactSlider extends Component {
  state = {
    SliderWidth: 0,
    open: false,
    supportData: null,
    questionIndex: null,
    selSubCat: null,
    answer: null,
    readyToRenderPage: false,
  };
  constructor(props) {
    super(props);
    this.handleLeftSliderOpen = this.handleLeftSliderOpen.bind(this);
  }

  handleLeftSliderOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  closeSlider = () => {};

  componentDidMount = () => {
    this.props.onRef(this);
    this.setState({ readyToRenderPage: true });
  };

  render() {
    return this.state.readyToRenderPage ? (
      <ManufacturerFilter
        manufacturers={this.props.manufacturers}
        open={this.state.open}
        closeModal={this.handleClose}
        handleChange={this.props.handleChange}
        ManuPenCount={this.props.ManuPenCount}
        getFilters={this.props.getFilters}
      />
    ) : (
      ""
    );
  }
}

export default ManufactSlider;
