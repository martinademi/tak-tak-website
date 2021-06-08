import React from 'react'
import LeftSlider from '../ui/sliders/leftSlider';
import green from '@material-ui/core/colors/green'
import Radio from '@material-ui/core/Radio';
import { withStyles } from '@material-ui/core/styles';
import { white } from 'material-ui/styles/colors';
import Wrapper from '../../hoc/wrapperHoc';
import AddCardLeftSliderMobile from '../checkout/addCardMobile';
import Switch from '@material-ui/core/Switch';
import orange from '@material-ui/core/colors/orange';
import { BASE_COLOR, APP_NAME, WHITE_BASE_COLOR } from '../../lib/envariables';


const styles = theme => ({
    root: {
        color: BASE_COLOR,
        '&$checked': {
            color: BASE_COLOR,
        },
    },
    checked: {},
    size: {
        width: 40,
        height: 20,
    },
    sizeIcon: {
        fontSize: 20,
    },
    colorSwitchBase: {
        color: BASE_COLOR,
        '&$colorChecked': {
            color: BASE_COLOR,
            '& + $colorBar': {
                backgroundColor: BASE_COLOR,
            },
        },
    },
    colorBar: {},
    colorChecked: {},
});

const walletBtnPay = {
    border: "1px solid " + BASE_COLOR,
    padding: "10px",
    color: "#fff",
    backgroundColor: BASE_COLOR,
    textTransform: "uppercase",
    letterSpacing: "1px",
    borderRadius: "4px",
    width: "100%"
}
const walletBtnAddMny = {
    padding: "10px",
    color: BASE_COLOR,
    border: "1px solid " + BASE_COLOR,
    backgroundColor: "#fff",
    textTransform: "uppercase",
    letterSpacing: "1px",
    borderRadius: "4px",
    width: "100%"
}
class SelectPaymentSlider extends React.Component {

    state = {
        SliderWidth: "100%",
        paymentMethod: null,
        showMat: false,
        isCardSelected: false
    }
    constructor(props) {
        super(props)
    }
    handleLeftSliderOpen = () => this.SelectPayRef.handleLeftSliderToggle();
    handleClose = () => this.SelectPayRef.handleLeftSliderClose();
    handleCloseSlider = () => { }
    closeSlider = () => { }

    handleChange = (type) => {
        this.setState({ paymentMethod: type })
    }

    setPayment = (payMethod) => {
        this.props.setPayment(payMethod);
        this.SelectPayRef.handleLeftSliderClose();
    }

    handleCardSelection = (event, card) => {
        this.setState({ isCardSelected: true })
        this.props.handleCardSelection(event, card)
        this.handleChange(2)
    }

    handleAddCardSlider = () => {
        this.AddCardLeftSliderRef.handleLeftSliderOpen();
    }
    componentDidMount() {
        // passing ref to parent to call children
        this.props.onRef(this);
        this.setState({ showMat: true })
    }

    determineCardTypeImage = (value) => {
        switch (value) {
            case 'MasterCard':
                return "/static/images/master-card.png";
                break;
            case 'Visa':
                return "/static/images/visa.png";
                break;
            case 'Discover':
                return "/static/images/discover.png";
                break;
            case 'American Express':
                return "/static/images/ae.png";
                break;
            default:
                return "/static/images/cc-icon.png";
                break;
        }
    };

