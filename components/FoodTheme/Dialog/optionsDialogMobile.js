import React from 'react';
import Dialog from 'material-ui/Dialog';
import { connect } from 'react-redux'
import $ from 'jquery'
import * as actions from '../../../actions/index';
import CircularProgress from 'material-ui/CircularProgress';
import { BASE_COLOR } from '../../../lib/envariables';
import { getCookie } from '../../../lib/session';


class OptionsDialogMobile extends React.Component {

    state = {
        listOpen: false,
        product: [],
    };

    constructor(props) {
        super(props);
        this.openOptionsDialog = this.openOptionsDialog.bind(this);
    }


    openOptionsDialog = async (product, selectedUnit) => {
        let newProduct;

        selectedUnit ?
            newProduct = { ...product, ...selectedUnit } :
            newProduct = { ...product }

        this.setState({ listOpen: true, product: newProduct })
    };

    addToCart = () => {
        let cartData;
        this.props.isAuthorized ?
            (cartData = {
                childProductId: this.state.product.childProductId,
                cartId: this.props.myCart.cartId,
                unitId: this.state.product.unitId,
                quantity: parseFloat(3).toFixed(1),
                addOns: this.state.addOnArrayforCart,
                storeType: getCookie("storeType"),
                packId: "0",
                increase: 1
            },
                this.props.dispatch(actions.repeatCart(cartData)),
                setTimeout(() => {
                    this.props.dispatch(actions.getCart())
                }, 100)
            ) : '';
    }

    chooseAddOns = () => {
        this.handleClose();

        this.props.openAddOnSlider(this.state.product)
        // this.props.openAddOnDialog(this.state.product)
    }

    handleClose = () => {
        this.setState({
            listOpen: false,
        });
    };

    componentDidMount() {
        this.props.onRef(this)
    }
    componentDidUpdate(prevProps) {
        if (prevProps.loading == true && this.props.loading == false) {
            this.handleClose();
        }
    }


    render() {

        return (
            <div style={{ marginTop: '50px' }}>
                <Dialog
                    modal={false}
                    open={this.state.listOpen}
                    autoDetectWindowHeight={false}
                    bodyStyle={{ maxHeight: '550px' }}
                    onRequestClose={this.handleClose}
                    contentStyle={{ marginTop: "0px", width: '100%', maxWidth: 'none', }}
                >
                    <div className="col-12 addOnsModalSec addOnsModal">
                        <div className="row">
                            <div className="col-12  addOnsModalTitleSec">
                                <div className="addOnsModalTitleSecInner">
                                    <h4 className="modal-title">
                                        {this.state.product ? this.state.product.productName : ''}</h4>
                                    <p className="addOnsModalSecTitlePrice m-0 mt-2">{this.state.product.currencySymbol || "$"}{this.state.product.priceValue || this.state.product.value}</p>
                                    <button type="button" onClick={this.handleClose} className="close" data-dismiss="modal">×</button>
                                </div>
                            </div>
                        </div>



                        <div className="row py-3">
                            <div className="col-12 addonsULSec">

                                <h6 className="py-3">Repeat last used customization ?</h6>

                                <div className="row">
                                    <div className="col-6 p-0">
                                        <button onClick={this.chooseAddOns} type="button" className="bttn-custom bttn-fluid">I'll chose</button>
                                    </div>
                                    <div className="col-6 p-0">
                                        <button onClick={this.addToCart} type="button" className="bttn-custom bttn-ghost">Repeat Last</button>
                                        {this.props.loading ?
                                            <div className="bttnLoaderSmall">
                                                <div className="">
                                                    <CircularProgress color={BASE_COLOR} size={20} thickness={2} />
                                                </div>
                                            </div>
                                            : ''}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </Dialog>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        reduxState: state,
        myCart: state.cartList,
        cartProducts: state.cartProducts,
        loading: state.loading
    };
};

export default connect(mapStateToProps)(OptionsDialogMobile);