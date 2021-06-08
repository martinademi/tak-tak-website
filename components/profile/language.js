import React from 'react'
import { Component } from 'react'
import Moment from 'react-moment';
import $ from 'jquery'
import Wrapper from '../../hoc/wrapperHoc'
import LeftSlider from '../ui/sliders/leftSlider'
import green from '@material-ui/core/colors/green'
import Radio from '@material-ui/core/Radio';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import Done from '@material-ui/icons/Done';
import Favorite from '@material-ui/icons/Favorite';
import { withStyles } from '@material-ui/core/styles';
import { BASE_COLOR } from '../../lib/envariables';

const styles = {
    root: {
        color: green[600],
        '&$checked': {
            color: green[500],
        },
    },
    checked: {},
    size: {
        width: 10,
        height: 2,
    },
    sizeIcon: {
        fontSize: 20,
        color: BASE_COLOR
    },
};

class LanguageSlider extends Component {
    state = {
        SliderWidth: 0,
        open: true,
        selectedLanguage: null
    }
    constructor(props) {
        super(props);
        this.handleLeftSliderOpen = this.handleLeftSliderOpen.bind(this);
    }

    handleLeftSliderOpen = () => this.LanguageRef.handleLeftSliderToggle();
    handleClose = () => this.LanguageRef.handleLeftSliderClose();
    handleChange = (lang) => this.setState({ selectedLanguage: lang })
    closeSlider = () => { }
    componentDidMount = () => this.props.onRef(this)

    render() {
        const { classes } = this.props;
        return (
            <Wrapper>
                <LeftSlider onRef={ref => (this.LanguageRef = ref)}
                    width={this.props.state.SliderWidth}
                    handleClose={this.closeSlider}
                    drawerTitle="Language"
                >
                    <div className="col-12 mt-lg-4">
                        <div className="row">
                            <div className="col-12 pt-2">
                                <span className="mb-lg-4 mb-2">Available Languages</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 mt-2">
                        <div className="row px-3 p-3" style={{ background: "white" }}>
                            <div className="col-12">
                                <span style={{ textTransform: "uppercase" }}>English</span>
                                <div style={{ float: "right" }}>
                                    <Radio
                                        checked={this.state.selectedLanguage === "en"}
                                        onChange={() => this.handleChange("en")}
                                        value="a"
                                        name="radio-button-demo"
                                        aria-label="A"
                                        className={classes.size}
                                        checkedIcon={<Done className={classes.sizeIcon} />}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 mt-2">
                        <div className="row px-3 p-3" style={{ background: "white" }}>
                            <div className="col-12">
                                <span style={{ textTransform: "uppercase" }}>Francis</span>
                                <div style={{ float: "right" }}>
                                    <Radio
                                        checked={this.state.selectedLanguage === "frn"}
                                        onChange={() => this.handleChange("frn")}
                                        value="a"
                                        name="radio-button-demo"
                                        aria-label="A"
                                        className={classes.size}
                                        checkedIcon={<Done className={classes.sizeIcon} />}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 mt-2">
                        <div className="row px-3 p-3" style={{ background: "white" }}>
                            <div className="col-12">
                                <span style={{ textTransform: "uppercase" }}>Espanol</span>
                                <div style={{ float: "right" }}>
                                    <Radio
                                        checked={this.state.selectedLanguage === "esp"}
                                        onChange={() => this.handleChange("esp")}
                                        value="a"
                                        name="radio-button-demo"
                                        aria-label="A"
                                        className={classes.size}
                                        checkedIcon={<Done className={classes.sizeIcon} />}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 mt-2">
                        <div className="row px-3 p-3" style={{ background: "white" }}>
                            <div className="col-12">
                                <span style={{ textTransform: "uppercase" }}>Urdu</span>
                                <div style={{ float: "right" }}>
                                    <Radio
                                        checked={this.state.selectedLanguage === "urdu"}
                                        onChange={() => this.handleChange("urdu")}
                                        value="a"
                                        name="radio-button-demo"
                                        aria-label="A"
                                        className={classes.size}
                                        checkedIcon={<Done className={classes.sizeIcon} />}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </LeftSlider>
            </Wrapper>
        )
    }
}

export default withStyles(styles)(LanguageSlider);