    printWalletSelection = () => {
        const { classes } = this.props;
        return (
            this.props.walletDetail && this.props.walletDetail.walletBalance > 0 ?
                <Wrapper>
                    {/* <div className="col-12 text-left">
                        <div className="row">
                            <div className="col-6 text-left" >Wallet Balance </div>
                            <div className="col-6 text-right" >{
                                this.props.myCart && this.props.myCart.cart && this.props.myCart.cart.length > 0 ?
                                    this.props.myCart.cart[0].currencySymbol : ''}
                                {this.props.walletDetail.walletBalance}
                            </div>
                        </div>
                    </div> */}
                    <div className="row mt-3">
                        <div className="col-6 text-left" style={{ lineHeight: '50px' }}>{this.props.locale.IncludeWallet||"Include Wallet"}</div>
                        <div className="col-6 pr-0 text-right">
                            <Switch
                                checked={this.props.includeWallet}
                                onChange={this.props.handleWallet}
                                classes={{
                                    switchBase: classes.colorSwitchBase,
                                    checked: classes.colorChecked,
                                    bar: classes.colorBar,
                                }}
                            />
                        </div>
                    </div>
                </Wrapper>
                : ''
        )
    }
  // card content
    printCards = () => {
        return (
            <div className="px-2 py-3">
                {/* <h5 className="mb-3 addPaymentCard" style={{ fontWeight: 500, fontSize: "15px", color: "#474747" }}>Select Card</h5> */}
                {/* <div className="row srlHidClsBt" style={{ maxHeight: "300px", overflow: "auto" }}> */}
                <div className="row">
                    {this.props.customerCards && this.props.customerCards.length > 0 ?
                        <Wrapper>
                            {this.props.customerCards.map((card, index) =>
                                <div className="col-12 cardPaymentsBt" key={"customdateRadio" + index}>
                                    <input id={"checkout-mobi" + card.id} onClick={() => this.handleChange(2)} onChange={(event) => this.handleCardSelection(event, card)} name="payment-radio" className="customradioMedium" type="radio" style={{ cursor: 'pointer' }} />

                                    <label className="col-12" style={{ cursor: 'pointer' }} htmlFor={"checkout-mobi" + card.id}>


                                        <div className="row align-items-center">
                                            <div className="col-2 p-0">
                                                <img width="30" src={this.determineCardTypeImage(card.brand)}></img>
                                            </div>

                                            <div className="col">
                                                <div className="row align-items-center">
                                                    <div className="col-12">
                                                        <div className="row align-items-center">
                                                            <div className="col-6 text-left">
                                                                <span className="cardNumbersComm">
                                                                    {"**** " + card.last4}
                                                                </span>
                                                            </div>
                                                            <div className="col-6 text-right">
                                                                <span style={{ fontSize: '10px', fontWeight: '400' }}>
                                                                    {card.expMonth + "/" + card.expYear}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-2 p-0 delete" data-toggle="modal" data-target="#deleteCard">
                                                <i class="fa fa-trash-o text-danger" aria-hidden="true"></i>
                                            </div>
                                        </div>

                                    </label>

                                </div>
                            )
                            }

                        </Wrapper>
                        :
                        ''
                    }
                </div>
            </div>
        )
    }


