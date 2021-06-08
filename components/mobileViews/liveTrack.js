import React from 'react'
import { Component } from 'react'
import Moment from 'react-moment';
import $ from 'jquery'
import Wrapper from '../../hoc/wrapperHoc'
import DoneIcon from '../ui/done'
import BottomSlider from '../ui/sliders/bottomSlider';
import GoogleMapReact from 'google-map-react';
import MapMarker from "../location/marker";
import { IconButton } from 'material-ui';
import { BASE_COLOR } from '../../lib/envariables';

const style = {
    margin: "0"
};

const buttonGreen = {
    width: '100%',
    backgroundColor: "#fff",
    border: "1px solid " + BASE_COLOR,
}

const lableFill = {
    fontSize: '13px',
    fontWeight: '700',
    color: BASE_COLOR
}
let driverMarker = null
export default class LiveTrackSlider extends Component {
    state = {
        SliderWidth: 0,
        open: true,
        orderData: null,
        trackingOpen: false,
        map: null
    }
    constructor(props) {
        super(props);
        this.handleLeftSliderOpen = this.handleLeftSliderOpen.bind(this);
    }

    handleLeftSliderOpen = async (orderData) => {
        await this.setState({ orderData: orderData, trackingOpen: true })
        // this.OrderSliderRef.handleLeftSliderToggle();
        this.OrderSliderRef.clickToggle();
        this.showSatus();

        orderData.statusCode == 12 ? this.showLiveTrack() : ''

        // this.setState({ map: map })
    }

    updateData = (orderData) => {
        this.setState({ orderData: orderData })

        orderData.statusCode == 12 && !this.state.drawMap ? this.showLiveTrack() : ''
        orderData.statusCode >= 13 ? this.hideLiveTrack() : ''

        if (driverMarker && driverMarker.setMap) {
            driverMarker.setMap(null);
        }
        if (this.state.map) {
            this.state.map.setCenter(new google.maps.LatLng(orderData.driverLatitude, orderData.driverLongitude));

            driverMarker = new google.maps.Marker({
                position: { lat: orderData.driverLatitude, lng: orderData.driverLongitude },
                map: this.state.map,
                title: 'Driver Location!',
                icon: "/static/icons/marker/driver.png"
            });

            driverMarker.setMap(this.state.map)
        }
        this.setState({ testMap: true })
    }

    handleClose = () => {
        this.OrderSliderRef.closeDrawer(),
            this.showSatus()
    };

    componentDidMount = () => this.props.onRef(this)

    hideLiveTrack = () => $(".liveTrack").hide();

