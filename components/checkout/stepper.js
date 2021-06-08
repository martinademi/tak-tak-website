import React from 'react';
import { Step, Stepper, StepButton, StepContent } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import Wrapper from '../../hoc/wrapperHoc';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import orange from '@material-ui/core/colors/orange';
import AddressList from '../Adress/addressList';
import { BASE_COLOR } from '../../lib/envariables';

const stepButtonStyle = {
    padding: '15px 0px 0px',
    backgroundColor: '#fff'
}

const iconBoxStyle = {
    position: 'absolute',
    left: '-20px'
}

const buttonStyleOutline = {
    width: '130px',
    color: BASE_COLOR + " !important",
    border: '1px solid ' + BASE_COLOR,
    background: '#fff'
}

const lableOutline = {
    fontSize: '13px',
    fontWeight: '700',
    color: BASE_COLOR,
    letterSpacing: '0.6px'
}

const stepButtonStyle2 = {
    padding: '0px 0px 0px',
    backgroundColor: '#fff'
}

const buttonStyleFill = {
    width: '100%',
    color: "#fff !important",
    border: '1px solid ' + BASE_COLOR,
    background: BASE_COLOR,

}

const lableFill = {
    fontSize: '13px',
    fontWeight: '700',
    color: '#fff',
    letterSpacing: '0.6px',
    padding: "16px 50px"
}

const fullWidthButtonStyleFill = {
    color: "#fff !important",
    border: '1px solid ' + BASE_COLOR,
    background: BASE_COLOR,

}

const styles = theme => ({
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
})

