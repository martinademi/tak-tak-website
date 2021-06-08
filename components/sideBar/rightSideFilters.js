import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import Slider from "material-ui/Slider";
import CheckCircleOutline from "@material-ui/icons/CheckCircleOutlined";
import CheckCircle from "@material-ui/icons/CheckCircle";
import Tooltip from "@material-ui/core/Tooltip";
import FiberManualRecordSharp from "@material-ui/icons/FiberManualRecordOutlined";
import Shimmer from "react-shimmer-effect";
import {
  getFilterParams,
  searchFilterParams,
  sortFilterParams,
} from "../../services/filterApis";
import { setCookie, getCookie, getCookiees } from "../../lib/session";
import PrintList from "./printList";
import PrintSubList from "./printSubList";
import { BASE_COLOR } from "../../lib/envariables";

const styles = (theme) => ({
  root: {
    width: "99%",
    backgroundColor: theme.palette.background.paper,
    paddingBottom: "0px",
  },

  rootCheck: {
    color: "#aaa",
    "&$checked": {
      color: BASE_COLOR,
    },
    height: "25px",
    width: "25px",
    fontSize: "20px",
    borderRadius: "25px",
    float: "right",
    right: "0px !important",
  },

  label: {
    margin: "10px 0px",
    padding: "0px",
    fontSize: "0.840rem !important",
    letterSpacing: "0.3px",
    textTransform: "lowercase",
  },

  labelHead: {
    padding: "0px 5px !important",
    fontSize: "13px",
    color: "#212121",
    height: "40px",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
    fontWeight: "600",
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
    padding: "0px 0px",
    width: "100%",
  },
  nested: {
    paddingLeft: "4px",
  },
  sizeIcon: {
    fontSize: 18,
    fontWeight: 300,
  },
  sizeIconPlus: {
    fontSize: 21,
    fontWeight: 300,
  },
  navList: {
    overflow: "hidden",
    marginBottom: "10px",
    marginTop: "10px",
    borderBottom: "1px solid #f0f0f0",
  },
  circle: {
    height: "100px",
    width: "100px",
    borderRadius: "50%",
    padding: "10px",
    margin: "10px 15px",
  },
  line: {
    width: "100%",
    height: "15px",
    alignSelf: "center",
    margin: "7px 16px",
    borderRadius: "4px",
  },
  paraLine: {
    width: "37%",
    height: "25px",
    alignSelf: "center",
    margin: "7px 16px",
    borderRadius: "4px",
  },
});

let max = 0;
let min = 0;

class ListExampleNested extends React.Component {
  state = {
    brands: [],
    manufacturer: [],
    category: [],
    subcategory: [],
    slider: null,
  };

  constructor(props) {
    super(props);
    this.selectedOptions = this.selectedOptions.bind(this);
    this.removedOptions = this.removedOptions.bind(this);
    this.categorySelection = this.categorySelection.bind(this);
  }
  componentDidMount = () => {
    // passing ref to parent to call children functions
    this.props.onRef(this);
    let priceArr = [];
    let currency = null;
    this.setState({ slider: this.props.maxPrice });
  };

  handleChange = (name) => (e) => {
    e.target.checked
      ? this.selectedOptions(e, name)
      : this.removedOptions(e, name);
    this.handleFilterSelection();
  };

  handleFilterSelection = () => {
    // this.props.handleFilterSelection()
  };

