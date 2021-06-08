import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

const styles = {
    root: {
        height: "100vh"
    },
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
};

class BottomDrawer extends React.Component {
    state = {
        top: false,
        left: false,
        bottom: false,
        right: false,
    };

    openDrawer = () => {
        this.setState({
            open: true,
        });
    };

    closeDrawer = () => this.setState({ open: false })

    componentDidMount = () => {
        this.props.onRef(this);
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <Drawer
                    anchor="bottom"
                    open={this.state.open}
                    onClose={this.closeDrawer}
                    classes={{ root: classes.root }}
                >
                    {this.props.children}
                </Drawer>
            </div>
        );
    }
}

BottomDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BottomDrawer);
