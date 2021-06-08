const RestaurantHeader = props => {
  const { store } = props;
  let storeAddrParts = store ? store.storeAddr.split(",") : '';
  storeAddrParts = storeAddrParts[0] + "," + storeAddrParts[1] + "," + storeAddrParts[2]
  return (
    <div className="row">
      <div
        className="col-12 productDetailTitleSec"
        id="productDetailTitleSecID"
      >
        <div className="row justify-content-center">
          {/* <div className="col-xl-10 col-lg-12">  */}
          <div className="col cusWidthImpClsComm">
            <div className="row">
              <div className="col-12">
                <div className="row align-items-start">
                  {/* <div className="col-xl-3 col-lg-auto col-md col-sm-4">  */}
                  <div
                    className="col-auto pr-lg-0"
                    id="productDetailTitleImgSec"
                  >
                  {/* "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_508,h_320,c_fill/ce3edkmkgoqqcxpt5rbr" ||  */}
                    {props.store && props.store.bannerImage ? (
                      <img
                        src={'/static/images/new_imgs/storeDummy.png'}
                        // src={props.store.bannerImage}
                        className="popularBrandItemImgRep popularBrandItemImgRepClsImg"
                        alt={props.store.businessName}
                      />
                    ) : (
                        ""
                      )}
                  </div>
                  {/* <div className="col-xl-6 col-lg col-md-7 col-sm-8 productTitleDetailsSec">  */}
                  <div className="col-auto productTitleDetailsSec">
                    <div className="row">
                      <div className="col-lg-7 mx-4">
                        {/* productTitleDetailsSec  */}
                        <h1 className="productTitleH1">
                          {store ? store.businessName : ""}
                        </h1>
                        <p className="productTitleP">
                          {store ? storeAddrParts : ""}
                        </p>
                        {/* <p className="productTitleP my-2">North Indian</p> */}
                        <div
                          className="row py-2"
                          id="productTitleAllInOneRowID"
                        >
                          <div className="col-auto paddRhtSplproductTitleAllInOneComm productTitleAllInOneComm">
                            <i className="fa fa-star" />
                            <span className="productTitleAllInOneSpan">
                              {" "}
                              {props.store
                                ? parseFloat(
                                  props.store.businessRating
                                ).toFixed(2) || "- -"
                                : ""}
                            </span>
                            <p className="productTitleAllInOneP">{props.locale.rating}</p>
                          </div>
                          <div className="col-auto borderSplproductTitleAllInOneComm productTitleAllInOneComm">
                            <span className="productTitleAllInOneSpan">
                              {store ? store.estimatedTime || "- -" : ""}
                            </span>
                            <p className="productTitleAllInOneP">
                             {props.locale.deliveryTime}
                            </p>
                          </div>
                          <div className="col-auto paddLftSplproductTitleAllInOneComm productTitleAllInOneComm">
                            <span className="productTitleAllInOneSpan">
                              {props.currencySymbol || "$"} {store ? store.costForTwo || "- -" : ""}
                            </span>
                            <p className="productTitleAllInOneP">
                             {props.locale.constForTwo}
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 pr-0 productTitleDetailsSearchFilters">
                            <div className="row align-items-center">
                              <div
                                className="col-xl-12 col-sm col-12 mb-2 mb-sm-0"
                                id="ctmWth"
                              >
                                <div className="productTitleDetailsSearchFiltersFormSpl">
                                  <form className="">
                                    <div className="input-group restoSearchCont">
                                      <div className="input-group-prepend">
                                        <div className="input-group-text">
                                          <i className="fa fa-search" />
                                        </div>
                                      </div>
                                      <input
                                        type="text"
                                        value={props.searchQuery}
                                        onChange={props.OnChangeSearch}
                                        className="form-control"
                                        id="inlineFormInputGroupUsername2"
                                        placeholder={props.locale.searchDish}
                                      />
                                    </div>
                                  </form>
                                </div>
                              </div>
                              {/* <div className="col-xl-auto col-sm-auto col-6">
                                                            <div className="productTitleDetailsSearchFiltersForm">
                                                                <form>
                                                                    <div className="custom-control custom-checkbox">
                                                                        <input type="checkbox" className="custom-control-input" id="customCheck1" name="example1" />
                                                                        <label className="custom-control-label" htmlFor="customCheck1">Veg Only</label>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </div> */}
                              {/* <div className="col-xl-auto col-sm-auto col-6">
                                                            <div className="productTitleDetailsSearchFiltersForm">
                                                                <form>
                                                                    <div className="custom-control custom-checkbox">
                                                                        <input type="checkbox" className="custom-control-input" id="customCheck2" name="example1" />
                                                                        <label className="custom-control-label" htmlFor="customCheck2">Favourite</label>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </div> */}
                            </div>
                          </div>
                        </div>
                        {/* productTitleDetailsSec  */}
                      </div>
                      {store &&
                        store.offerTitle &&
                        store.offerTitle.length > 0 ? (
                          <div className="col-lg-4 align-self-center productTitleOffersSec">
                            {/* <div className="col-xl-3 col-lg-4 align-self-center d-none d-lg-block productTitleOffersSec">  */}
                            <span className="productTitleOfferAbs">Offer</span>
                            <h6 className="productTitleOffersH6">
                              <i className="fa fa-gift" /> {store.offerTitle}
                            </h6>
                          </div>
                        ) : (
                          ""
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RestaurantHeader;


