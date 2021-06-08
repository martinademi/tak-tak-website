import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import Done from "@material-ui/icons/Done";
import Wrapper from "../../hoc/wrapperHoc";
import { getFilterParams } from "../../services/filterApis";
import { getCookie } from "../../lib/session";

import PrintMobileList from "./printMobileList";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PrintMobileSublist from "./printMobileSubList";
import { BASE_COLOR } from "../../lib/envariables";

const styles = (theme) => ({
  root: {
    width: "99%",
    backgroundColor: theme.palette.background.paper,
    paddingBottom: "100px",
  },

  rootCheck: {
    color: BASE_COLOR,
    "&$checked": {
      color: BASE_COLOR,
    },
    height: "25px",
    width: "40px",
    fontSize: "20px",
    float: "left",
    left: "0px !important",
  },
  rootRadio: {
    color: BASE_COLOR,
    "&$checked": {
      color: BASE_COLOR,
    },
    height: "25px",
    width: "40px",
    fontSize: "20px",
    float: "left",
    left: "0px !important",
  },
  label: {
    display: "unset",
    margin: "10px 0px",
  },

  labelRadio: {
    padding: "10px 0px",
    margin: "0px",
    display: "flex",
    fontSize: "16px",
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
    paddingLeft: "4px",
    paddingTop: "4px",
    paddingBottom: "4px",
    width: "100%",
  },
  radioForm: {
    paddingLeft: "4px",
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
    lineHeight: "unset",
    padding: "10px",
  },
  listView: {
    fontSize: "9px",
    padding: "10px 25px",
  },
});

class MobileViewFilters extends React.Component {
  state = {
    brands: [],
    manufacturer: [],
    category: [],
    menuView: "showFilter",
    filterOne: "",
    filterTwo: "",
    filterThree: "",
    value: "",
    subCat: [],
    subSubCat: [],
    selectedCat: null,
    showSubCat: false,
    readyToRenderPage: false,
    slider: null,
    expanded: null,
  };

  constructor(props) {
    super(props);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.reset = this.reset.bind(this);
    this.selectCategories = this.selectCategories.bind(this);
    this.ApplyFilters = this.ApplyFilters.bind(this);
  }

  handleExpChange = (panel) => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  handleSlider = async (event) => {
    this.setState({ slider: event.target.value });
    // await this.priceSelection();
  };

  handleRadioChange = (event) => {
    this.setState({ value: event.target.value });
    this.props.sortProducts(event.target.value);
  };

  async selectedOptions(e, name) {
    await this.setState({ [name]: this.state[name].concat([e.target.value]) });
    
  }

  async removedOptions(e, name) {
    var array = this.state[name];
    var index = array.indexOf(e.target.value);
    await array.splice(index, 1);
    await this.setState({ [name]: array });
  }

  async ApplyFilters() {
    let brandQuery;
    let manufacturerQuery;
    let category;
    let subCat;
    let subsubCat;
    let priceQuery;
    this.state.brands.length > 0
      ? (brandQuery = await {
          match: { "brandTitle.en": this.state.brands.toString() },
        })
      : "";
    this.state.manufacturer.length > 0
      ? (manufacturerQuery = await {
          match: { "manufactureName.en": this.state.manufacturer.toString() },
        })
      : "";
    this.state.category.length > 0
      ? (category = await {
          match: { "catName.en": this.state.category.toString() },
        })
      : "";
    this.state.subCat.length > 0
      ? (subCat = await {
          match: { "subCatName.en": this.state.subCat.toString() },
        })
      : "";
    this.state.subSubCat.length > 0
      ? (subsubCat = await {
          match: { "subSubCatName.en": this.state.subSubCat.toString() },
        })
      : "";

    priceQuery = {
      range: {
        "units.floatValue": {
          gte: 0,
          lte: this.state.slider || this.props.maxPrice,
        },
      },
    };
    let favQuery = { match: { "favorites.userId": getCookie("sid") } };
    let query = [
      brandQuery,
      manufacturerQuery,
      category,
      subCat,
      subsubCat,
      priceQuery,
    ];
    this.props.heading == "Favourite Products" ? query.push(favQuery) : "";
    query = await query.filter((n) => {
      return n != undefined;
    });

    this.props.searchFilter(query);

    this.closeAllFilters();
  }

