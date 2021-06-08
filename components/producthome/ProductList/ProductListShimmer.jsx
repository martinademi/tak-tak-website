import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Shimmer from "react-shimmer-effect";
import Wrapper from "../../../hoc/wrapperHoc";

const StyleSheet = {
  container: {
    border: "0px solid rgba(255, 255, 255, 1)",
    boxShadow: "0px 0px 20px rgba(0, 0, 0, .1)",
    borderRadius: "4px",
    backgroundColor: "white",
    display: "flex",
    padding: "16px",
    width: "200px"
  },
  circle: {
    height: "100px",
    width: "100px",
    borderRadius: "50%",
    padding: "10px",
    margin: "10px 15px"
  },
  line: {
    width: "100%",
    height: "15px",
    alignSelf: "center",
    margin: "7px 16px",
    borderRadius: "4px"
  },
  paraLine: {
    width: "37%",
    height: "25px",
    alignSelf: "center",
    margin: "7px 16px",
    borderRadius: "4px"
  }
};

const getShimmers = props => {
  let shimmerHtml = "";
  const { classes } = props;
  for (let i = 0; i < props.length; i++) {
    shimmerHtml += (
      <div className="col-md-3 col-6">
        <Shimmer>
          <div className={classes.circle} />
          <div className={classes.line} />
          <div className={classes.line} />
          <div className={classes.paraLine} />
          <div className={classes.paraLine} />
        </Shimmer>
      </div>
    );
  }
  return shimmerHtml;
};
// generate shimmers for loading screens
const ProductListShimmer = props => {
  //   let shimmerData = getShimmers(props);
  const { classes } = props;
  return (
    <Wrapper>
        <div className="col-md-3 col-6">
          <Shimmer>
            <div className={classes.circle} />
            <div className={classes.line} />
            <div className={classes.line} />
            <div className={classes.paraLine} />
            <div className={classes.paraLine} />
          </Shimmer>
        </div>
        <div className="col-md-3 col-6">
          <Shimmer>
            <div className={classes.circle} />
            <div className={classes.line} />
            <div className={classes.line} />
            <div className={classes.paraLine} />
            <div className={classes.paraLine} />
          </Shimmer>
        </div>
        <div className="col-md-3 col-6">
          <Shimmer>
            <div className={classes.circle} />
            <div className={classes.line} />
            <div className={classes.line} />
            <div className={classes.paraLine} />
            <div className={classes.paraLine} />
          </Shimmer>
        </div>
        <div className="col-md-3 col-6">
          <Shimmer>
            <div className={classes.circle} />
            <div className={classes.line} />
            <div className={classes.line} />
            <div className={classes.paraLine} />
            <div className={classes.paraLine} />
          </Shimmer>
        </div>
        <div className="col-md-3 col-6">
          <Shimmer>
            <div className={classes.circle} />
            <div className={classes.line} />
            <div className={classes.line} />
            <div className={classes.paraLine} />
            <div className={classes.paraLine} />
          </Shimmer>
        </div>
        <div className="col-md-3 col-6">
          <Shimmer>
            <div className={classes.circle} />
            <div className={classes.line} />
            <div className={classes.line} />
            <div className={classes.paraLine} />
            <div className={classes.paraLine} />
          </Shimmer>
        </div>
        <div className="col-md-3 col-6">
          <Shimmer>
            <div className={classes.circle} />
            <div className={classes.line} />
            <div className={classes.line} />
            <div className={classes.paraLine} />
            <div className={classes.paraLine} />
          </Shimmer>
        </div>
        <div className="col-md-3 col-6">
          <Shimmer>
            <div className={classes.circle} />
            <div className={classes.line} />
            <div className={classes.line} />
            <div className={classes.paraLine} />
            <div className={classes.paraLine} />
          </Shimmer>
        </div>
    </Wrapper>
  );
};

export default withStyles(StyleSheet)(ProductListShimmer);
