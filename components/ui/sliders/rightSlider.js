import React from 'react'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import { FontIcon } from 'material-ui';
const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent)


const recentsIcon = <FontIcon className="material-icons" style={{ fontSize: "15px" }}> <i className="fa fa-times"></i></FontIcon>;
    

export default class RightSlider extends React.Component {

    constructor(props) {
        super(props);
        this.state = { open: false };
    } 

    handleRightSliderToggle = () => this.setState({ open: !this.state.open });
    handleRightSliderClose = () => {
        this.setState({ open: false });
        this.props.handleClose();
    };


    componentDidMount() {
        // passing ref to parent to call children functions
        this.props.onRef(this)
    }


    render() {
        return (

            <Drawer
                onRequestChange={(open) => this.setState({ open })} open={this.state.open}
                width={this.props.width}
                docked={false}
                openSecondary = {false}
                disableSwipeToOpen={true}
                disableBackdropTransition={!iOS} disableDiscovery={iOS}
                containerStyle={{ overflowX: 'hidden', background: "#f7f7f7" }}
                containerClassName="scroller"
            >
                <div className="closeDrawer" style={{right: '0px' , padding:'25px'}}>
                    <a onClick={this.handleRightSliderClose}>{recentsIcon}</a>
                </div>
                {this.props.children}

            </Drawer>
      
        );
    }

}