    showLiveTrack() {
        // $(".statusList").hide();
        $(".liveTrack").show();

        let orderData = this.state.orderData;
        let center = {
            lat: orderData.dropLat,
            lng: orderData.dropLong
        };
        var mapOptions = {
            center: center,
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.map,
            disableDefaultUI: true
        }
        var map = new google.maps.Map(document.getElementById("liveTrackMap"), mapOptions);
        this.setState({ map: map, drawMap: true })

        var marker = new google.maps.Marker({
            position: { lat: orderData.dropLat, lng: orderData.dropLong },
            map: map,
            title: 'Drop Location!',
            icon: "/static/icons/marker/marker.png"
        });
        var marker = new google.maps.Marker({
            position: { lat: orderData.pickupLat, lng: orderData.pickupLong },
            map: map,
            title: 'Start Location!',
            icon: "/static/icons/marker/start.png"
        });


        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        let startLoc = new google.maps.LatLng(orderData.pickupLat, orderData.pickupLong)
        let dropLoc = new google.maps.LatLng(orderData.dropLat, orderData.dropLong)

        let flightPlanCoordinates = []

        directionsService.route({
            origin: startLoc,
            destination: dropLoc,
            travelMode: 'DRIVING'
        }, (response, status) => {
            if (status === 'OK') {
                response.routes[0].overview_path.map(async (item) => {
                    flightPlanCoordinates.push({ lat: item.lat(), lng: item.lng() })
                })
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
        setTimeout(() => {
            let flightPath = new google.maps.Polyline({
                path: flightPlanCoordinates,
                geodesic: true,
                strokeColor: '#1a95d0',
                strokeOpacity: 1.0,
                strokeWeight: 5,
                icons: [{
                    strokeColor: '#53ED00'
                }]
            });
            flightPath.setMap(map)
            this.setState({ flightPath: flightPath })
        }, 1000)
    }

    showSatus() {
        // $(".liveTrack").hide();
        $(".statusList").show();
    }

    printMap = (orderData) => {
        let lat; let lng; let cnt;

        let center = {
            lat: orderData.dropLat,
            lng: orderData.dropLong
        };

        lat = orderData.dropLat;
        lng = orderData.dropLong;

        cnt = {
            lat: lat,
            lng: lng
        }
        const pathCoordinates = [
            { lat: lat, lng: lng },
            { lat: this.state.orderData.pickupLat, lng: this.state.orderData.pickupLong },
        ]
        let icon = "static/images/cross.svg";
        let start = cnt.lat + "," + cnt.lng
        let end = orderData.pickupLat + "," + orderData.pickupLong

        let allLatLng = []

        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        let startLoc = new google.maps.LatLng(pathCoordinates[0].lat, pathCoordinates[0].lng)
        let dropLoc = new google.maps.LatLng(pathCoordinates[1].lat, pathCoordinates[1].lng)

        directionsService.route({
            origin: startLoc,
            destination: dropLoc,
            travelMode: 'DRIVING'
        }, (response, status) => {
            if (status === 'OK') {
                response.routes[0].overview_path.map(async (item) => {
                    allLatLng.push({ lat: item.lat(), lng: item.lng() })
                })
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });

        return (
            <GoogleMapReact
                panControl={false}
                streetViewControl={false}
                fullscreenControl={false}
                bootstrapURLKeys={{ key: 'AIzaSyBJ2LWIMnZNdsoYmUREgbN_4VEksPnoW8w' }}
                defaultCenter={center}
                defaultZoom={13}
                center={cnt} zoom={16} showPath={true}
            >
                {allLatLng.map((item, index) => {
                    return (< MapMarker point="start" lat={item.lat} lng={item.lng} text={'Me'} />);
                }
                )}
                <MapMarker point="start" lat={this.state.orderData.pickupLat} lng={this.state.orderData.pickupLong} text={'Me'} />
                <MapMarker point="end" lat={lat} lng={lng} text={'Me'} />

            </GoogleMapReact >
        )


    }


    render() {

        return (
            <Wrapper>
                <BottomSlider onRef={ref => (this.OrderSliderRef = ref)}>

                    {this.state.orderData ?
                        <div className="col-12 p-0 mobileOrderTracking">
                            <div className="col-12 py-2 px-1 floating-header">
                                <div className="col-12">
                                    <div className="row align-items-center">
                                        <div className="col-2 pl-0">
                                            <IconButton onClick={this.handleClose} style={{ height: '30px', padding: '0px 12px' }}>
                                                <img src='/static/icons/Common/BackIcon.imageset/back_btn@2x.png' width="24" />
                                            </IconButton>
                                        </div>
                                        <div className="col-8 px-0 text-center">
                                            <h6 className="innerPage-heading lineSetter">Order ID : {this.state.orderData.orderId}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 pl-4 statusList scrolling-body">
                                {this.state.orderData.timeStampObject && this.state.orderData.timeStampObject.created ?
                                    <div className="listContent active col-12">
                                        <div className="driverTitle col-12">
                                            <div className="tickMark mapMark">
                                                <DoneIcon />
                                            </div><h4 >Order requested</h4>
                                            <div className="descTitle color">
                                                <Moment format="ddd, D MMM, h:m A">
                                                    {this.state.orderData.timeStampObject.created.timeStamp * 1000}
                                                </Moment>
                                            </div>
                                        </div>
                                        <div className="sideLine"></div>
                                    </div>
                                    : <div className="listContent col-12">
                                        <div className="driverTitle col-12  py-3 ">
                                            <div className="tickMark mapMark">
                                                <span className="selectedTick ion-checkmark-round"></span>
                                            </div><h4 >Order requested</h4>
                                            <div className="descTitle color"> </div>
                                        </div>
                                        <div className="sideLine"></div>
                                    </div>
                                }

                                {this.state.orderData.statusCode >= 4 ?
                                    <div className="listContent active col-12">
                                        <div className="driverTitle col-12">
                                            <div className="tickMark mapMark">
                                                <DoneIcon />
                                            </div><h4 >Order confirmed</h4>
                                            <div className="descTitle color">
                                                <Moment format="ddd, D MMM, h:m A">
                                                    {this.state.orderData.timeStampObject.created.timeStamp * 1000}
                                                </Moment>
                                                <p className="color">{this.state.orderData.storeName}</p>
                                            </div>
                                        </div>
                                        <div className="sideLine"></div>
                                    </div>
                                    : <div className="listContent col-12">
                                        <div className="driverTitle col-12  py-3 ">
                                            <div className="tickMark mapMark">
                                                <span className="selectedTick ion-checkmark-round"></span>
                                            </div><h4 >Order confirmed</h4>
                                            <div className="descTitle color"> </div>
                                        </div>
                                        <div className="sideLine"></div>
                                    </div>
                                }

                                {this.state.orderData.timeStampObject && this.state.orderData.timeStampObject.accepted ?
                                    <div className="listContent active col-12">
                                        <div className="driverTitle col-12">
                                            <div className="tickMark mapMark">
                                                <DoneIcon />
                                            </div><h4 >Driver assigned</h4>
                                            <div className="descTitle color">
                                                <Moment format="ddd, D MMM, h:m A">
                                                    {this.state.orderData.timeStampObject.accepted.timeStamp * 1000}
                                                </Moment>
                                                <p className="color">{this.state.orderData.timeStampObject.accepted.message}</p>
                                            </div>
                                        </div>
                                        <div className="sideLine"></div>
                                    </div>
                                    : <div className="listContent col-12">
                                        <div className="driverTitle col-12  py-3 ">
                                            <div className="tickMark mapMark">
                                                <span className="selectedTick ion-checkmark-round"></span>
                                            </div><h4 >Driver assigned</h4>
                                            <div className="descTitle color"> </div>
                                        </div>
                                        <div className="sideLine"></div>
                                    </div>
                                }
                                {this.state.orderData.timeStampObject && this.state.orderData.timeStampObject.onTheWay ?
                                    <div className="listContent active col-12">
                                        <div className="driverTitle col-12">
                                            <div className="tickMark mapMark">
                                                <DoneIcon />
                                            </div><h4 >Driver on the way to store </h4>
                                            <div className="descTitle color">
                                                {/* <Moment format="ddd, D MMM, h:m A">
                                                    {this.state.orderData.timeStampObject.arrived.timeStamp * 1000}
                                                </Moment> */}
                                                <p className="color">{this.state.orderData.timeStampObject.onTheWay.message}</p>
                                            </div>
                                        </div>
                                        <div className="sideLine"></div>
                                    </div>
                                    : <div className="listContent col-12">
                                        <div className="driverTitle col-12  py-3 ">
                                            <div className="tickMark mapMark">
                                                <span className="selectedTick ion-checkmark-round"></span>
                                            </div><h4 >Driver on the way to store</h4>
                                            <div className="descTitle color"> </div>
                                        </div>
                                        <div className="sideLine"></div>
                                    </div>
                                }
                                {this.state.orderData.timeStampObject && this.state.orderData.timeStampObject.arrived ?
                                    <div className="listContent active col-12">
                                        <div className="driverTitle col-12">
                                            <div className="tickMark mapMark">
                                                <DoneIcon />
                                            </div><h4 >Driver at the store </h4>
                                            <div className="descTitle color">
                                                <Moment format="ddd, D MMM, h:m A">
                                                    {this.state.orderData.timeStampObject.arrived.timeStamp * 1000}
                                                </Moment>
                                                <p className="color">{this.state.orderData.timeStampObject.arrived.message}</p>
                                            </div>
                                        </div>
                                        <div className="sideLine"></div>
                                    </div>
                                    : <div className="listContent col-12">
                                        <div className="driverTitle col-12  py-3 ">
                                            <div className="tickMark mapMark">
                                                <span className="selectedTick ion-checkmark-round"></span>
                                            </div><h4 >Driver at the store</h4>
                                            <div className="descTitle color"> </div>
                                        </div>
                                        <div className="sideLine"></div>
                                    </div>
                                }


                                {this.state.orderData.timeStampObject && this.state.orderData.timeStampObject.journeyStart ?
                                    <div className="listContent active col-12">
                                        <div className="driverTitle col-12">
                                            <div className="tickMark mapMark">
                                                <DoneIcon />
                                            </div><h4 >Driver on the way</h4>
                                            <div className="descTitle color">
                                                <Moment format="ddd, D MMM, h:m A">
                                                    {this.state.orderData.timeStampObject.journeyStart.timeStamp * 1000}
                                                </Moment>
                                                <p className="color">{this.state.orderData.timeStampObject.journeyStart.message}</p>

                                            </div>
                                            <div className="col-12 mt-2 p-0 text-left">
                                                {/* <RaisedButton label=" Live Track " secondary={true} style={style} buttonStyle={buttonGreen} labelStyle={lableFill}
                                                    onClick={() => this.showLiveTrack()}
                                                /> */}
                                                <div style={{ height: '430px', width: '100%' }} className="liveTrack">

                                                    {/* {this.printMap(this.state.orderData)} */}
                                                    <div id="liveTrackMap">
                                                    </div>

                                                    <div className="mt-4">
                                                        <div className="row">
                                                            <div className="col-5 py-2 col-md-4">
                                                                <img src={this.state.orderData.driverImage} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                                                            </div>

                                                            <div className="titleRest col-7 col-md-8 pr-0 textEllipse mt-3">
                                                                <div className="title textEllipse" style={{ fontSize: '18px', fontWeight: '700' }}>{this.state.orderData.driverName}</div>
                                                                <div className="idOrder my-1  text-success">{this.state.orderData.driverMobile}</div>
                                                                <div className="row">
                                                                    <div className="col-4 text-left" style={{ borderRight: '1px solid #eee' }}>
                                                                        <p> <b> Distance </b> </p>
                                                                        <p>--</p>
                                                                    </div>
                                                                    <div className="col-6 text-left">
                                                                        <p><b> ETA </b></p>
                                                                        <p>--</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <hr />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="col-12 mt-2 p-0 text-left">
                                                <RaisedButton label=" Live Track " secondary={true} style={style} buttonStyle={buttonGreen} labelStyle={lableFill}
                                                    onClick={() => this.showLiveTrack()}
                                                />
                                            </div> */}
                                        </div>
                                        <div className="sideLine"></div>
                                    </div>
                                    : <div className="listContent col-12">
                                        <div className="driverTitle col-12  py-3 ">
                                            <div className="tickMark mapMark">
                                                <span className="selectedTick ion-checkmark-round"></span>
                                            </div><h4 >Driver on the way</h4>
                                            <div className="descTitle color"> </div>
                                        </div>
                                        <div className="sideLine"></div>
                                    </div>
                                }

                                {this.state.orderData.timeStampObject && this.state.orderData.timeStampObject.reached ?
                                    <div className="listContent active col-12">
                                        <div className="driverTitle col-12">
                                            <div className="tickMark mapMark">
                                                <DoneIcon />
                                            </div><h4 >Driver reached</h4>
                                            <div className="descTitle color">
                                                <Moment format="ddd, D MMM, h:m A">
                                                    {this.state.orderData.timeStampObject.reached.timeStamp * 1000}
                                                </Moment>
                                                <p className="color">{this.state.orderData.timeStampObject.reached.message}</p>
                                            </div>
                                        </div>
                                        <div className="sideLine"></div>
                                    </div>
                                    : <div className="listContent col-12">
                                        <div className="driverTitle col-12  py-3 ">
                                            <div className="tickMark mapMark">
                                                <span className="selectedTick ion-checkmark-round"></span>
                                            </div><h4 >Driver reached</h4>
                                            <div className="descTitle color"> </div>
                                        </div>
                                        <div className="sideLine"></div>
                                    </div>
                                }

                                {(this.state.orderData.timeStampObject && (this.state.orderData.statusCode == 14 || this.state.orderData.statusCode == 15)) ?
                                    <div className="listContent active col-12">
                                        <div className="driverTitle col-12  py-3 ">
                                            <div className="tickMark mapMark">
                                                <DoneIcon />
                                            </div><h4 >Order completed</h4>
                                            <a onClick={() => this.props.handleRating(this.state.orderData, "mobile")}>Rate this Order</a>
                                            <div className="descTitle color"> </div>
                                        </div>
                                    </div> :
                                    <div className="listContent col-12">
                                        <div className="driverTitle col-12  py-3 ">
                                            <div className="tickMark mapMark">
                                                <span className="selectedTick ion-checkmark-round"></span>
                                            </div><h4 >Order completed</h4>
                                            {/* <a onClick={() => this.props.handleRating(this.state.orderData, "mobile")}>Rate this Order</a> */}
                                            <div className="descTitle color"> </div>
                                        </div>
                                    </div>
                                }
                            </div>
                            {/* {this.state.orderData.timeStampObject && this.state.orderData.timeStampObject.onTheWay ?
                                <div style={{ height: '300px', width: '100%', display: 'none' }} className="col-12 liveTrack">

                                    {this.printMap(this.state.orderData)}
                                    <div id="liveTrackMap">
                                    </div>

                                    <div className="col-12 mt-4">
                                        <div className="row">
                                            <div className="col-5 py-2 col-md-4">
                                                <img src={this.state.orderData.driverImage} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                                            </div>

                                            <div className="titleRest col-7 col-md-8 pr-0 textEllipse mt-3">
                                                <div className="title textEllipse" style={{ fontSize: '18px', fontWeight: '700' }}>{this.state.orderData.driverName}</div>
                                                <div className="idOrder my-1  text-success">{this.state.orderData.driverMobile}</div>
                                                <div className="row">
                                                    <div className="col-4 text-left" style={{ borderRight: '1px solid #eee' }}>
                                                        <p> <b> Distance </b> </p>
                                                        <p>--</p>
                                                    </div>
                                                    <div className="col-6 text-left">
                                                        <p><b> ETA </b></p>
                                                        <p>--</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                    </div>

                                    <div className="col-12 mt-4 text-center">
                                        <RaisedButton label=" View Status " secondary={true} style={style} buttonStyle={buttonGreen} labelStyle={lableFill}
                                            onClick={() => this.showSatus()}
                                        />
                                    </div>
                                </div>
                                : ''} */}
                        </div>

                        : ''}
                </BottomSlider>

            </Wrapper>
        )
    }
}
