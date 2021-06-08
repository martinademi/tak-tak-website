
import React from 'react';
import FoodListCard from '../Cards/foodListCard';
  
const FoodCategories = (props) => (
    <div id={(props.category.name).replace(/[^A-Za-z]/g, "")}>
        <div className="row">
            <div className="col-12"> 
                <div className="productDetailSrlSpyItemsList">
                    <h4 className="productDetailSrlSpyH4Title">{props.category.name}</h4>

                    {props.category.subCat && props.category.subCat.length > 0 ? props.category.subCat.map((subcategory) =>
                        <div>
                            <h3 className="productDetailSrlSpyH3Title">{subcategory.name}</h3>
                            <p className="productDetailSrlSpyPTitle">{subcategory.product.length} item</p>
                            <span className="I6-HS"></span>

                            {subcategory.product && subcategory.product.length > 0 ?
                                subcategory.product.map((product) =>
                                    <FoodListCard product={product} addToCart={props.addToCart} editCart={props.editCart} openAddOnDialog={props.openAddOnDialog}
                                  openOptionsDialog={props.openOptionsDialog} cartProducts={props.cartProducts} cartLoadProdId={props.cartLoadProdId}
                                    /> 
                                ) : ''} 

                        </div>

                    ) : ''}

                </div>
            </div>
        </div>
    </div>
)

export default FoodCategories;