  selectCategories(
    category,
    subCategory,
    subSubCategory,
    e,
    ref,
    allSubcategory
  ) {
    e.target.checked
      ? category && subCategory && subSubCategory
        ? (this.state.category.indexOf(category) < 0
            ? this.setState({
                category: this.state.category.concat([category]),
              })
            : "",
          this.state.subCat.indexOf(subCategory) < 0
            ? this.setState({ subCat: this.state.subCat.concat([subCategory]) })
            : "",
          // this.setState({ subSubCat: this.state.subSubCat.concat([subSubCategory]) })

          typeof subSubCategory === "object" || subSubCategory.isArray
            ? this.setState({
                subSubCat: [...this.state.subSubCat, ...subSubCategory],
              })
            : this.setState({
                subSubCat: [...this.state.subSubCat, subSubCategory],
              }))
        : (this.state.category.indexOf(category) < 0
            ? this.setState({
                category: this.state.category.concat([category]),
              })
            : "",
          this.state.subCat.indexOf(subCategory) < 0
            ? this.setState({ subCat: this.state.subCat.concat([subCategory]) })
            : "")
      : this.removeCategories(
          category,
          subCategory,
          subSubCategory,
          e,
          ref,
          allSubcategory
        );

    setTimeout(() => {}, 1000);
  }

  async removeCategories(
    category,
    subCategory,
    subSubCategory,
    e,
    ref,
    allSubcategory
  ) {
    let array1;
    let array2;
    let array3;
    let index1;
    let index2;
    let index3;

    category && subCategory && subSubCategory
      ? ((array1 = this.state.category),
        (array2 = this.state.subCat),
        (array3 = this.state.subSubCat),
        (index1 = array1.indexOf(category)),
        (index2 = array2.indexOf(subCategory)),
        typeof subSubCategory === "object" || subSubCategory.isArray
          ? (subSubCategory.map((subSubCategory, index) => {
              index3 = array3.indexOf(subSubCategory);
              array3.splice(index3, 1);
              this.setState({ subSubCat: array3 });
            }),
            array2.splice(index2, 1),
            this.setState({ subCat: array2 }),
            this.hasCommonElement(array2, [...allSubcategory])
              ? ""
              : (array1.splice(index1, 1), this.setState({ category: array1 })))
          : ((index3 = array3.indexOf(subSubCategory)),
            array3.splice(index3, 1),
            this.hasCommonElement(array3, [...ref])
              ? ""
              : (array2.splice(index2, 1), this.setState({ subCat: array2 })),
            this.hasCommonElement(array2, [...allSubcategory])
              ? ""
              : (array1.splice(index1, 1),
                this.setState({ category: array1 }))),
        array3.length < 1
          ? (await array1.splice(index1, 1),
            await array2.splice(index2, 1),
            this.setState({ category: array1, subCat: array2 }))
          : "")
      : ((array1 = this.state.category),
        (array2 = this.state.subCat),
        (index1 = array1.indexOf(category)),
        (index2 = array2.indexOf(subCategory)),
        await array1.splice(index1, 1),
        await array2.splice(index2, 1));

    setTimeout(() => {}, 1000);
  }

  hasCommonElement(arr1, arr2) {
    var bExists = false;
    $.each(arr2, function (index, value) {
      if ($.inArray(value, arr1) != -1) {
        bExists = true;
      }

      if (bExists) {
        return false; //break
      }
    });
    return bExists;
  }

  getSubCategory = async (CatName) => {
    let storeId = getCookie("storeId", "");
    let data;

    let query = [{ match_phrase_prefix: { "catName.en": CatName } }];

    getFilterParams(0, 2, 0, 10, storeId, false, query)
      .then(
        ({ data }) => {
          this.setState({ subCat: data.data, selectedCat: CatName });
          this.props.searchFilter(query);
        },
        (error) => {
      
        }
      )
      .catch((err) => {});
  };

