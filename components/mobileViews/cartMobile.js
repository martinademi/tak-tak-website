import React from 'react'
import { connect } from 'react-redux'

import BottomSlider from '../ui/sliders/bottomSlider';
import CartContent from '../cart/cartContent'
import * as actions from '../../actions/index'

class CartMobile extends React.Component {

    state = {
        width: '100%',
        maxWidth: '100%',
        open: false
    }    

    constructor(props) {
        super(props);
        this.closeDrawer = this.closeDrawer.bind(this);
        this.setDeliveryType = this.setDeliveryType.bind(this);
    }


    componentDidMount() {
        // passing ref to parent to call children functions
        this.props.onRef(this)
    }

    opendrawer() {
        this.child.clickToggle()
    }

    closeDrawer() {
        this.child.closeDrawer()
    }

    editCart = (cartDetail, type) => {

        let editCartData = {
            cartId: this.props.myCart.cartId,
            childProductId: cartDetail.childProductId,
            unitId: cartDetail.unitId,
        }

        type == 1 ? editCartData['quantity'] = cartDetail.quantity - 1 : editCartData['quantity'] = cartDetail.quantity + 1

        this.props.dispatch(actions.editCard(editCartData))
    }

    setDeliveryType(type) {
        this.props.dispatch(actions.deliveryType(type))
    }
    render() {
        return (

            <BottomSlider onRef={ref => (this.child = ref)}>
                <CartContent myCart={this.props.myCart} handleClose={this.closeDrawer} setDeliveryType={this.setDeliveryType} editCart={this.editCart} mobile={true} />
            </BottomSlider>
        )
    }
}


const mapStateToProps = state => {
    return {
        myCart: state.cartList,
    };
};

export default connect(mapStateToProps)(CartMobile);