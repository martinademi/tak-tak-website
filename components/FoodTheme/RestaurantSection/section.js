import React from "react";
import { Component } from "react";
import StoreCard from "../Cards/storeCard";
import { getRestaurants } from "../../../services/category";
import cardLoader from "../Loaders/cardLoader";
import Router from "next/router";
import { setCookie, getCookiees, getCookie } from "../../../lib/session";

class RestaurantSection extends Component {
  state = {
    restaurantList: [],
    penCount: 0,
    loading: true
  };

  componentDidMount() {
    let data = {
      type: 1,
      categoryId: this.props.categoryId,
      subcategoryId: this.props.category.subCatId,
      lat: getCookie("lat", ""),
      long: getCookie("long", ""),
      zoneId: this.props.zoneId,
      offset: 0,
      limit: 15
    };
    getRestaurants(data).then(
      res => {
        const { data } = res;
       
        this.setState({
          restaurantList: data.data,
          penCount: data.storeCount,
          loading: false
        });
      },
      error => {}
    );
  }

  goToProdsList = () => {
    setCookie("selectedCatId", this.props.category.subCatId);
    setCookie("selctedCatName", this.props.category.subCatName);
   
    // Router.push(`/restViewAll?id=${this.props.category.subCatId}`)
    Router.push(
      `/restViewAll?id=${this.props.category.subCatId}`,
      `/view-all/${this.props.category.subCatName
        .replace(/%20/g, "")
        .replace(/,/g, "")
        .replace(/&/g, "")
        .replace(/ /g, "-")}`
    ).then(() => window.scrollTo(0, 0));
  };

  render() {
   
    return (
      <div className="row">
        <div className="col-12 popularBrandsSec">
          <h3 className="popularBrandsSecTitle">
            {this.props.category.subCatName}
          </h3>

          {this.state.loading == false ? (
            <div className="row restCardRow">
              {this.state.restaurantList && this.state.restaurantList.length > 0
                ? this.state.restaurantList.map((restaurant, index) => (
                    <StoreCard
                      className={"col-md-4 col-xl-4"}
                      key={"StoreCard" + index}
                      startTopLoader={this.props.startTopLoader}
                      restaurant={restaurant}
                      currencySymbol={this.props.currencySymbol}
                      expireCart={this.props.expireCart}
                      myCart={this.props.myCart}
                    />
                  ))
                : ""}

              {/* {this.state.penCount > 6 ? (
                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 moreProdsSplSec">
                  <div
                    className="popularBrandItemInnerLayout"
                    onClick={this.goToProdsList}
                  >
                    <div className="moreProdsSpl d-flex align-items-center justify-content-center">
                      <h4 className="moreProdsSplH4Title">
                        +
                        {this.state.penCount - this.state.restaurantList
                          ? this.state.restaurantList.length
                          : 0}{" "}
                        more
                      </h4>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )} */}
            </div>
          ) : (
            <div className="row">{cardLoader()}</div>
          )}
        </div>
      </div>
    );
  }
}

export default RestaurantSection;
