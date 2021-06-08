import React from "react";
import { OFFER_ICON_GREEN } from "../../../lib/envariables";

const storeListMobile = props => {
  const { store, index } = props;
  return (
    <div
    className={`col-12 storeListing ${
      !props.store.storeIsOpen && "storeClosed"
    }`}
    onClick={() => {
   
      props.store.storeIsOpen && props.handleStoreRoute(store);
    }}
    key={"storeList-" + index}
  >
      <div className="row align-items-start">
        <div className="col-3 pr-0">
          <img
            src={store.bannerImage || store.bannerimage}
            height="60px"
            width="90%"
            alt={store.storeName}
          />
        </div>
        <div className="col-9 pl-2">
          <p className="storeName mt-0">{store.storeName}</p>
          {store.storeSubCategory ?<p className="storeAddr">{store.storeSubCategory}</p> :<div className="pb-2"></div> }
          <p className="storeAddr">{store.areaName}</p>
          <p className="offerTitle">
            <div className="row">
              <div className="col-auto pr-0">
                {" "}
                {store.offerTitle && store.offerTitle.length > 0 ? (
                  <img
                    style={{ marginRight: "4px", height: "12px" }}
                    src={OFFER_ICON_GREEN}
                  />
                ) : (
                  ""
                )}
              </div>
              <div className="col-10 pl-0">{store.offerTitle}</div>
            </div>
          </p>

         
        </div>
        <div className="col-12">
        <div className="row pl-1 text-center">
            <div className="col-12 my-1 py-1 px-0 storeDetail">
              <div className="row align-items-center">
                <div className="col-3 pl-0 storeDetailTags">
                  <span>
                    <i className="fa fa-star" style={{ fontSize: "14px" }} />
                  </span>{" "}
                  <span>
                    {parseFloat(store.averageRating || 0.0).toFixed(2)}
                  </span>
                </div>
                <div className="col-3 pl-0 storeDetailTags">
                  <span>{parseFloat(store.distanceKm).toFixed(2)} </span>
                  <span>Km</span>
                </div>
                <div className="col-3 storeDetailTags">
                  {store.storeType == "1" ? "" : <span>Min.</span>}{" "}
                  <span>
                    {store.currencySymbol}
                    {store.minimumOrder}
                  </span>{" "}
                  {store.storeType == "1" ? (
                    <span style={{ margin: "0px 3px" }}>For Two</span>
                  ) : (
                    ""
                  )}{" "}
                </div>
                <div className="col-3 pl-0 storeDetailTags">
                  <span>{(store.avgDeliveryTime)} </span>
                  <span>mins</span>
                </div>
                <div />
              </div>
            </div>
          </div>
      </div>
      </div>
      {!props.store.storeIsOpen && (
        <div className="storeclosed" style={{ color: "red", float: "left" }}>
           Closed
        </div>
      )}
      <style jsx>{`
        .storeClosed {
          opacity: 0.5;
          cursor: not-allowed !important;
        }
      `}</style>
    </div>
  );
};

export default storeListMobile;