  handleSlider = (event) => {
    this.setState({ slider: event.target.value }, () => {
      this.priceSelection();
      // this.handleFilterSelection();
    });
  };
// this fuction store the sub sub categories 
  getSubSubCategory = (subCatName) => {
    let storeId = getCookie("storeId", "");
    let queryName = getCookie("catQuery", "");
    let query = [
      { match_phrase_prefix: { "catName.en": queryName } },
      { match_phrase_prefix: { "subCatName.en": subCatName } },
    ];
    getFilterParams(0, 3, 0, 10, storeId, false, query)
      .then(
        ({ data }) => {
          
        },
        (error) => {
         
        }
      )
      .catch((err) => {});
  };
// store the price value and if the multiple filter scenario
  priceSelection = async () => {
    let brandQuery;
    let manufacturerQuery;
    let category;
    let subCat;
    let subsubCat;
    let priceQuery;
    this.state.manufacturer.length > 0
      ? (manufacturerQuery = await {
          match: { "manufactureName.en": this.state.manufacturer.toString() },
        })
      : "";

    this.props.useBrand
      ? (brandQuery = await {
          match: { "brandTitle.en": this.props.catName.toString() },
        })
      : this.state.brands.length > 0
      ? (brandQuery = await {
          match: { "brandTitle.en": this.state.brands.toString() },
        })
      : "";

    this.props.showSubCategory
      ? (category = await {
          match_phrase_prefix: { "catName.en": this.props.catName.toString() },
        })
      : this.state.category.length > 0
      ? (category = await {
          match_phrase_prefix: { "catName.en": this.state.category.toString() },
        })
      : "";

    this.props.showSubCategory
      ? this.state.category.length > 0
        ? (subCat = await {
            match_phrase_prefix: {
              "subCatName.en": this.state.category.toString(),
            },
          })
        : ""
      : "";

    this.state.subcategory.length > 0
      ? (subsubCat = await {
          match_phrase_prefix: {
            "subSubCatName.en": this.state.subcategory.toString(),
          },
        })
      : "";

    this.props.showSubCategory && name == "category"
      ? this.props.getSubSubCategory(this.state.category.toString())
      : "";
    priceQuery = {
      range: {
        "units.floatValue": {
          gte: 0,
          lte: this.state.slider > 0 ? this.state.slider : this.props.maxPrice,
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
    query = await query.filter((n) => {
      return n != undefined;
    });
    this.props.searchFilter(query);
    // this.props.applyPriceFilter(query)
  };
//  if the multiple filter scenario
  async selectedOptions(e, name) {
    let brandQuery;
    let manufacturerQuery;
    let category;
    let subCat;
    let subsubCat;
    let priceQuery;
    await this.setState({ [name]: this.state[name].concat([e.target.value]) });

    this.state.manufacturer.length > 0
      ? (manufacturerQuery = await {
          match: { "manufactureName.en": this.state.manufacturer.toString() },
        })
      : "";

    this.props.useBrand
      ? (brandQuery = await {
          match: { "brandTitle.en": this.props.catName.toString() },
        })
      : this.state.brands.length > 0
      ? (brandQuery = await {
          match: { "brandTitle.en": this.state.brands.toString() },
        })
      : "";

    this.props.showSubCategory
      ? (category = await {
          match_phrase_prefix: { "catName.en": this.props.catName.toString() },
        })
      : this.state.category.length > 0
      ? (category = await {
          match_phrase_prefix: { "catName.en": this.state.category.toString() },
        })
      : "";

    this.props.showSubCategory
      ? this.state.category.length > 0
        ? (subCat = await {
            match_phrase_prefix: {
              "subCatName.en": this.state.category.toString(),
            },
          })
        : ""
      : "";

    this.state.subcategory.length > 0
      ? (subsubCat = await {
          match_phrase_prefix: {
            "subSubCatName.en": this.state.subcategory.toString(),
          },
        })
      : "";

    this.props.showSubCategory && name == "category"
      ? this.props.getSubSubCategory(this.state.category.toString())
      : "";
    priceQuery = {
      range: {
        "units.floatValue": {
          gte: 0,
          lte: this.state.slider > 0 ? this.state.slider : this.props.maxPrice,
        },
      },
    };
    let query = [
      brandQuery,
      manufacturerQuery,
      category,
      subCat,
      subsubCat,
      priceQuery,
    ];
    query = await query.filter((n) => {
      return n != undefined;
    });

    this.props.searchFilter(query);
  }
// remove the option 
  async removedOptions(e, name) {
    let brandQuery;
    let manufacturerQuery;
    let category;
    let subCat;
    let priceQuery;

    var array = this.state[name];
    var index = array.indexOf(e.target.value);
    await array.splice(index, 1);
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

    this.props.showSubCategory
      ? (category = await {
          match_phrase_prefix: { "catName.en": this.props.catName.toString() },
        })
      : this.state.category.length > 0
      ? (category = await {
          match_phrase_prefix: { "catName.en": this.state.category.toString() },
        })
      : "";

    this.props.showSubCategory
      ? this.state.category.length > 0
        ? (subCat = await {
            match_phrase_prefix: {
              "subCatName.en": this.state.category.toString(),
            },
          })
        : ""
      : "";

    this.props.showSubCategory && name == "category"
      ? this.props.getSubSubCategory(this.state.category.toString())
      : "";
    priceQuery = {
      range: {
        "units.floatValue": {
          gte: 0,
          lte: this.state.slider > 0 ? this.state.slider : this.props.maxPrice,
        },
      },
    };
    let query = [brandQuery, manufacturerQuery, category, subCat, priceQuery];
    query = await query.filter((n) => {
      return n != undefined;
    });

    this.props.searchFilter(query);
  }
// store the category value and if the multiple filter scenario
  async categorySelection(
    categorySelected,
    subcategorySelected,
    subsubcategorySelected
  ) {
    let brandQuery;
    let manufacturerQuery;
    let category;
    let subCat;
    let subsubCat;
    let priceQuery;

    this.state.manufacturer.length > 0
      ? (manufacturerQuery = await {
          match: { "manufactureName.en": this.state.manufacturer.toString() },
        })
      : "";

    this.props.useBrand
      ? (brandQuery = await {
          match: { "brandTitle.en": this.props.catName.toString() },
        })
      : this.state.brands.length > 0
      ? (brandQuery = await {
          match: { "brandTitle.en": this.state.brands.toString() },
        })
      : "";

    categorySelected
      ? (category = await {
          match_phrase_prefix: { "catName.en": categorySelected.toString() },
        })
      : "";
    subcategorySelected
      ? (subCat = await {
          match_phrase_prefix: {
            "subCatName.en": subcategorySelected.toString(),
          },
        })
      : "";
    subsubcategorySelected
      ? (subsubCat = await {
          match_phrase_prefix: {
            "subSubCatName.en": subsubcategorySelected.toString(),
          },
        })
      : "";
    priceQuery = {
      range: {
        "units.floatValue": {
          gte: 0,
          lte: this.state.slider > 0 ? this.state.slider : this.props.maxPrice,
        },
      },
    };

    let query = [
      brandQuery,
      manufacturerQuery,
      category,
      subCat,
      subsubCat,
      priceQuery,
    ];
    query = await query.filter((n) => {
      return n != undefined;
    });

    this.props.searchFilter(query);
    this.props.updateSlug(
      categorySelected,
      subcategorySelected,
      subsubcategorySelected
    );
    this.handleFilterSelection();
  }
// store the sub category value and if the multiple filter scenario
  async subCategorySelection(subcategorySelected, subsubcategorySelected) {
    let brandQuery;
    let manufacturerQuery;
    let category;
    let subCat;
    let subsubCat;
    let priceQuery;

    this.state.manufacturer.length > 0
      ? (manufacturerQuery = await {
          match: { "manufactureName.en": this.state.manufacturer.toString() },
        })
      : "";

    this.props.useBrand
      ? (brandQuery = await {
          match: { "brandTitle.en": this.props.catName.toString() },
        })
      : this.state.brands.length > 0
      ? (brandQuery = await {
          match: { "brandTitle.en": this.state.brands.toString() },
        })
      : "";

    categorySelected
      ? (category = await {
          match_phrase_prefix: { "catName.en": categorySelected.toString() },
        })
      : "";
    subcategorySelected
      ? (subCat = await {
          match_phrase_prefix: {
            "subCatName.en": subcategorySelected.toString(),
          },
        })
      : "";
    subsubcategorySelected
      ? (subsubCat = await {
          match_phrase_prefix: {
            "subSubCatName.en": subsubcategorySelected.toString(),
          },
        })
      : "";

    priceQuery = {
      range: {
        "units.floatValue": {
          gte: 0,
          lte: this.state.slider > 0 ? this.state.slider : this.props.maxPrice,
        },
      },
    };

    let query = [
      brandQuery,
      manufacturerQuery,
      category,
      subCat,
      subsubCat,
      priceQuery,
    ];
    query = await query.filter((n) => {
      return n != undefined;
    });

    this.props.searchFilter(query);
    this.props.updateSlug(
      categorySelected,
      subcategorySelected,
      subsubcategorySelected
    );
    this.handleFilterSelection();
  }

  render() {
    
    const {
      classes,
      filterCatLoading,
      filterManuLoading,
      filterBrandLoading,
      filterPriceLoading,
    } = this.props;
    let catnameHead;
    this.props.showSubCategory
      ? (catnameHead = "Sub Categories")
      : (catnameHead = "Categories");

    return (
      // <div className={classes.root + ' '} style={{ minHeight: this.props.height, maxHeight: '100vh', background: 'transparent' }}>
      <div
        className={classes.root + " "}
        style={{ minHeight: this.props.height, background: "transparent" }}
      >
        {this.props.Categories && this.props.Categories.length > 0 ? (
          this.props.showSubCategory ? (
            ""
          ) : (
            <div className="row filter-bottom-border">
              <div className="col-12 py-lg-3 py-2 filtersCategoriesLayout">
                <h6 className="filtersCategories">{this.props.locale ? this.props.locale.CATEGORIES :"CATEGORIES"}</h6>
                
                {/* categories  */}
                {this.props.Categories.map((category, index) => (
                  <div key={"catComDyna" + index} className="catComDyna">
                    <p>
                      <a
                        className="filtersCategoriesSubSelect"
                        onClick={() =>
                          this.categorySelection(category, null, null)
                        }
                        data-toggle="collapse"
                        href={"#collapseExample" + index}
                        role="button"
                        aria-expanded="false"
                        aria-controls="collapseExample1"
                      >
                        {category}
                      </a>
                    </p>
                    <div className="collapse" id={"collapseExample" + index}>
                      <div className="card card-body">
                        <div className="col-12 p-0 filtersCategoriesSubSelectULLayout">
                          <ul className="nav flex-column filtersCategoriesSubSelectItemsUL">
                            <PrintList
                              category={category}
                              categorySelection={this.categorySelection}
                            />
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* {this.props.CatPenCount >= 4 ?
                                <div style={{ padding: '0px 7px' }}>
                                    {this.props.CatPenCount > 4 ?
                                        <a onClick={() => this.props.getFilters(1, 4, 6)} style={{ marginRight: '15px', color: BASE_COLOR }}>view less <span className="fas fa-angle-up"></span></a> :
                                        this.props.CatPenCount == 4 ? <a onClick={() => this.props.getFilters(this.props.Categories.length + 1, 100, 3)} style={{ color: BASE_COLOR }}>view more <span className="fas fa-angle-down"></span></a> : ''
                                    }
                                </div> : ''
                            } */}
              </div>
            </div>
          )
        ) : !this.props.isFromCategory && filterCatLoading ? (
          <div className="col-12 px-0">
            <Shimmer>
              <div className={classes.paraLine} />
              <div className={classes.line} />
              <div className={classes.line} />
            </Shimmer>
          </div>
        ) : (
          ""
        )}
{/* sub categories */}
        {this.props.showSubCategories &&
        this.props.showSubCategories.length > 0 ? (
          <div className="row filter-bottom-border">
            <div className="col-12 py-lg-3 py-2 filtersCategoriesLayout">
              <h6 className="filtersCategories">{this.props.locale ? this.props.locale.SUBCATEGORIES :"SUB CATEGORIES"}</h6>
              {this.props.showSubCategories.map((category, index) => (
                <div key={"catComDyna" + index} className="catComDyna">
                  <p>
                    <a
                      className="filtersCategoriesSubSelect"
                      onClick={() =>
                        this.categorySelection(
                          this.props.catName,
                          category,
                          null
                        )
                      }
                      data-toggle="collapse"
                      href={"#collapseExample" + index}
                      role="button"
                      aria-expanded="false"
                      aria-controls="collapseExample1"
                    >
                      {category}
                    </a>
                  </p>
                  <div className="collapse" id={"collapseExample" + index}>
                    <div className="card card-body">
                      <div className="col-12 p-0 filtersCategoriesSubSelectULLayout">
                        <ul className="nav flex-column filtersCategoriesSubSelectItemsUL">
                          {/* <PrintList getFilters={this.props.getFilters} category={category} categorySelection={this.categorySelection} /> */}
                          <PrintSubList
                            category={this.props.catName}
                            subCategory={category}
                            categorySelection={this.categorySelection}
                          />
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* {this.props.CatPenCount >= 4 ?
                                    <div style={{ padding: '0px 7px' }}>
                                        {this.props.CatPenCount > 4 ?
                                            <a onClick={() => this.props.getFilters(1, 4, 6)} style={{ marginRight: '15px', color: BASE_COLOR }}>view less <span className="fas fa-angle-up"></span></a> :
                                            this.props.CatPenCount == 4 ? <a onClick={() => this.props.getFilters(this.props.Categories.length + 1, 100, 3)} style={{ color: BASE_COLOR }}>view more <span className="fas fa-angle-down"></span></a> : ''
                                        }
                                    </div> : ''
                                } */}
            </div>
          </div>
        ) : this.props.isFromCategory && filterCatLoading ? (
          <div className="col-12 px-0">
            <Shimmer>
              <div className={classes.paraLine} />
              <div className={classes.line} />
              <div className={classes.line} />
            </Shimmer>
          </div>
        ) : (
          ""
        )}
{/* brands */}
        {this.props.brandsList.length > 0 ? (
          <List
            component="nav"
            subheader={
              <ListSubheader
                classes={{
                  root: classes.labelHead,
                }}
                disableSticky={true}
                component="div"
              >
                {" "}
                {this.props.locale ? this.props.locale.Brands: "Brands"}{" "}
              </ListSubheader>
            }
            classes={{
              root: classes.navList,
            }}
          >
            <FormControl
              component="fieldset"
              required
              error
              className={classes.formGroup}
            >
              {/* checkedIcon={<Done className={classes.sizeIcon} />} */}
              {this.props.brandsList.map((brands, index) => (
                <FormControlLabel
                  label={brands}
                  control={
                    <Checkbox
                      value={brands}
                      classes={{
                        root: classes.rootCheck,
                        checked: classes.checked,
                      }}
                      icon={
                        <FiberManualRecordSharp
                          className={classes.sizeIconPlus}
                        />
                      }
                      checkedIcon={<CheckCircle className={classes.sizeIcon} />}
                      onChange={this.handleChange("brands")}
                    />
                  }
                  classes={{
                    root: classes.label,
                  }}
                />
              ))}
              {/* {this.props.brandPenCount >= 4 ?
                                <div style={{ padding: '0px 7px' }}>
                                    {this.props.brandsList.length > 4 ?
                                        <a onClick={() => this.props.getFilters(1, 4, 4)} style={{ marginRight: '15px', color: BASE_COLOR }}>view less <span className="fas fa-angle-up"></span></a>
                                        : ''
                                    }
                                    {this.props.brandsList.length == 4 ? <a onClick={() => this.props.getFilters(this.props.brandsList.length + 1, 100, 1)} style={{ color: BASE_COLOR }}>view more <span className="fas fa-angle-down"></span></a> : ''
                                    }
                                </div> : ''
                            } */}
            </FormControl>
          </List>
        ) : !this.props.isFromBrands && filterBrandLoading ? (
          <div className="col-12 px-0">
            <Shimmer>
              <div className={classes.paraLine} />
              <div className={classes.line} />
              <div className={classes.line} />
            </Shimmer>
          </div>
        ) : (
          ""
        )}
{/* manufacture */}
        {this.props.manufacturers.length > 0 ? (
          <List
            component="nav"
            subheader={
              <ListSubheader
                classes={{
                  root: classes.labelHead,
                }}
                disableSticky={true}
                component="div"
              >
                {" "}
                {this.props.locale ? this.props.locale.Manufacturers :"Manufacturers"}{" "}
              </ListSubheader>
            }
            classes={{
              root: classes.navList,
            }}
          >
            <FormControl
              component="fieldset"
              required
              error
              className={classes.formGroup}
            >
              {this.props.manufacturers.map((manufacturer, index) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      value={manufacturer}
                      classes={{
                        root: classes.rootCheck,
                        checked: classes.checked,
                      }}
                      icon={
                        <FiberManualRecordSharp
                          className={classes.sizeIconPlus}
                        />
                      }
                      checkedIcon={<CheckCircle className={classes.sizeIcon} />}
                      onChange={this.handleChange("manufacturer")}
                    />
                  }
                  label={manufacturer}
                  classes={{
                    root: classes.label,
                  }}
                />
              ))}
              {/* {this.props.ManuPenCount >= 4 ?
                                <div style={{ padding: '0px 7px' }}>
                                    {this.props.ManuPenCount > 4 ?
                                        <a onClick={() => this.props.getFilters(1, 4, 5)} style={{ marginRight: '15px', color: BASE_COLOR }}>view less <span className="fas fa-angle-up"></span></a> :
                                        this.props.ManuPenCount == 4 ?
                                            <a onClick={() => this.props.getFilters(this.props.manufacturers.length + 1, 100, 2)} style={{ color: BASE_COLOR }}>view more <span className="fas fa-angle-down"></span></a>
                                            : ''
                                    }
                                </div> : ''
                            } */}
            </FormControl>
          </List>
        ) : filterManuLoading ? (
          <div className="col-12 px-0">
            <Shimmer>
              <div className={classes.paraLine} />
              <div className={classes.line} />
              <div className={classes.line} />
            </Shimmer>
          </div>
        ) : (
          ""
        )}
{/* price */}
        {
        this.props.minPrice &&
        this.props.maxPrice &&
        this.state.slider !== null ? (
          <List
            component="nav"
            subheader={
              <ListSubheader
                classes={{
                  root: classes.labelHead,
                }}
                disableSticky={true}
                component="div"
              >
                {" "}
                {this.props.locale ? this.props.locale.Price :"Price"}{" "}
              </ListSubheader>
            }
            classes={{
              root: classes.navList,
            }}
          >
            <div style={{ padding: "13px" }}>
              <p>
                <span className="float-left">
                  <b>
                    {"$" + " "}
                    {this.props.minPrice}
                  </b>
                </span>
                <span className="float-right">
                  <b>
                    {"$" + " "}
                    {Math.ceil(this.state.slider||this.props.maxPrice)}
                  </b>
                </span>
              </p>

              <input
                type="range"
                name="points"
                min={this.props.minPrice}
                max={Math.ceil(this.props.maxPrice)}
                value={Math.ceil(this.state.slider || this.props.maxPrice)}
                onChange={this.handleSlider}
                class="slider"
                id="myRange"
              ></input>

              {/* <Tooltip disableHoverListener title={this.state.slider} placement="top">
                                    <Slider 
                                        min={this.props.minPrice}
                                        max={this.props.maxPrice}
                                        step={this.props.maxPrice / 10}
                                        value={this.state.slider}
                                        onChange={this.handleSlider}
                                    />
                                </Tooltip> */}
            </div>
          </List>
        ) : (
          ""
        )}
      </div>
    );
  }
}

ListExampleNested.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListExampleNested);
