import React from 'react'
import { Component } from 'react'
import Moment from 'react-moment';
import * as moment from "moment";
import $ from 'jquery'
import Wrapper from '../../hoc/wrapperHoc'
import LeftSlider from '../ui/sliders/leftSlider'
import BottomSlider from '../ui/sliders/bottomSlider';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import RightSlider from '../ui/sliders/rightSlider';
import { BASE_COLOR } from '../../lib/envariables';
import { createTicket } from '../../services/profileApi';
import { getCookie } from '../../lib/session';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: "100%"
    },
    menu: {
        width: 200,
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
        width: "100%"
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
});

class HelpSlider extends Component {
    state = {
        SliderWidth: 0,
        open: true,
        priority: 10,
        showHelp: false,
        helpQuestion: '',
        helpBody: ''
    }
    constructor(props) {
        super(props);
        this.handleLeftSliderOpen = this.handleLeftSliderOpen.bind(this);
    }

    handleLeftSliderOpen = () => { this.HelpRef.handleLeftSliderToggle(); }
    handleClose = () => this.HelpRef.handleLeftSliderClose();
    handleBottomClose = () => this.TicketRef.closeDrawer();
    addHandler = (que) => {
        this.props.isFromOrderHistory ? (this.HelpRef.handleLeftSliderClose(), this.TicketRef.clickToggle()) : ''
        this.props.viewType == "mobileView" ?
            this.TicketRef.clickToggle() : (this.DeskTicketRef.handleRightSliderToggle(), this.setState({ helpQuestion: que ? que : '' }))
    }

    handleTicketDrawer = async (que) => {
        await this.setState({ helpQuestion: que })
        this.TicketRef.clickToggle();
    }   // method used to open ticket drawer from Order history ( help support )
    updateHelpSub = (e) => this.setState({ helpQuestion: e.target.value })
    updateHelpInput = (e) => this.setState({ helpBody: e.target.value })

    closeSlider = () => { }
    handleChange = (event) => this.setState({ priority: event.target.value })
    componentDidMount = () => { this.props.onRef(this); this.setState({ showHelp: true }) }

    saveNewTicket = () => {
        let tktData = {
            subject: this.state.helpQuestion || '',
            body: this.state.helpBody,
            requester_id: getCookie("req_id"),
            priority: this.state.priority,
            status: "new"
        }
        createTicket(tktData)
            .then((data) => {
                toastr.success("New Ticket Created Succesffully.");
                this.DeskTicketRef.handleRightSliderClose();
                this.TicketRef.closeDrawer();
                this.props.getTickets();
                // this.props.handleHelpSliderClose();
            })
    }

