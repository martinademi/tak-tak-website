
const PlainCard = (props) => (
    <div className="productDetailSrlSpyItemBxShdw px-3">
        <img src={props.product.mobileImage[0].image} width="244" height="160" className="popularBrandItemImgRep productDetailrecomItemImg" alt={props.product.productName} />
        <h6 className="productDetailSrlSpyH6Name" style={{paddingLeft:'20px'}}>  {props.product.productName} </h6>
        <p className="productDetailSrlSpyNameCat">Starters</p>

        <div className="row align-items-center">
            <div className="col-lg">
                <h5 className="productDetailSrlSpyNamePrice"> $   {props.product.priceValue} </h5>
            </div>
            <div className="col-xl-5 col-lg-5">
                {/* <span className="addOnBtnDV">+</span> */}
                <button className="btn btn-default prodetailsRecomItemAddBtnDV" data-toggle="modal" data-target="#addOnsModal">add</button>
                {/* <p className="customisableReminder">Customisable</p> */}
            </div>
        </div>
    </div>
)

export default PlainCard;