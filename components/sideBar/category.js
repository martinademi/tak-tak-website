import React from "react";
import { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import CategoryFilter from "./mobileFilterList/categoryFilterList";

class CategorySlider extends Component {
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
      <CategoryFilter
        Categories={this.props.Categories}
        handleChange={this.props.handleChange}
        open={this.state.open}
        CatPenCount={this.props.CatPenCount}
        getFilters={this.props.getFilters}
        closeModal={this.handleClose}
        startFromSubCategory={this.props.startFromSubCategory}
      />
    ) : (
      ""
    );
  }
}

export default CategorySlider;