    render() {
        const { classes, ticketHistory } = this.props;
        return (
            this.state.showHelp ?
                <Wrapper>
                    <LeftSlider onRef={ref => (this.HelpRef = ref)}
                        width={this.props.state.SliderWidth}
                        handleClose={this.closeSlider}
                        drawerTitle="Help Center" showAdd={true} addHandler={() => this.addHandler()}>
                        <div className="col-12 mt-lg-4 text-center">
                            <div className="row justify-content-center">
                                {
                                    ticketHistory && ticketHistory.data && ticketHistory.data.open && ticketHistory.data.open.length > 0 ?
                                        ticketHistory.data.open.map((ticket, index) =>
                                            <div className="card ticketCard w-100" key={index}>
                                                <div className="card-body px-2 py-3">
                                                    <p className="ticketTitle">
                                                        <span className="float-left"> <i className="fa fa-ticket mx-3" aria-hidden="true"></i>{ticket.subject} - <span className={"ticketBadge mx-2" + " badge-danger"}>High</span> </span>   <span className="" style={{ color: "#807e7e" }}>[{moment.unix(ticket.timeStamp).format("DD-MM-YYYY HH:mm a")}]</span></p>
                                                    <div className="col-12">
                                                        <p className="ticketDesc text-left">{ticket.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : ''
                                }
                            </div>
                        </div>

                    </LeftSlider>
                    <div className="mobile-show">
                        <BottomSlider onRef={ref => (this.TicketRef = ref)} >
                            <div className="col-12 cartHead" style={{ paddingTop: '15px' }}>
                                <h5 className="text-center">
                                    <a onClick={this.handleBottomClose} style={{ float: "left" }}><img src='/static/icons/Common/BackIcon.imageset/back_btn@2x.png' width="18" /></a>
                                    New Ticket
                            </h5>
                            </div>
                            <div className="col-12 cartHead mt-3 px-4">
                                <div>
                                    <span style={{
                                        borderRadius: "50%",
                                        padding: "4px 10px",
                                        color: "white",
                                        background: BASE_COLOR
                                    }}>{this.props.userProfileDetail ? (this.props.userProfileDetail.name[0]).toUpperCase() : ''}</span>
                                    <span className="ml-2">{this.props.userProfileDetail ? this.props.userProfileDetail.name : ''} <br />
                                        <Moment format="ddd, D MMM YYYY | h:m A" style={{ fontSize: "11px", color: BASE_COLOR, marginLeft: "35px" }}>
                                            {new Date()}
                                        </Moment>
                                    </span>

                                    <TextField
                                        error
                                        id="error"
                                        label="Subject"
                                        defaultValue=" "
                                        className={classes.textField}
                                        margin="normal"
                                        style={{ border: "0px" }}
                                        value={this.state.helpQuestion}
                                        onChange={this.updateHelpSub}
                                    />

                                    <FormControl className={classes.formControl}>
                                        <InputLabel shrink htmlFor="priority-label-placeholder">
                                            Priority
                                        </InputLabel>
                                        <Select
                                            value={this.state.priority}
                                            onChange={this.handleChange}
                                            input={<Input name="priority" id="priority-label-placeholder" />}
                                            displayEmpty
                                            name="priority"
                                            className={classes.selectEmpty}
                                        >
                                            <MenuItem value={"Urgent"}>Urgent</MenuItem>
                                            <MenuItem value={"High"}>High</MenuItem>
                                            <MenuItem value={"Normal"}>Normal</MenuItem>
                                            <MenuItem value={"Low"}>Low</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                            <div className="col-12" style={{ position: "fixed", bottom: "15px" }}>
                                <input type="text" onChange={this.updateHelpInput} style={{ border: "none", background: "#f3f3f3", padding: "10px 15px", borderRadius: "50px", width: "80%" }} placeholder="Type Message" />
                                <button onClick={this.saveNewTicket} style={{ border: "none", color: "white", backgroundColor: BASE_COLOR, marginLeft: "13px", padding: "5px 10px", borderRadius: "5px" }}>Send</button>
                            </div>
                        </BottomSlider>
                    </div>
                    <div className="mobile-hide">
                        <RightSlider onRef={ref => (this.DeskTicketRef = ref)}
                            width={this.props.state.SliderWidth}
                            handleClose={this.closeSlider}
                            drawerTitle="New Ticket">
                            <div className="col-12 cartHead mt-3 px-4">
                                <div>
                                    <span style={{
                                        borderRadius: "50%",
                                        padding: "4px 10px",
                                        color: "white",
                                        background: BASE_COLOR
                                    }}>{this.props.userProfileDetail ? (this.props.userProfileDetail.name[0]).toUpperCase() : ''}</span>
                                    <span className="ml-2">{this.props.userProfileDetail ? this.props.userProfileDetail.name : ''} <br />
                                        <Moment format="ddd, D MMM YYYY | h:m A" style={{ fontSize: "11px", color: BASE_COLOR, marginLeft: "35px" }}>
                                            {new Date()}
                                        </Moment>
                                    </span>

                                    <TextField
                                        error
                                        id="error"
                                        label="Subject"
                                        defaultValue=" "
                                        value={this.state.helpQuestion}
                                        onChange={this.updateHelpSub}
                                        className={classes.textField}
                                        margin="normal"
                                        style={{ border: "0px" }}
                                    />

                                    <FormControl className={classes.formControl}>
                                        <InputLabel shrink htmlFor="priority-label-placeholder">
                                            Priority
                                </InputLabel>
                                        <Select
                                            value={this.state.priority}
                                            onChange={this.handleChange}
                                            input={<Input name="priority" id="priority-label-placeholder" />}
                                            displayEmpty
                                            name="priority"
                                            className={classes.selectEmpty}
                                        >
                                            <MenuItem value={"Urgent"}>Urgent</MenuItem>
                                            <MenuItem value={"High"}>High</MenuItem>
                                            <MenuItem value={"Normal"}>Normal</MenuItem>
                                            <MenuItem value={"Low"}>Low</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                            <div className="col-12" style={{ position: "fixed", bottom: "15px" }}>
                                <input type="text" onChange={this.updateHelpInput} style={{ border: "none", background: "#f3f3f3", padding: "10px 15px", borderRadius: "50px", width: "80%" }} placeholder="Type Message" />
                                <button onClick={this.saveNewTicket} style={{ border: "none", color: "white", backgroundColor: BASE_COLOR, marginLeft: "13px", padding: "5px 10px", borderRadius: "5px" }}>Send</button>
                            </div>
                        </RightSlider>
                    </div>
                </Wrapper> : ''
        )
    }
}
export default withStyles(styles)(HelpSlider)