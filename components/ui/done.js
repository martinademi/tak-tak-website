import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import Done from '@material-ui/icons/Done';

const styles = theme => ({
    sizeIcon: {
        fontSize: 22,
        paddingTop: 4
    }
})
    

class DoneIcon extends React.Component {
    render() {
        const { classes } = this.props;
        return (<Done className={classes.sizeIcon} />)
    }
}




export default withStyles(styles)(DoneIcon);