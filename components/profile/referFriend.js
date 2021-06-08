import React from 'react'
import { Component } from 'react'
import Moment from 'react-moment';
import $ from 'jquery'
import Wrapper from '../../hoc/wrapperHoc'
import LeftSlider from '../ui/sliders/leftSlider'
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { BASE_COLOR } from '../../lib/envariables';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
        background: BASE_COLOR
    },
    input: {
        display: 'none',
    },
});


class ReferSlider extends Component {
    state = {
        SliderWidth: 0,
        open: true,
        showReferal: false
    }
    constructor(props) {
        super(props);
        this.handleLeftSliderOpen = this.handleLeftSliderOpen.bind(this);
    }

    handleLeftSliderOpen = () => this.ReferFrndRef.handleLeftSliderToggle();
    handleClose = () => this.ReferFrndRef.handleLeftSliderClose();
    closeSlider = () => { }
    componentDidMount = () => { this.props.onRef(this); this.setState({ showReferal: true }) }

    render() {
        const { classes } = this.props;
        return (
            this.state.showReferal ?
                <Wrapper>
                    <LeftSlider onRef={ref => (this.ReferFrndRef = ref)}
                        width={this.props.state.SliderWidth}
                        handleClose={this.closeSlider}
                        drawerTitle="Referrals"
                    >
                        <div className="col-12 mt-lg-4">
                            <div className="row">
                                <div className="col-12">
                                    {/* <h4 className="mb-lg-4 mb-2 manageAddressHeader">Referral Program</h4> */}
                                </div>
                            </div>
                        </div>
                        <div className="col-12 mt-lg-4 text-center" style={{ position: "fixed", bottom: 0 }}>
                            <div className="row">
                                <div className="col-12">
                                    <Button variant="contained" color="primary" className={classes.button}>
                                        Share
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </LeftSlider>
                </Wrapper> : ''
        )
    }
}

export default withStyles(styles)(ReferSlider);