const CheckoutStepper = (props) => {
    const { stepIndex, pickupStepIndex, divider, firstIcon, secondIcon, thirdIcon, NowButton, NowLabel, LaterButton, LaterLabel, walletBalance, isDeliveryType, deliveryFeesTotal,deliveryCash,deliveryCard } = props;
    const { classes } = props;
  // select time step content 
    const orderTimeStepContent = (
        <div className="row">
            <div className="col-12 orderTypeSection">
                {/* <!-- The Modal --> */}
                <div className="modal fade" id="orderTypeModal" style={{ zIndex: '1000' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">

                            {/* <!-- Modal Header --> */}
                            <div className="modal-header text-center">
                                <h4 className="modal-title">{props.locale.Ordertime}</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>

                            {/* <!-- Modal body --> */}
                            <div className="modal-body">
                                <div className="col-12 orderTypeModalBody">
                                    <h3 className="selectType mt-3">Select date of order?</h3>

                                    {props.printTime()}

                                    <div>
                                        <div className="float-left">
                                            <div style={{ cursor: 'pointer' }} className="customradioBigLabel">
                                                <span >{props.locale.Select}</span><br />
                                                <span style={{ fontWeight: '700', fontSize: '20px' }}>
                                                    <DatePicker
                                                        minDate={new Date()}
                                                        placeholder="dd/mm"
                                                        value={props.DatePickervalue} onChange={props.onChangeDatePicker} autoOk={true}
                                                        textFieldStyle={{ fontSize: '11px', width: '60px', marginTop: '0px', height: 'unset', textAlign: 'center' }}
                                                        floatingLabelStyle={{ top: '28px', margin: '0px' }} inputStyle={{ marginTop: '0px', fontSize: '11px', textAlign: 'center' }}
                                                        underlineShow={false} floatingLabelFixed={true}
                                                    />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <!-- Modal footer --> */}
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-dismiss="modal">{props.locale.next}</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- The Modal --> */}

                <div>
                    <div className="col-12 p-0 mb-4">
                        <div className="row">
                            <div className="col-auto">
                                <RaisedButton
                                    label={props.locale.Now}
                                    disableTouchRipple={true}
                                    disableFocusRipple={true}
                                    primary={true}
                                    style={{ marginRight: 12, marginTop: 18 }}
                                    buttonStyle={NowButton}
                                    labelStyle={NowLabel}
                                    onClick={() => props.selectBookingType(1)}
                                />
                            </div>
                            <div className="col-auto pl-0">
                                <RaisedButton
                                    label={props.locale.Schedule}
                                    disableTouchRipple={true}
                                    disableFocusRipple={true}
                                    primary={true}
                                    style={{ marginRight: 12, marginTop: 18 }}
                                    buttonStyle={LaterButton}
                                    labelStyle={LaterLabel}
                                    onClick={() => props.selectBookingType(2)}
                                    data-toggle="modal" data-target="#orderTypeModal"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 orderTypeSectionLayout">

                        <div className="row mb-1">
                            {props.bookingType == 2 ?
                                <div className="col">
                                    <div className="row">
                                        <div className="col-6">
                                            <h6 className="srtTimingsCommTitleStatic">{props.locale.DeliveryDate}</h6>
                                            <span data-toggle="modal" data-target="#orderTypeModal" className="srtTimingsCommTitleDyna dateTimeStyle pt-0">{props.bookingDate}</span>
                                        </div>
                                        <div className="col-6">
                                            <h6 className="srtTimingsCommTitleStatic">{props.locale.DeliveryTime}</h6>
                                            {/* <span className="srtTimingsCommTitleDyna">{props.bookingTime}</span> */}
                                            <div className="float-left text-center pt-0 checkoutCartDelTime" style={{ width: '100%' }}>
                                                <TimePicker value={props.timeSelectionValue} autoOk={true} onChange={props.onTimeChange} hintText="hh:mm" />
                                                {/* <input type="time" onChange={props.onTimeChange} className="inputTime" ></input> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="col-6">
                                    <h6 className="srtTimingsCommTitleStatic">{props.locale.DeliveryDate}</h6>
                                    <span style={{ borderBottom: 'none ' }} className="srtTimingsCommTitleDyna dateTimeStyle pt-0">{props.bookingDate}</span>
                                </div>
                            }
                            {/* {props.bookingType == 2 ?
                                isDeliveryType ?
                                    <p className="checkoutOrderTimeCaption">Scheduled orders are meant to place orders where you can pick up your order at the selected time slot.</p> :
                                    <p className="checkoutOrderTimeCaption">Scheduled orders are meant to place orders where the courier delivers your order at the selected time slot.</p>
                                :
                                isDeliveryType ?
                                    <p className="checkoutOrderTimeCaption">Now orders are meant to place orders where the courier delivers your order ASAP.</p> :
                                    <p className="checkoutOrderTimeCaption">Now orders are meant to place orders where you can pick up your order ASAP.</p>

                            } */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
// select payment option step content
    const paymentStepContent = (
        <div className="row pt-3 pb-5">
            {/* <div className="col-sm-auto col-12 py-3 pr-0 mx-lg-3" id="afteraddPaymentCoLayout"> */}
            <div className="col-sm-auto col-lg-auto col-xl-4 col-12 py-3 pr-0 mx-xl-3" id="afteraddPaymentCoLayout">
                <ul className="nav nav-pills flex-column" role="tablist" id="ordersSideMenuLayoutULId">
                   {deliveryCash == 1 ? 
                    <li className="nav-item">
                        <a className={`nav-link ${deliveryCash == 1 ? "active show": "" } `} id="paymentsid" data-toggle="pill" href="#pod">{props.locale.payondelivery}</a>
                    </li>
             : ""}
                 {deliveryCard == 1 ? 
                   
                   <li className="nav-item">
                        <a className={`nav-link ${deliveryCash == 0 ? "active show": "" } `} id="addressesid" data-toggle="pill" href="#card">{props.locale.creditdebitcards}</a>
                    </li>
                      : ""}
                      {deliveryCard == 1 ?
                    <li className="nav-item">
                        <a className="nav-link" id="walletid" data-toggle="pill" href="#wallet">{props.locale.wallet}</a>
                    </li>
                  :""}
                    {/* <li className="nav-item">
        <a className="nav-link" id="wishListid" data-toggle="pill" href="#quickcard">Quick Card</a>
    </li> */}
                </ul>

            </div>
            <div className="col-sm col-12 py-3 py-lg-3">
                <div className="tab-content" id="pills-tabContent">
                
                    {/* card tab content - start */}
                    { deliveryCard == 1  ? 
                    <div className={`tab-pane fade ${deliveryCash == 0 ? "active show": "" } `} id="card" role="tabpanel" aria-labelledby="pills-profile-tab">
                        <div className="col-12">
                            <div className="row">
                                {/* <div className="col-12"> */}
                                <div className="col-12 px-3 px-sm-0 px-lg-0 px-xl-3">
                                    <div className="row">

                                        {walletBalance > 0 ?
                                            <Wrapper>
                                                <div className="col-12 text-left">
                                                    <div className="row">
                                                        <div className="col-6 text-left" >{props.locale.WalletBalance} </div>
                                                        <div className="col-6 text-right" >{
                                                            props.myCart && props.myCart.cart && props.myCart.cart.length > 0 ?
                                                                props.myCart.cart[0].currencySymbol : ''}
                                                            {walletBalance}
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <div className="col-6 text-left" style={{ lineHeight: '50px' }}>Include Wallet</div>
                                                <div className="col-6 pr-0 text-right">
                                                    <Switch
                                                        checked={props.includeWallet}
                                                        onChange={props.handleWallet}
                                                        classes={{
                                                            switchBase: classes.colorSwitchBase,
                                                            checked: classes.colorChecked,
                                                            bar: classes.colorBar,
                                                        }}
                                                    />
                                                </div> */}
                                            </Wrapper>
                                            : ''}

                                        <div className="col-12  px-sm-0 px-lg-0">
                                          

                                          

                                            {props.printCards()}
  {props.selectedCard ?
                                                
                                                <div className="col-12">
                                                    <RaisedButton
                                                        label={"Checkout"}
                                                        disableTouchRipple={true}
                                                        disableFocusRipple={true}
                                                        primary={true}
                                                        style={{ marginTop: 0, width: "100%" }}
                                                        buttonStyle={fullWidthButtonStyleFill}
                                                        labelStyle={lableFill}
                                                        onClick={() => props.checkOut(1)}
                                                    />
                                                   
                                                </div> : ''
                                            }

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    : ""}
                    {/* card tab content - end */}

                    {/* pay on delivery tab content - start */}
                 {deliveryCash == 1 ? 
                    <div className={`tab-pane fade ${deliveryCash == 1 ? "active show": "" } `} id="pod" role="tabpanel" aria-labelledby="pills-contact-tab">
                        <div className="col-12">
                            <div className="row">
                                <div className="col-12 py-3 mb-3">
                                    <img alt="get-money" title="get-money" width="60" className="mb-2" src="/static/images/get-money.png" />
                                    <h6 className="paymentTitleCo">{props.locale.Cash}</h6>
                                    <p className="paymentDescCo py-2">{props.locale.Pleasekeepexactchange}</p>
                                    <div className="row">
                                        <div className="col-12 px-3 py-3" style={{ background: '#fff' }}>
                                            <div className="col p-0" >
                                                <div className="row">
                                                    {walletBalance > 0 ?
                                                        <Wrapper>
                                                            <div className="col-12 text-left">
                                                                <div className="row">
                                                                    <div className="col-6 text-left" >{props.locale.WalletBalance} </div>
                                                                    <div className="col-6 text-right" >{
                                                                        props.myCart && props.myCart.cart && props.myCart.cart.length > 0 ?
                                                                            props.myCart.cart[0].currencySymbol : ''}
                                                                        {walletBalance}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-6 text-left" style={{ lineHeight: '50px' }}>{props.locale.IncludeWallet}</div>
                                                            <div className="col-6 pr-0 text-right">
                                                                <Switch
                                                                    checked={props.includeWallet}
                                                                    onChange={props.handleWallet}
                                                                    classes={{
                                                                        switchBase: classes.colorSwitchBase,
                                                                        checked: classes.colorChecked,
                                                                        bar: classes.colorBar,
                                                                    }}
                                                                />
                                                            </div>
                                                        </Wrapper>
                                                        : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        {
                                            // props.myCart.finalTotalIncludingTaxes ?

                                            props.includeWallet && (walletBalance < props.myCart.finalTotalIncludingTaxes) ?
                                                <div className="col-12 text-center">
                                                    <RaisedButton
                                                         label={props.couponBenifit ?
                                                            "Pay " + props.myCart.cart[0].currencySymbol + "" + (parseFloat(parseFloat(props.driverTip||0)+parseFloat(props.serviceFees) +parseFloat(deliveryFeesTotal)+parseFloat(props.myCart.finalTotalIncludingTaxes)- parseFloat(props.couponBenifit.discountAmount)-parseFloat(walletBalance)).toFixed(2))
                                                            : "Pay " + props.myCart.cart[0].currencySymbol + "" + parseFloat(parseFloat(props.driverTip||0) +parseFloat(props.serviceFees) +parseFloat(deliveryFeesTotal)+parseFloat(props.myCart.finalTotalIncludingTaxes)).toFixed(2)}
                                                        disableTouchRipple={true}
                                                        disableFocusRipple={true}
                                                        primary={true}
                                                        style={{ marginRight: 12, marginTop: 18 }}
                                                        buttonStyle={buttonStyleFill}
                                                        disabled={props.stopCheckout}
                                                        labelStyle={lableFill}
                                                        onClick={() => props.checkOut(2)}
                                                    />
                                                </div>
                                                :
                                                <div className="col-12 text-center">
                                                    <RaisedButton
                                                          label={props.couponBenifit ? "Pay " + props.myCart.cart[0].currencySymbol + "" + (parseFloat(parseFloat(props.driverTip||0)+parseFloat(props.serviceFees)  +parseFloat(deliveryFeesTotal)+parseFloat(props.myCart.finalTotalIncludingTaxes)- parseFloat(props.couponBenifit.discountAmount)).toFixed(2)) : "Pay " + props.myCart.cart[0].currencySymbol + "" + parseFloat(parseFloat(props.driverTip||0)+parseFloat(props.serviceFees)  +parseFloat(deliveryFeesTotal)+parseFloat(props.myCart.finalTotalIncludingTaxes)).toFixed(2)}
                                                        disableTouchRipple={true}
                                                        disableFocusRipple={true}
                                                        primary={true}
                                                        style={{ marginRight: 12, marginTop: 18 }}
                                                        buttonStyle={buttonStyleFill}
                                                        labelStyle={lableFill}
                                                        onClick={() => props.checkOut(2)}
                                                    />
                                                </div>
                                            // : ''
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                  : ""}
                  {/* pay on delivery tab content - end */}

                   
                 {/* wallet tab content - start */}
                  {deliveryCard == 1 ? 
                    <div className="tab-pane fade" id="wallet" role="tabpanel" aria-labelledby="pills-wallet-tab">
                        <div className="col-12">
                            <div className="row">
                                {/* <div className="col-12"> */}
                                <div className="col-12 px-3 px-sm-0 px-lg-0 px-xl-3">
                                    <div className="row">
                                        {/* <div className="col-12"> */}
                                        <div className="col-12 px-3 px-sm-0 px-lg-0 px-xl-3">
                                            <div className="row px-3 px-xl-0 align-items-center">
                                                <div className="col-12 col-md-12 col-xl-6">
                                                    <h5 className="mb-3 addPaymentCard">{props.locale.wallet}</h5>
                                                </div>
                                                <div className="col-6 text-right">

                                                    <RaisedButton
                                                        label={props.locale.AddMoney}
                                                        disableTouchRipple={true}
                                                        disableFocusRipple={true}
                                                        primary={true}
                                                        onClick={() => props.handleWalletSlider()}
                                                        style={{ marginTop: 1 }}
                                                        buttonStyle={buttonStyleOutline}
                                                        labelStyle={lableOutline}
                                                    />
                                                </div>
                                            </div>
                                            {/* {props.printCards()} */}
                                        </div>
                                        <div className="col-12 px-3 px-sm-3 px-lg-3 px-xl-3 mt-3">
                                            <div className="row">
                                                <div className="col-8 col-md-12 col-lg-12 col-xl-8">
                                                    <h5 className="mb-3 mb-md-1 addPaymentCard">{props.locale.WalletBalance}</h5>
                                                </div>
                                                <div className="col-4">
                                                    <p className="text-right mb-md-3 walletBalanceLarge">
                                                        {
                                                            props.myCart && props.myCart.cart && props.myCart.cart.length > 0 ?
                                                                props.myCart.cart[0].currencySymbol : ''}
                                                        {walletBalance}</p>
                                                </div>
                                            </div>
                                            {/* {props.printCards()} */}
                                        </div>
                                        {props.myCart.finalTotalIncludingTaxes ?

                                            walletBalance > props.myCart.finalTotalIncludingTaxes ?
                                                <div className="col-12 px-3 px-sm-3 px-lg-3 px-xl-3">
                                                     <RaisedButton
                                                        label={props.couponBenifit ?
                                                            " PAY " + props.myCart.cart[0].currencySymbol + "" + (parseFloat(parseFloat(props.driverTip||0) +parseFloat(props.serviceFees) +parseFloat(deliveryFeesTotal)+parseFloat(props.myCart.finalTotalIncludingTaxes)- parseFloat(props.couponBenifit.discountAmount)).toFixed(2)) :
                                                            " PAY " + props.myCart.cart[0].currencySymbol + "" + parseFloat(parseFloat(props.driverTip||0)+parseFloat(props.serviceFees)  +parseFloat(deliveryFeesTotal)+parseFloat(props.myCart.finalTotalIncludingTaxes)).toFixed(2)}
                                                        disableTouchRipple={true}
                                                        disableFocusRipple={true}
                                                        primary={true}
                                                        onClick={() => props.checkOut(3)}
                                                        style={{ marginTop: 1, width: "100%" }}
                                                        buttonStyle={buttonStyleFill}
                                                        labelStyle={lableFill}
                                                    />
                                                </div> : <div className="col-12 px-3 px-sm-3 px-lg-3 px-xl-3">
                                                    <p className="d-sm-none d-md-block d-lg-block d-xl-none d-none"><span>Amount: </span><b>{props.couponBenifit ?
                                                        props.myCart.cart[0].currencySymbol + "" + (parseFloat(props.getFloatSum(props.myCart.finalTotalIncludingTaxes, deliveryFeesTotal)).toFixed(2) - props.couponBenifit.discountAmount) :
                                                        props.myCart.cart[0].currencySymbol + "" + parseFloat(props.getFloatSum(props.myCart.finalTotalIncludingTaxes, deliveryFeesTotal)).toFixed(2)}</b></p>
                                                  <RaisedButton
                                                       label={props.couponBenifit ?
                                                        "ADD MONEY & PAY " + props.myCart.cart[0].currencySymbol + "" + (parseFloat(parseFloat(props.driverTip||0)+parseFloat(props.serviceFees)  +parseFloat(deliveryFeesTotal)+parseFloat(props.myCart.finalTotalIncludingTaxes)- parseFloat(props.couponBenifit.discountAmount)).toFixed(2)) :
                                                        "ADD MONEY & PAY " + props.myCart.cart[0].currencySymbol + "" + parseFloat(parseFloat(props.driverTip||0)+parseFloat(props.serviceFees)  +parseFloat(deliveryFeesTotal)+parseFloat(props.myCart.finalTotalIncludingTaxes)).toFixed(2)}
                                                        disableTouchRipple={true}
                                                        disableFocusRipple={true}
                                                        primary={true}
                                                        onClick={() => props.handleWalletSlider()}
                                                        style={{ marginTop: 1, width: "100%" }}
                                                        buttonStyle={buttonStyleFill}
                                                        labelStyle={lableFill}
                                                    />
                                                </div>

                                            : ''
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                 :" "}
                 {/* wallet tab content - end */}

                    {/* quick card tab content - start */}
                    <div className="tab-pane fade" id="quickcard" role="tabpanel" aria-labelledby="pills-contact-tab">
                        {props.showIframe ?
                            <div className="col-12 py-3 mb-3">
                                <iframe width="500" height="300" src={props.appConfig.quickCardCustomer.baseUrl + "/oauth/authorize?client_id=" + props.appConfig.quickCardCustomer.clientId + "&redirect_uri=https://www.google.co.in&state=website"}></iframe>
                            </div> :
                            <div className="col-12  border text-center py-3 mb-3">
                                <img src="/static/icons/EmptyScreens/EmptyCard.imageset/card@3x.png" width='60' className="mb-2" height='80' />
                                <div className="row text-center">
                                    <div className="col-12 py-2">
                                        {props.appConfig && props.appConfig.quickCardCustomer && props.appConfig.quickCardCustomer.baseUrl ?
                                            <RaisedButton
                                                label="  Link Card   "
                                                disableTouchRipple={true}
                                                disableFocusRipple={true}
                                                primary={true}
                                                href={props.appConfig.quickCardCustomer.baseUrl + "/oauth/authorize?client_id=" + props.appConfig.quickCardCustomer.clientId + "&redirect_uri=http://localhost:3000/checkout&state=website"}
                                                target="_blank"
                                                // onClick={props.showIframe}
                                                style={{ marginTop: 18 }}
                                                buttonStyle={buttonStyleFill}
                                                labelStyle={lableFill}
                                            />
                                            : ''
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    {/* quick card tab content - end */}
                </div>
            </div>
        </div>
    )
    return (

        isDeliveryType ?
            <Stepper
                activeStep={stepIndex}
                linear={false}
                orientation="vertical"
                connector={<div style={divider} />}
            >
 {/* select Address step content  */}
                <Step style={{ background: '#fff', minHeight: '140px', boxShadow: "0 2px 8px #d4d5d9" }} disabled={props.hideAddress}>
                    <StepButton disableTouchRipple={true} style={stepButtonStyle} icon={firstIcon} iconContainerStyle={iconBoxStyle} onClick={() => props.setStepIndex(0)}>
                        {stepIndex == 0 ? <h3 className="accountHeaderActive">{props.locale.ChooseDeliveryAddress}</h3> :
                            <div className="row text-left" onClick={() => props.setStepIndex(0)} style={{ marginTop: '50px', width: '100%' }}>
                                <div className="col-10 p-0" >
                                    <a>
                                        <h3 className="accountHeader">{props.locale.deliveryAddress}   <span className="sucTick"><i class="fa fa-check-circle" aria-hidden="true"></i></span></h3>
                                    </a>
                                </div>
                                <div className="col-2 pt-3 text-center">
                                    <a className="stepChangeLnk">{props.locale.change}</a>
                                </div>
                                <div className="col-12" style={{ padding: '0px 40px', fontSize: '13px' }}>
                                    {props.selectedAddress ? <div className="text-muted"> <p style={{ textTransform: 'capitalize', fontWeight: '700', margin: "5px auto" }}>{props.selectedAddress.taggedAs}</p> {props.selectedAddress.addLine1} </div> : props.deliveryType != 2 ? <p style={{ fontWeight: '500', color: '#ff0000' }}> Delivery Address Required**</p> : ''}
                                </div>
                            </div>}
                    </StepButton>
                    <StepContent style={{ padding: '35px 55px 15px', marginLeft: '-9px', marginTop: '-25px', borderLeft: ' 1px dashed rgb(189, 189, 189)' }}>
                        <div className="row">


                            {/* {props.addressList ? props.addressList.map((addressDetail, index) =>

                                <div key={"addressDetail" + index} onClick={() => props.selectAddress(addressDetail)} className="col-6">
                                    <div className="addNewnDeliverInner p-sm-3 p-xl-4 p-lg-3 border">
                                        <div className="row">
                                            <div className="col-auto pr-0 homeAddressIconLayout">
                                                {addressDetail.taggedAs == "home" ? <i className="fa fa-home"></i> : <i className="fa fa-briefcase" style={{ fontSize: "16px", marginTop: "3px" }}></i>}
                                            </div>
                                            <div className="col pt-1 homeAddressInitialLayout">
                                                <h6 className="homeAddressInitial">
                                                    {addressDetail.taggedAs}
                                                </h6>
                                                <p className="addressBox">
                                                    {addressDetail.addLine1}
                                                  
                                                    <br />
                                                    {addressDetail.flatNumber}  {addressDetail.flatNumber.length > 0 ? ", " : ''}
                                                    <br />
                                                    {addressDetail.landmark}
                                                </p>
                                                <div className="editDeleteButtonLayout">
                                                    <a className="addressEditAndDeleteButton" onClick={(event) => props.handleEditAdrSliderOpen(event, addressDetail)}>
                                                        <span style={{ color: '#2569e9' }} >edit</span>
                                                    </a>
                                                    <a className="addressEditAndDeleteButton" onClick={(event) => props.deleteAddress(event, addressDetail)}>
                                                        <span style={{ color: '#e94125' }} >delete</span>
                                                    </a>

                                                    <a className="addressEditAndDeleteButton" onClick={() => props.selectAddress(addressDetail)} >
                                                        <span style={{ color: BASE_COLOR }} > deliver here </span>
                                                    </a>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            ) : ""} */}

                            <div className="col-6">
                                <div className="addNewnDeliverInner p-xl-3 p-lg-3 border">
                                    <div className="row">
                                        <div className="col-auto pr-0 homeAddressIconLayout">
                                            <img src="/static/images/new_imgs/pin.svg" style={{ height: "20px", marginTop: "6px" }} />
                                            {/* <img src="/static/images/grocer/addLoc.PNG" style={{ height: "20px", marginTop: "6px" }} /> */}
                                        </div>
                                        <div className="col pt-1 homeAddressInitialLayout">
                                            <div style={{ fontSize: '15px', fontWeight: '500', textAlign: 'left', textTransform: 'capitalize', letterSpacing: '0.3px', marginBottom: '10px' }}>{props.locale.addNewAddress}</div>
                                            <p className="addressBox" style={{ marginBottom: "1px" }}>{props.currentAddress}</p>
                                            <RaisedButton
                                                label={props.locale.addNew}
                                                disableTouchRipple={true}
                                                disableFocusRipple={true}
                                                primary={true}
                                                onClick={props.opendrawer}
                                                style={{ marginRight: 12, marginTop: 0, float: 'left' }}
                                                buttonStyle={buttonStyleOutline}
                                                labelStyle={lableOutline}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <AddressList addressList={props.addressList} selectAddress={props.selectAddress} isCheckout={true}
                                handleEditAdrSliderOpen={props.handleEditAdrSliderOpen} deleteAddress={props.deleteAddress} />
                            {/* // dashed-box */}
                        </div>
                    </StepContent>
                </Step>
{/* select order time content  */}
                <Step style={{ background: '#fff', minHeight: '120px', boxShadow: "0 2px 8px #d4d5d9" }} disabled={!props.selectedAddress}>
                    <StepButton disableTouchRipple={true} style={stepButtonStyle2} icon={secondIcon} iconContainerStyle={iconBoxStyle} onClick={() => props.setStepIndex(1)}>
                        {stepIndex == 1 ? <h3 className="accountHeaderActive">{props.locale.SelectOrdertime}</h3> :
                            <div className="row text-left" style={{ marginTop: '50px', width: '100%' }}>
                                <div className="col-10 p-0">
                                    <h3 className="accountHeader">{props.locale.Ordertime}  {stepIndex > 0 ? <span className="sucTick"><i class="fa fa-check-circle" aria-hidden="true"></i></span> : ''}</h3>
                                </div>
                                <div className="col-2 pt-3 text-center">
                                    {props.selectedAddress ? <a className="stepChangeLnk" onClick={() => props.setStepIndex(1)} >{props.locale.change}</a> : ''}
                                </div>
                                <div className="col-12" style={{ padding: '0px 40px', fontSize: '13px' }}>
                                    {props.bookingType == 2 ?
                                        <p className="text-muted">
                                            <span style={{ textTransform: 'capitalize', fontWeight: '700', color: "#333" }}>{props.locale.OrderLater}</span>
                                            <br /> {props.bookingDate + ",  Time:" + props.bookingTime} </p> :
                                        <p className="text-muted">
                                            <span style={{ textTransform: 'capitalize', fontWeight: '700', color: '#333' }}>{props.locale.orderNow}</span>
                                            <br /> {props.bookingDate} </p>
                                    }
                                </div>
                            </div>}
                    </StepButton>
                    <StepContent style={{ padding: '15px 55px 15px', marginLeft: '-9px', marginTop: '-13px', borderLeft: ' 1px dashed rgb(189, 189, 189)' }}>
                        {orderTimeStepContent}
                    </StepContent>
                </Step>
{/* select payment content  */}
                <Step style={{ background: '#fff', boxShadow: "0 2px 8px #d4d5d9" }} disabled={!props.selectedAddress}>
                    <StepButton disableTouchRipple={true} style={stepButtonStyle2} icon={thirdIcon} iconContainerStyle={iconBoxStyle} onClick={() => props.setStepIndex(2)}>
                        <div className="row">
                            <div className="col-12 px-0">
                                {stepIndex == 2 ? <h3 className="accountHeaderActive">{props.locale.ChoosePaymentMethod}</h3> : <h3 className="accountHeader">{props.locale.paymentt}</h3>}
                            </div>
                        </div>
                    </StepButton>
                    <StepContent style={{ padding: '15px 55px 15px', marginLeft: '-9px', marginTop: '-25px', borderLeft: ' 0px dashed rgb(189, 189, 189)' }}>
                        {paymentStepContent}
                        {/* {props.renderStepActions(1)} */}
                    </StepContent>
                </Step>
            </Stepper>

            :
// this is for pickup
            <Stepper
                activeStep={pickupStepIndex}
                linear={false}
                orientation="vertical"
                connector={<div style={divider} />}
            >

                <Step style={{ background: '#fff', minHeight: '120px', boxShadow: "0 2px 8px #d4d5d9" }} disabled={!props.selectedAddress}>
                    <StepButton disableTouchRipple={true} style={stepButtonStyle2} icon={secondIcon} iconContainerStyle={iconBoxStyle} onClick={() => props.setPickupStepIndex(0)}>


                        {pickupStepIndex == 0 ? <h3 className="accountHeaderActive">{props.locale.Ordertime}</h3> :
                            <div className="row text-left" style={{ marginTop: '50px', width: '100%' }}>
                                <div className="col-10 p-0">
                                    <h3 className="accountHeader">{props.locale.Ordertime}</h3>
                                </div>
                                <div className="col-2 pt-3 text-center">
                                    <a className="stepChangeLnk" onClick={() => props.setPickupStepIndex(0)} >{props.locale.change}</a>
                                </div>
                                <div className="col-12" style={{ padding: '0px 40px', fontSize: '13px' }}>
                                    {props.bookingType == 2 ?
                                        <p className="text-muted">
                                            <span style={{ textTransform: 'capitalize', fontWeight: '700' }}>{props.locale.OrderLater}</span>
                                            <br /> {props.bookingDate + ",  Time:" + props.bookingTime} </p> :
                                        <p className="text-muted">
                                            <span style={{ textTransform: 'capitalize', fontWeight: '700' }}>{props.locale.orderNow}</span>
                                            <br /> {props.bookingDate} </p>
                                    }
                                </div>
                            </div>}

                    </StepButton>
                    <StepContent style={{ padding: '15px 55px 15px', marginLeft: '-9px', marginTop: '-12px', borderLeft: ' 1px dashed rgb(189, 189, 189)' }}>
                        {orderTimeStepContent}
                    </StepContent>
                </Step>

                <Step style={{ background: '#fff', boxShadow: "0 2px 8px #d4d5d9" }}>
                    <StepButton disableTouchRipple={true} style={stepButtonStyle2} icon={thirdIcon} iconContainerStyle={iconBoxStyle} onClick={() => props.setPickupStepIndex(1)}>
                        <div className="row">
                            <div className="col-12 px-0">
                                {stepIndex == 1 ? <h3 className="accountHeaderActive">{props.locale.paymentt}</h3> : <h3 className="accountHeader">{props.locale.paymentt}</h3>}
                            </div>
                        </div>
                    </StepButton>
                    <StepContent style={{ padding: '15px 55px 15px', marginLeft: '-9px', marginTop: '-25px', borderLeft: ' 0px dashed rgb(189, 189, 189)' }}>
                        {paymentStepContent}
                        {/* {props.renderStepActions(1)} */}
                    </StepContent>
                </Step>
            </Stepper>
    )
}

export default withStyles(styles)(CheckoutStepper)