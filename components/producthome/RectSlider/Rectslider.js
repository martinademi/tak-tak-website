import React from 'react'
import Component from 'react'
import Items from '../Items/items'
import Brands from '../Brands/Brands'
import Wrapper from '../../../hoc/wrapperHoc'

const RectSlider = (props) => {
    return (
        <Wrapper>
            {props.products && props.products.length > 0 ? (
                // <div className="row px-4">
                <div className="row align-items-center align-items-md-start padLeftNRightMulti">
                    {props.type === 'items' ? (
                        <Items currency={props.currency} rowId={props.rowId} cartProducts={props.cartProducts} editCart={props.editCart}
                            addToCart={props.addToCart} header={props.header} products={props.products} startTopLoader={props.startTopLoader}
                            openProductDialog={props.openProductDialog} handleDetailToggle={props.handleDetailToggle} bType={props.bType} selectedStore={props.selectedStore} />
                    ) : ''}
                </div>
            ) : ''
            }

            {props.brands && props.brands.length > 0 ? (
                // <div className="row px-4">
                <div className="row align-items-center align-items-md-start padLeftNRightMulti">
                    {props.type === 'items' ? (
                        '') : (
                            <Brands rowId={props.rowId}  {...props} selectedStore={props.selectedStore} startTopLoader={props.startTopLoader} />
                        )}
                </div>
            ) : ''
            }
        </Wrapper>
    )
}

export default RectSlider;



