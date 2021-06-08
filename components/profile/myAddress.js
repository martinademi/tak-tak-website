import React from 'react'
import { Component } from 'react'
import Moment from 'react-moment';
import $ from 'jquery'
import Wrapper from '../../hoc/wrapperHoc'
import LeftSlider from '../ui/sliders/leftSlider'
import { IconButton } from 'material-ui';
import { BASE_COLOR } from '../../lib/envariables';
import LanguageWrapper from "../../hoc/language"
 class AddressSlider extends Component {
    state = {
        SliderWidth: 0,
        open: true
    }
    constructor(props) {
        super(props);
        this.handleLeftSliderOpen = this.handleLeftSliderOpen.bind(this);
    }

    handleLeftSliderOpen = () => this.AddressSliderRef.handleLeftSliderToggle();
    handleClose = () => this.AddressSliderRef.handleLeftSliderClose();
    closeSlider = () => { }
    componentDidMount = () => this.props.onRef(this)

    render() {
        let {lang} = this.props
        return (
            <Wrapper>
                <LeftSlider onRef={ref => (this.AddressSliderRef = ref)}
                    width={this.props.state.SliderWidth}
                    handleClose={this.closeSlider}
                    drawerTitle={lang.manageAddress||"Manage Addresses"}
                >
                    <div className="row  manageAddressLayout">

                        <div className="col-12 scroller horizontal-scroll" style={{ height: '80vh' }}>

                            <div className="row">
                                {/* <p style={{ fontWeight: 600, padding: 10, color: "#999" }}>Saved Addresses</p> */}
                                <div className="col justify-content-between mt-2">
                                    {
                                        this.props.userAddress && this.props.userAddress.length > 0 && this.props.userAddress.map((addressDetail, index) => {
                                            return (
                                                <div key={"mobileOrderDetail" + index} className="row ">
                                                    <div className="col-12 px-5 col-lg-6">
                                                        <div className="row manageAddressWidth py-2" style={{ background: '#fff' }}>
                                                            <div className="col-auto px-2 homeAddressIconLayout">
                                                                {addressDetail.taggedAs == "home" ?
                                                                    <i className="fa fa-home" style={{ fontSize: "20px", paddingTop: "6px" }}></i> :
                                                                    addressDetail.taggedAs == "others" ?
                                                                        <i className="fa fa-map-pin" style={{ fontSize: "20px", paddingTop: "6px" }}></i>
                                                                        : <i className="fa fa-briefcase" style={{ fontSize: "20px", paddingTop: "6px" }}></i>
                                                                }
                                                            </div>
                                                            <div className="col homeAddressInitialLayout">
                                                                <h6 className="homeAddressInitial">
                                                                    {addressDetail.taggedAs}
                                                                </h6>
                                                                <p>
                                                                    {addressDetail.flatNumber}  {addressDetail.flatNumber.length > 0 ? ", " : ''}
                                                                    {addressDetail.addLine1}
                                                                    {/* {addressDetail.addLine2} */}
                                                                    <br />
                                                                    {/* <br /> */}
                                                                    {addressDetail.landmark && addressDetail.landmark.length > 0 ? <span><span>{lang.landMark||"Landmark"}:</span> {addressDetail.landmark}</span> : ''}
                                                                </p>
                                                                <div className="editDeleteButtonLayout">
                                                                    <a href="#" className="" data-toggle="modal" style={{ color: "#63a8ef", padding: 0, textTransform: "uppercase", fontSize: "13px", fontWeight: 600, margin: 0, paddingRight: "10px" }} data-target="#addressEditModal" onClick={(event) => this.props.handleEditAdrSliderOpen(event, addressDetail, true)}>
                                                                        {lang.edit||"edit"}
                                                            </a>
                                                                    {/* addressEditAndDeleteButton */}
                                                                    <a href="#" className="" style={{ color: "#f15c5c", padding: 0, textTransform: "uppercase", fontSize: "13px", fontWeight: 600, margin: 0, paddingRight: "10px" }} data-toggle="modal" data-target="#addressDeleteModal" onClick={(event) => this.props.deleteAddress(event, addressDetail)}>
                                                                        {lang.delete||"delete"}
                                                            </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>



                        <div className="col">
                            <div className="row">
                                <div className="col-12 py-2 text-center">

                                    <button style={{
                                        position: 'fixed',
                                        left: '0px',
                                        bottom: '0px',
                                        width: '100%',
                                        backgroundColor: BASE_COLOR,
                                        border: "none",
                                        padding: "12px 35px",
                                        fontSize: '15px',
                                        color: "white",
                                        fontWeight: 400,
                                        textTransform: "uppercase",
                                        letterSpacing: "1px"
                                    }} onClick={() => this.props.opendrawerForMobile()}>Add New</button>

                                </div>
                            </div>
                        </div>
                    </div>

                </LeftSlider>

            </Wrapper>
        )
    }
}


export default LanguageWrapper(AddressSlider)