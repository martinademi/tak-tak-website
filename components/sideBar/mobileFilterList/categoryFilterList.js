import React from "react";
import { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Done from "@material-ui/icons/Done";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";

import Wrapper from "../../../hoc/wrapperHoc";
import { BASE_COLOR } from "../../../lib/envariables";

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

const styles = (theme) => ({
  modalRoot: {
    overflowX: "hidden",
  },
  modalPaperOpen: {
    width: "100%",
    overflowX: "hidden",
  },
  modalPaperClose: {
    width: "0%",
    overflowX: "hidden",
  },
  root: {
    width: "99%",
    backgroundColor: theme.palette.background.paper,
    paddingBottom: "100px",
  },

  rootCheck: {
    color: "transparent",
    "&$checked": {
      color: BASE_COLOR,
    },
    height: "25px",
    width: "40px",
    fontSize: "20px",
    float: "right",
    right: "0px !important",
  },
  rootRadio: {
    color: "transparent",
    "&$checked": {
      color: BASE_COLOR,
    },
    height: "25px",
    width: "40px",
    fontSize: "20px",
    float: "right",
    right: "0px !important",
  },
  label: {
    display: "unset",
    margin: "10px 0px",
  },

  labelRadio: {
    padding: "10px 0px",
    margin: "0px",
    display: "unset",
    fontSize: "16px !important",
  },

  checked: {},
  radio: {
    height: "25px",
    width: "40px",
    fontSize: "20px",
  },
  radioColor: {
    color: "#ff9800",
  },
  formGroup: {
    paddingLeft: theme.spacing.unit * 4,
    paddingTop: "4px",
    paddingBottom: "4px",
    width: "100%",
  },
  radioForm: {
    paddingLeft: "25px",
    paddingTop: "4px",
    paddingBottom: "4px",
    width: "100%",
  },
  radioGroup: {
    flexWrap: "unset",
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
  sizeIcon: {
    fontSize: 20,
  },
  listHeader: {
    background: "#f4f4f4",
    fontSize: 16,
    fontWeight: "bold",
  },
  listView: {
    fontSize: "9px",
    padding: "10px 25px",
  },
});

class CategoryFilter extends Component {
  state = {
    SliderWidth: 0,
    open: true,
    supportData: null,
    questionIndex: null,
    selSubCat: null,
    answer: null,
  };

  handleSubCategory = () => {
    this.props.handleChange("category");
    this.props.handleSubCategory();
    // this.SubCatSlider.handleLeftSliderOpen();
  };

  render() {
    const { classes } = this.props;
    let drawerClass;
    drawerClass = this.props.open ? classes.modalPaperOpen : "";

    return (
      <Wrapper>
        <Drawer
          disableBackdropTransition={!iOS}
          disableDiscovery={iOS}
          open={this.props.open}
          openSecondary={true}
          containerClassName={"DrawerClassBRands"}
          classes={{
            paper: drawerClass,
          }}
        >
          <div
            className="row align-items-center pt-2 pb-2 px-4"
            style={{ right: "0px", backgroundColor: "white" }}
          >
            <div onClick={this.props.closeModal} className="col-2 pt-1">
              <a onClick={this.props.closeModal}>
                <img
                  src="/static/icons/Common/BackIcon.imageset/back_btn@2x.png"
                  width="18"
                />
              </a>
            </div>
            <div className="col-8 pt-2 text-center">
              <h6
                style={{ fontSize: "16px", fontWeight: "700", color: "#333" }}
              >
                Categories
              </h6>
            </div>
            {/* {this.props.showAdd ?
                                <div className="col-2 mt-2">
                                    <span className="helpNewTktBtn" onClick={() => this.props.addHandler()}> + </span>
                                </div> : ''
                            } */}
          </div>
          <FormControl
            component="fieldset"
            required
            error
            className={classes.formGroup}
          >
            {this.props.Categories &&
              !this.props.startFromSubCategory &&
              this.props.Categories.map((category, index) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      value={category}
                      classes={{
                        root: classes.rootCheck,
                        checked: classes.checked,
                      }}
                      checkedIcon={<Done className={classes.sizeIcon} />}
                      onChange={this.props.handleChange("category")}
                    />
                  }
                  label={category}
                  classes={{
                    root: classes.labelRadio,
                  }}
                />
              ))}

            {!this.props.Categories &&
              this.props.startFromSubCategory &&
              this.props.startFromSubCategory.map((category, index) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      value={category}
                      classes={{
                        root: classes.rootCheck,
                        checked: classes.checked,
                      }}
                      checkedIcon={<Done className={classes.sizeIcon} />}
                      onChange={this.props.handleChange("sub-category")}
                    />
                  }
                  label={category}
                  classes={{
                    root: classes.labelRadio,
                  }}
                />
              ))}

            {this.props.CatPenCount > 2 ? (
              <div style={{ padding: "0px 7px" }}>
                {this.props.CatPenCount > 4 ? (
                  <a
                    onClick={() => this.props.getFilters(0, 20, 6)}
                    style={{ marginRight: "15px", color: BASE_COLOR }}
                  >
                    view less <span class="fas fa-angle-up"></span>
                  </a>
                ) : this.props.CatPenCount <= 4 ? (
                  <a
                    onClick={() =>
                      this.props.getFilters(
                        this.props.Categories.length + 1,
                        100,
                        3
                      )
                    }
                    style={{ color: BASE_COLOR }}
                  >
                    view more <span class="fas fa-angle-down"></span>
                  </a>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}
          </FormControl>
          <div className="Sticky-Button">
            <Button
              onClick={this.props.closeModal}
              variant="extendedFab"
              color="secondary"
              aria-label="Delete"
              className={classes.button}
            >
              Save Filters
            </Button>
          </div>
        </Drawer>
      </Wrapper>
    );
  }
}

export default withStyles(styles)(CategoryFilter);
