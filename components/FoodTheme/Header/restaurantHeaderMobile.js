import Wrapper from "../../../hoc/wrapperHoc";

const RestaurantHeaderMobile = props => {
  const { store } = props;
  return (
    <Wrapper>
      <div className="row">
        <div className="col-12 prodetailsTitleSecM">
          <div className="prodetailsTitleSecInnerM">
            <h5 className="prodetailsH5TitleM">
              {" "}
              {store ? store.businessName : ""}{" "}
            </h5>
            <p className="prodetailsPTitle">{store ? store.storeAddr : ""}</p>
          </div>
        </div>
      </div>
      <div className="row py-3 prodetailsItemRatingMRow">
        <div className="col-4 text-center">
          <div className="prodetailsItemRatingM">
            <i className="fa fa-star" />
            <span className="">
              {store ? " " + parseFloat(store.businessRating).toFixed(2) : ""}
            </span>
          </div>
          <p className="prodetailsItemRatingPDescM">ratings</p>
        </div>
        <div className="col-4 text-center">
          <div className="prodetailsItemRatingM">
            {store ? store.estimatedTime || "- -" : ""}
          </div>
          <p className="prodetailsItemRatingPDescM">Delivery Time</p>
        </div>
        <div className="col-4 text-center">
          <div className="prodetailsItemRatingM">
            $ {store ? store.costForTwo || "- -" : ""}
          </div>
          <p className="prodetailsItemRatingPDescM">For Two</p>
        </div>
      </div>
      <div className="row prodetailsItemOffersSecMRow">
        <div className="col-12  productTitleDetailsSearchFilters">
          <div className="row align-items-center">
            <div className="col-xl-6 col-sm col-12 mb-2 mb-sm-0" id="ctmWth">
              <div className="productTitleDetailsSearchFiltersFormSpl">
                <form className="">
                  <div className="input-group">
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
                      placeholder="search for dishes..."
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="col-12">
                <div className="prodetailsItemOffersSecM">
                    <i className="fa fa-anchor"></i>
                    <span className="prodetailsItemffersSpanM">Free Delivery on orders above $99</span>
                </div> 
            </div> */}
      </div>

      <div className="row" />
    </Wrapper>
  );
};
export default RestaurantHeaderMobile;
