import React from 'react';
import FoodListCard from '../Cards/foodListCard';


const FoodCategoriesMobile = (props) => (

    <div className="row">
        <div className="col-12 mb-3 foodListMV">
            <div className="row prodetailsRecomH6TitleRow">
                <div className="col-12">
                    <h6 className="prodetailsSubSecCommH6Title">{props.category.name}</h6>
                </div>
            </div>

            {props.category.subCat && props.category.subCat.length > 0 ? props.category.subCat.map((subcategory, index) =>
                <div id="subcategoryAccordion" className="row">
                    <div className="col-12 prodetailsSubSecComm productDetailSrlSpySec">

                        <div data-toggle="collapse" href={"#" + (props.category.name + subcategory.name).replace(/[^A-Za-z]/g, "")} className="prodetailsSubSecCommTitle">
                            <span className="prodetailsSubSecCommSpanTitleSub">{subcategory.name}</span>
                            <p className="prodetailsSubSecCommPDescMTitle">{subcategory.product.length} items</p>
                        </div>

                        <div id={(props.category.name + subcategory.name).replace(/[^A-Za-z]/g, "")} className="collapse" data-parent="#subcategoryAccordion">
                            {subcategory.product && subcategory.product.length > 0 ?
                                subcategory.product.map((product) =>
                                    <FoodListCard product={product} addToCart={props.addToCart} openAddOnDialog={props.openAddOnDialog}
                                        openOptionsDialog={props.openOptionsDialog} cartProducts={props.cartProducts} editCart={props.editCart}
                                    />
                                ) : ''}


                            {/* {subcategory.product && subcategory.product.length > 0 ?
                                subcategory.product.map((product) =>
                                    <div className="row">
                                        <div className="col-12 mb-3">
                                            <div className="row align-items-center justify-content-between">
                                                <div className="col-8 col-sm-8">
                                                    <div className="prodetailsSubSecCommItemTitle">
                                                        <i className={"fa fa-star " + subcategory.name}></i>
                                                        <span className="prodetailsSubSecCommSpanTitle">{product.productName}</span>
                                                        <p className="prodetailsSubSecCommPDescM">$ {product.priceValue} </p>
                                                    </div>
                                                </div>
                                                <div className="col-auto col-sm-2">
                                                    <button className="btn btn-default prodetailsRecomItemAddBtn">add</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : ''} */}


                        </div>

                    </div>
                </div>
            ) : ''}
        </div>
    </div>
)

export default FoodCategoriesMobile;