  closeAllFilters = () => {
    this.props.closeFilters();
  };

  reset() {
    this.setState({ value: "" });
    this.props.sortProducts("");
    this.props.closeFilters();
  }
  componentDidMount() {
    this.setState({ readyToRenderPage: true, slider: this.props.maxPrice });
  }

  handleChange = (name) => (e) => {
    e.target.checked
      ? this.selectedOptions(e, name)
      : this.removedOptions(e, name);
  };

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;

    return this.state.readyToRenderPage ? (
      <Wrapper>
        <div
          className="header"
          style={{
            position: "absolute",
            top: "0px",
            width: "100%",
            zIndex: "9",
          }}
        >
          <div className="row py-3">
            <div className="col-3 text-center">
              <a onClick={this.closeAllFilters}>
                <img
                  src="/static/icons/Common/BackIcon.imageset/back_btn@2x.png"
                  width="24"
                />
              </a>
            </div>
            <div className="col-6 text-center text-head">Filters</div>
          </div>
        </div>

        <div
          className="scroller horizontal-scroll"
          style={{ marginTop: "60px" }}
        >
          <div className="row">
            <div className="col">
              <div className="row">
                {/* <div className={"scroller horizontal-scroll  " + this.state.menuView} style={{ height: '77vh' }} > */}
                <div className="col-4 pr-0">
                  <ul
                    className="nav nav-pills flex-column"
                    role="tablist"
                    id="product-filters"
                  >
                    <li className="nav-item">
                      <a
                        className="nav-link active"
                        data-toggle="pill"
                        href="#categoryFilters"
                      >
                        {this.props.showSubCategories
                          ? "Sub-Category"
                          : "Category"}
                        {this.state.category &&
                        this.state.category.length > 0 ? (
                          <span className="selectedDot"></span>
                        ) : (
                          ""
                        )}
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        data-toggle="pill"
                        href="#brandFilters"
                      >
                        Brand
                        {this.state.brands && this.state.brands.length > 0 ? (
                          <span className="selectedDot"></span>
                        ) : (
                          ""
                        )}
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        data-toggle="pill"
                        href="#manufacturerFilters"
                      >
                        Manufacturer
                        {this.state.manufacturer &&
                        this.state.manufacturer.length > 0 ? (
                          <span className="selectedDot"></span>
                        ) : (
                          ""
                        )}
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        data-toggle="pill"
                        href="#priceFilters"
                      >
                        Price
                        {this.state.slider && this.state.slider > 0 ? (
                          <span className="selectedDot"></span>
                        ) : (
                          ""
                        )}
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        data-toggle="pill"
                        href="#sortFilters"
                      >
                        Sort By
                        {this.state.value && this.state.value != "" ? (
                          <span className="selectedDot"></span>
                        ) : (
                          ""
                        )}
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="col-8 pl-0 scroll80">
                  <div className="tab-content">
                    {/* category filter */}
                    <div
                      className="tab-pane fade in show active"
                      id="categoryFilters"
                      role="tabpanel"
                    >
                      {this.props.hideCats == false &&
                      this.props.Categories &&
                      this.props.Categories.length > 0
                        ? this.props.showSubCategory
                          ? ""
                          : this.props.Categories.map((category, index) => (
                              <ExpansionPanel
                                key={"catMobDyna" + index}
                                expanded={expanded === category}
                                onChange={this.handleExpChange(category)}
                              >
                                <ExpansionPanelSummary
                                  expandIcon={<ExpandMoreIcon />}
                                >
                                  {category}
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                  <PrintMobileList
                                    getFilters={this.props.getFilters}
                                    category={category}
                                    selectCategories={this.selectCategories}
                                  />
                                </ExpansionPanelDetails>
                              </ExpansionPanel>
                            ))
                        : ""}

                      {this.props.hideCats == false &&
                      this.props.subCategories &&
                      this.props.subCategories.length > 0
                        ? this.props.showSubCategories
                          ? this.props.subCategories.map(
                              (subCategory, index) => (
                                <ExpansionPanel
                                  key={"catMobDyna" + index}
                                  expanded={expanded === subCategory}
                                  onChange={this.handleExpChange(subCategory)}
                                >
                                  <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                  >
                                    {subCategory}
                                  </ExpansionPanelSummary>
                                  <ExpansionPanelDetails>
                                    <PrintMobileSublist
                                      category={this.props.catName}
                                      subCategory={subCategory}
                                      classes={classes}
                                      allSubcategory={this.props.subCategories}
                                      selectCategories={this.selectCategories}
                                    />

                                    {/* <PrintMobileList getFilters={this.props.getFilters} category={category} selectCategories={this.selectCategories} /> */}
                                  </ExpansionPanelDetails>
                                </ExpansionPanel>
                              )
                            )
                          : ""
                        : ""}

                      {this.props.hideCats == true &&
                      this.props.Categories &&
                      this.props.Categories.length > 0 ? (
                        <PrintMobileSublist
                          category={this.props.catName}
                          subCategory={this.props.subCatName}
                          classes={classes}
                          allSubcategory={this.props.Categories}
                          selectCategories={this.selectCategories}
                        />
                      ) : (
                        ""
                      )}
                    </div>

                    {/* brands filter */}
                    <div
                      className="tab-pane fade"
                      id="brandFilters"
                      role="tabpanel"
                    >
                      <FormControl
                        component="fieldset"
                        required
                        error
                        className={classes.formGroup}
                      >
                        {this.props.brandsList &&
                          this.props.brandsList.map((brands, index) => (
                            <FormControlLabel
                              label={brands}
                              key={"brands" + index}
                              control={
                                <Checkbox
                                  value={brands}
                                  classes={{
                                    root: classes.rootCheck,
                                    checked: classes.checked,
                                  }}
                                  onChange={this.handleChange("brands")}
                                  checkedIcon={
                                    <Done className={classes.sizeIcon} />
                                  }
                                />
                              }
                              classes={{
                                root: classes.labelRadio,
                              }}
                            />
                          ))}
                        {this.props.brandPenCount > 2 ? (
                          <div style={{ padding: "0px 7px" }}>
                            {this.props.brandPenCount > 4 ? (
                              <a
                                onClick={() => this.props.getFilters(0, 20, 4)}
                                style={{
                                  marginRight: "15px",
                                  color: BASE_COLOR,
                                }}
                              >
                                view less <span class="fas fa-angle-up"></span>
                              </a>
                            ) : this.props.brandPenCount <= 4 ? (
                              <a
                                onClick={() =>
                                  this.props.getFilters(
                                    this.props.brandsList.length + 1,
                                    100,
                                    1
                                  )
                                }
                                style={{ color: BASE_COLOR }}
                              >
                                view more{" "}
                                <span class="fas fa-angle-down"></span>
                              </a>
                            ) : (
                              ""
                            )}
                          </div>
                        ) : (
                          ""
                        )}
                      </FormControl>
                    </div>

                    {/* manufacturers filter */}
                    <div
                      className="tab-pane fade "
                      id="manufacturerFilters"
                      role="tabpanel"
                    >
                      <FormControl
                        component="fieldset"
                        required
                        error
                        className={classes.formGroup}
                      >
                        {this.props.manufacturers &&
                          this.props.manufacturers.map(
                            (manufacturer, index) => (
                              <FormControlLabel
                                key={"manufacturer" + index}
                                control={
                                  <Checkbox
                                    value={manufacturer}
                                    classes={{
                                      root: classes.rootCheck,
                                      checked: classes.checked,
                                    }}
                                    checkedIcon={
                                      <Done className={classes.sizeIcon} />
                                    }
                                    onChange={this.handleChange("manufacturer")}
                                  />
                                }
                                label={manufacturer}
                                classes={{
                                  root: classes.labelRadio,
                                }}
                              />
                            )
                          )}
                        {this.props.ManuPenCount > 2 ? (
                          <div style={{ padding: "0px 7px" }}>
                            {this.props.ManuPenCount > 4 ? (
                              <a
                                onClick={() => this.props.getFilters(0, 20, 5)}
                                style={{
                                  marginRight: "15px",
                                  color: BASE_COLOR,
                                }}
                              >
                                view less <span class="fas fa-angle-up"></span>
                              </a>
                            ) : this.props.ManuPenCount <= 4 ? (
                              <a
                                onClick={() =>
                                  this.props.getFilters(
                                    this.props.manufacturers.length + 1,
                                    100,
                                    2
                                  )
                                }
                                style={{ color: BASE_COLOR }}
                              >
                                view more{" "}
                                <span class="fas fa-angle-down"></span>
                              </a>
                            ) : (
                              ""
                            )}
                          </div>
                        ) : (
                          ""
                        )}
                      </FormControl>
                    </div>

                    {/* price filter */}
                    <div
                      className="tab-pane fade "
                      id="priceFilters"
                      role="tabpanel"
                    >
                      <div style={{ padding: "13px 26px" }}>
                        <p>
                          <span className="float-left">
                            <b>
                              {this.props.priceCurrency + " "}
                              {this.props.minPrice}
                            </b>
                          </span>
                          <span className="float-right">
                            <b>
                              {this.props.priceCurrency + " "}
                              {this.props.maxPrice}
                            </b>
                          </span>
                        </p>
                        <input
                          type="range"
                          name="points"
                          min={this.props.minPrice}
                          max={this.props.maxPrice}
                          value={this.state.slider || this.props.maxPrice}
                          onChange={this.handleSlider}
                          class="slider"
                          id="myRange"
                        ></input>
                      </div>
                    </div>

                    {/* sortby */}
                    <div
                      className="tab-pane fade "
                      id="sortFilters"
                      role="tabpanel"
                    >
                      <FormControl
                        component="fieldset"
                        className={classes.radioForm}
                      >
                        <RadioGroup
                          name="sortFilter"
                          value={this.state.value}
                          onChange={this.handleRadioChange}
                          className={classes.radioGroup}
                        >
                          <FormControlLabel
                            value="sort1"
                            control={
                              <Radio
                                classes={{
                                  root: classes.rootRadio,
                                  checked: classes.checked,
                                }}
                                checkedIcon={
                                  <Done className={classes.sizeIcon} />
                                }
                              />
                            }
                            classes={{
                              root: classes.labelRadio,
                              label: classes.labelRadio,
                            }}
                            label="Newest"
                            labelplacement="start"
                          />
                          <FormControlLabel
                            value="sort2"
                            control={
                              <Radio
                                classes={{
                                  root: classes.rootRadio,
                                  checked: classes.checked,
                                }}
                                checkedIcon={
                                  <Done className={classes.sizeIcon} />
                                }
                              />
                            }
                            classes={{
                              root: classes.labelRadio,
                              label: classes.labelRadio,
                            }}
                            label="Price Lowest"
                            labelplacement="start"
                          />
                          <FormControlLabel
                            value="sort3"
                            control={
                              <Radio
                                classes={{
                                  root: classes.rootRadio,
                                  checked: classes.checked,
                                }}
                                checkedIcon={
                                  <Done className={classes.sizeIcon} />
                                }
                              />
                            }
                            classes={{
                              root: classes.labelRadio,
                              label: classes.labelRadio,
                            }}
                            label="Price Highest"
                            labelplacement="start"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </div>
                </div>
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            position: "fixed",
            bottom: "0px",
            width: "100%",
            zIndex: "9",
          }}
        >
          <div className="row">
            <div className="col-4 pr-0">
              <button
                type="button"
                className="reset-filters"
                onClick={() => location.reload()}
              >
                Reset
              </button>
            </div>
            <div className="col-8 pl-0">
              <button
                type="button"
                className="save-filters"
                onClick={this.ApplyFilters}
              >
                Save Filters
              </button>
            </div>
          </div>
        </div>
      </Wrapper>
    ) : (
      ""
    );
  }
}

MobileViewFilters.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MobileViewFilters);