    render() {
        const { classes } = this.props;
        return (
            this.state.showMat ?
                <Wrapper>
                    <LeftSlider onRef={ref => (this.SelectPayRef = ref)} width={this.state.SliderWidth} handleClose={this.handleCloseSlider}
                        drawerTitle="Payment Options">
                        {/* <div className="col-12 mt-lg-4 px-0 manageAddressLayout"> */}
                        <div className="col-12 mt-lg-4 manageAddressLayout">

                            <div className="row">
                                <div className="col-12">
                                    <p className="payOptionsBtPTag" >{this.props.locale.wallet||"Wallet"}</p>
                                    {/* <div className="row justify-content-between"> */}
                                    <div className="row">
                                        {
                                            <div className="col-12 manageAddressWidth mobilePad" style={{ padding: "15px 5px" }}>
                                                <div className="row align-items-center payOptionsBtPTag py-0">
                                                    <div className="col-6 homeAddressIconLayout px-4" onClick={() => this.handleChange(0)}
                                                    >
                                                        <img src="/static/icons/TabBar/ProfileTab/Payment/Wallet.imageset/wallet (1).png" width="25" height="20" style={{ marginRight: "10px" }} />
                                                        <span className="homeAddressInitial">{APP_NAME} {this.props.locale.wallet||"Wallet"}</span>
                                                    </div>
                                                    <div className="col-6 homeAddressInitialLayout" onClick={() => this.handleChange(0)}>
                                                        <span style={{ float: "right", fontSize: '15px ' }}>
                                                            <strong>
                                                                <i className="fa fa-inr" aria-hidden="true"></i>
                                                                {this.props.walletDetail ? parseFloat(this.props.walletDetail.walletBalance).toFixed(2) : 0.00}
                                                                <Radio
                                                                    checked={this.state.paymentMethod === 0}
                                                                    onChange={() => this.handleChange(0)}
                                                                    value="Wallet"
                                                                    name="payment-radio"
                                                                    aria-label="A"
                                                                    className={classes.size}
                                                                    style={{ color: BASE_COLOR }}
                                                                />
                                                            </strong>
                                                        </span>
                                                    </div>
                                                    {
                                                        this.state.paymentMethod === 0 ?
                                                            <div className="col-12">
                                                                <div className="row px-2 mt-3">
                                                                    {this.props.walletDetail.walletBalance > this.props.cartTotal ?
                                                                        <div className="col-6">
                                                                            <button style={walletBtnPay} onClick={() => this.setPayment("Wallet")}>{this.props.locale.pay||"Pay"}</button>
                                                                        </div>
                                                                        : ''}
                                                                    <div className="col-6">
                                                                        <button style={walletBtnAddMny} onClick={() => this.props.handleWalletSlider("100%")}>{this.props.locale.AddMoney||"Add Money"}</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            : ''
                                                    }
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="col-12">
                                    <p className="payOptionsBtPTag" >{this.props.locale.creditdebitcards||"Credit/Debit Cards"}</p>
                                    <div className="row" style={{ background: WHITE_BASE_COLOR }}>
                                        {
                                            this.props.customerCards && this.props.customerCards.length > 0 ?
                                                <div className="col-12" style={{ maxHeight: "50vh", overflow: "auto" }}>
                                                    {this.printCards()}
                                                </div> : ''
                                        }
                                        {
                                            <div className="col-12 manageAddressWidth mobilePad payOptionsBtPTag" style={{ padding: "15px 15px" }}>
                                                <div className="row align-items-center">
                                                    <div className="col-12 homeAddressIconLayout px-4">

                                                        <div className="row">
                                                            <div className="col-12">
                                                                <img src="/static/icons/TabBar/ProfileTab/Payment/Add_new.imageset/credit-card (1).png" width="25" height="20" style={{ marginRight: "10px" }} />
                                                                <span className="homeAddressInitial" onClick={() => this.handleAddCardSlider()}>{this.props.locale.AddNewCard||"Add New Card"}</span>
                                                            </div>
                                                            {
                                                                this.state.paymentMethod == 2 ?
                                                                    <Wrapper>
                                                                        <div className="col-12">
                                                                            {this.printWalletSelection()}
                                                                        </div>
                                                                        <div className="col-12">
                                                                            <button className="float-right mt-3" style={walletBtnPay} onClick={() => this.setPayment("Card")}>{this.props.locale.pay||"Pay"}</button>
                                                                        </div>
                                                                    </Wrapper>
                                                                    : ''
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                        }

                                    </div>
                                </div>
                                <div className="col-12">
                                    <p className="payOptionsBtPTag">{this.props.locale.payondelivery||"Pay On Delivery"}</p>
                                    <div className="row">
                                        {

                                            <div className="col-12 manageAddressWidth mobilePad" style={{ padding: "15px 5px" }}>
                                                <div className="row align-items-center">

                                                    <div className="col-8 homeAddressIconLayout px-4" onClick={() => this.handleChange(1)}>
                                                        <img src="/static/icons/TabBar/ProfileTab/Payment/Cash.imageset/money (1).png" width="25" height="20" style={{ marginRight: "10px" }} />
                                                        <span className="homeAddressInitial">{this.props.locale.Cash||"Cash"}</span>
                                                    </div>
                                                    <div className="col-4 homeAddressInitialLayout" onClick={() => this.handleChange(1)}>
                                                        <span style={{ float: "right", fontSize: '15px ' }}>
                                                            <strong>
                                                                <Radio
                                                                    checked={this.state.paymentMethod === 1}
                                                                    onChange={() => this.handleChange(1)}
                                                                    value="Cash"
                                                                    name="payment-radio"
                                                                    aria-label="A"
                                                                    className={classes.size}
                                                                    style={{ color: BASE_COLOR }}
                                                                />
                                                            </strong>
                                                        </span>
                                                    </div>
                                                    {/* {
                                                        this.state.paymentMethod === 1 ?
                                                            <div className="text-center mt-3" style={{ width: "100%" }}>
                                                                <button style={walletBtnPay} onClick={() => this.setPayment("Cash")}>Pay</button>
                                                            </div>
                                                            : ''
                                                    } */}

                                                    {
                                                        this.state.paymentMethod == 1 ?
                                                            <Wrapper>
                                                                <div className="col-12">
                                                                    {this.printWalletSelection()}
                                                                </div>
                                                                <div className="col-12">
                                                                    <button className="float-right mt-3" style={walletBtnPay} onClick={() => this.setPayment("Cash")}>{this.props.locale.pay||"Pay"}</button>
                                                                </div>
                                                            </Wrapper>
                                                            : ''
                                                    }

                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </LeftSlider>
                    <AddCardLeftSliderMobile width="100%" onRef={ref => (this.AddCardLeftSliderRef = ref)} userProfile={this.props.userProfile} handleWalletHistorySlider={this.props.handleWalletHistorySlider} getCustomerCards={this.props.getCustomerCards} />
                </Wrapper> : ''

        )
    }
}
// export default SelectPaymentSlider;
export default withStyles(styles)(SelectPaymentSlider);