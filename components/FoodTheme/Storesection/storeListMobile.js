import Router from "next/router";
import { setCookie } from '../../../lib/session';


const RouteTo = (store) => {
    setCookie("storeId", store.storeId)
    Router.push(`/restofront?id=${store.storeId}`, `/restaurant/${(store.storeName).replace(/%20/g, '').replace(/,/g, '').replace(/&/g, '').replace(/ /g, '-')}`).then(() => window.scrollTo(0, 0))
}

const RouteToStore = (store, categoryId) => {
    setCookie("storeId", store.storeId)
    setCookie("storeType", store.type);
    setCookie("stroeCategoryId", categoryId);
    Router.push(`/stores/${store.storeName.replace(/,/g, '').replace(/& /g, '').replace(/ /g, '-')}`)
}


const StoreList = (props) => (
    props.restaurantList && props.restaurantList.length > 0 ?
        props.restaurantList.map((restaurant, index) =>
            <div key={"storeList" + index + restaurant.storeName} className="col-12 catListSecM">
                <div className="row" key={"RestList" + index}>
                    <div className="col-12 catListItemFullLayout"
                        onClick={props.type == 2 ? (() => RouteToStore(restaurant, props.categoryId)) : (() => RouteTo(restaurant))}
                    >
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
            </div>
        ) : ''
)

export default StoreList