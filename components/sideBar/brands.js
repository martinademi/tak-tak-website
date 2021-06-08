import React from "react";
import { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import BrandFilter from "./mobileFilterList/brandFilterList";

class BrandSlider extends Component {
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
      <BrandFilter
        brandsList={this.props.brandsList}
        handleChange={this.props.handleChange}
        open={this.state.open}
        brandPenCount={this.props.brandPenCount}
        getFilters={this.props.getFilters}
        closeModal={this.handleClose}
      />
    ) : (
      ""
    );
  }
}

export default BrandSlider;
