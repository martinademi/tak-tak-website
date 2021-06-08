import React from 'react'
import { connect } from 'react-redux'

import * as actions from '../../actions/index'
import Router from "next/router";
import { BASE_COLOR } from '../../lib/envariables';

class CartFooter extends React.Component {

    state = {
        width: '100%',
        maxWidth: '480px',
        open: false
    }

    goToCart(type) {
        Router.push('/cart')
    }

    render() {
        return (
            this.props.myCart && this.props.myCart.cart && this.props.cartProducts ?

                <div className="col-12 mobile-show" >
                    <div className="row py-3 px-3" style={{ background: BASE_COLOR, color: '#fff', fontWeight: '700', left: 0, width: '104%', position: 'fixed', bottom: '0px' }} onClick={this.goToCart}>
                        <div className="col">
                            <div className="row">
                                <div className="col-6 text-left" >
                                    <span>{this.props.cartProducts.length} Item </span> |
                            <span>{" " + this.props.myCart.cart[0].currencySymbol} {parseFloat(this.props.myCart.finalTotalIncludingTaxes).toFixed(2)}</span>
                                </div>
                                <div className="col-6 text-right">
                                    <span>View Cart</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : ''
        )
    }
}


const mapStateToProps = state => {
    return {
        myCart: state.cartList,
        cartProducts: state.cartProducts,
    };
};

export default connect(mapStateToProps)(CartFooter);