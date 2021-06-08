import React from "react";
import { Component } from "react";
import Moment from "react-moment";
import $ from "jquery";
import Wrapper from "../../hoc/wrapperHoc";
import LeftSlider from "../ui/sliders/leftSlider";
import languageWrapper from "../../hoc/language";
import { getSupportData } from "../../services/profileApi";
class FaqSlider extends Component {
  state = {
    SliderWidth: 0,
    open: true,
    supportData: null,
    questionIndex: null,
    selSubCat: null,
    answer: null
  };
  constructor(props) {
    super(props);
    this.handleLeftSliderOpen = this.handleLeftSliderOpen.bind(this);
  }

  handleLeftSliderOpen = () => this.FaqRef.handleLeftSliderToggle();
  handleClose = () => this.FaqRef.handleLeftSliderClose();
  closeSlider = () => {};
  handleSubCategory = index => {
    this.SubFaqRef.handleLeftSliderToggle();
    this.setState({ questionIndex: index });
  };
  handleAnswer = (selectedSubCat, answer) => {
    this.FaqAnsRef.handleLeftSliderToggle();
    let result = answer.replace(/(<p[^>]+?>|<p>|<\/p>)/gim, "");

    let answerTag = document.getElementById("finalAns");
    answerTag.innerHTML = answer;
    this.setState({ selSubCat: selectedSubCat, answer: result });
  };
  componentDidMount = () => {
    this.props.onRef(this);
    getSupportData().then(({ data }) => {
      data.error ? "" : this.setState({ supportData: data.data });
    });
  };

  render() {
    let lang = this.props.lang;
    return (
      <Wrapper>
        <LeftSlider
          onRef={ref => (this.FaqRef = ref)}
          width={this.props.state.SliderWidth}
          handleClose={this.closeSlider}
          drawerTitle={lang.faqsc || "FAQs"}
        >
          {this.state.supportData &&
            this.state.supportData.map((supItem, index) => (
              <div
                className="col-12 mt-lg-4 px-4 mt-1 p-1"
                key={"mainQuestion" + index}
                style={{ background: "white" }}
              >
                <div className="row">
                  <div className="col-12">
                    <h6
                      className="checkOutFeat"
                      style={{ color: "black" }}
                      onClick={() => this.handleSubCategory(index)}
                    >
                      {supItem.name}
                    </h6>
                  </div>
                </div>
              </div>
            ))}
        </LeftSlider>

        <LeftSlider
          onRef={ref => (this.SubFaqRef = ref)}
          width={this.props.state.SliderWidth}
          handleClose={this.closeSlider}
          drawerTitle={
            this.state.supportData && this.state.questionIndex != null
              ? this.state.supportData[this.state.questionIndex]["name"]
              : ""
          }
        >
          {this.state.supportData &&
            this.state.questionIndex != null &&
            this.state.supportData[this.state.questionIndex]["subcat"].map(
              (supItem, index) => (
                <div
                  className="col-12 mt-lg-4 px-4 mt-1 p-1"
                  key={"subQuestion" + index}
                  style={{ background: "white" }}
                >
                  <div className="row">
                    <div className="col-12">
                      <h6
                        className="chesckOutFeat"
                        style={{ color: "black" }}
                        onClick={() =>
                          this.handleAnswer(supItem.name, supItem.desc)
                        }
                      >
                        {supItem.name}
                      </h6>
                    </div>
                  </div>
                </div>
              )
            )}
        </LeftSlider>
        <LeftSlider
          onRef={ref => (this.FaqAnsRef = ref)}
          width={this.props.state.SliderWidth}
          handleClose={this.closeSlider}
          drawerTitle={
            this.state.supportData && this.state.questionIndex != null
              ? this.state.selSubCat
              : ""
          }
        >
          <div
            className="col-12 mt-lg-4 px-4 mt-1 p-1"
            style={{ background: "white" }}
          >
            <div className="row">
              <div className="col-12" id="finalAns">
                {/* <p className="" id="finalAns" style={{ color: "black", fontWeight: 500 }}></p> */}
              </div>
            </div>
          </div>
        </LeftSlider>
      </Wrapper>
    );
  }
}

export default languageWrapper(FaqSlider);
