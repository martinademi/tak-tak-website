import Router from "next/router";
import { setCookie, getCookiees, getCookie } from "../../../lib/session";
import {
  NavigateToRestaurant,
  NavigateToStore,
} from "../../../lib/navigation/navigation";

const RouteToRestaurant = (store, loaderCallback, props) => {
  // check if the category is different, clear the old cart
  if (
    props.myCart &&
    props.myCart.cart &&
    props.myCart.cart.length > 0 &&
    getCookie("storeType") != store.storeType
  ) {
    props.expireCart(store, "restaurant"); // calling the parent function to open cart reset dialog
    return;
  }

  loaderCallback();

  NavigateToRestaurant(store);
};

const RouteToStore = (store, categoryId, loaderCallback, props) => {
  // check if the category is different, clear the old cart
  if (
    props.myCart &&
    props.myCart.cart &&
    props.myCart.cart.length > 0 &&
    getCookie("storeType") &&
    getCookie("storeType") != store.storeType
  ) {
    props.expireCart(store, "store", categoryId); // calling the parent function to open cart reset dialog
    return;
  }

  loaderCallback();

  NavigateToStore(store, categoryId);
};

const StoreCard = (props) => {
  let storeOpen = true;
  if (props.restaurant.storeType == 1) {
    storeOpen = props.restaurant.toreIsOpen;
  } else {
    storeOpen = props.restaurant.storeIsOpen;
  }

 
  const storeImage =
    props.restaurant.bannerImage && props.restaurant.bannerImage.length > 0
      ? props.restaurant.bannerImage
      : props.restaurant.bannerimage && props.restaurant.bannerimage.length > 0
      ? props.restaurant.bannerimage
      : props.restaurant.logoImage && props.restaurant.logoImage.length > 0
      ? props.restaurant.logoImage
      : "";
  return (
    <div
      className={"col-6 popularBrandItem px-0 " + props.className}
      onClick={
        storeOpen &&
        (props.type == 2
          ? () =>
              RouteToStore(
                props.restaurant,
                props.categoryId,
                props.startTopLoader,
                props
              )
          : () =>
              RouteToRestaurant(props.restaurant, props.startTopLoader, props))
      }
    >
      {/* "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_508,h_320,c_fill/w1lk5ym4lhaaoqzyll1u" ||  */}
      <div
        className={`popularBrandItemInnerLayout ${!storeOpen && "storeClosed"}`}
      >
        {!storeOpen && (
          <div className="storeclosed" style={{ color: "red", float: "right" }}>
            Store closed
          </div>
        )}
        <img
          // src={'/static/images/new_imgs/storeDummy.png'}
          src={storeImage}
          // src={props.restaurant.bannerImage || props.restaurant.bannerimage || props.logoImage}
          width=""
          height="160"
          className="popularBrandItemImgRep img-fluid"
          alt={props.restaurant.storeName || props.restaurant.businessName}
        />
        <h6 className="popularBrandItemTitle">
          {props.restaurant.storeName || props.restaurant.businessName}
        </h6>
        <p className="popularBrandItemCat">
          {props.restaurant.storeCategory || props.restaurant.storeTypeMsg}
        </p>
        <div className="row">
          <div className="col-12">
            <div className="popularBrandItemInnerSec">
              <div className="row align-items-center">
                <div className="col-3 pr-0">
                  <div className="popularBrandItemInnerRating">
                    <i className="fa fa-star" />
                    <span className="popularBrandItemRating">
                      {" " +
                        parseFloat(props.restaurant.averageRating || 0).toFixed(
                          2
                        )}
                    </span>
                  </div>
                </div>
                <div className="col-9 pl-0 text-left popularBrandItemServingsCommSEC">
                  <span className="popularBrandItemDot">•</span>
                  <span className="popularBrandItemServingsComm">
                    {parseFloat(
                      props.restaurant.distance ||
                        props.restaurant.distanceMiles
                    ).toFixed(2)}{" "}
                    KM
                  </span>
                  <span className="popularBrandItemDot">•</span>
                  <span className="popularBrandItemServingsComm mr-1">
                    {props.restaurant.currencySymbol || "$"}
                    {parseFloat(props.restaurant.costForTwo || 0.0).toFixed(
                      0
                    )}{" "}
                    FOR TWO
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {props.restaurant.offerTitle ? (
          <div className="row">
            <div className="col-12">
              <div className="popularBrandItemOffersSec">
                {/* <i className="offerIcon" /> */}
                <div className="row align-items-center">
                  <div className="col-1 pl-2 pr-3">
                    <img
                      src="/static/images/updated/percentage.svg"
                      height="30px"
                    />
                  </div>
                  <div className="col-9 pl-1">
                    <span
                      title={props.restaurant.offerTitle}
                      className="popularBrandItemOffersSpan"
                    >
                      {props.restaurant.offerTitle}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="row">
          {/* <div className="col-12">
            <div className="popularBrandItemQkViewSec">
              <div className="row">
                <div className="col-6">
                  <span className="popularBrandItemQkViewOutlets">3 Outlets</span>
                </div>
                <div className="col-6 text-right">
                  <span className="popularBrandItemQkView">Quick View</span>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default StoreCard;
