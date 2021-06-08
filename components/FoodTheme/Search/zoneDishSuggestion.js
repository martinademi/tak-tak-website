
import React from 'react'
import { Component } from 'react'
import { connect } from 'react-redux'
import Wrapper from '../../../hoc/wrapperHoc'
import { searchProductFromZone } from '../../../services/filterApis'
import FoodListCard from '../Cards/foodListCard'

class DishList extends React.Component {

    state = {
        stores: []
    }
    renderData = (productList) => {

        let Category = {};
        let CatArray = [];

        for (let i = 0; i < productList.length; i++) {
            let item = productList[i];
            if (typeof Category[item.storeId] == 'undefined') {
                Category[item.storeId] = {
                    storeId: item.storeId,
                    storeName: item.storeName,
                    storeLogo: item.storeLogo,
                    products: []
                }
            }

            Category[item.storeId]['products'].push(item);
        }
        CatArray = Object.keys(Category).map((item) => {
            return Category[item];
        });

        this.setState({ stores: CatArray }, () => {
          
        })
    }
 
    render() {
        return (
            <Wrapper>
                <div className="_28yRc">
                    <div onClick={() => this.props.searchProductFromZone(this.props.query)} className="_2ntDc">
                        <span>   
                            <mark className="_2UBj8 ">{this.props.query}</mark>
                        </span>
                    </div>
                </div>

                {this.state.stores.length > 0 ?

                    this.state.stores.map((store) =>
                        <div className="zone-search-stores">
                            <div className="zone-search-store-header">
                                <h2 className="zone-search-store-title">{store.storeName}
                                    <a className="_2H8LW"> See more </a>
                                </h2>
                                <p className="fxt3y">
                                    Chinese, South Indian, North Indian, Desserts, Kerala, Beverages, Mughlai, Seafood, Pan-Asian, Thai
                            </p>
                            </div>
                            <div className="zone-search-product-container productDetailSrlSpySec">
                                {store.products && store.products.length > 0 ? store.products.map((product) =>
                                    <FoodListCard product={product} />
                                ) : ''}
                            </div>
                        </div>

                    )

                    : ''}
            </Wrapper>
        )
    }
}


export default DishList;