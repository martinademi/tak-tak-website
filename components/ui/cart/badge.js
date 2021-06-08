import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { BASE_COLOR, CART_ICON } from '../../../lib/envariables';

const styles = theme => ({
    badge: {
        top: 4,
        fontSize: 10,
        height: 16,
        minWidth: 16,
        // right: -3,
        // The border color match the background color.
        background: BASE_COLOR,
        // border: `2px solid ${
        //     theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[900]
        //     }`,
    },
    icons: {
        color: "red",
        background: "red",
        fill: "red"
    }
});

function CartBadge(props) {
    const { classes } = props;

    return (
        <IconButton aria-label="Cart">
            <Badge badgeContent={props.count} color="primary" classes={{ badge: classes.badge }}>
                {/* <ShoppingCartIcon className={classes.Icon} /> */}
                <a>{CART_ICON}</a>
            </Badge>
        </IconButton>
    );
}

CartBadge.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CartBadge);
