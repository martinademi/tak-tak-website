import React from 'react'
import { Component } from 'react'

import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Done from '@material-ui/icons/Done';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Wrapper from '../../hoc/wrapperHoc';
import Drawer from '@material-ui/core/Drawer';
import { BASE_COLOR } from '../../lib/envariables';

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent)

const styles = theme => ({

    modalRoot: {
        overflowX: 'hidden'
    },
    modalPaperOpen: {
        width: '100%',
        overflowX: 'hidden'
    },
    modalPaperClose: {
        width: '0%',
        overflowX: 'hidden'
    },
    root: {
        width: '99%',
        backgroundColor: theme.palette.background.paper,
        paddingBottom: '100px'
    },

    rootCheck: {
        color: 'transparent',
        '&$checked': {
            color: BASE_COLOR
        }, height: '25px',
        width: '40px',
        fontSize: '20px',
        float: 'right',
        right: '0px'
    },
    rootRadio: {
        color: 'transparent',
        '&$checked': {
            color: BASE_COLOR
        }, height: '25px',
        width: '40px',
        fontSize: '20px',
        float: 'right',
        right: '0px'
    },
    label: {
        display: 'unset',
        margin: '10px 0px'
    },

    labelRadio: {
        padding: '10px 0px',
        margin: '0px',
        display: 'unset',
        fontSize: '16px'
    },

    checked: {},
    radio: {
        height: '25px',
        width: '40px',
        fontSize: '20px'
    },
    radioColor: {
        color: "#ff9800"
    },
    formGroup: {
        paddingLeft: theme.spacing.unit * 4,
        paddingTop: '4px',
        paddingBottom: '4px',
        width: "100%"

    },
    radioForm: {
        paddingLeft: '25px',
        paddingTop: '4px',
        paddingBottom: '4px',
        width: "100%"
    },
    radioGroup: {
        flexWrap: 'unset'
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
    sizeIcon: {
        fontSize: 20,
    },
    listHeader: {
        background: '#f4f4f4',
        fontSize: 16,
        fontWeight: 'bold'
    },
    listView: {
        fontSize: '9px',
        padding: '10px 25px'
    }
});

class PriceFilter extends Component {
    state = {
        SliderWidth: 0,
        open: false,
        supportData: null,
        questionIndex: null,
        selSubCat: null,
        answer: null,
        readyToRenderPage: false,
       
    }
    handleLeftSliderOpen = () => {
        this.setState({ open: true })
    }
    handleClose = () => { this.setState({ open: false }) }

    componentDidMount = () => {
        this.props.onRef(this)
        setTimeout(() => {
            this.setState({ readyToRenderPage: true, slider: this.props.maxPrice })
        }, 200)
    }

    render() {
        const { classes } = this.props; let drawerClass;

        drawerClass = this.props.open ? classes.modalPaperOpen : ''

        return (
            this.state.readyToRenderPage ?
                <Wrapper>
                    <Drawer
                        disableBackdropTransition={!iOS} disableDiscovery={iOS}
                        open={this.state.open}
                        width={"100%"}
                        openSecondary={true}
                        containerClassName={"DrawerClassBRands"}
                        classes={{
                            paper: drawerClass
                        }}
                    >
                        <div className="row align-items-center pt-2 pb-2 px-4" style={{ right: '0px', backgroundColor: "white" }}>
                            <div onClick={this.props.closeModal} className="col-2 pt-1">
                                <a onClick={this.props.closeModal}>
                                    <img src='/static/icons/Common/BackIcon.imageset/back_btn@2x.png' width="18" />
                                </a>
                            </div>
                            <div className="col-8 pt-2 text-center">
                                <h6 style={{ fontSize: '16px', fontWeight: '700', color: '#333' }}>Price</h6>
                            </div>

                        </div>
                        <FormControl component="fieldset" required error className={classes.formGroup}>
                            <div style={{ padding: '13px' }}>

                                <p><span className="float-left"><b>{this.props.minPrice}</b></span><span className="float-right"><b>{this.props.maxPrice}</b></span></p>


                                <input type="range" name="points"
                                    min={this.props.minPrice}
                                    max={this.props.maxPrice}
                                    value={this.props.slider || this.props.maxPrice}
                                    onChange={this.props.handleSlider}
                                    class="slider" id="myRange"
                                ></input>

                            </div>

                        </FormControl>
                        {/* <div className="Sticky-Button">
                            <Button onClick={this.props.closeModal} variant="extendedFab" color="secondary" aria-label="Delete" className={classes.button}>
                                Save Filters
                    </Button>
                        </div> */}
                    </Drawer>
                </Wrapper> : ''
        )
    }
}

export default withStyles(styles)(PriceFilter);