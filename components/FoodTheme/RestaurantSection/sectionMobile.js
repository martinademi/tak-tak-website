import React from 'react';
import { Component } from 'react'
import { getRestaurants } from '../../../services/category';
import { setCookie, getCookiees, getCookie } from '../../../lib/session';

import Slider from 'react-slick';
import Router from "next/router";
import ListLoader from '../Loaders/listLoader';

const RouteTo = (store) => {
    setCookie("storeId", store.storeId)
    Router.push(`/restofront?id=${store.storeId}`, `/restaurant/${(store.storeName).replace(/%20/g, '').replace(/,/g, '').replace(/&/g, '').replace(/ /g, '-')}`).then(() => window.scrollTo(0, 0))
}

class RestaurantSectionMobile extends Component {


    state = {
        restaurantList: [],
        penCount: 0,
        loading: true,
    }


    componentDidMount() {
        let data = {
            type: 1,
            categoryId: this.props.categoryId,
            subcategoryId: this.props.category.subCatId,
            lat: getCookie("lat", ''),
            long: getCookie("long", ''),
            zoneId: this.props.zoneId,
            offset: 0,
            limit: 15
        } 
        getRestaurants(data).then(({ data }) => {
            
            this.setState({ restaurantList: data.data, penCount: data.storeCount, loading: false })
        }, (error) => {

        })
    }

    render() {

        const settingsRestList = {
            arrows: true,
            infinite: false,
            speed: 500,
            slidesToShow: 7,
            slidesToScroll: 1,
            responsive: [{ breakpoint: 567, settings: { slidesToShow: 3, slidesToScroll: 1 } }]
        };

        return (



            this.props.currentIndex == 3 ?
                this.state.restaurantList ?
                    <div className="row">
                        <div className="col-12 promotionsSliderComm">
                            <div className="promotionsSliderInner">
                                {/* <h6 className="promotionsH6Title">Popular Brands</h6> */}
                                <div className="promotionsSliderCls">
                                    <Slider {...settingsRestList}>
                                        {this.state.restaurantList.map((restaurant, index) =>
                                            <div key={"RestSlider" + index}>
                                                <img width="80" height="80" onClick={() => RouteTo(restaurant)} src={restaurant.bannerImage} alt={restaurant.storeName} title={restaurant.storeName} />
                                                <p className="promotionsSliderClsDesc">{restaurant.storeName}</p>
                                            </div>
                                        )}
                                    </Slider>
                                </div>
                            </div>
                        </div>
                    </div>
                    : ''
                :

                this.state.loading == false ?

                    this.state.restaurantList  ?
 
                        this.state.restaurantList.map((restaurant, index) =>
                            <div className="row" key={"RestList" + index}>
                                <div className="col-12 catListItemFullLayout" onClick={() => RouteTo(restaurant)}>
                                    <div className="row">
                                        <div className="col-auto">
                                            <img src={restaurant.bannerImage} width="80" height="80" />
                                        </div>
                                        <div className="col">
                                            <div className="row">
                                                <div className="col-8 px-0">
                                                    <h6 className="catListSecH6Title">{restaurant.storeName}</h6>
                                                    <p className="catListSecCatType">{restaurant.storeTypeMsg}</p>
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <div className="popularBrandItemOffersSecM">
                                                                <i className="fa fa-anchor"></i>
                                                                <span className="popularBrandItemOffersSpanM">Free Delivery</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-4">
                                                    {/* <img src="/static/foodImages/30minsRFree.jpg" width="56" height="20" className="30minsRFree float-right" /> */}
                                                </div>
                                            </div>
                                            <div className="row popularBrandItemInnerRatingMRow">
                                                <div className="col-12">
                                                    <div className="itemFullDetailsSec">
                                                        <div className="row">
                                                            <div className="col-3 p-0">
                                                                <div className="popularBrandItemInnerRatingM">
                                                                    <i className="fa fa-star"></i>
                                                                    <span className="popularBrandItemRatingM">{" " + parseFloat(restaurant.averageRating).toFixed(2)}</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-4 col-md-3">
                                                                <p className="itemDelTime">{parseFloat(restaurant.distance).toFixed(2)} KM</p>
                                                            </div>
                                                            <div className="col-md-6 col-5 pl-0 text-right">
                                                                <p className="itemPriceView">{restaurant.currencySymbol} {parseFloat(restaurant.costForTwo || 0.00).toFixed(0)} FOR TWO</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        )
                        : ''
                    : ListLoader()
        )
    }
}

export default RestaurantSectionMobile