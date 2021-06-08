import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Drawer from 'material-ui/Drawer'
const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent)


class BottomSlider extends React.Component {
    state = {
        bottom: false,
        windowHeight: ''
    };

    toggleDrawer = (side, open) => () => {
    
        this.setState({
            [side]: open,
        });
    };

    clickToggle() { this.setState({ bottom: true }) }

    clickCustomHeightToggle = (height) => this.setState({ windowHeight: height, bottom: true })

    closeDrawer() { this.setState({ bottom: false }) }

    componentDidMount() {
        // passing ref to parent to call children functions
        this.props.onRef(this)
        // const windowHeight = $(document).height() + 'px'
        // this.setState({ windowHeight: windowHeight })
    }


    render() {
        const { classes } = this.props;


        return (
            <Drawer
                open={this.state.bottom}
                width={this.state.bottom ? '100%' : '0%'}
                onClose={this.toggleDrawer('bottom', false)}
                containerStyle={{ overflowX: 'hidden', background: "#fff" }}
                docked={false}
                disableBackdropTransition={!iOS} disableDiscovery={iOS}
                disableSwipeToOpen={true}
                openSecondary={true}
            >
                
                    {this.props.children}
               
            </Drawer>
        );
    }
}


export default withStyles()(BottomSlider);