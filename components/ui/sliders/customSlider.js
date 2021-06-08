import React from 'react'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import { FontIcon } from 'material-ui';
const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent)


const recentsIcon = <FontIcon className="material-icons" style={{ fontSize: "15px" }}> <i className="fa fa-times"></i></FontIcon>;

export default class CustomSlider extends React.Component {

    constructor(props) {
        super(props);
        this.state = { open: false };
    } 

    handleLeftSliderToggle = () => this.setState({ open: !this.state.open });
    
    handleLeftSliderClose = () => {
        this.setState({ open: false });
        // this.props.handleClose();
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
                disableBackdropTransition={!iOS} disableDiscovery={iOS}
                openSecondary = {true}
                disableSwipeToOpen={true}
                disableSwipeToClose={true}
                containerStyle={{ overflowX: 'hidden', background: "#fff" , width: this.props.width}}
                
            >
                
                {this.props.children}

            </Drawer>

        );
    }
}
